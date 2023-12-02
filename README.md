# Fellowship Finder

Fellowship Finder is a web app that allows users to find and meet people with similar interests in games.

The app allows users to create profiles, filter through other users based on interests and meetup logistics, add friends, and plan events. Fellowship Finder is meant to provide a platform for people to make friends with shared interests and streamline the process of organizing tabletop sessions.

## Major Concepts
Events Calendar:  you can put in your location and friends to invite. This data not only creates a pin on the map, but also creates a chatroom for the event participants to talk to each other. Users can also upload photos for the event.

Character Creator: Create a character sheet for your next adventure! You can input the states, class and race of your next character and see the stats generated in a spider graph.

Posting Board: Users can Post requests as well as edit, delete and up vote requests.

Photo Sharing: Post photos from your the event you have attended or hosted

Chat: Communicate in real time with other members of the events you are hosting or invited to

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/). (We used Node v18.16.0 and have not tested on other versions)

2. Clone this repository and navigate into the project directory

3. Install the requirements

```
npm install
```

## NOTE ABOUT GOOGLE OAUTH - WE HAVE REMOVEED THIS FEATURE AND ARE ONLY USING THE LOCAL STRATEGY SO YOU DONT NEED TO SET THIS UP UNLESS YOU WANT TO ##

4. Make an account or sign in the [Google Cloud](https://cloud.google.com/).

5. Navigate to the [credentials section](https://console.cloud.google.com/apis/credentials?project=massive-concept-383720) of the API's and services.

6. Create a OAuth client ID credential. Name it whatever you like. For *Application type* select Web application.

7. Add the following Authorized origins:
```
http://localhost:8080
```
```
http://localhost:3001
```

8. Add the following redirect URI's:

```
http://localhost:3001/auth/google/redirect
```
```
http://localhost:8080/auth/google/callback
```
9. Make a copy of the .env.example and re-name as .env

10. Inside of the new .env file, replace the empty strings with your new Google Oauth Client ID and Client secret. The session cookieKey can be named whatever you like. 

11. Make a [Cloudinary account](cloudinary.com)

12. Navigate to your dashboard and copy over the API Key, API Secret, and Cloudinary URL into the respective sections of the your .env

13. Run the app

```
npm run dev
```

14. You should now be able to access the app at [http://localhost:3001](http://localhost:3001)

## For deployment

Assuming you're using AWS EC2 Ubuntu instance you're going to:

1. Install nvm and npm

2. Install mysql and set password for mysql (https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04) Don't do secure install

3. Run export command for the environment variables listed:
CLOUDINARY_URL= >whatever youre cloudinary url is<
API_SECRET= >whatever your cloudinary api secret is<
API_KEY=>whatever your cloudinary api key is<
GOOGLE_CLIENT_ID=>whatever your google client id is<
GOOGLE_CLIENT_SECRET=>whatever your google client secret is<

4. Run scripts:
Npm run build-short
Npm run start-short
Make sure console logs ‘Connected to database!’

(Make sure youre running the 'short' so the build doesn't freeze!)

## First Iteration Designed by @party-cubed:
  *Emmy Bishop*
  @emmy-bishop

  *Kalypso Homan* 
  @catcatmcgee

  *Marvas McCladdie*
  @MarvyWarvy

## Second Iteration Designed by Fighting Mongeese:
[AJ Bell](https://github.com/abell10101)\
[Geremy Fisher](https://github.com/gfish94)\
[Evan Perry](https://github.com/evmaperry)\
[Sydney Andre](https://github.com/saandre0217)\
[James Sheppard](https://github.com/Jshep23prog)

## Stack

Node: v20.9.0

Database: mySQL

ORM: Sequelize

HTTP Client: Axios

Deployment site: AWS

Server: Express

Authentication: Passport and Google auth

Client: React

Styling: Material-UI

Calendar UI: Big React Calendar

Project management: Trello

Cloud based Media Storage: Cloudinary

Interactive Map API: MapBox

Websocket: socket.io

Data Visualization Library: Chart.js

## Known Bugs
The sign up page will take in your info but sometimes it will not send you to the user page. 

You can refresh the page or you can type /home at the end of the URL to advance into the site. 

Refreshing may change context for logged in user to a different user.

Running seed may cause conflicts with actual Data Models.

Adding yourself to an event will cause duplicate chat rooms.

Can't add yourself to an event if you want to add an photo.

May load duplicates of certain resources (login page, emotion/react)

## License
This project is licensed under the VERYREALVERYSECURE License.

