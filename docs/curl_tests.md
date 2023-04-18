curl \
  -X POST \
  -H "Content-Type: application/json" \
  --data "{ \"query\": \"query categories { categories { name id tags { id name } } } \" }" \
  http://localhost:4000/graphql


DEV (the k is insecure so it will accept the self-signed cert)

curl -k -X POST -H "Content-Type: application/json" --data "{ \"query\": \"query categories { categories { name id tags { id name } } } \" }" \
https://dev-notify.ashevillenc.gov/graphql

PROD

curl -k -X POST -H "Content-Type: application/json" --data "{ \"query\": \"query categories { categories { name id tags { id name } } } \" }" \
https://notify-api.ashevillenc.gov/graphql




Preflight Headers
  curl -k -i -X OPTIONS https://notify-api.ashevillenc.gov/graphql
  curl -k -i -X OPTIONS https://dev-notify.ashevillenc.gov/graphql

curl -k -X POST -H "Content-Type: application/json" --data '{ "query": "mutation{ deleteUserPreference(email: \"user@ashevillenc.gov\" ) \
{ deletedEmail error} }" }' \
 http://localhost:4000/graphql


curl -k -X POST -H "Content-Type: application/json" --data "{ \"query\": \"query categories { categories { name id tags { id name } } } \" }" http://127.0.0.1:5011/graphql