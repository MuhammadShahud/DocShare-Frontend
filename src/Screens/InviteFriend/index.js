import { Text, View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Button, Header, SearchBox } from '../../Components';
import { back_arrow, invite_friend_icon, link_icon, search } from '../../Assets';
import { Colors } from '../../Styles';
import Share from 'react-native-share';


export default function InviteFriend({ navigation }) {

  const onPressShare = () => {
    Share.open({})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };
  return (
    <View style={{ flex: 1 }}>
      <Header
        leftIcon={back_arrow}
        onPressLeftIcon={() => navigation.navigate('Setting')}
        headerText={'INVITE FRIENDS'}
      />
      <View
        style={{
          flex: 1,
          padding: 15,
          backgroundColor: Colors.WHITE_1,
        }}>
        <View
          style={{
            backgroundColor: Colors.WHITE,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}>
          <Image
            resizeMode="contain"
            source={invite_friend_icon}
            style={{ width: 80, height: 80 }}
          />
          <Text style={{ color: Colors.BLACK, fontWeight: 'bold', fontSize: 20 }}>
            Invite Friend
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginVertical: 10,
            }}>
            Share a Referral Link and Invite Your Friends to Download the app
          </Text>
          <SearchBox
            icon={link_icon}
            placeholder="www.docshare.com/appstore/download"
          />
          <Button
            btnText="Invite Friend +"
            theme="blue"
            style={{ width: '100%', marginVertical: 20 }}
            onPress={() => onPressShare()}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
