# Deploying the Simplicity GraphQL Server

These instructions are to run two SimpliCity GraphQL node server instances behind an NGINX proxy server.

To deploy, simply run 
````
  cd deployment
  sudo ./deploy.sh
````

or run the individual commands.

To update from Github and redeploy, run:

````
  git pull
  sudo systemctl restart converse1
  sudo systemctl restart converse2
````

To see the status of the node services, run, e.g., ````sudo systemctl status converse1```` or ````sudo journalctl -u converse1````.

Node console logging goes to /var/log/messages

