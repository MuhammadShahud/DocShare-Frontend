import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StyleSheet, Platform } from 'react-native';
import {
  edit_active,
  edit_inactive,
  home_active, home_inactive, list_active, list_inactive, mail_active, mail_inactive, profile_active, profile_inactive
} from '../Assets';
import { Files, Home, Messages, Post, Setting, PostEdit } from '../Screens';
import { Colors } from '../Styles';

const BottomTabs = () => {
  const BottomTab = createBottomTabNavigator();

  return (
    <BottomTab.Navigator
      barStyle={{
        backgroundColor: Colors.GMAIL_RED,
      }}
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.BLUE,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: Platform.OS === 'ios' ? 25 : null,
          height: Platform.OS === 'ios' ? null : 70,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === 'Home') {
            icon = (
              <Image
                source={focused ? home_active : home_inactive}
                style={styles.iconImage}
                resizeMode={'contain'}
              />
            );
          } else if (route.name === 'Files') {
            icon = (
              <Image
                source={focused ? list_active : list_inactive}
                style={styles.iconImage}
                resizeMode={'contain'}
              />
            );
          } else if (route.name === 'Post') {
            icon = (
              <Image
                source={focused ? edit_active : edit_inactive}
                style={styles.iconImage}
                resizeMode={'contain'}
              />
            );
          } else if (route.name === 'Messages') {
            icon = (
              <Image
                source={focused ? mail_active : mail_inactive}
                style={styles.iconImage}
                resizeMode={'contain'}
              />
            );
          } else if (route.name === 'Setting') {
            icon = (
              <Image
                source={focused ? profile_active : profile_inactive}
                style={styles.iconImage}
                resizeMode={'contain'}
              />
            );
          }
          return icon;
        },
      })}
      initialRouteName="Home">
      <BottomTab.Screen name={'Home'} component={Home} />
      <BottomTab.Screen name={'Files'} component={Files} />
      <BottomTab.Screen name={'Post'} component={Post} />
      <BottomTab.Screen name={'Messages'} component={Messages} />
      <BottomTab.Screen name={'Setting'} component={Setting} />

    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconImage: {
    height: 35, width: 35
  },
});

export default BottomTabs;
