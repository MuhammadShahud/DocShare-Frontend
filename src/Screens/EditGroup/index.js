import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Button, Header, Modal, SearchBox, TagFrind } from '../../Components';
import {
  Avatar,
  face1,
  face2,
  face3,
  grey_delete_bucket,
  modal_cross_icon,
  search,
  back_arrow
} from '../../Assets';
import { Colors } from '../../Styles';
import { IMG_URL } from '../../Store/Apis';
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native';
import ChatMiddleware from '../../Store/Middleware/ChatMiddleware'
import CustomAlert from '../../Components/CustomAlert'

const EditGroup = (props) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [tagFriends, setTagFriends] = useState([])
  const [tagFriendModal, setTagFriendModal] = useState(false);
  const is_admin = props?.route?.params?.item?.is_admin;


  const [isOpen, setIsOpen] = useState(false);
  const [GroupName, setGroupName] = useState(props?.route?.params?.item?.name)
  const data = props?.route?.params?.item
  const [friendList, setfriendList] = useState(props?.route?.params?.item?.members);
  const [text, setText] = useState()
  const [member, setMember] = useState()
  const [alert, setAlert] = useState({
    type: '',
    message: '',
    isVisible: false,
  })

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 5
        }}>
        <Image
          source={item?.profile_pic ? { uri: IMG_URL + item?.profile_pic } : Avatar}
          resizeMode="contain"
          style={{ width: 50, height: 50, borderRadius: 25, resizeMode: 'contain' }}
        />
        <Text
          style={{
            marginLeft: 20,
            fontWeight: 'bold',
            color: Colors.BLACK,
            fontSize: 18,
          }}>
          {item.username}
        </Text>
        {is_admin == 1 ?
          <TouchableOpacity
            style={{ marginLeft: 'auto' }}
            onPress={() => removeMember(item.id, item.username)}>
            <Image
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
              source={grey_delete_bucket}
            />
          </TouchableOpacity>
          : null}
      </View>
    );
  };

  const onSearch = () => {
    if (text) {
      let finduser = [...friendList]
      let index = finduser.findIndex(element => element.username.toLowerCase() == text.toLowerCase());
      if (index >= 0) {
        setfriendList([finduser[index]])
      } else {
        setfriendList(props?.route?.params?.item?.members)
      }
    } else {
      setfriendList(props?.route?.params?.item?.members)
    }
  }

  const removeMember = (id, name) => {
    let finduser = [...friendList]
    let index = finduser.findIndex(element => element.id == id);
    finduser.splice(index, 1)
    dispatch(ChatMiddleware.removeGroupMember({ user_id: id, group_id: props?.route?.params?.item?.id }))
      .then(() => { setfriendList(finduser), setMember(name), setIsOpen(true) })
      .catch();
  }

  const updateGroup = () => {
    dispatch(ChatMiddleware.updateGroup({ name: GroupName, group_id: props?.route?.params?.item?.id, selectedFriend: tagFriends }))
      .then(() => setAlert({ type: 'Success', message: 'Group updated successfully.', isVisible: true }))
      .catch()
  }

  const leaveGroup = () => {
    dispatch(ChatMiddleware.leaveGroup({ id: props?.route?.params?.item?.id }))
      .then(() => setAlert({ type: 'Success', message: 'Group leave successfully.', isVisible: true }))
      .catch()
  }


  // const updatemember = (friends) => {
  //   setfriendList([...friends, friends])
  //   setTagFriends(friends)
  // }


  return (
    <View style={{ flex: 1 }}>
      <Header
        leftIcon={back_arrow}
        onPressLeftIcon={() => navigation.goBack()}
        // rightIcon={notification_white}
        headerText={'EDIT GROUP'}
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
            placeholder="Doc share group"
            value={GroupName}
            onChangeText={(val) => setGroupName(val)}
          />

          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: is_admin == 1 ? '65%' : '100%' }}>
              <SearchBox icon={search} placeholder="Search Friend" onChangeText={text => setText(text)}
                onSubmitEditing={() => onSearch()}
              />
            </View>
            {is_admin == 1 ?
              <View style={{ width: '30%' }}>
                <Button btnText="Add" theme="blue" onPress={() => setTagFriendModal(true)} />
              </View>
              : null}
          </View>

          {/* <View style={{marginVertical: 10}}>
            <Text
              style={{color: Colors.BLACK, fontSize: 20, fontWeight: 'bold'}}>
              Doc share group
            </Text>
            <Text style={{color:Colors.GRAY_3}}>
              This group is to Share documents with students and teachers
            </Text>
          </View> */}

          <View>
            <FlatList
              style={{
                width: '100%',
                marginVertical: 10,
                height: 250,
              }}
              renderItem={renderItem}
              data={friendList}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={{ marginTop: 30 }}>
            <Button btnText="Update Group" theme="blue" onPress={() => updateGroup()} />
          </View>

          <View style={{ marginTop: 10 }}>
            <Button btnText="Exit Group" theme="blue" onPress={() => leaveGroup()} />
          </View>

        </View>
        <Modal onPressCloseIcon={() => setIsOpen(false)} visible={isOpen}>
          <View
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Image
              source={modal_cross_icon}
              style={{ width: 100, height: 100 }}
            />
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: Colors.GRAY_3 }}>{member}</Text>
            <Text style={{ color: Colors.TEXT_GRAY }}>Removed From Group</Text>
          </View>
        </Modal>
      </View>

      <CustomAlert
        visible={alert.isVisible}
        onPress={() => { setAlert({ isVisible: false }), alert.type == 'Success' ? navigation.goBack() : null }}
        type={alert.type}
        Message={alert.message} />

      <TagFrind
        isGroup={true}
        isOpen={tagFriendModal}
        setTagFriendModal={setTagFriendModal}
        getSelectedFriends={friends => setTagFriends(friends)}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

export default EditGroup;
