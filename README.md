# Notifications API
**Send emails to users who sign up to be notified about Permit Applications or other events.**

## .env files
Each application, noteapi and messages, needs a new file .env (based on .env.example)
NOTE: This is actually a Terraform formatted variable file, which requires strings to be in double quotes.

### Deploy to Lambda
All Lambdas are deployed like this, (After getting proper permissions to AWS and changing to dir)

```npm run deploy``` deploys the application to AWS Lambda (and API Gateway for noteapi).
```npm run destroy``` removes all AWS assets.
```npm run clean``` removes all local temp files.

---
## Main Application
* noteapi/
This is the backend of the City of Asheville Notifications App. It provides a GraphQL API for the [Notifications frontend](https://github.com/cityofasheville/notifications-frontend)

#### CORS
CORS configuration for the API is done in the file noteapi/src/util/cors.js

### Testing: API
For local API testing, set these variables in noteapi/.env :
``` bash
send_email=false # Set to true to test sending emails locally; you can use an AWS_PROFILE in the .env.
debug=true # allows introspection and playground options for Apollo Graphql server, and bypasses log-in requirement.
```

Then run:

```
cd noteapi
npm install
npm start
```
```npm start``` runs in-memory SQLite so it does not require an external database.
You can also run ```npm run startpg``` for a local test with a Postgres DB.

---
## Messages
* messages/
Script to run nightly to send emails.
The table notifications_permits is filled first. This is compared to notifications_permits_history. 
If there are new ones, the emails are sent and the new permits are copied to history.

### Testing: Messages
There is no local DB option for local testing of messages, a Postgres DB connection is required.
```
cd messages
npm install
npm start
```

---
## SES Bounce Processing
* ses-bounce-processing/
TODO: rewrite as Lambda.