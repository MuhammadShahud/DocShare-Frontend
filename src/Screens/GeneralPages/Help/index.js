import {Text, StyleSheet, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Header} from '../../../Components';
import {Colors} from '../../../Styles';
import {back_arrow, notification_white, search} from '../../../Assets';
import RenderHtml from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import HelpPrivacyTermsMiddleware from '../../../Store/Middleware/HelpPrivacyTermsMiddleware';

const Help = () => {

  const dispatch = useDispatch()
  const [Help, setHelp] = useState('')
  const navigation = useNavigation()  

    useEffect(()=>{
      getHelpPrivacyTerms()
    },[])

    const getHelpPrivacyTerms = () =>{

      dispatch(HelpPrivacyTermsMiddleware.getHelpPrivacyTerms())
      .then((data) => setHelp(data?.help) )
      .catch((error)=> console.log(error) );

    }

    return (
      <View style={{flex: 1}}>
        <Header
          leftIcon={back_arrow}
          onPressLeftIcon={() => navigation.navigate('Setting')}
          rightIcon={notification_white}
          onPressRightIcon={() =>
            navigation.navigate('Notification')
          }
          headerText={'HELP'}
        />        
          <ScrollView showsVerticalScrollIndicator={false} style={{paddingVertical: 20, paddingHorizontal: 20}}>
          <RenderHtml
                        
                        contentWidth={'100%'}
                        source={{ html: Help }}
            />
          </ScrollView>        
      </View>
    );
}

const styles = StyleSheet.create({});

export default Help;
