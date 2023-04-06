## Frontend URLS:
https://notifications.ashevillenc.gov
https://dev-notifications-frontend.ashevillenc.gov/ 

## Backend URLS:
https://dev-notify.ashevillenc.gov/graphql
https://notify-api.ashevillenc.gov/graphql


PROD: 34.199.118.56
DEV: ec2-34-199-118-56.compute-1.amazonaws.com

pwno

## To deploy
git pull
npm ci
sudo systemctl restart devnotifications1
sudo systemctl restart devnotifications2

systemctl status devnotifications1

