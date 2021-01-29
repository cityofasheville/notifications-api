#Circle CI deployment - IN PROGRESS

The deployment process is still very much in progress. So far it is only set up for development.

There are a few things to note.

- The Node/NVM set up process is not working as well/efficiently as hoped for. Right now you need to set up nvm for the deployment user manually.

- From the server, a ssh key needs to be created and then set up in GitHub as a deploy key. This is done for this repo.

- The first time the repo has to be manually set up and ownership has to be massaged.

- Due to NVM set up, when we change node versions, we whill need to change how node is called in the service files at /etc/systemd/system. Then reload the daemon, before restarting the services.
