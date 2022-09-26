import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  gallery1,
  gallery2,
  face2,
  camera_icon,
  grey_delete_bucket,
} from '../../Assets';
import {Colors} from '../../Styles';

const PostCard = () => {
  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        width: '100%',
        height: 300,
        padding: 15,
        borderRadius: 20,
        marginVertical: 10,
      }}>
      {/* ///card header// */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image source={face2} style={{width: 40, height: 40}} />

          <View style={{marginLeft: 10}}>
            <Text style={{color:Colors.GRAY_3}}>Joseph</Text>
            <Text style={{color:Colors.GRAY_3}}>5 min ago</Text>
          </View>
        </View>

        <View>
          {/* <MaterialCommunityIcons
            name="dots-vertical"
            color={'#707070'}
            size={30}
          /> */}
          <Image
            style={{width: 20, height: 20}}
            resizeMode="contain"
            source={grey_delete_bucket}
          />
        </View>
      </View>

      {/* ///input field */}
      <View style={{backgroundColor: 'white'}}>
        <TextInput placeholder="Write Your First message" />
      </View>

      {/* ///Card BODY/// */}
      <View
        style={{
          backgroundColor: Colors.WHITE,
          flex: 1,
          flexDirection: 'row',
          height: 160,
          //   backgroundColor: 'red',
          justifyContent: 'space-around',
        }}>
        {/* ///card content */}

        <View
          style={{
            flex: 1.5,
            paddingHorizontal: 10,
            marginRight: 10,
            borderColor: Colors.GRAY_BORDER,
            borderWidth: 1,
            borderRadius: 12,
          }}>
          <Text
            style={{
              fontSize: 20,
              marginVertical: 10,
              fontWeight: '300',
              color: Colors.BLACK,
            }}>
            Document Title
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{fontSize: 10 , color:Colors.GRAY_3}}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet. Lorem.
            </Text>
          </ScrollView>
        </View>
        {/* ///card Images // */}
        <View
          style={{
            flex: 1,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Image
            source={gallery1}
            style={{width: 100, height: 80}}
            resizeMode="contain"
          />
          <View>
            <ImageBackground
              source={gallery2}
              resizeMode="contain"
              style={{
                width: 100,
                height: 80,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Image
                source={camera_icon}
                resizeMode="contain"
                style={{width: 20, height: 20}}
              />
              <Text style={{color: Colors.WHITE}}>17</Text>
            </ImageBackground>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
