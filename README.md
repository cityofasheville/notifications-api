# Notifications API
Send transactional emails

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


# Testing
For local API testing, set these variables in noteapi/.env :
```
send_email=false
```

Then run:

```
cd noteapi
npm install
npm start
```

# Deploy to Lambda

TODO