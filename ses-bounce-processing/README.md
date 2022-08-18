# ses-bounce-processing

A Lambda that handles bounced emails by deleting them from the DB.

Lambda triggers:

SNS: ses-bounces
arn:aws:sns:us-east-1:518970837364:ses-bounces

SNS: checkins-email-notifications
arn:aws:sns:us-east-1:518970837364:checkins-email-notifications
