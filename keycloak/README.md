# Keycloak

Keycloak is used to authenticate users of the application.
The image is based on the official Keycloak image, but with additional build time configuration and a custom realm. The realm is defined in the `realm.json` file, and it contains several environment variables that are used to configure the realm on launch.

- `CLIMATE_FRONTEND_CLIENT_ID` - The client ID of the Keycloak client that flood-frontend will use
- `CLIMATE_FRONTEND_CLIENT_SECRET` - The client secret of the Keycloak client that flood-frontend will use
- `CLIMATE_FRONTEND_DOMAIN` - The domain that the flood-frontend application is running on. This is used to configure the redirect URI of the Keycloak client.

## Configuration

All configurations for Keycloak is done by Pulumi
See the [README.md](../infrastructure/README.md) file in the infrastructure folder
