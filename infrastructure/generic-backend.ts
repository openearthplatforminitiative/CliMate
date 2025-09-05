import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as random from "@pulumi/random";

// launch a fargate service with the entity attribute backend
interface BackendServiceArgs {
  ecsClusterArn: pulumi.Input<string>;
  hostedZoneId: pulumi.Input<string>;
}

export default class BackendService extends pulumi.ComponentResource {
  readonly ecsClusterArn: pulumi.Input<string>;
  readonly hostedZoneId: pulumi.Input<string>;

  readonly url: pulumi.Output<string>;
  readonly arn: pulumi.Output<string>;

  constructor(
    name: string,
    args: BackendServiceArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("BackendService", name, {}, opts);

    this.ecsClusterArn = args.ecsClusterArn;
    this.hostedZoneId = args.hostedZoneId;

    const cliMateConfig = new pulumi.Config("cli-mate");
    const childOptions = pulumi.mergeOptions(opts, { parent: this });

    const certificate = new aws.acm.Certificate(
      "certificate",
      {
        domainName: `api.${cliMateConfig.require("domainName")}`,
        validationMethod: "DNS",
      },
      childOptions
    );

    this.url = pulumi.interpolate`https://${certificate.domainName}`;

    const validationOptions = certificate.domainValidationOptions[0];

    const certificateValidationDomain = new aws.route53.Record(
      "domain-validation",
      {
        name: validationOptions.resourceRecordName,
        zoneId: this.hostedZoneId,
        type: validationOptions.resourceRecordType,
        records: [validationOptions.resourceRecordValue],
        ttl: 60 * 10, // 10 minutes
      },
      childOptions
    );

    const certificateValidation = new aws.acm.CertificateValidation(
      "certificate-validation",
      {
        certificateArn: certificate.arn,
        validationRecordFqdns: [certificateValidationDomain.fqdn],
      },
      childOptions
    );

    const [
      loadBalancerSecurityGroup,
      fargateServiceSecurityGroup,
      databaseSecurityGroup,
    ] = ["fargate-service", "load-balancer", "database"].map(
      (name) =>
        new aws.ec2.SecurityGroup(
          `${name}-security-group`,
          { namePrefix: `cli-mate-backend-${name}-` },
          childOptions
        )
    );

    const loadBalancer = new awsx.lb.ApplicationLoadBalancer(
      "load-balancer",
      {
        namePrefix: "ff-lb-",
        listener: {
          port: 443,
          protocol: "HTTPS",
          sslPolicy: "ELBSecurityPolicy-2016-08",
          certificateArn: certificateValidation.certificateArn,
        },
        securityGroups: [loadBalancerSecurityGroup.id],
        defaultTargetGroup: {
          port: 8080,
          namePrefix: "ff-tg-",
          protocol: "HTTP",
          deregistrationDelay: 30,
          healthCheck: {
            matcher: "200,302",
          },
        },
      },
      childOptions
    );

    const databaseUsername = "climate";
    const databasePassword = new random.RandomPassword(
      "database-password",
      {
        length: 128,
        special: false,
      },
      childOptions
    );

    const database = new aws.rds.Instance(
      "database",
      {
        dbName: "climate",
        identifierPrefix: "cli-mate-backend-",
        engine: "postgres",
        instanceClass: "db.t4g.micro",
        allocatedStorage: 5,
        username: databaseUsername,
        password: databasePassword.result,
        skipFinalSnapshot: true,
        vpcSecurityGroupIds: [databaseSecurityGroup.id],
      },
      childOptions
    );

    const databaseConnectionStringParameter = new aws.ssm.Parameter(
      "database-connection-string-parameter",
      {
        type: aws.ssm.ParameterType.SecureString,
        name: "/cli-mate/backend/database-connection-string",
        value: database.endpoint, // TODO: Can we use database.endpoint directly?
      },
      childOptions
    );

    const defaultVpc = new awsx.ec2.DefaultVpc("default-vpc", {}, childOptions);

    const service = new awsx.ecs.FargateService(
      "fargate-service",
      {
        name: "cli-mate-backend",
        cluster: this.ecsClusterArn,
        networkConfiguration: {
          assignPublicIp: true,
          subnets: defaultVpc.publicSubnetIds,
          securityGroups: [fargateServiceSecurityGroup.id],
        },
        taskDefinitionArgs: {
          family: "cli-mate-backend",
          container: {
            name: "cli-mate-backend",
            essential: true,
            cpu: 256,
            memory: 512,
            image:
              "ghcr.io/openearthplatforminitiative/entity-attribute-backend:latest",
            portMappings: [
              {
                containerPort: 8080,
                appProtocol: "http",
                targetGroup: loadBalancer.defaultTargetGroup,
              },
            ],
            environment: [
              {
                name: "IMPORT_ENTITIES",
                value: "true",
              },
              {
                name: "UPDATE_ENTITIES",
                value: "true",
              },
              // {
              //   name: "IMPORT_CONFIG",
              //   value: "/entites",
              //   // TODO: This needs to be imported somehow..
              //   // Maybe need to be packed with the data in the CliMate Repo and
              //   // have its own pipeline?
              // },
              {
                name: "ENABLE_ASSETS",
                value: "true",
              },
              {
                name: "ENABLE_ADMIN_API",
                value: "true",
              },
              {
                name: "ENABLE_METRICS",
                value: "false",
              },
              {
                name: "LOG_LEVEL",
                value: "INFO",
              },
              {
                name: "POSTGRES_DB",
                value: "climate",
              },
            ],
            secrets: [
              {
                name: "POSTGRES_HOST",
                valueFrom: databaseConnectionStringParameter.arn,
              },
              {
                name: "POSTGRES_USER",
                valueFrom: databaseUsername,
              },
              {
                name: "POSTGRES_PASSWORD",
                valueFrom: databasePassword.result,
              },
            ],
          },
          executionRole: {
            args: {
              namePrefix: "cli-mate-backend-execution-role-",
              inlinePolicies: [
                {
                  name: "secret-policy",
                  policy: pulumi.jsonStringify({
                    Version: "2012-10-17",
                    Statement: [
                      {
                        Effect: "Allow",
                        Action: "ssm:GetParameters",
                        Resource: [databaseConnectionStringParameter.arn],
                      },
                    ],
                  }),
                },
              ],
            },
          },
        },
      },
      childOptions
    );

    this.arn = service.service.id;

    new aws.ec2.SecurityGroupRule(
      "load-balancer-egress-rule",
      {
        securityGroupId: loadBalancerSecurityGroup.id,
        type: "egress",
        description:
          "Allow outgoing TCP-traffic to the Fargate service on port 8080",
        sourceSecurityGroupId: fargateServiceSecurityGroup.id,
        fromPort: 8080,
        toPort: 8080,
        protocol: "tcp",
      },
      childOptions
    );

    new aws.ec2.SecurityGroupRule(
      "load-balancer-ingress-rule",
      {
        securityGroupId: loadBalancerSecurityGroup.id,
        type: "ingress",
        description: "Allow incoming TCP-traffic on port 443 from all sources",
        cidrBlocks: ["0.0.0.0/0"],
        ipv6CidrBlocks: ["::/0"],
        fromPort: 443,
        toPort: 443,
        protocol: "tcp",
      },
      childOptions
    );

    new aws.ec2.SecurityGroupRule(
      "fargate-service-egress-rule",
      {
        securityGroupId: fargateServiceSecurityGroup.id,
        type: "egress",
        description: "Allow all outgoing traffic from the Fargate service",
        cidrBlocks: ["0.0.0.0/0"],
        ipv6CidrBlocks: ["::/0"],
        fromPort: 0,
        toPort: 0,
        protocol: "-1",
      },
      childOptions
    );

    new aws.ec2.SecurityGroupRule(
      "fargate-service-ingress-rule",
      {
        securityGroupId: fargateServiceSecurityGroup.id,
        type: "ingress",
        description:
          "Allow incoming TCP-traffic on port 8080 from the load balancer",
        sourceSecurityGroupId: loadBalancerSecurityGroup.id,
        fromPort: 8080,
        toPort: 8080,
        protocol: "tcp",
      },
      childOptions
    );

    new aws.ec2.SecurityGroupRule(
      "database-ingress-rule",
      {
        securityGroupId: databaseSecurityGroup.id,
        type: "ingress",
        description: pulumi.interpolate`Allow incoming TCP-traffic from the Fargate service on port ${database.port}`,
        sourceSecurityGroupId: fargateServiceSecurityGroup.id,
        fromPort: database.port,
        toPort: database.port,
        protocol: "tcp",
      },
      childOptions
    );

    new aws.route53.Record(
      "alias-record",
      {
        name: certificate.domainName,
        zoneId: this.hostedZoneId,
        type: aws.route53.RecordType.A,
        aliases: [
          {
            name: loadBalancer.loadBalancer.dnsName,
            zoneId: loadBalancer.loadBalancer.zoneId,
            evaluateTargetHealth: true,
          },
        ],
      },
      childOptions
    );
  }
}
