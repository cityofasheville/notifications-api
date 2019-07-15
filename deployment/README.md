# Deploying the Notifications GraphQL Server

These instructions are to run Notifications GraphQL node server instances behind an NGINX proxy server.

To deploy, simply run 
````
  cd deployment
  sudo ./deploy.sh
````

or run the individual commands.

To update from Github and redeploy, run:

````
  git pull
  sudo systemctl restart notifications1
  sudo systemctl restart notifications2
````

To see the status of the node services, run, e.g., ````sudo systemctl status notifications1```` or ````sudo journalctl -u notifications1````.

Node console logging goes to /var/log/messages

