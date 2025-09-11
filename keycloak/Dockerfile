FROM keycloak/keycloak:24.0
ENV KC_PROXY=edge
COPY realm.json /opt/keycloak/data/import/realm.json
RUN /opt/keycloak/bin/kc.sh build --db=postgres --health-enabled=true