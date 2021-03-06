import React from 'react';
import { View, Text, Platform, AsyncStorage } from "react-native";
import { GiftedChat, InputToolbar, Bubble } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import NetInfo from "@react-native-community/netinfo";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";

/**
* @description Chat page where users can send and recieve messages
*/

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      isConnected: false,
      user: {
        _id: '',
        name: '',
        avatar: ''
      },
      uid: 0
    }


    /**
    * //Initializes database
    * @param {object} firebaseConfig
    * @param {string} apiKey
    * @param {string} authDomain
    * @param {string} databaseURL
    * @param {string} projectID
    * @param {string} storageBucket
    * @param {string} messagingSenderId
    * @param {string} appId
    * @param {string} measurementId
    */
    let firebaseConfig = {
      apiKey: "AIzaSyBiSms1NYTwB39qOCEZlPlVauMshUSvpn0",
      authDomain: "chat-app-99203.firebaseapp.com",
      databaseURL: "https://chat-app-99203.firebaseio.com",
      projectId: "chat-app-99203",
      storageBucket: "chat-app-99203.appspot.com",
      messagingSenderId: "249093433879",
      appId: "1:249093433879:web:ec90f7357484def2c0ca52",
      measurementId: "G-78L5MW8LF0"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  /**
   * Checks if app is online
   * @param  {} NetInfo.fetch
   * @param  {} 
   * @param  {true}}
   */
  componentDidMount() {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.setState({
          isConnected: true
        });
      }
      if (state.isConnected) {
        try {
          this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }

            if (this.props.navigation.state.params.name) {
              this.setUser(user.uid, this.props.navigation.state.params.name);
            } else {
              this.setUser(user.uid);
            }

            this.setState({
              uid: user.uid,
              loggedInText: `Hello there, ${this.props.navigation.state.params.name}!`
            });
            this.referenceMessages = firebase.firestore().collection("messages");
            this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
          });
        } catch (err) {
          console.log(err.message);
        }
      } else {
        this.setState({
          isConnected: false
        });
        this.getMessages();
      }
    });
  }

  //Unmounts component
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  /**
  * Sets default user
  * @function setUser
  * @param _id
  * @param name
  * @returns null
  */
  setUser = (_id, name = "Anonymous") => {
    this.setState({
      user: {
        _id: _id,
        name: name,
        avatar: "https://placeimg.com/140/140/tech"
      }
    });
  }

  /**
   * Adds messages to database
   * @function addMessage
   * @param {number}
   * @param {string}
   * @param {date}
   * @param {string}
   * @param {image}
   * @param {number}
   */
  addMessage() {
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || '',
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      uid: this.state.uid,
      location: this.state.messages[0].location || null,
      image: this.state.messages[0].image || ''
    });
  }

  /**
  *Retrieves messages from AsyncStorage
  * @async
  * @function getMessages
  */
  getMessages = async () => {
    let messages = [];
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  /**
   * Deletes messages from AsyncStorage (not currently used)
   * @async
   * @function deleteMessages
   */
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
  * Saves messages to AsyncStorage
  * @async
  * @function saveMessages
  */
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (err) {
      console.log(err.message);
    }
  };

  //Saves message state to database
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }),
      () => {
        this.addMessage();
        this.saveMessages();
      });
  }

  /**
  * Retrieves all messages from database
  * @function onCollectionUpdate
  *   * @param {string} _id
  * @param {string} text
  * @param {number} created.At
  * @param {string} image
  * @param {object} location
  * @param {number} location.longitude
  * @param {number} location.latitude
  * @param {object} user
  * @param {string} user.name
  * @param {string} user._id
  * @param {string} user.avatar
  */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    try {
      querySnapshot.forEach(doc => {
        let data = doc.data();
        messages.push({
          _id: data._id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          image: data.image || '',
          location: data.location || null,
          user: data.user
        })
        this.setState({
          messages
        });
      })
    }
    catch (error) {
      console.log(error.message)
    }
  };

  //Sets username as title at top of page
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  //Renders + menu button for map and image chat options
  renderCustomActions = props => {
    return <CustomActions {...props} />;
  };

  //Shows location on map
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      );
    }
    return null;
  }

  //Hides message input field when offline
  renderInputToolbar(props) {
    if (this.state.isConnected) {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  //Renders chat bubbles
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "lightblue"
          }
        }}
      />
    )
  }

  /**
  * @function renderCustomView
  * @param  {} props
  * @param  {}
  * @param  {300}
  * @param  {200}
  * @param  {13} 
  * @param  {5}
  * @param  {currentMessage.location.longitude}
  * @param  {0.0922}
  * @param  {0.0421}
  */
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.props.navigation.state.params.color }}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        {Platform.OS === "android" ? <KeyboardSpacer /> : null}
      </View>
    )
  }
}
