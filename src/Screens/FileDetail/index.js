import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { Button, Header, Modal, Text, TextInput } from '../../Components';
import React, { Component } from 'react';
import {
  delete_gray,
  document,
  download_gray,
  menu_gray,
  notification_white,
  passcode_icon,
  red_horizontal_dots,
  search,
  share_white,
  star_blue,
  back_arrow,
  face1,
  message_white
} from '../../Assets';
import { Colors } from '../../Styles';
import Share from 'react-native-share';
import { connect } from 'react-redux'
import FilesMiddleware from '../../Store/Middleware/FilesMiddleware'
import CustomAlert from '../../Components/CustomAlert'
import ChatMiddleware from '../../Store/Middleware/ChatMiddleware';
import { IMG_URL } from '../../Store/Apis'


class FileDetail extends Component {
  state = {
    isShowMenu: false,
    isShowDeleteFileModal: false,
    isShowPasscodeModal: false,
    isShowCreatePasscodeFormModal: false,
    Pass: false,
    type: '',
    message: '',
    isVisible: false,
    attachment: false,
    isChat: false
  };


  componentDidMount() {
    this.fsPermission()
    this.props.getChatHead({ search: '' })
  }


  fsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("You can use the camerasss");
      } else {
        console.log("Storage permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }


  renderMenu = () => {
    const item = this.props?.route?.params?.item;

    let menuItems = [
      {
        label: item?.is_protected == 0 ?
          "Create Passcode" : "Change Password",
        icon: passcode_icon,
        onPress: () =>
          this.checkMembership(),
      },
      {
        label: 'Delete',
        icon: delete_gray,
        onPress: () =>
          this.setState({ isShowDeleteFileModal: true, isShowMenu: false }),
      },
      {
        label: 'Download',
        icon: download_gray,
        onPress: () => {
          this.downloadFile()
        },
      },
    ];

    return (
      <View style={{ position: 'absolute', top: 20, right: 20 }}>
        <TouchableOpacity
          onPress={() => this.setState({ isShowMenu: !this.state.isShowMenu })}
          style={{}}>
          <Image
            source={red_horizontal_dots}
            style={{ width: 30, tintColor: Colors.GRAY_3 }}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        {this.state.isShowMenu ? (
          <View
            style={{
              position: 'absolute',
              top: 20,
              right: 0,
              backgroundColor: Colors.WHITE,
              width: 230,
              height: 140,
              borderRadius: 20,
              paddingVertical: 10,
              paddingHorizontal: 5,
              elevation: 5,
            }}>
            <FlatList
              data={menuItems}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={item.onPress}
                    style={{
                      flexDirection: 'row',
                      height: 40,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={item.icon}
                      style={{ height: 20, paddingHorizontal: 25 }}
                      resizeMode={'contain'}
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: Colors.TEXT_GRAY,
                      }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        ) : null}
      </View>
    );
  };

  renderDeleteFileModal = () => {
    return (
      <Modal visible={this.state.isShowDeleteFileModal}
      >
        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <Image
            source={delete_gray}
            style={{ height: 60, alignSelf: 'center' }}
            resizeMode={'contain'}
          />
          <Text
            style={{
              color: Colors.GRAY_LIGHT,
              textAlign: 'center',
              marginVertical: 10,
            }}>
            Are you sure you want to{' '}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              color: Colors.TEXT_GRAY,
              textAlign: 'center',
            }}>
            Delete file?
          </Text>
          <View style={{ flexDirection: 'row', width: '100%', marginTop: 20 }}>
            <Button
              btnText={'Not now'}
              theme={'white'}
              style={{ flex: 1, marginRight: 5 }}
              onPress={() => this.setState({ isShowDeleteFileModal: false })}
            />
            <Button
              btnText={`Yes I'm`}
              theme={'cyan'}
              style={{ flex: 1, marginLeft: 5 }}
              onPress={() => this.deleteFile()}
            />
          </View>
        </View>
      </Modal>
    );
  };

  renderPasscodeModal = () => {
    return (
      <Modal visible={this.state.isShowPasscodeModal}
        onPressCloseIcon={() => this.setState({ isShowPasscodeModal: false })}
      >
        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <Image
            source={star_blue}
            style={{ height: 60, alignSelf: 'center' }}
            resizeMode={'contain'}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 22,
              color: Colors.TEXT_GRAY,
              textAlign: 'center',
              marginVertical: 10,
            }}>
            Create Passcode
          </Text>
          <Text style={{ color: Colors.GRAY_LIGHT, textAlign: 'center' }}>
            Please Upgrade Your Plan{' '}
          </Text>
          <Button
            btnText={'Subscribe'}
            theme={'cyan'}
            style={{ width: 150, alignSelf: 'center', marginTop: 20 }}
            onPress={() => {
              this.hidemodel();
              this.props.navigation.navigate('SubScriptionPlan')
            }
            }
          />
        </View>
      </Modal>
    );
  };

  renderCreatePassCodeFormModal = () => {
    const file = this.props?.route?.params?.item;
    return (

      <Modal visible={this.state.isShowCreatePasscodeFormModal}
        onPressCloseIcon={() => this.setState({ isShowCreatePasscodeFormModal: false })}

      >
        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 22,
              color: Colors.BLACK,
              textAlign: 'center',
              marginVertical: 10,
            }}>
            {file?.is_protected == 0 ?
              "Create Passcode" : "Change Password"}
          </Text>
          <Text
            style={{
              color: Colors.GRAY_LIGHT,
              color: Colors.BLACK,
              fontWeight: 'bold',
            }}>
            File Name{' '}
          </Text>
          <Text
            style={{
              color: Colors.GRAY_LIGHT,
              color: Colors.TEXT_GRAY,
              fontSize: 18,
            }}>
            {file.name}
          </Text>
          <TextInput label={'Set New Passcode'} value={'**********'}
            secureTextEntry={true} onChangeText={text => this.setState({ Pass: text })}
            maxlength={5} />
          <Button
            btnText={'Set Passcode'}
            theme={'cyan'}
            style={{ marginTop: 10 }}
            onPress={() =>
              this.setFilePassword()
            }
          />
        </View>
      </Modal>
    );
  };

  onPressShare = () => {
    Share.open({})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  setFilePassword = () => {
    const file = this.props?.route?.params?.item;
    if (this.state.Pass) {
      this.props.setPasscode({ id: file.id, passcode: this.state.Pass })
        .then(() =>
          this.setState({
            type: 'Success',
            message: 'Passcode created successfully.',
            isVisible: true
          }))

        .catch()
    } else {
      this.setState({
        type: 'Error',
        message: 'Passcode field is required',
        isVisible: true
      })
    }
  }

  hidemodel = () => {
    this.setState({
      isShowDeleteFileModal: false,
      isShowPasscodeModal: false,
      isShowCreatePasscodeFormModal: false,
      isShowMenu: false
    })
  }

  deleteFile = () => {
    const file = this.props?.route?.params?.item;

    this.props.deleteFile({ id: file.id })
      .then(() => {
        this.setState({
          type: 'Success',
          message: 'File deleted successfully.',
          isVisible: true
        }),
          this.props.navigation.goBack()
      }

      )
      .catch()
  }

  downloadFile = () => {
    const file = this.props?.route?.params?.item;

    try {
      this.props.downloadFile({
        selectedItem: file,
      }).then(() => Platform.OS === "android" ?
        this.setState({
          type: 'Success',
          message: 'File downloaded successfully.',
          isVisible: true
        })
        : null).catch((err) => console.log(err))
    } catch (error) {
      console.log(error)
    }

  }

  chats = ({ item }) => {
    let { user } = this.props;
    let userDetails = null;
    if (item?.is_group == 0) {
      if (item?.to_user?.id == user.id) {
        userDetails = item?.from_user;
      } else if (item?.from_user?.id == user.id) {
        userDetails = item?.to_user;
      }
    }
    return (
      item?.is_group == 0 ?
        <TouchableOpacity
          key={item.id}
          style={styles.chat_Component}
          onPress={() => this.shareWith(item?.id, userDetails?.username, item?.is_group)}
        >
          <View style={styles.profile_view}>
            <Image style={styles.profile_Img} source={userDetails?.profile_pic ? { uri: IMG_URL + userDetails?.profile_pic } : face1} />
          </View>
          <View style={styles.chat_view}>
            <Text style={styles.chat_name}>{userDetails?.username}</Text>
          </View>

        </TouchableOpacity>
        :

        <TouchableOpacity
          key={item.id}
          style={styles.chat_Component}
          onPress={() => this.shareWith(item?.id, item?.name, item?.is_group)}
        >
          <View style={[styles.profile_view,
          {
            width: 50,
            height: 50,
            backgroundColor: Colors.WHITE,
            borderRadius: 10,
            justifyContent: 'center'
          }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              {item?.members?.map((item, index) => {
                return (
                  index < 3 ?
                    <Image key={item.id} style={styles.group_profile_Img} source={item?.profile_pic ? { uri: IMG_URL + item.profile_pic } : face1} />
                    : null)
              })}
            </View>
            <View style={{ flexDirection: 'row', marginVertical: -5, justifyContent: 'center' }}>
              {item?.members.length > 3 ? item?.members.map((item, index) => {
                return (
                  index > 2 ?
                    <Image key={item.id} style={styles.group_profile_Img} source={item?.profile_pic ? { uri: IMG_URL + item.profile_pic } : face1} />
                    : null)
              }) : null}
            </View>
          </View>
          <View style={styles.chat_view}>
            <Text style={styles.chat_name}>{item?.name}</Text>
          </View>

        </TouchableOpacity>


    );
  };

  renderModal = () => {
    const { chatHead } = this.props
    return (
      <Modal animationType={'fade'} visible={this.state.attachment} style={{ backgroundColor: Colors.WHITE, minHeight: 230 }}>
        <View style={{ width: "90%", height: 150, alignSelf: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', alignSelf: 'center', marginBottom: 10 }}>Share Via</Text>
          {chatHead != null && this.state.isChat ?
            <FlatList
              data={chatHead}
              renderItem={item => this.chats(item)}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              horizontal
              ListEmptyComponent={
                <View style={{ marginVertical: 10, backgroundColor: Colors.WHITE, padding: 10, borderRadius: 5 }}>
                  <Text style={{ textAlign: 'center', color: Colors.GRAY_3 }}>Chats not found</Text>
                </View>
              }

            /> :
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }} >
              <TouchableOpacity
                style={styles.chat_Component}
                onPress={() => this.setState({ isChat: true })}
              >
                <View style={styles.profile_view}>
                  <Image style={[styles.profile_Img, { tintColor: Colors.CYAN }]} source={message_white} resizeMode={'contain'} />
                </View>
                <View style={styles.chat_view}>
                  <Text style={styles.chat_name}>Chat</Text>
                </View>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chat_Component}
                onPress={() => this.setState({ attachment: false }, () => { this.onPressShare() })}
              >
                <View style={styles.profile_view}>
                  <Image style={[styles.profile_Img, { tintColor: Colors.CYAN }]} source={share_white} resizeMode={'contain'} />
                </View>
                <View style={styles.chat_view}>
                  <Text style={styles.chat_name}>Apps</Text>
                </View>
              </TouchableOpacity>
            </View>
          }
        </View>
        <TouchableOpacity style={styles.dismiss} onPress={() => this.setState({ attachment: false, isChat: false })}>
          <Text style={{ color: Colors.WHITE }}>Dismiss</Text>
        </TouchableOpacity>
      </Modal>
    )
  }

  shareWith = (chathead_id, name, is_group) => {
    const item = this.props?.route?.params?.item;
    this.props.shareDocument({
      document_id: item.id,
      type: is_group == 0 ? 'message' : 'group',
      to: chathead_id
    })
      .then(() => this.setState({
        type: 'Success',
        message: `Successfully shared with ${name}`,
        isVisible: true,
        attachment: false,
        isChat: false
      }))
      .catch()
  }

  checkMembership = () => {
    let packagename = this.props.user?.user_subscription?.subscription?.type
    if (packagename?.toLowerCase() != 'premium_plan') {
      this.setState({ isShowPasscodeModal: true, isShowMenu: false })
      return
    } else {
      this.setState({ isShowCreatePasscodeFormModal: true })

    }
  }


  render() {
    const item = this.props?.route?.params?.item;
    return (
      <>
        <View style={{ flex: 1 }}>
          <Header
            leftIcon={back_arrow}
            onPressLeftIcon={() =>
              this.props.navigation.goBack()
            }
            rightIcon={notification_white}
            onPressRightIcon={() =>
              this.props.navigation.navigate('Notification')
            }
            headerText={'PREVIEW'}
          />
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              backgroundColor: Colors.WHITE_1,
            }}>
            <Text
              style={{
                color: Colors.BLACK,
                fontWeight: 'bold',
                fontSize: 20,
                marginVertical: 20,
              }}>
              {item.name}
            </Text>
            <View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('FileEdit', { item })}>
                <Image
                  source={document}
                  style={{ height: 500, width: '100%', borderRadius: 15 }}
                />
              </TouchableOpacity>
              {this.renderMenu()}
              <TouchableOpacity
                onPress={() => this.setState({ attachment: true })}
                style={{
                  backgroundColor: Colors.BLUE,
                  position: 'absolute',
                  bottom: -30,
                  left: '45%',
                  height: 60,
                  width: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                  elevation: 3,
                }}>
                <Image
                  source={share_white}
                  style={{ height: 30, width: 30 }}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {this.renderDeleteFileModal()}
        {this.renderPasscodeModal()}
        {this.renderCreatePassCodeFormModal()}
        <CustomAlert
          visible={this.state.isVisible}
          onPress={() => { this.setState({ isVisible: false }), this.state.type == 'Success' ? this.hidemodel() : null }}
          type={this.state.type}
          Message={this.state.message} />
        {this.renderModal()}
      </>
    );
  }
}

const mapDisPatchToProps = (dispatch) => {
  return {
    setPasscode: payload => dispatch(FilesMiddleware.setPasscode(payload)),
    deleteFile: payload => dispatch(FilesMiddleware.deleteFile(payload)),
    downloadFile: payload => dispatch(FilesMiddleware.DownloadAttachment(payload)),
    getChatHead: payload => dispatch(ChatMiddleware.getChatHeads(payload)),
    shareDocument: payload => dispatch(FilesMiddleware.shareDocument(payload))

  }
}
const mapStateToProps = (state) => {
  return {
    chatHead: state.ChatReducer.chatHeads,
    user: state.AuthReducer.user

  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(FileDetail);

const styles = StyleSheet.create({

  dismiss: {
    alignSelf: 'center',
    marginVertical: 5,
    backgroundColor: Colors.CYAN,
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 10
  },
  profile_Img: {
    width: 50,
    height: 50,
  },
  chat_Component: {
    backgroundColor: Colors.GRAY_BG,
    // width: '100%',
    height: 100,
    padding: 15,
    alignItems: 'center',
    // flexDirection: 'row',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  profile_view: {
    // width: '20%',
  },
  profile_Img: {
    width: 50,
    height: 50,
  },
  group_profile_Img: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginHorizontal: -2
  },
  friendCardWrapper: {
    // width: 45,
    // height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: Colors.BORDER_BLUE_COLOR,
    borderWidth: 2,
    borderStyle: 'solid',
    marginHorizontal: 10,
  },
  chat_view: {
    marginHorizontal: 5,
    // width: '55%',
  },
  chat_message: {
    fontSize: 14,
    color: Colors.GRAY_3
  },
  chat_name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.GRAY_3
  },
  date_view: {
    // width: '20%',
    alignItems: 'flex-end'
  },
  chat_date: {
    fontSize: 12,
    color: Colors.GRAY_3
  },
  message_count: {
    alignItems: 'center',
  },
  message_countText: {
    fontSize: 14,
    color: Colors.WHITE,
    fontWeight: 'bold',
    backgroundColor: Colors.COUNT_RED,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

});
