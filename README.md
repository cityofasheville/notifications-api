# notifications-api
Send transactional emails


# GraphQL Starter Template

This is the starter template for all City of Asheville web API projects. It contains the basic functionality of a GraphQL API, plus authentication, logging and caching. It is intended to be paired with a front-end application based on the [React Starter Template](https://github.com/cityofasheville/react-starter-template). 

To create a new API that derives from this one, create the new repo (e.g., NEW-REPO) and then:

````
git clone  https://github.com/cityofasheville/graphql-starter-template NEW-REPO
cd NEW-REPO  
git remote set-url origin https://github.com/cityofasheville/NEW-REPO
git remote add upstream https://github.com/cityofasheville/graphql-starter-template
git push origin master
````

If you are outside the City of Asheville organization, then you can just fork.

To build the API, run:
````
npm run
npm run start
````

Applications should should fork rather than clone this project so that updates to the template can be pulled. The application-specific API code should all be added in the ```api``` subdirectory.


