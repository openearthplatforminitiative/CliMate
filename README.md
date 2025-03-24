# CliMate

Repository for the CliMate cooperation app

## Keycloak

If you choose to use our premade realm, you need to set the following environmentvariables in a `.env.docker` file:

```
FLOOD_FRONTEND_CLIENT_SECRET=secret
FLOOD_FRONTEND_CLIENT_ID=web
FLOOD_FRONTEND_DOMAIN=localhost:8080
```

`FLOOD_FRONTEND_CLIENT_ID` needs to be `web` if using our premade realm.
