import { Text, View, Image, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { Colors } from '../../Styles';
import { apple_white, fb_white, logo_white, mail_white } from '../../Assets';
import { Button, TextInput } from '../../Components';
import CustomAlert from '../../Components/CustomAlert'
import { connect } from 'react-redux'
import AppMiddleware from '../../Store/Middleware/AppMiddleware'
import messaging from '@react-native-firebase/messaging';
import { Checkbox } from 'native-base';
import EvilIcons from 'react-native-vector-icons/EvilIcons'


class SignUp extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsCondition: false,
    alert: {
      type: '',
      message: '',
      isVisible: false,
    }
  }



  onPressSignup = async () => {
    let token = await messaging().getToken();
    const { name, email, password, confirmPassword, termsCondition } = this.state
    if (password === confirmPassword) {
    } else {
      this.setState({
        alert: ({
          type: 'Error',
          message: 'Password and confirm password should be match',
          isVisible: true,
        })
      })
      return;
    }
    if (!this.props.isTerms) {
      this.setState({
        alert: ({
          type: 'Error',
          message: 'Please accept Terms & conditions',
          isVisible: true,
        })
      })
      return;
    }
    if (name && email && password && confirmPassword) {
      this.props.register({
        token,
        name,
        email,
        password
      })
        .then(data => {
          this.setState({
            alert: ({
              type: 'Success',
              message: 'Signup Successfully.',
              isVisible: true,
            })
          })
        })
        .catch();
    } else {
      this.setState({
        alert: ({
          type: 'Error',
          message: 'All fields are required',
          isVisible: true,
        })
      })
    }

  }

  render() {
    console.log(this.props.isTerms)
    return (
      <View style={styles.container}>
        <Image source={logo_white} style={styles.logo} resizeMode={'contain'} />
        <ScrollView style={styles.bodyContainer}>
          <Text style={styles.welcomText}>Signup</Text>
          <Text style={styles.lightGrayText}>
            Signup to create your personal account
          </Text>
          {/* <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[
                styles.socialIconContainer,
                { backgroundColor: Colors.FB_BLUE },
              ]}>
              <Image
                source={fb_white}
                style={styles.socialIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.socialIconContainer,
                { backgroundColor: Colors.BLACK },
              ]}>
              <Image
                source={apple_white}
                style={styles.socialIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialIconContainer,
              { backgroundColor: Colors.WHITE, borderWidth: 3, borderColor: Colors.WHITE_1 }]}
            >
              <EvilIcons name='sc-google-plus' size={40} />
            </TouchableOpacity>
            {/* <View
              style={[
                styles.socialIconContainer,
                { backgroundColor: Colors.GMAIL_RED },
              ]}>
              <Image
                source={mail_white}
                style={styles.socialIcon}
                resizeMode={'contain'}
              />
            </View>
          </View> */}


          {/* <Text style={styles.msg1}>Or connect with your email</Text> */}
          <TextInput label={'Name'} value={'David James'} onChangeText={value => this.setState({ name: value })} />
          <TextInput label={'Email'} value={'david.james@gmail.com'} onChangeText={value => this.setState({ email: value })} />
          <TextInput label={'Password'} value={'**********'} secureTextEntry={true} onChangeText={value => this.setState({ password: value })} />
          <TextInput label={'Confirm Password'} value={'**********'} secureTextEntry={true} onChangeText={value => this.setState({ confirmPassword: value })} />
          <View style={{ marginVertical: 10, flexDirection: 'row' }}>
            <Checkbox
              style={{
                height: 20,
                width: 20,
                marginLeft: 5,
              }}
              isDisabled
              isChecked={this.props.isTerms}
              tintColors
              onValueChange={newValue => {
                this.setState({ termsCondition: true });
              }}
            />
            <TouchableOpacity onPress={() => this.props.navigation.navigate('TermsAndCondition', { type: true })}>
              <Text style={{ fontSize: 14, color: Colors.GRAY_3, marginLeft: 5, textDecorationLine: 'underline' }}>I Accept Terms & conditions</Text>

            </TouchableOpacity>

          </View>
          <Button
            btnText={'Create an account'}
            theme={'cyan'}
            style={{ marginTop: 30 }}
            onPress={() => this.onPressSignup()}
          />
          <Text
            style={styles.msg2}
            onPress={() => this.props.navigation.navigate('Login')}>
            Already have an account?
          </Text>
        </ScrollView>
        <CustomAlert
          visible={this.state.alert.isVisible}
          onPress={() => { this.setState({ alert: { isVisible: false } }), this.state.alert.type == 'Success' ? this.props.navigation.goBack() : null }}
          type={this.state.alert.type}
          Message={this.state.alert.message} />
      </View>
    );
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    register: payload => dispatch(AppMiddleware.Register(payload))
  }
}
const mapStateToProps = (state) => {
  return {
    isTerms: state.GeneralReducer.isTerms
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(SignUp)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLUE,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  welcomText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: Colors.BLACK,
  },
  lightGrayText: {
    color: Colors.GRAY_LIGHT,
  },
  socialContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-evenly',
  },
  socialIconContainer: {
    width: 90,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  msg1: {
    color: Colors.GRAY_LIGHT,
    alignSelf: 'center',
  },
  msg2: { color: Colors.GRAY_LIGHT, alignSelf: 'center', marginVertical: 25 },
  socialIcon: { height: 25, width: 25 },
  logo: { width: '50%', alignSelf: 'center' },
});
