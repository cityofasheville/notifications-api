# ses-bounce-processing

A Lambda that handles bounced emails by deleting them from the DB.

This is wired up manually without Terraform.

SES bounces are sent to this pub/sub:
SNS: ses-bounces
arn:aws:sns:us-east-1:518970837364:ses-bounces
which pushes it to this queue:
SQS: ses-bounce-queue
arn:aws:sqs:us-east-1:518970837364:ses-bounce-queue
which triggers this lambda

Lambda permissions:
arn:aws:iam::aws:policy/AmazonSQSReadOnlyAccess (Maybe? ... or:)
arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole
