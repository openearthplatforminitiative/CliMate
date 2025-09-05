import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as random from "@pulumi/random";

interface KeycloakServiceArgs {
  ecsClusterArn: pulumi.Input<string>;
  hostedZoneId: pulumi.Input<string>;
}

export default class KeycloakService extends pulumi.ComponentResource {
  readonly ecsClusterArn: pulumi.Input<string>;
  readonly hostedZoneId: pulumi.Input<string>;

  readonly clientId = "web";
  readonly clientSecretArn: pulumi.Output<string>;

  readonly url: pulumi.Output<string>;
  readonly arn: pulumi.Output<string>;

  constructor(
    name: string,
    args: KeycloakServiceArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("KeycloakService", name, {}, opts);

    this.ecsClusterArn = args.ecsClusterArn;
    this.hostedZoneId = args.hostedZoneId;

    const cliMateConfig = new pulumi.Config("cli-mate");
    const childOptions = pulumi.mergeOptions(opts, { parent: this });

    const certificate = new aws.acm.Certificate(
      "certificate",
      {
        domainName: `auth.${cliMateConfig.require("domainName")}`,
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

    const databasePassword = new random.RandomPassword(
      "database-password",
      {
        length: 128,
        special: false,
      },
      childOptions
    );

    const databasePasswordParameter = new aws.ssm.Parameter(
      "database-password-parameter",
      {
        type: aws.ssm.ParameterType.SecureString,
        name: "/cli-mate/keycloak/database/password",
        value: databasePassword.result,
      },
      childOptions
    );

    const keycloakAdminPassword = new random.RandomPassword(
      "keycloak-admin-password",
      {
        length: 128,
        special: false,
      },
      childOptions
    );

    const keycloakAdminParameter = new aws.ssm.Parameter(
      "keycloak-admin-password-parameter",
      {
        type: aws.ssm.ParameterType.SecureString,
        name: "/cli-mate/keycloak/admin/password",
        value: keycloakAdminPassword.result,
      },
      childOptions
    );

    const [
      loadBalancerSecurityGroup,
      fargateServiceSecurityGroup,
      databaseSecurityGroup,
    ] = ["load-balancer", "fargate-service", "database"].map(
      (name) =>
        new aws.ec2.SecurityGroup(
          `${name}-security-group`,
          { namePrefix: `keycloak-${name}-` },
          childOptions
        )
    );

    const loadBalancer = new awsx.lb.ApplicationLoadBalancer(
      "load-balancer",
      {
        namePrefix: "kc-lb-",
        listener: {
          port: 443,
          protocol: "HTTPS",
          sslPolicy: "ELBSecurityPolicy-2016-08",
          certificateArn: certificateValidation.certificateArn,
        },
        securityGroups: [loadBalancerSecurityGroup.id],
        defaultTargetGroup: {
          port: 8080,
          namePrefix: "kc-tg-",
          protocol: "HTTP",
          deregistrationDelay: 30,
          healthCheck: {
            path: "/health/ready",
          },
        },
      },
      childOptions
    );

    const database = new aws.rds.Instance(
      "database",
      {
        dbName: "keycloak",
        identifierPrefix: "cli-mate-keycloak-",
        engine: "postgres",
        instanceClass: "db.t4g.micro",
        allocatedStorage: 5,
        username: "keycloak",
        password: databasePassword.result,
        skipFinalSnapshot: true,
        vpcSecurityGroupIds: [databaseSecurityGroup.id],
      },
      childOptions
    );

    const defaultVpc = new awsx.ec2.DefaultVpc("default-vpc", {}, childOptions);

    const keycloakClientSecret = new random.RandomPassword(
      "keycloak-client-secret",
      {
        length: 128,
        special: false,
      },
      childOptions
    );

    const keycloakClientSecretParameter = new aws.ssm.Parameter(
      "keycloak-client-secret-parameter",
      {
        type: aws.ssm.ParameterType.SecureString,
        name: "/cli-mate/keycloak/client-secret",
        value: keycloakClientSecret.result,
      },
      childOptions
    );

    this.clientSecretArn = keycloakClientSecretParameter.arn;

    const service = new awsx.ecs.FargateService(
      "fargate-service",
      {
        name: "cli-mate-keycloak",
        cluster: this.ecsClusterArn,
        networkConfiguration: {
          assignPublicIp: true,
          subnets: defaultVpc.publicSubnetIds,
          securityGroups: [fargateServiceSecurityGroup.id],
        },
        taskDefinitionArgs: {
          family: "cli-mate-keycloak",
          container: {
            name: "keycloak",
            essential: true,
            cpu: 1024,
            memory: 2048,
            image:
              "ghcr.io/openearthplatforminitiative/climate-keycloak:latest",
            command: ["start", "--optimized", "--import-realm"],
            portMappings: [
              {
                containerPort: 8080,
                appProtocol: "http",
                targetGroup: loadBalancer.defaultTargetGroup,
              },
            ],
            environment: [
              {
                name: "KEYCLOAK_ADMIN",
                value: "admin",
              },
              {
                name: "KC_HOSTNAME",
                value: certificate.domainName,
              },
              {
                name: "KC_DB_USERNAME",
                value: database.username,
              },
              {
                name: "KC_DB_URL",
                value: pulumi.concat(
                  "jdbc:postgresql://",
                  database.endpoint,
                  "/",
                  database.dbName
                ),
              },
              {
                name: "CLIMATE_FRONTEND_CLIENT_ID",
                value: this.clientId,
              },
              {
                name: "CLIMATE_FRONTEND_DOMAIN",
                value: cliMateConfig.require("domainName"),
              },
            ],
            secrets: [
              {
                name: "KC_DB_PASSWORD",
                valueFrom: databasePasswordParameter.arn,
              },
              {
                name: "KEYCLOAK_ADMIN_PASSWORD",
                valueFrom: keycloakAdminParameter.arn,
              },
              {
                name: "CLIMATE_FRONTEND_CLIENT_SECRET",
                valueFrom: keycloakClientSecretParameter.arn,
              },
            ],
          },
          executionRole: {
            args: {
              namePrefix: "keycloak-execution-role-",
              inlinePolicies: [
                {
                  name: "secret-policy",
                  policy: pulumi.jsonStringify({
                    Version: "2012-10-17",
                    Statement: [
                      {
                        Effect: "Allow",
                        Action: "ssm:GetParameters",
                        Resource: [
                          databasePasswordParameter.arn,
                          keycloakAdminParameter.arn,
                          keycloakClientSecretParameter.arn,
                        ],
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
