npm start supergraph -- --cwd ./gateways/mesh --test $1
npx --yes @graphql-mesh/serve-cli@0.10.0 supergraph supergraph.graphql --port 4000 --fork 1
