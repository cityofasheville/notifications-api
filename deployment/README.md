# Deploying the Notifications GraphQL Server
## NOTE: This process has been updates as of Jan 29, 2021

These instructions are to reset the services only. The set up and deployment have been moved to the server creation process.

To deploy changes, push your code to Github and create a pull request to either the development or production/main branch.

The development branch will trigger the ci/cd process to install the code onto the development server and restart the services automatically.

The production/main branch will trigger the ci/cd process and install the code and restart the services after recievine review and approval from an authorized approver.

To restart the services manually run the redeploy.sh file:

````
  sudo systemctl restart converse1
  sudo systemctl restart converse2
````

To see the status of the node services, run, e.g., ````sudo systemctl status converse1```` or ````sudo journalctl -u converse1````.

Node console logging goes to /var/log/messages

