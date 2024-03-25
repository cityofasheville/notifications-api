# Notifications API
Send emails to users who sign up to be notified about Permit Applications or other events.

## .env files
Each application, noteapi and messages, needs a new file .env (based on .env.example)
NOTE: This is actually a Terraform formatted variable file, which requires strings to be in double quotes.

## Main Application
* noteapi/
This is the backend of the City of Asheville Notifications App. It provides a GraphQL API for the [Notifications frontend](https://github.com/cityofasheville/notifications-frontend)

## Messages
* messages/
Script to run nightly to send emails.
The table notifications_permits is filled first. This is compared to notifications_permits_history. 
If there are new ones, the emails are sent and the new permits are copied to history.

## SES Bounce Processing
* ses-bounce-processing/
TODO: rewrite as Lambda.


# Testing: API
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

# Deploy to Lambda
```npm run deploy``` deploys the application to AWS Lambda and API Gateway.
```npm run destroy``` removes all AWS assets.
```npm run clean``` removes all local temp files.