import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Colors } from '../../Styles';

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20, backgroundColor: 'red' },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: { marginVertical: 10, alignItems: 'center' },
  cell: {
    width: 70,
    height: 70,
    fontSize: 24,
    borderWidth: 1,
    borderRadius: 9,
    borderColor: Colors.CYAN,
    color: Colors.CYAN,
    fontSize: 30,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  focusCell: {
    borderWidth: 1.5
  },
});

const CELL_COUNT = 4;

const App = ({ onChangeText, value }) => {
  //const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  // const [props, getCellOnLayoutHandler] = useClearByFocusCell({
  //   value,
  //   setValue,
  // });

  return (

    <CodeField
      ref={ref}
      value={value}
      onChangeText={onChangeText}
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFieldRoot}
      // keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => (
        <Text
          key={index}
          style={[styles.cell, isFocused && styles.focusCell]}
        // onLayout={getCellOnLayoutHandler(index)}
        >
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      )}
    />
  );
};

export default App;