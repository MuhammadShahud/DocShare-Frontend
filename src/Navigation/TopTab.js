import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'native-base';
import * as React from 'react';
import { back_arror_white } from '../Assets';
import { Header } from '../Components';
import { PaymentHistory, PaymentMethod } from '../Screens';
import { Colors } from '../Styles';

const MyTab = createMaterialTopTabNavigator();

const TopTab = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <Header
        leftIcon={back_arror_white}
        headerText={'BILLING AND PAYMENT'}
        leftIconStyle={{ backgroundColor: Colors.CYAN }}
        onPressLeftIcon={() => navigation.goBack()}
      />
      <View style={{ flex: 1, marginVertical: 10 }}>
        <MyTab.Navigator
          screenOptions={{
            tabBarLabelStyle: {
              color: '#fff',
              fontSize: 14,
              textTransform: 'capitalize',
            },
            tabBarItemStyle: {
              backgroundColor: Colors.BLUE,
              borderRadius: 40,
              marginHorizontal: 3,
            },
            tabBarStyle: {
              width: '95%',
              alignSelf: 'center',
              paddingVertical: 10,
              paddingHorizontal: 5,
              borderRadius: 10,
            },
            tabBarIndicatorStyle: { opacity: 0 },
          }}>
          <MyTab.Screen name="Payment Method" component={PaymentMethod} />
          <MyTab.Screen name="Payment History" component={PaymentHistory} />
        </MyTab.Navigator>
      </View>
    </View>
  );
};

export default TopTab;
