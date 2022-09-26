import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  Chat, Group, CreateGroup, DrawFile, EditAccount,
  EditGroup, FileDetail, FileEdit, Help, InviteFriend, Map, MyAccount, AddPaymentCard, PostEdit,
  Notification, PassCode, Privacy, Profile, SearchFriend, SecurityAndPrivacy, SubScriptionPlan, Support, TermsAndCondition, VideoCall, VideoCallGroup , IncomingCall
} from '../../Screens';
import BottomTabs from '../BottomTab';
import TopTab from '../TopTab';

const App = ({ }) => {
  const AppStack = createNativeStackNavigator();

  return (
    <AppStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'BottomTabs'}>
      <AppStack.Screen name="BottomTabs" component={BottomTabs} />
      <AppStack.Screen name="Support" component={Support} />
      <AppStack.Screen name="SearchFriend" component={SearchFriend} />
      <AppStack.Screen name="Chat" component={Chat} />
      <AppStack.Screen name="Group" component={Group} />
      <AppStack.Screen name="Map" component={Map} />
      <AppStack.Screen name="PassCode" component={PassCode} />
      <AppStack.Screen name="VideoCall" component={VideoCall} />
      <AppStack.Screen name="IncomingCall" component={IncomingCall} />

      <AppStack.Screen name="VideoCallGroup" component={VideoCallGroup} />
      <AppStack.Screen name="CreateGroup" component={CreateGroup} />
      <AppStack.Screen name="EditGroup" component={EditGroup} />
      <AppStack.Screen name="FileDetail" component={FileDetail} />
      <AppStack.Screen name="Notification" component={Notification} />
      <AppStack.Screen name="Help" component={Help} />
      <AppStack.Screen name="Privacy" component={Privacy} />
      <AppStack.Screen name="TermsAndCondition" component={TermsAndCondition} />
      <AppStack.Screen name="MyAccount" component={MyAccount} />
      <AppStack.Screen name="EditAccount" component={EditAccount} />
      <AppStack.Screen name="TopTab" component={TopTab} />
      <AppStack.Screen
        name="SecurityAndPrivacy"
        component={SecurityAndPrivacy}
      />
      <AppStack.Screen name="InviteFriend" component={InviteFriend} />
      <AppStack.Screen name="SubScriptionPlan" component={SubScriptionPlan} />
      <AppStack.Screen name="AddCard" component={AddPaymentCard} />

      <AppStack.Screen name="Profile" component={Profile} />
      <AppStack.Screen name="FileEdit" component={FileEdit} />
      <AppStack.Screen name="DrawFile" component={DrawFile} />
      <AppStack.Screen name="PostEdit" component={PostEdit} />

    </AppStack.Navigator>
  );
};

export default App;
