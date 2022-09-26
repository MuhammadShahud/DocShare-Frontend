import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button, Header, Modal, SearchBox } from '../../Components';
import {
  check_icon,
  face1,
  face2,
  face3,
  Avatar,
  search,
  star_blue,
  unchecked_icon,
  back_arrow,
} from '../../Assets';
import { Colors } from '../../Styles';
import { useDispatch, useSelector } from 'react-redux';
import ChatMiddleware from '../../Store/Middleware/ChatMiddleware';
import { avatar } from '../../Utils';
import { IMG_URL } from '../../Store/Apis';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../../Components/CustomAlert'
import FriendsMiddleware from '../../Store/Middleware/FriendsMiddleware';

export default function CreateGroup() {
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const FriendState = useSelector(state => state.FriendsReducer);
  const user = useSelector(state => state.AuthReducer.user);

  const FriendList = FriendState?.getFriends
  const [groupName, setgroupName] = useState('')
  const [selectedFriend, setSelectedFriend] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState({
    type: '',
    message: '',
    isVisible: false,
  })


  const onPressCreateGroup = () => {
    let packagename = user?.user_subscription?.subscription?.type
    if (selectedFriend.length > 2 && packagename?.toLowerCase() != 'premium_plan') {
      setIsOpen(true)
      return
    }
    if (groupName == '') {
      setAlert({
        type: 'Error',
        message: 'Enter group name.',
        isVisible: true
      })
    }
    else if (selectedFriend.length == 0) {
      setAlert({
        type: 'Error',
        message: 'Select atleast one member.',
        isVisible: true
      })
    }
    else {
      let userData = {
        groupName: groupName,
        selectedFriend: selectedFriend
      }
      dispatch(ChatMiddleware.createGroup(userData))
        .then(data => {
          if (data?.success) {
            setAlert({
              type: 'Success',
              message: data?.message,
              isVisible: true
            })
          }
        })
        .catch(err => { console.log(err) });
    }
  }

  const onPressSearch = (val) => {
    dispatch(FriendsMiddleware.getFriends({ search: val }))
  }

  const renderItem = ({ item, index }) => {
    let has_added = selectedFriend.find(element => element.id == item?.id);
    return (
      <TouchableOpacity
        onPress={() => {
          if (has_added) {
            let friends = [...selectedFriend];
            friends.splice(index, 1);
            setSelectedFriend(friends);
          } else setSelectedFriend([...selectedFriend, item]);
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 5
        }}>
        <Image
          source={item?.profile_pic ? { uri: IMG_URL + item?.profile_pic } : Avatar}
          style={{ width: 50, height: 50, borderRadius: 25, resizeMode: 'contain' }}
        />
        <Text
          style={{
            marginLeft: 20,
            fontWeight: 'bold',
            color: Colors.BLACK,
            fontSize: 18,
          }}>
          {item?.username}
        </Text>
        <Image
          resizeMode="contain"
          style={{ marginLeft: 'auto', width: 20, height: 20 }}
          source={has_added ? check_icon : unchecked_icon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        leftIcon={back_arrow}
        onPressLeftIcon={() => navigation.goBack()}
        // rightIcon={notification_white}
        headerText={'CREATE GROUP'}
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: Colors.WHITE_1,
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.WHITE,
            paddingHorizontal: 15,
          }}>
          <TextInput
            style={{
              //   backgroundColor: 'red',
              borderBottomColor: Colors.GRAY_BORDER,
              borderBottomWidth: 1,
              fontSize: 20,
              fontWeight: 'bold',
              marginVertical: 10,
            }}
            placeholder="Your group name"
            placeholderTextColor={Colors.GRAY_1}
            onChangeText={(val) => setgroupName(val)}
          />

          <View style={{ marginVertical: 10 }}>
            <Text
              style={{ color: Colors.BLACK, fontSize: 20, fontWeight: 'bold' }}>
              Add members to group
            </Text>

          </View>
          <SearchBox
            icon={search}
            placeholder="Search Friend"
            onChangeText={(val) => onPressSearch(val)}
          />
          <View>
            <FlatList
              style={{
                width: '100%',
                marginVertical: 10,
                height: 250,
              }}
              renderItem={renderItem}
              data={FriendList}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={{ marginTop: 30 }}>
            <Button
              btnText="Create Group"
              onPress={onPressCreateGroup}
              // onPress={() => setIsOpen(true)}
              theme="blue"
            />
          </View>
        </View>
        <Modal onPressCloseIcon={() => setIsOpen(false)} visible={isOpen}>
          <View
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Image source={star_blue} style={{ width: 100, height: 100 }} />
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: Colors.GRAY_3 }}>Upgrade</Text>
            <Text style={{ color: Colors.TEXT_GRAY }}>
              Please Upgrade to Premium Plan
            </Text>
            <Text style={{ color: Colors.TEXT_GRAY }}>
              To Add More Then 3 Group Members
            </Text>
          </View>
        </Modal>
      </View>

      <CustomAlert
        visible={alert.isVisible}
        onPress={() => { setAlert({ isVisible: false }), alert.type == 'Success' ? navigation.goBack() : null }}
        type={alert.type}
        Message={alert.message} />

    </View>
  );
}

const styles = StyleSheet.create({});
