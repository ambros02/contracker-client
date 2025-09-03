

# Usage of ConTracker

## Setup

you will need a unix environment with a bash shell

### Server
1. install python 3.12 and pipenv
2. run `pipenv install` to install the dependencies from the pipfile
3. run `pipenv run start_dev_server_unix` to start the server

### Client
1. install node and npm
2. run `npm install` to install the dependencies
3. run `npm run dev` to start the server


## Usage

1. In the client fill in the information under edit information and press submit
2. You can check in the server log if it is still working (takes some time)
3. If you get a notification about unmatched usernames use the checkUsernames in the top to set the unmatched usernames and then submit again
4. Once it runs through go to repository data and select the contributors which are in the respective team then press set contributors
5. Check in the server log if it set the contributors correctly
6. Press the analyze repository button in the client
7. Check the server logs and search for `missing contributors`, there is one for the server and one for the client, for all missing contributors add a mapping to the dictionary in src/utils/username_matcher, where you put the missing contributors from the log as keys and their github usernames as values, you can also add the ones which you fixed in the 3. step if there were any
8. When you change anything in the server it reloads the server so follow again through step 1-6 and it will display the ratings in the server console.