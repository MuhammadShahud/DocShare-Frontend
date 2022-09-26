import {View, Text, Image} from 'react-native';
import React from 'react';
import {Actionsheet} from 'native-base';
import {Colors} from '../../Styles';
import {camera_icon, doucment_icon, tag_friend_icon} from '../../Assets';

const ActionSheet = ({isOpen, onClose , onPressAddPhoto,onPressAddFiles }) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
      <Actionsheet.Content>
        <Actionsheet.Item onPress={onPressAddPhoto}>
          <BottomSheetItem title={'Add Photo'} icon={camera_icon} />
        </Actionsheet.Item>
        <Actionsheet.Item onPress={onPressAddFiles}>
          <BottomSheetItem title={'Add Google Document'} icon={doucment_icon} />
        </Actionsheet.Item>
        <Actionsheet.Item onPress={onPressAddFiles}>
          <BottomSheetItem title={'Add File'} icon={doucment_icon} />
        </Actionsheet.Item>
        <Actionsheet.Item
          onPress={() => {
            onClose();
          }}></Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const BottomSheetItem = ({title, icon}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      }}>
      <View
        style={{
          backgroundColor: Colors.BLACK,
          borderRadius: 10,
          width: 50,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <Image
          resizeMode="contain"
          style={{width: 30, height: 30}}
          source={icon}
        />
      </View>
      <View>
        <Text
          style={{
            marginLeft: 10,
            fontWeight: 'bold',
            color: Colors.BLACK,
          }}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default ActionSheet;
