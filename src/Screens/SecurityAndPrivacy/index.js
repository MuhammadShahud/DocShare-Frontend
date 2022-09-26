import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { Button, Header, SearchBar, TextInput, Modal } from '../../Components';
import {
  add_friend_icon,
  back_arror_white,
  email_icon,
  face1,
  face4,
  key,
  Logo,
  notification_white,
  search,
} from '../../Assets';
import { Colors } from '../../Styles';
import ToggleSwitch from 'toggle-switch-react-native'
import { connect } from 'react-redux'
import AppMiddleware from '../../Store/Middleware/AppMiddleware'
import NotificationMiddleware from '../../Store/Middleware/NotificationMiddleware'
import CustomAlert from '../../Components/CustomAlert'
import AuthAction from '../../Store/Actions/AuthAction';
import Storage from '../../Utils/AsyncStorage'

class SecurityAndPrivacy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: this.props.user.is_notify,
      changePassModal: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      alert: {
        type: '',
        message: '',
        isVisible: false
      }
    };
  }
  renderChangePasswordModal = () => {
    return (
      <Modal visible={this.state.changePassModal}
        onPressCloseIcon={() => this.setState({ changePassModal: false })}
        style={{ height: 450 }}
      >
        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 22, color: Colors.BLACK, textAlign: 'center' }}>Change Password</Text>
          <TextInput label={'Old Password'} value={'**********'} secureTextEntry={true} onChangeText={value => this.setState({ oldPassword: value })} />
          <TextInput label={'New Password'} value={'**********'} secureTextEntry={true} onChangeText={value => this.setState({ newPassword: value })} />
          <TextInput label={'Re-type new Password'} value={'**********'} secureTextEntry={true} onChangeText={value => this.setState({ confirmPassword: value })} />
          <Button btnText={'Change Password'} theme={'cyan'} style={{ marginVertical: 20 }}
            onPress={() => this.resetPassword()}
          />
        </View>
      </Modal>
    )
  }

  resetPassword = () => {
    const { newPassword, confirmPassword, oldPassword } = this.state
    if (!newPassword && !confirmPassword) {
      this.setState({ alert: { type: 'Error', message: 'Password fields is required', isVisible: true, } })
      return;
    }
    if (newPassword === confirmPassword) {
      this.props.resetPassword({
        id: this.props.user.id,
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      }).then(data => {
        this.setState({ changePassModal: false }),
          this.setState({ alert: { type: 'Success', message: 'Password Successfully Changed.', isVisible: true, } })
      }).catch();
    } else {
      this.setState({ alert: { type: 'Error', message: 'Password and confirm password should be match', isVisible: true, } })
      return;
    }

  }
  toggleNotify = (val) => {
    this.props.notification({ is_notify: val == true ? 1 : 0 })
      .then(() => {
        this.setState({
          alert: {
            type: 'Success',
            message: val == true ? 'Notification on successfully' : 'Notification off successfully',
            isVisible: true
          }
          , isOn: val
        })
          , this.updateRedux(val)
      })
      .catch()

  }
  updateRedux = async (val) => {
    let user = this.props.user
    const userdata = {
      ...user,
      is_notify: val == true ? 1 : 0
    }
    this.props.setUserData(userdata)
    await Storage.set('@user', JSON.stringify(userdata));

  }

  render() {
    const { alert } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftIcon={back_arror_white}
          headerText={'SECURITY AND PRIVACY'}
          leftIconStyle={{ backgroundColor: Colors.CYAN }}
          onPressLeftIcon={() => this.props.navigation.goBack()}
        />
        <View
          style={{
            backgroundColor: Colors.WHITE_1,
            flex: 1,
            paddingHorizontal: 30,
          }}>

          {/* <Text style={{
            color: '#1C1D1F',
            paddingTop: 30,
            paddingBottom: 10
          }}>Notification</Text> */}

          {/* <View
            style={{
              backgroundColor: Colors.WHITE,
              height: 70,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              elevation: 2,
              padding: 10
            }}
          >
            <Text style={{ color: '#1C1D1F', paddingLeft: 10, fontWeight: 'bold' }}>Allow Notification</Text>

            <View style={{
              marginRight: 10,
              marginTop: 3
            }}>
              <ToggleSwitch
                isOn={this.state.isOn}
                onColor="#27D56C"
                offColor="grey"
                size="small"
                onToggle={val => this.toggleNotify(val)}
              />
            </View>

          </View> */}

          <View
            // style={{ borderWidth: 0.5, borderColor: '#505050', borderStyle: 'dashed', marginTop: 10 }}
          />

          <Text style={{
            color: '#1C1D1F',
            paddingTop: 30,
            paddingBottom: 10
          }}>Security</Text>

          <View
            style={{ backgroundColor: '#0659FD', elevation: 1, width: '60%', borderRadius: 10, marginTop: 5, marginBottom: 5, height: 40 }}
          >
            <TouchableOpacity
              onPress={() => this.setState({ changePassModal: true })}
              style={{ padding: 10, backgroundColor: Colors.SETTING_BUTTON, elevation: 2, width: '93%', height: 40, flexDirection: 'row', borderRadius: 10, alignItems: 'center', justifyContent: 'space-evenly' }}
            >
              <Image
                source={key}
                style={{ height: 20, width: 20 }}
              />
              <Text
                style={{ color: '#707070', fontWeight: 'bold', fontSize: 12 }}
              >
                Change password
              </Text>

            </TouchableOpacity>
          </View>

        </View>
        {this.renderChangePasswordModal()}
        <CustomAlert
          visible={alert.isVisible}
          onPress={() => { this.setState({ alert: { isVisible: false } }), alert.type == 'Success' ? null : null }}
          type={alert.type}
          Message={alert.message} />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetPassword: (payload) => dispatch(AppMiddleware.changePassword(payload)),
    notification: (payload) => dispatch(NotificationMiddleware.toggleNotifcation(payload)),
    setUserData: (payload) => dispatch(AuthAction.getUserData(payload))
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.AuthReducer.user
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SecurityAndPrivacy)
const styles = StyleSheet.create({});
