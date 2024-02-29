# Notifications API
Send transactional emails

# .env
Each application, noteapi and messages, needs a new file .env (based on .env.example,)

## Main Application
noteapi/
This is the backend of the City of Asheville Notifications App. It provides a GraphQL API for the [Notifications frontend](https://github.com/cityofasheville/notifications-frontend)

## Messages
messages/
Script to run nightly to send emails

## SES Bounce Processing
ses-bounce-processing/


# Testing
For local API testing, set these variables in noteapi/.env :
```
cache_method=memory
database_type=memory
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