import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { Button, Header, SearchBar, TextInput } from '../../Components';
import {
  add_friend_icon,
  back_arror_white,
  email_icon,
  face2,
  Logo,
  notification_white,
  person_crose,
  search,
} from '../../Assets';
import { Colors } from '../../Styles';
import { connect } from 'react-redux'
import { IMG_URL } from '../../Store/Apis'
import FriendsMiddleware from '../../Store/Middleware/FriendsMiddleware'
import ChatMiddleware from '../../Store/Middleware/ChatMiddleware'
import CustomAlert from '../../Components/CustomAlert'

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      alert: false,
      ModalVisible: false,
      type: '',
      message: '',
    };
  }
  componentDidMount() {
    this.setState({
      user: this.props.route.params.item
    })
  }
  onPressRequestOrRemove = () => {
    let userdetail = {
      ...this.state.user,
      is_friend: this.state.user.status === "approved" ? false : true,
      status: this.state.user.status === "approved" ? "approved" : "pending"
    }
    this.state.user.status === "approved" ?
      this.props
        .unFriend({ id: userdetail.id, screen: this.props.route.params.screen })
        .then(() => { this.setState({ user: userdetail, ModalVisible: true, type: "Success", message: "Remove Friend Successfully." }) })
        .catch()
      :
      this.props
        .sendRequest({ id: userdetail.id })
        .then(() => { this.setState({ user: userdetail, ModalVisible: true, type: "Success", message: "Friend Request Sent" }) })
        .catch()
  }

  createChat = () => {
    const { user } = this.state;

    this.props.createChatSession({ id: user.id })
      .then(data => this.props.navigation.navigate('Chat', {
        details: {
          chatHead_id: data?.id,
          recipient_user: user?.id,
          name: user?.username
        }
      }))
      .catch()


  }
  render() {
    const { user } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftIcon={back_arror_white}
          headerText={'PROFILE'}
          leftIconStyle={{ backgroundColor: Colors.CYAN }}
          onPressLeftIcon={() => this.props.navigation.goBack()}
        />
        <View
          style={styles.container}>
          <View
            style={styles.profileContainer}>
            <Image
              source={user?.profile_pic ? { uri: IMG_URL + user.profile_pic } : face2}
              style={{
                borderRadius: 50,
                width: 80,
                height: 80,
                marginBottom: 10,
              }}
              resizeMode="contain"
            />
            <Text
              style={{ fontWeight: 'bold', fontSize: 20, color: Colors.BLACK }}>
              {user.username}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                marginTop: 30,
              }}>
              <Text style={{ fontWeight: '500', color: Colors.BLACK }}>
                Email
              </Text>
              <Text style={{ fontWeight: '500', color: Colors.GRAY_LIGHT }}>
                {user.email}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={styles.sendMessage}
              onPress={this.createChat}
            >
              <Image
                source={email_icon}
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: Colors.WHITE,
                  marginLeft: 5,
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                Send Message
              </Text>
            </TouchableOpacity>
            {user.status === "pending" ?
              <View
                style={[styles.addUser, { backgroundColor: Colors.GMAIL_RED }]}>
                <Text
                  style={{
                    color: Colors.WHITE,
                    marginLeft: 5,
                    fontSize: 12,
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                  {user.status}
                </Text>
              </View> :
              <TouchableOpacity
                onPress={this.onPressRequestOrRemove}
                style={styles.addUser}>
                <Image
                  source={
                    user.is_friend
                      ? person_crose
                      : add_friend_icon
                  }
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: Colors.WHITE,
                    marginLeft: 5,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                  {user.is_friend
                    ? 'Remove User'
                    : 'Add User'}
                </Text>
              </TouchableOpacity>
            }

          </View>
        </View>
        <CustomAlert
          visible={this.state.ModalVisible}
          onPress={() => this.setState({ ModalVisible: false })}
          type={this.state.type}
          Message={this.state.message} />
      </View>
    );
  }
}

const mapDisPatchToProps = (dispatch) => {
  return {
    sendRequest: payload => dispatch(FriendsMiddleware.sendFriendRequest(payload)),
    unFriend: payload => dispatch(FriendsMiddleware.unfriend(payload)),
    createChatSession: payload => dispatch(ChatMiddleware.CreateChat(payload))

  }
}
const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(Profile)

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE_1,
    flex: 1,
    paddingHorizontal: 30,
  },
  profileContainer: {
    backgroundColor: Colors.WHITE,
    width: '100%',
    height: 300,
    marginTop: 50,
    borderRadius: 20,
    borderColor: Colors.GRAY_BORDER,
    borderWidth: 2,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  sendMessage: {
    backgroundColor: Colors.BLUE,
    width: 150,
    height: 60,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  addUser: {
    backgroundColor: Colors.CYAN,
    width: 150,
    height: 60,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  }
});
