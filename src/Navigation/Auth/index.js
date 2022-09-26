import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Login, Setting, SignUp, TermsAndCondition } from '../../Screens';

const Auth = ({ }) => {
    const AuthStack = createNativeStackNavigator();

    return (
        <AuthStack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={'Login'}>
            <AuthStack.Screen name="Login" component={Login} />
            <AuthStack.Screen name="SignUp" component={SignUp} />
            <AuthStack.Screen name='TermsAndCondition' component={TermsAndCondition} />
        </AuthStack.Navigator>
    );
};


export default Auth