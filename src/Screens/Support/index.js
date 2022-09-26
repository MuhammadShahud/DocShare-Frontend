import { Text, View, StyleSheet, Image } from 'react-native'
import React, { Component } from 'react'
import { Button, Header, SearchBar, TextInput } from '../../Components'
import { Logo, notification_white, search } from '../../Assets'
import { Colors } from '../../Styles'
export default class Support extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header leftIcon={search} 
        onPressRightIcon={() => this.props.navigation.navigate('Notification')}
        headerText={'FRIENDS'} />
        <View style={{ flex: 1, paddingHorizontal: 20, backgroundColor: Colors.WHITE_1 }}>
          <SearchBar />
          <TextInput label={'Email'} value={'david.james@gmail.com'} />
          <TextInput label={'Password'} value={'david.james@gmail.com'} />
          <Button btnText={'Sign in'} theme={'cyan'} />
          <Button btnText={'Create Group'} theme={'blue'} />
          <Button btnText={'Not right now'} theme={'white'} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({

})