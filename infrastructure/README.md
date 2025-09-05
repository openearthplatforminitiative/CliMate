# Infrastructure

The infrastructure is defined in the `infrastructure` folder using [Pulumi](https://www.pulumi.com/).
Pulumi will build all the infrastructure you will need in AWS, including the setup for Keycloak.

## Configuration

To get started, create a `Pulumi.[stack-name].yml` file in the root of the `infrastructure` folder. The file requires some configs to create the infrastructure, and can be set using the pulumi cli, e.g.

```bash
pulumi config set aws:region eu-central-1
```

To set secrets, use the --secret flag.

```bash
pulumi config set cloudflare:apiToken --secret
```

The file should contain the following config:

- `aws:region` - The AWS region to deploy to
- `cloudflare:apiToken` - The API token used to authenticate with Cloudflare. The API token can be obtained from the Cloudflare dashboard. The token needs DNS edit access
- `cloudflare:zoneId` - The zone ID of the Cloudflare zone to use
- `cli-mate:domainName` - The domain name to use for the CliMate application.

## Deploying the infrastructure

Use the AWS CLI to authenticate with AWS, and then run `pulumi up` to deploy the infrastructure.

## Tear down the infrastructure

To tear down the infrastructure, use `pulumi destroy`.

## TODO:

Entity attribute backenden

Det er backenden og databasen som må snakke sammen.
