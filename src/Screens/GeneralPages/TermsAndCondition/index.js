import { Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Header } from '../../../Components';
import { Colors } from '../../../Styles';
import { back_arrow, notification_white, search } from '../../../Assets';
import RenderHtml from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import HelpPrivacyTermsMiddleware from '../../../Store/Middleware/HelpPrivacyTermsMiddleware';
import AuthAction from '../../../Store/Actions/AuthAction'

const TermsAndCondition = (props) => {

  const dispatch = useDispatch()
  const [Terms, setTerms] = useState('')
  const navigation = useNavigation()
  const TermsAndCondition = props?.route?.params?.type

  useEffect(() => {
    getHelpPrivacyTerms()
  }, [])

  const getHelpPrivacyTerms = () => {

    dispatch(HelpPrivacyTermsMiddleware.getHelpPrivacyTerms())
      .then((data) => setTerms(data?.terms))
      .catch((error) => console.log(error));

  }

  const acceptAndReject = (check) => {
    dispatch(AuthAction.isTerms(check))
    navigation.goBack()
  }

  return (
    <View style={{ flex: 1 }}>
      {TermsAndCondition ?
        <Header
          headerText={'Terms and Conditions'}
        />
        :
        <Header
          leftIcon={back_arrow}
          onPressLeftIcon={() => navigation.navigate('Setting')}
          rightIcon={notification_white}
          onPressRightIcon={() =>
            navigation.navigate('Notification')
          }
          headerText={'Terms and Conditions'}
        />
      }

      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
        <RenderHtml

          contentWidth={'100%'}
          source={{ html: Terms }}
        />
      </ScrollView>

      {TermsAndCondition ? <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>

        <TouchableOpacity onPress={() => acceptAndReject(false)} style={{ backgroundColor: Colors.WHITE, borderColor: Colors.GRAY_3, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 }}>
          <Text style={{ fontWeight: 'bold', color: Colors.GRAY_3 }}>Not right now</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => acceptAndReject(true)} style={{ backgroundColor: Colors.CYAN, borderColor: Colors.CYAN, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 }}>
          <Text style={{ fontWeight: 'bold', color: Colors.WHITE_1 }}>I agree with terms</Text>
        </TouchableOpacity>

      </View> : null}
    </View>
  );
}

const styles = StyleSheet.create({});

export default TermsAndCondition;
