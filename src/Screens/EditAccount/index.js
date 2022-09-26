import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
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
  profile_camera
} from '../../Assets';
import { Colors } from '../../Styles';
import { connect } from 'react-redux'
import { IMG_URL } from '../../Store/Apis';
import { OpenImagePicker } from '../../Components/ImagePicker'
import CustomAlert from '../../Components/CustomAlert'
import AppMiddleware from '../../Store/Middleware/AppMiddleware'

class EditAccount extends Component {
  state = {
    name: '',
    email: '',
    image: null,
    address: '',
    alert: {
      type: 'Success',
      message: 'Profile Successfully Updated.',
      isVisible: false
    }
  };
  componentDidMount() {
    this.setState({
      name: this.props.user.username,
      email: this.props.user.email
    })
  }

  uploadImage = () => {
    let uri_script, name, imgObj;
    OpenImagePicker(img => {
      uri_script = img.path.split('/');
      name = uri_script[uri_script.length - 1];
      imgObj = {
        name,
        uri: img.path,
        size: img.size,
        type: img.mime,
      };
      this.setState({ image: imgObj })
    });
  };

  updateProfile = () => {
    let { name, email, image, address } = this.state
    this.props.updateProfile({
      name: name,
      email: email,
      image: image,
      address: address
    })
      .then(() => {
        this.setState({ alert: { type: 'Success', message: 'Profile Successfully Updated.', isVisible: true } })
      })
      .catch()

  }
  render() {

    const { user } = this.props
    let { image, alert } = this.state

    return (
      <View style={{ flex: 1 }}>
        <Header
          leftIcon={back_arror_white}
          headerText={'EDIT ACCOUNT'}
          leftIconStyle={{ backgroundColor: Colors.CYAN }}
          onPressLeftIcon={() => this.props.navigation.goBack()}
        />
        <ScrollView
          style={{
            backgroundColor: Colors.WHITE_1,
            flex: 1,
            paddingHorizontal: 30,
          }}>
          <View style={{
            marginTop: 30,
            height: 100,
            width: 100,
            alignSelf: 'center',
            justifyContent: 'flex-end',
            alignItems: 'flex-end'
          }}>
            <Image
              source={image ? { uri: image.uri } :
                user.profile_pic ? { uri: IMG_URL + user.profile_pic } : face4}
              style={{
                borderRadius: 50,
                width: 100,
                height: 100,
                marginBottom: 10,
                alignSelf: 'center'
              }}
            // resizeMode="contain"
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
              }}
              onPress={this.uploadImage}
            >
              <Image
                source={profile_camera}
                style={{
                  // borderRadius: 50,
                  width: 30,
                  height: 30,
                  marginLeft: 5,
                  marginBottom: 5,
                  alignSelf: 'center'
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{ fontWeight: 'bold', fontSize: 20, color: Colors.BLACK, alignSelf: 'center', textAlign: 'center' }}>
            {user.username}
          </Text>


          <TextInput label={'Name'} value={user.username} onChangeText={text => this.setState({ name: text })} />
          <TextInput label={'Address'} value={user.address} onChangeText={text => this.setState({ address: text })} />

          <TextInput label={'Email'} value={user.email} editable={false} onChangeText={text => this.setState({ email: text })} />

          <View style={{ marginTop: 20, marginBottom: 20, width: '100%', alignSelf: 'center' }}>
            <TouchableOpacity
              onPress={this.updateProfile}
              style={{
                backgroundColor: Colors.CYAN,
                height: 50,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 2,
                marginLeft: 5,
                marginRight: 5
              }}>
              <Text
                style={{
                  color: Colors.WHITE,
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <CustomAlert
          visible={alert.isVisible}
          onPress={() => {
            this.setState({ alert: { isVisible: false } }),
              alert.type == 'Success' ? this.props.navigation.goBack()
                : null
          }}
          type={alert.type}
          Message={alert.message} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.AuthReducer.user

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateProfile: payload => dispatch(AppMiddleware.updateProfile(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAccount)

const styles = StyleSheet.create({});
