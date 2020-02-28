import React from 'react';
import { View, Text, Platform, AsyncStorage } from "react-native";
import { GiftedChat, InputToolbar, Bubble } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import NetInfo from "@react-native-community/netinfo";

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

    var firebaseConfig = {
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

    this.referenceMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.setState({
          isConnected: true
        });
      }
      if (state.isConnected) {
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
            loggedInText: "Hello There"
          });

          this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({
          isConnected: false
        });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  setUser = (_id, name = "Anonymous") => {
    this.setState({
      user: {
        _id: _id,
        name: name,
        avatar: "https://placeimg.com/140/140/tech"
      }
    });
  }

  get user() {
    return {
      name: this.props.navigation.state.params.name,
      _id: this.state.uid,
      id: this.state.uid,
    }
  }

  addMessage() {
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || '',
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      uid: this.state.uid
    });
  }

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

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };

  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (err) {
      console.log(err.message);
    }
  };

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }),
      () => {
        this.addMessage();
        this.saveMessages();
      });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach(doc => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user
      });
    });
    this.setState({
      messages
    });
  };

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  renderInputToolbar(props) {
    if (this.state.isConnected) {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

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

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.props.navigation.state.params.color, justifyContent: "center" }}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        {Platform.OS === "android" ? <KeyboardSpacer /> : null}
      </View>
    )
  }
} 