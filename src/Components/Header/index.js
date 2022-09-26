import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { search } from '../../Assets';
import { Colors } from '../../Styles';
import { Text } from '../../Components';

export class Header extends Component {
  render() {
    const {
      leftIcon,
      rightIcon,
      headerText,
      leftIconStyle,
      rightIconStyle,
      onPressLeftIcon,
      onPressRightIcon,
      fontSize = 16,
    } = this.props;
    return (
      <View style={styles.container}>
        {leftIcon ? (
          <TouchableOpacity
            style={[styles.iconContainer, leftIconStyle]}
            onPress={onPressLeftIcon}>
            <Image
              source={leftIcon}
              style={styles.icon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.w40} />
        )}
        <Text style={{ ...styles.headerText, fontSize }}>{headerText}</Text>
        {rightIcon ? (
          <TouchableOpacity
            style={[styles.iconContainer, styles.bgCyan, rightIconStyle]}
            onPress={onPressRightIcon}>
            <Image
              source={rightIcon}
              style={styles.icon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.w40} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: Colors.WHITE,
  },
  iconContainer: {
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    elevation: 4,
  },
  bgCyan: { backgroundColor: Colors.CYAN },
  headerText: { fontSize: 16, fontWeight: 'bold', color: Colors.BLACK },
  icon: { width: 20, height: 20 },
  w40: { width: 40 },
});

export default Header;
