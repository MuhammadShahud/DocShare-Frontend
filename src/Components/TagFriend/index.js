import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Modal from '../Modal';
import SearchBox from '../SearchBox';
import {
  check_icon,
  face1,
  face2,
  face3,
  search,
  unchecked_icon,
  white_cross_icon,
} from '../../Assets';
import { Colors } from '../../Styles';
import Button from '../Button';
import { connect, useDispatch, useSelector } from 'react-redux'
import FriendsMiddleware from '../../Store/Middleware/FriendsMiddleware'
import { IMG_URL } from '../../Store/Apis'


const TagFrind = ({ isOpen, setTagFriendModal, getSelectedFriends, isGroup }) => {
  const [search, setSearch] = useState('');
  const [loader, setloader] = useState(false)

  const [selectedFriend, setSelectedFriend] = useState([]);

  const dispatch = useDispatch()
  const getFriendList = useSelector((state) => state.FriendsReducer.getFriends)

  const timeout = useRef(null)

  const onPressSearch = (value) => {
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      setloader(true)
      dispatch(FriendsMiddleware.getFriends({ search: value }))
        .then(() => setloader(false))
        .catch(() => setloader(false))
    }, 1500);

  }

  useEffect(() => {
    setloader(true)
    dispatch(FriendsMiddleware.getFriends({ search: '' }))
      .then(() => setloader(false))
      .catch(() => setloader(false))
  }, [])

  const renderItem = ({ item, index }) => {
    let has_added = selectedFriend.find(element => element.id == item.id);
    return (
      <TouchableOpacity
        onPress={() => {
          if (has_added) {
            let friends = [...selectedFriend];
            friends.splice(index, 1);
            setSelectedFriend(friends);
          } else {
            setSelectedFriend([...selectedFriend, item]);
          }
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={item?.profile_pic ? { uri: IMG_URL + item?.profile_pic } : face1}
          resizeMode="contain"
          style={{ width: 50, height: 50 }}
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
        <Image
          resizeMode="contain"
          style={{ marginLeft: 'auto', width: 20, height: 20 }}
          source={has_added ? check_icon : unchecked_icon}
        />
      </TouchableOpacity>
    );
  };
  return (
    <Modal
      setTagFriendModal={setTagFriendModal}
      visible={isOpen}
      onPressCloseIcon={() => setTagFriendModal(false)}
      style={{ height: '65%' }}>
      <View style={{ paddingHorizontal: 10 }}>
        <View style={{ marginVertical: 15, marginTop: 40 }}>
          <SearchBox icon={search} placeholder="Search Friend"
            onChangeText={value => { setSearch(value), onPressSearch(value) }}
          // onSubmitEditing={() => onPressSearch()}
          />
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={StyleSheet.selectListWrapper}>
          {selectedFriend.map((val, ind) => {
            return (
              <View style={styles.selectedBox} key={ind}>
                <Text style={{ color: Colors.BLACK }}>{val.username}</Text>
                <TouchableOpacity
                  onPress={() => {
                    let friends = selectedFriend;
                    friends.splice(ind, 1);
                    setSelectedFriend([...selectedFriend]);
                  }}
                  style={styles.closeBtn}>
                  <Image
                    resizeMode="contain"
                    source={white_cross_icon}
                    style={styles.crossImg}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
        {!loader ?
          <FlatList
            style={{
              width: '100%',
              marginVertical: 10,
              height: 180,
            }}
            renderItem={renderItem}
            data={getFriendList}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
          :
          <View style={{
            width: '100%',
            marginVertical: 10,
            height: 180,
          }}>
            <ActivityIndicator size={'large'} color={Colors.CYAN} />
          </View>
        }
        <View style={{ marginTop: 25 }}>
          <Button
            btnText={isGroup ? 'Add User' : 'Tag User'}
            onPress={() => { setTagFriendModal(false), getSelectedFriends(selectedFriend) }}
            theme="blue"
          />
        </View>
      </View>
    </Modal>
  );
};



export default TagFrind;

const styles = StyleSheet.create({
  selectListWrapper: {
    backgroundColor: 'red',
    width: '100%',
  },
  selectedBox: {
    flexDirection: 'row',
    width: 100,
    height: 40,
    backgroundColor: Colors.WHITE_1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 3,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY_BUTTON,
    marginRight: 10,
    marginVertical: 10,
  },
  closeBtn: {
    borderRadius: 50,
    width: 15,
    height: 15,
    backgroundColor: Colors.GRAY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossImg: {
    width: 10,
    height: 10,
    borderRadius: 50,
  },
});


