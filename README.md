# Chat App
A React-Native messenger project.

Expo CLI is required to run this app, it's documentation can be found [here](https://docs.expo.io/versions/latest/get-started/installation/).
It can be installed with `npm install -g expo-cli` or `yarn add  -g expo-cli`

Firebase is also required for storing images and text, it's documentation can be found [here](https://firebase.google.com/docs/firestore/data-model).
To set up a database with Firebase you will need to follow these steps:
1. Sign into your google account [here](https://firebase.google.com/?hl=en).
2. Click *Go to console* and then *Add project*.
3. Follow the instructions until it says *Creating your project*.
4. Navigate to the *Develop tab* and click on *Database*.
5. Select *Create Database* and then *Start in test mode*.
6. Click *Start collection* then name the new collection "Messages".
7. Select *Auto ID*, then confirm the prompt.
8. Find the *Authentication* link on the *Develop tab*, then select enable *Anonymous authentication* under the *Set up sign-in method* section
11. Last, select "Project settings" above the *Develop tab* to name you app and copy and paste the contents of the *firebaseConfig* code into the corresponding section in the app's Chat.js file.

## Features
- Send and receive text messages from friends and family
- Share photos from your phone's camera or it's image gallery
- Pin your location on a map to send to others
- Access previous conversations even when offline

## Dependencies

"@react-native-community/masked-view": "0.1.5",
"@react-native-community/netinfo": "^4.6.0",
"expo": "~36.0.0",
"expo-image-picker": "~8.0.1",
"expo-location": "~8.0.0",
"expo-permissions": "~8.0.0",
"firebase": "^7.9.0",
"react": "~16.9.0",
"react-dom": "~16.9.0",
"react-native": "https://github.com/expo/react-native/archive/sdk-36.0.0.tar.gz",
"react-native-gesture-handler": "~1.5.0",
"react-native-gifted-chat": "^0.13.0",
"react-native-keyboard-spacer": "^0.4.1",
"react-native-maps": "0.26.1",
"react-native-reanimated": "~1.4.0",
"react-native-safe-area-context": "0.6.0",
"react-native-safe-area-view": "^1.0.0",
"react-native-screens": "2.0.0-alpha.12",
"react-native-web": "~0.11.7",
"react-navigation": "^4.2.2",
"react-navigation-stack": "^2.2.2"

https://trello.com/b/YN6V8nbI/native-chat-app