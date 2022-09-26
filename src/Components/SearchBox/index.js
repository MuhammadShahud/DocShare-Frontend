import { View, StyleSheet, Image, TextInput } from 'react-native';
import React from 'react';
import { Colors } from '../../Styles';
import { link_icon, search } from '../../Assets';

export default function SearchBox({ placeholder, icon, onSubmitEditing, onChangeText }) {
  return (
    <View style={styles.SearchBarWrapper}>
      <Image source={icon} style={styles.SearchIcon} />
      <TextInput placeholder={placeholder} style={styles.inputField}
        onChangeText={text => (onChangeText ? onChangeText(text) : undefined)}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  SearchBarWrapper: {
    width: '100%',
    backgroundColor: Colors.WHITE,
    borderColor: Colors.GRAY_BORDER,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 20,
    marginVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  SearchIcon: { width: 18, height: 18 },
  inputField: { width: '100%', paddingVertical: 6 },
});
