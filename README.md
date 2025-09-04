# Contracker server
https://github.com/ambros02/contracker

# Usage of ConTracker

## Setup

you will need a unix environment with a bash shell

### Server
1. install python 3.12 and pipenv
2. run `pipenv install` to install the dependencies from the pipfile
3. run `pipenv run start_dev_server_unix` to start the server
4. In the src directory create a .env file
5. To the .env file add a github access token for GITHUB_AUTH_TOKEN
6. To the .env file add a github access token for GRAPHQL_AUTH_TOKEN here you need a classic auth token with read:org and project anabled

### Client
1. install node and npm
2. run `npm install` to install the dependencies
3. run `npm run dev` to start the server


## Usage
1. In the server under src/scrappers/project_scrapper put in the field names from the teams project kanban board
2. In the client fill in the information under edit information and press submit
3. You can check in the server log if it is still working (takes some time)
4. If you get a notification about unmatched usernames use the checkUsernames in the top to set the unmatched usernames and then submit again
5. Once it runs through go to repository data and select the contributors which are in the respective team then press set contributors
6. Check in the server log if it set the contributors correctly
7. Press the analyze repository button in the client
8. Check the server logs and search for `missing contributors`, there is one for the server and one for the client, for all missing contributors add a mapping to the dictionary in src/utils/username_matcher, where you put the missing contributors from the log as keys and their github usernames as values, you can also add the ones which you fixed in the 3. step if there were any
9. When you change anything in the server it reloads the server so follow again through step 1-6 and it will display the ratings in the server console.
