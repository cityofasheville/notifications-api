# Official node image. Trying alpine to keep the image as tight as possible.
FROM node:10

# Folder where the app will be copied to
# will by the target of the docker file commands
WORKDIR /opt

# Set up environmental vars
ARG sessionName
ARG sessionName
ARG sessionSecret
ARG maxSessionDays
ARG cache_method
ARG region
ARG userpoolId
ARG appClientId
ARG cognitoOauthUrl
ARG mds_host
ARG mds_user
ARG mds_password
ARG mds_database
ARG note_host
ARG note_user
ARG note_password
ARG note_database
ARG AWS_PROFILE
ARG EMAIL_SENDER
ARG emailhashkey
ARG unsubURL



# Session Configuration
ENV sessionName=$sessionName
ENV sessionSecret=$sessionSecret
ENV maxSessionDays=$maxSessionDays
ENV cache_method=$cache_method

# Cognito Variables
ENV region=$region
ENV userpoolId=$userpoolId
ENV appClientId=$appClientId
ENV cognitoOauthUrl=$cognitoOauthUrl


####################################
## Datastore connection information
####################################
ENV mds_host=$mds_host
ENV mds_user=$mds_user
ENV mds_password=$mds_password
ENV mds_database=$mds_database

ENV note_host=$note_host
ENV note_user=$note_user
ENV note_password=$note_password
ENV note_database=$note_database

####################################
## SNS processing info
####################################
ENV AWS_PROFILE=$AWS_PROFILE
ENV EMAIL_SENDER=$AWS_SENDER
ENV emailhashkey=$emailhashkey
ENV unsubURL=$unsubURL


# Copy package.json + package-lock.json files
COPY package*.json ./

# Installing dependencies
RUN npm install

# Bundle app source
COPY . .

# Exposes port 4000
EXPOSE 4000

# Runs Server at container start
ENTRYPOINT ["npm", "start"]


