import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Start from './Start';
import Chat from './Chat';

const navigator = createStackNavigator({
  Start: { screen: Start },
  Chat: { screen: Chat }
});

const navigatorContainer = createAppContainer(navigator);

export default navigatorContainer; 