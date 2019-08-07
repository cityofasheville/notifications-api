curl \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{ "query": "{ tags { id } }" }' \
  http://localhost:4000/graphql


DEV (the k is insecure so it will accept the self-signed cert)

curl -k -X POST -H "Content-Type: application/json" --data '{ "query": "{ tags { id } }" }' \
https://dev-notify.ashevillenc.gov/graphql

curl -k -X POST -H "Content-Type: application/json" --data '{ "query": "mutation{ deleteUserPreference(email: \"user@ashevillenc.gov\" ) }" }' \
https://dev-notify.ashevillenc.gov/graphql

curl -k -X POST -H "Content-Type: application/json" --data "{ \"query\": \" query { tags { id } }\" }" \
https://dev-notify.ashevillenc.gov/graphql

PROD

curl -k -X POST -H "Content-Type: application/json" --data '{ "query": "{ tags { id name } }" }' \
https://notify-api.ashevillenc.gov/graphql




Preflight Headers
  curl -k -i -X OPTIONS https://notify-api.ashevillenc.gov/graphql
  curl -k -i -X OPTIONS https://dev-notify.ashevillenc.gov/graphql

curl -k -X POST -H "Content-Type: application/json" --data '{ "query": "mutation{ deleteUserPreference(email: \"user@ashevillenc.gov\" ) \
{ deletedEmail error} }" }' \
 http://localhost:4000/graphql