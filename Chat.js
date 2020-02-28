import React from "react";
import { View, Text } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat"
import KeyboardSpacer from "react-native-keyboard-spacer"

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: []
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name,
    };
  };

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any"
          },
        },
        {
          _id: 2,
          text: this.props.navigation.state.params.name + " has entered the chat",
          createdAt: new Date(),
          system: true,
        },
      ]
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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
        <Text>Start chatting!</Text>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === "android" ? <KeyboardSpacer /> : null}
      </View>
    )
  }
} 