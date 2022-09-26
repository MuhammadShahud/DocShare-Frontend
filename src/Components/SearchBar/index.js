import React, { Component } from 'react';
import { Image, StyleSheet, View, TextInput } from 'react-native';
import { back_arrow, search } from '../../Assets';
import { Colors } from '../../Styles';
import { Text } from '../../Components';
export default class SearchBar extends Component {
  render() {
    const { placeholder, icon, onSubmitEditing, onChangeText } = this.props
    return (
      <View style={styles.container}>
        {/* <View style={styles.backIconContainer}>
                    <Image source={back_arrow} style={styles.backIcon} resizeMode={'contain'} />
                </View> */}
        <View style={styles.searchbarContainer}>
          <Image source={search} style={styles.searhIcon} />
          <TextInput placeholder={placeholder} style={styles.inputField}
            onChangeText={text => (onChangeText ? onChangeText(text) : undefined)}
            onSubmitEditing={onSubmitEditing}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%'
  },
  backIconContainer: {
    backgroundColor: Colors.CYAN,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  backIcon: { width: 15, height: 15 },
  searchbarContainer: {
    height: 40,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    width: '100%',
    // marginLeft: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
  },
  searhIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  inputField: {
    width: '85%'
  }
});
