import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import { Header, SearchBar, Button, SearchBox, TagFrind } from '../../Components';
import {
  back_arrow,
  camera_icon,
  cross_icon,
  doucment_icon,
  face1,
  gallery1,
  gallery2,
  grey_plus_icon,
  Logo,
  notification_white,
  search,
  tag_friend_icon,
} from '../../Assets';
import { Colors } from '../../Styles';
import { Actionsheet, Icon, useDisclose } from 'native-base';
import ActionSheet from './ActionSheet';
import { useNavigation } from '@react-navigation/native';
import { OpenImagePicker } from '../../Components/ImagePicker'
import DocumentPicker from 'react-native-document-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { connect, useDispatch, useSelector } from 'react-redux'
import { IMG_URL } from '../../Store/Apis'
import PostMiddleware from '../../Store/Middleware/PostMiddleware'
import CustomAlert from '../../Components/CustomAlert'


const Post = () => {
  const navigation = useNavigation()
  const { isOpen, onOpen, onClose } = useDisclose();
  const [tagFriendModal, setTagFriendModal] = useState(false);
  const [image, setimage] = useState([])
  const [tagFriends, setTagFriends] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [alert, setAlert] = useState({
    type: '',
    message: '',
    isVisible: false,
  })

  const user = useSelector((state) => state.AuthReducer.user)
  const dispatch = useDispatch()


  const data =
  {
    type: 'jsx',
    jsx: (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.WHITE_1,
          width: 150,
          height: 150,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 5,
          marginVertical: 5,
        }}
        onPress={() => onOpen()}>
        <Image
          resizeMode="contain"
          style={{ width: 80, height: 80 }}
          source={grey_plus_icon}
        />
      </TouchableOpacity>
    ),
  };

  const uploadImage = () => {
    OpenImagePicker(img => {
      createimageObj(img);
    }, true);
  };

  const createimageObj = imgs => {
    let uri_script, name, imgObj;
    let imagearray = [...image];
    imagearray.splice(imagearray.length - 1, 1)
    if (imgs.length > 0) {
      for (const [i, img] of imgs.entries()) {
        uri_script = img.path.split('/');
        name = uri_script[uri_script.length - 1];
        imgObj = {
          file_code: 1,
          name,
          uri: img.path,
          size: img.size,
          type: img.mime,
        };
        imagearray.push(imgObj)
      }
      imagearray.push(data)
      setimage(imagearray)

    } else {
      uri_script = imgs.path.split('/');
      name = uri_script[uri_script.length - 1];
      imgObj = {
        file_code: 1,
        name,
        uri: imgs.path,
        size: imgs.size,
        type: imgs.mime,
      };
      imagearray.push(imgObj)
      imagearray.push(data)
      setimage(imagearray)
    }
  }

  const renderItem = ({ item, index }) => {
    return (
      <>
        {item.type !== 'jsx' && item.file_code == 1 ? (
          <View>
            <Image
              resizeMode="cover"
              //   style={{width: 80, height: 80}}
              style={{
                backgroundColor: Colors.LIGHT_GREY_BUTTON,
                width: 150,
                height: 150,
                borderRadius: 20,
                marginHorizontal: 5,
                marginVertical: 5,
              }}
              source={{ uri: item?.uri }}
            />
            <TouchableOpacity style={{
              position: 'absolute',
              right: 0,
              top: 1,
              width: 20,
              height: 20,
              backgroundColor: Colors.GRAY_BORDER,
              borderRadius: 50,
            }}
              onPress={() => removeimage(item, index)}
            >
              <Image
                source={cross_icon}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </TouchableOpacity>
          </View>
        ) : item.file_code == 2 ? (<View
          style={{
            backgroundColor: Colors.WHITE,
            width: 150,
            height: 150,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 5,
            marginVertical: 5,
            borderColor: Colors.WHITE_1,
            borderWidth: 2
          }}
        >
          <TouchableOpacity style={{
            position: 'absolute',
            right: 0,
            top: 1,
            width: 20,
            height: 20,
            backgroundColor: Colors.GRAY_BORDER,
            borderRadius: 50,
          }}
            onPress={() => removeimage(item, index)}
          >
            <Image
              source={cross_icon}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </TouchableOpacity>

          <FontAwesome name="file-text-o" size={38} color={Colors.COUNT_RED} />
          <Text style={{ color: Colors.BLACK, marginHorizontal: 15, marginTop: 2, textAlign: 'center' }}>{item.name}</Text>

        </View>) : (
          item.jsx
        )}
      </>
    );
  };

  const removeimage = (item, index) => {
    let images = [...image];
    images.splice(index, 1)
    setimage(images)
  }

  const onPressChooseFile = async () => {
    let documents = [...image];
    documents.splice(documents.length - 1, 1)
    try {
      const res = await DocumentPicker.pickSingle({ type: "application/*" });
      let document = {
        file_code: 2,
        name: res.name,
        fileCopyUri: res.fileCopyUri,
        size: res.size,
        type: res.type,
        uri: res.uri
      }
      documents.push(document)
      documents.push(data)
      setimage(documents)
      console.log(document)
      // this.setState({ file: res });
    } catch (err) {
      console.log(err);
    }
  };

  const storeProduct = () => {
    if (image.length == 0) {
      setAlert({
        type: 'Error',
        message: 'Please upload document or image',
        isVisible: true
      })
      return;
    }
    if (title && description) {
      image.splice(image.length - 1, 1)
      dispatch(PostMiddleware.storePost({
        title: title,
        description: description,
        documents: image,
        friends: tagFriends
      })).then(data => {
        setAlert({
          type: 'Success',
          message: 'Post created successfully.',
          isVisible: true
        })
        resetState()
      }).catch(() => setimage([...image, data]));

    } else {
      setAlert({
        type: 'Error',
        message: 'All fields are required.',
        isVisible: true
      })
    }
  }

  const resetState = () => {
    setimage([]);
    setDescription('');
    setTitle('');
    setTagFriends([]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <Header
        leftIcon={back_arrow}
        onPressLeftIcon={() => navigation.goBack()}
        rightIcon={notification_white}
        onPressRightIcon={() => navigation.navigate('Notification')}
        headerText={'POST'}
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          //   backgroundColor: Colors.WHITE_1,
        }}>
        {/* <Button onPress={onOpen}>Actionsheet</Button> */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Image source={user?.profile_pic ? { uri: IMG_URL + user?.profile_pic } : face1} style={{ width: 40, height: 40 }} />
          <View style={{ marginLeft: 10, flexDirection: 'row' }}>
            <Text style={{ color: Colors.BLACK, fontWeight: 'bold' }}>
              {user?.username}
            </Text>
            {tagFriends?.length > 0 ? <>
              <Text
                style={{
                  color: Colors.TEXT_GRAY,
                  paddingHorizontal: 5,
                }}>
                {"is with " + tagFriends.length}
              </Text>
              <Text style={{ color: Colors.BLACK, fontWeight: 'bold' }}>{tagFriends[0].username}</Text>
            </>
              : null}
          </View>
        </View>

        <View
          style={{
            width: '100%',
            // height: 60,
            paddingVertical: Platform.OS === 'ios' ? 20 : null
          }}>
          <TextInput value={title} placeholder="Document Title" onChangeText={(text) => setTitle(text)} />
          <TextInput value={description} placeholder="Write your first message" onChangeText={(text) => setDescription(text)} />
        </View>
        <View
          style={{
            width: '100%',
            height: 300,
          }}>
          {image.length > 0 ?
            <FlatList
              numColumns={2}
              data={image}
              renderItem={(item, index) => renderItem(item, index)}
              keyExtractor={item => item.name}
              showsVerticalScrollIndicator={false}
            /> : <TouchableOpacity
              style={{
                backgroundColor: Colors.WHITE_1,
                width: 150,
                height: 150,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 5,
                marginVertical: 5,
              }}
              onPress={() => onOpen()}>
              <Image
                resizeMode="contain"
                style={{ width: 80, height: 80 }}
                source={grey_plus_icon}
              />
            </TouchableOpacity>}
        </View>
        <View style={{ marginTop: 30 }}>
          <Button btnText={'Post'} theme={'blue'} onPress={() => storeProduct()} />
        </View>

        <TagFrind
          isOpen={tagFriendModal}
          setTagFriendModal={setTagFriendModal}
          getSelectedFriends={friends => setTagFriends(friends)}
        />

        <ActionSheet
          isOpen={isOpen}
          onClose={onClose}
          setTagFriendModal={setTagFriendModal}
          onPressAddPhoto={() => { uploadImage(), onClose() }}
          onPressAddFiles={() => { onPressChooseFile(), onClose() }}
        />
      </View>
      <CustomAlert
        visible={alert.isVisible}
        onPress={() => { setAlert({ isVisible: false }), alert.type == 'Success' ? navigation.goBack() : null }}
        type={alert.type}
        Message={alert.message} />
    </View>
  );
};



export default Post;

const styles = StyleSheet.create({});
