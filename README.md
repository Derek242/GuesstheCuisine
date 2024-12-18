# GuesstheCuisine
This is for Web Dev Final Project
```
Evan - MealDB API and React State Management
Lameya - Frontend React and Figma designs
Maliha - Frontend React, Mantine, and Countries API
Derek - Firebase Authentification and Firestore Database
James - Backend Manager and Debugger
```


## Need to run backend first then frontend
#### Need these installed
Nodejs
Npm

### Backend:

For the backend, we used express to get the two key endpoints:
1) /Random-meal → Fetches a random meal (image and country).
2) /Areas → Fetches a list of all countries.

State Management

We used React’s useState hook to manage:
1) Meal Data: Stores the random meal fetched from the backend.
2) Country List: by using the list of countries fetched from the area endpoint, we Dynamically generated buttons for valid countries.
3) Feedback: Shows whether the player's guess is correct or wrong.
4) Score and Chances: Keeps track of the player’s score and remaining chances

Fetching Data from the Backend

We used the useEffect hook to call my backend endpoints when the component first loads or when a player guesses correctly.
1) Random Meal: Fetches a meal with an image and its country.
2) Country List: Fetches all valid countries, excluding "Unknown."

**CORS library is needed for the frontend and the backend to communicate with each other. 
Without CORS, the browser would block requests from the frontend to the backend for security reasons.

```
1) npm i install cors
2) npm i
3) cd cuisineGuesser/src
4) node server.js
```
http://localhost:5000/


### FrontEnd
```
1) cd cuisineGuesser
2) npm i
3) npm run start
```

http://localhost:3000/


### Install Packages


```
npm install @mantine/core @mantine/hooks @emotion/react
npm install react-router-dom 
```
