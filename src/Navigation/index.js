import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { connect, useDispatch, useSelector } from 'react-redux';
import AuthAction from '../Store/Actions/AuthAction';
import Storage from '../Utils/AsyncStorage'
import { store } from '../Store/store';
import App from './App';
import Auth from './Auth';
import { SafeAreaView, Platform, Modal, ActivityIndicator, View, Text } from 'react-native'
import messaging from '@react-native-firebase/messaging';
import notifee from "@notifee/react-native";

const AppNavigation = () => {

  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.AuthReducer.isLogin)
  const loading = useSelector((state) => state.GeneralReducer.isloading)


  const createChannel = async () => {
    let channelId = await notifee.createChannel({
      id: 'docshare',
      name: 'DocShare Channel',
      sound: "default",
      vibration: true,
      badge: true,
      importance: 4,
      visibility: 1,
      bypassDnd: true
    });
  }
  async function checkPermission() {
    const enabled = await messaging().hasPermission();
    // If Premission granted proceed towards token fetch
    if (enabled != messaging.AuthorizationStatus.AUTHORIZED) {
      requestPermission();
    }
  }
  async function requestPermission() {
    try {
      await messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }
  async function onMessageReceived(message) {
    // Do something
    let channelId = await notifee.createChannel({
      id: 'docshare',
      name: 'DocShare Channel',
      sound: "default",
      vibration: true,
      badge: true,
      importance: 4,
      visibility: 1,
      bypassDnd: true
    });
    // Display a notification
    await notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      android: {
        channelId: channelId,
        importance: 4,
        sound: "default",
      },
    });
  }
  const isAuthentication = async () => {
    setTimeout(async () => {
      let token = await Storage.getToken('@token');
      let user = await Storage.get('@user')
      if (user != null) {
        const userdata = JSON.parse(user)
        dispatch(AuthAction.getUserData(userdata));
        dispatch(AuthAction.isLogin(true));
        SplashScreen.hide();
      } else {
        dispatch(AuthAction.isLogin(false));
        SplashScreen.hide();
      }
    }, 0);
  }


  useEffect(() => {
    isAuthentication()
    createChannel();
    checkPermission()
    messaging().registerDeviceForRemoteMessages();
    messaging().onMessage(onMessageReceived)
  }, [isLogin])



  return (
    <NavigationContainer>
      <NativeBaseProvider>
        {Platform.OS === 'ios' ?
          <SafeAreaView style={{ flex: 1 }}>
            {isLogin == undefined ? SplashScreen.show() : isLogin ? <App /> : <Auth />}
          </SafeAreaView>
          : isLogin == undefined ? SplashScreen.show() :
            isLogin ? <App /> : <Auth />
        }

        <Modal visible={loading} transparent>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator
              size={"large"}
              color="#fff"
            />
            <Text style={{ color: "#fff", margin: 15 }}>Loading please wait..</Text>
          </View>
        </Modal>

      </NativeBaseProvider>
    </NavigationContainer>
  );
};

export default AppNavigation
