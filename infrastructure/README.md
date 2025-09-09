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

## Activation PostGIS on RDS

When using RDS you have to activate PostGIS after the database is created.
Log in to AWS console, and navigate to Parameter Store. To log in to the database, you have to uncomment the SecurityRule in `generic-backend.ts` called `database-public-ingress-rule`. You also need to uncomment `publiclyAccessible: true` on the database definition. Then run `pulumi up`
Use the parameters you find in Parameter Store to log in with the psql command:

```bash
psql --host="cli-mate-backend-2025090909332648320000000e.cntzlhr0ao2b.eu-central-1.rds.amazonaws.com" --port=5432 --username=climate --password
```

Then run the following commands to enable postgis:

```SQL
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_raster;
CREATE EXTENSION fuzzystrmatch;
CREATE EXTENSION postgis_tiger_geocoder;
CREATE EXTENSION postgis_topology;
CREATE EXTENSION address_standardizer_data_us;
```

Then

- comment out the `database-public-ingress-rule` SecurityRule
- comment out the `publiclyAccessible: true` line
- set ENABLE_ADMIN_API to false

Then run `pulumi up` to remove deploy the changes.

## Inserting entities

TODO: Explain /docs, or ready curl commands? Ready curl commands is best!

## Disabling the admin API

When you have added the entities, you should disable the Admin API, so nobody can tamper with your system.
To do so, set `ENABLE_ADMIN_API` environment variable to `false` and run `pulumi up`.

## TODO:

Entity attribute backenden

Det er backenden og databasen som må snakke sammen.
