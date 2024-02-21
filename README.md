# Notifications API
Send transactional emails

# .env
Make two copies of the file .env based on .env.example, in each dir: noteapi and messages

## Main Application
noteapi/
This is the backend of the City of Asheville Notifications App. It provides a GraphQL API for the [Notifications frontend](https://github.com/cityofasheville/notifications-frontend)

````
cd noteapi
npm install
npm start
````

## Messages
messages/
Script to run nightly to send emails

## SES Bounce Processing
ses-bounce-processing/
