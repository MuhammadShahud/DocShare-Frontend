import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { Component } from 'react';
import { Button, Header, SearchBar, TextInput } from '../../Components';
import {
  add_friend_icon,
  back_arror_white,
  email_icon,
  face1,
  face2,
  face3,
  face4,
  face5,
  Logo,
  notification_white,
  search,
  setting_mail,
  setting_pin,
  setting_user,
  setting_billing,
  setting_security,
  setting_invite_friend,
  setting_sub_plan,
  setting_help,
  setting_terms,
  setting_logout,
} from '../../Assets';
import { Colors } from '../../Styles';
import { connect } from 'react-redux';
import AuthAction from '../../Store/Actions/AuthAction';
import Storage from '../../Utils/AsyncStorage';
import { IMG_URL } from '../../Store/Apis'
import CustomAlert from '../../Components/CustomAlert'

class Setting extends Component {
  state = {
    logout: false
  }
  onPressLogout = async () => {
    this.setState({ logout: false })
    await Storage.clearStorage()
    this.props.isLogin(false);
    this.props.logout(true)
  };
  render() {
    let { user } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftIcon={back_arror_white}
          headerText={'SETTINGS'}
          leftIconStyle={{ backgroundColor: Colors.CYAN }}
          onPressLeftIcon={() => this.props.navigation.goBack()}
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.profileMainView}>
            <Image
              source={user.profile_pic ? { uri: IMG_URL + user.profile_pic } : face4}
              style={styles.profileImageView}
              resizeMode="contain"
            />
            <Text style={styles.profileTextView}>{user.username}</Text>
          </View>

          <View style={styles.profileMailPinMainView}>
            <Image
              source={setting_mail}
              style={styles.profileMailPinImageView}
              resizeMode="contain"
            />

            <Text
              style={{
                color: Colors.BLACK,
              }}>
              {user.email}
            </Text>
          </View>

          <View style={styles.profileMailPinMainView}>
            <Image
              source={setting_pin}
              style={styles.profileMailPinImageView}
              resizeMode="contain"
            />

            <Text
              style={{
                color: Colors.BLACK,
              }}>
              {user.address ? user.address : 'Null'}
            </Text>
          </View>

          {/* Setting Button */}

          <View style={styles.settingButtonBackGround}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('MyAccount')}
              style={styles.settingButton}>
              <View style={styles.settingButtonIconStyle}>
                <Image
                  source={setting_user}
                  style={styles.settingButtonIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.settingButtonText}>My Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingButtonBackGround}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('TopTab')}
              style={styles.settingButton}>
              <View style={styles.settingButtonIconStyle}>
                <Image
                  source={setting_billing}
                  style={styles.settingButtonIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.settingButtonText}>Billing and Payment</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingButtonBackGround}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('SecurityAndPrivacy')
              }
              style={styles.settingButton}>
              <View style={styles.settingButtonIconStyle}>
                <Image
                  source={setting_security}
                  style={styles.settingButtonIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.settingButtonText}>Security & Privacy</Text>
            </TouchableOpacity>
          </View>

          {/* Setting Button */}

          {/* Setting Other Button */}

          <Text
            style={{
              color: Colors.BLACK,
              paddingTop: 10,
              fontSize: 16,
              marginLeft: 5,
            }}>
            Others
          </Text>

          <View style={styles.settingButtonBackGround}>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => this.props.navigation.navigate('InviteFriend')}>
              <View style={styles.settingButtonIconStyle}>
                <Image
                  source={setting_invite_friend}
                  style={styles.settingButtonIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.settingButtonText}>Invite Friend</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingButtonBackGround}>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() =>
                this.props.navigation.navigate('SubScriptionPlan')
              }>
              <View style={styles.settingButtonIconStyle}>
                <Image
                  source={setting_sub_plan}
                  style={styles.settingButtonIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.settingButtonText}>Subscription Plan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingButtonBackGround}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Help');
              }}
              style={styles.settingButton}>
              <View style={styles.settingButtonIconStyle}>
                <Image
                  source={setting_help}
                  style={styles.settingButtonIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.settingButtonText}>Help</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingButtonBackGround}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Privacy');
              }}
              style={styles.settingButton}>
              <View style={styles.settingButtonIconStyle}>
                <Image
                  source={setting_security}
                  style={styles.settingButtonIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.settingButtonText}>Privacy and Policy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingButtonBackGround}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('TermsAndCondition', { type: false });
              }}
              style={styles.settingButton}>
              <View style={styles.settingButtonIconStyle}>
                <Image
                  source={setting_terms}
                  style={styles.settingButtonIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.settingButtonText}>Terms and Conditions</Text>
            </TouchableOpacity>
          </View>
          {/* Setting Other Button */}

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => this.setState({ logout: true })}>
            <Image
              source={setting_logout}
              style={styles.logoutIcon}
              resizeMode="contain"
            />

            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
        <CustomAlert
          visible={this.state.logout}
          type={'logout'}
          Message={`${user.username} are you sure you want to logout ?`}
          onPress={() => this.onPressLogout()}
          onCancel={() => this.setState({ logout: false })}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.AuthReducer.user
  };
};
const mapDispatchToProps = dispatch => {
  return {
    isLogin: payload => dispatch(AuthAction.isLogin(payload)),
    logout: payload => dispatch(AuthAction.logout(payload))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Setting);
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.WHITE_1,
    flex: 1,
    paddingHorizontal: 30,
  },
  profileMainView: {
    alignSelf: 'center',
    marginTop: 10,
  },
  profileImageView: {
    borderRadius: 100,
    width: 80,
    height: 80,
    marginBottom: 10,
    alignSelf: 'center',
  },
  profileTextView: {
    color: Colors.BLACK,
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
  },
  profileMailPinMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20,
  },
  profileMailPinImageView: {
    width: 20,
    height: 20,
    marginRight: 15,
    marginLeft: 5,
  },
  settingButtonBackGround: {
    backgroundColor: Colors.SETTING_BUTTON_BackGround,
    height: 50,
    width: '95%',
    elevation: 1,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  settingButton: {
    backgroundColor: Colors.SETTING_BUTTON,
    height: 50,
    width: '94%',
    elevation: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingButtonIconStyle: {
    borderWidth: 2,
    borderColor: Colors.SETTING_BUTTON_ICON_BORDER,
    backgroundColor: Colors.WHITE,
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    borderRadius: 10,
  },
  settingButtonIcon: {
    width: 20,
    height: 20,
  },
  settingButtonText: {
    color: Colors.BLACK,
    fontWeight: 'bold',
    fontSize: 14,
    paddingLeft: 30,
  },
  logoutButton: {
    height: 50,
    width: 150,
    backgroundColor: Colors.SETTING_LOGOUT_BUTTON,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 5,
    borderRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
    marginLeft: 5,
  },
  logoutText: {
    color: Colors.WHITE,
    fontSize: 16,
  },
});
