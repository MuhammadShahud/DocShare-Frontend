import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'native-base'

const CText = ({ style, children, ...rest }) => {
  return (
    <Text {...rest} style={[styles.textStyle, style]}>
      {children}
    </Text>
  );
};

export default CText;

const styles = StyleSheet.create({
  textStyle: {},
});
