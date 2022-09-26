import { View, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { Colors } from '../../Styles'
import { Input } from 'native-base'
import { Text } from '../../Components'
export default class TextInput extends Component {
    render() {
        const { label, value, onChangeText, secureTextEntry, editable, maxlength , type, InputValue } = this.props;
        return (
            <View>
                <Text style={styles.labelText}>{label}</Text>
                <View style={styles.inputContainer}>
                    <Input size="lg"
                        secureTextEntry={secureTextEntry}
                        placeholder={value}
                        value={InputValue}
                        variant={'unstyled'}
                        editable={editable}
                        maxLength={maxlength}
                        keyboardType={type}
                        onChangeText={text => (onChangeText ? onChangeText(text) : undefined)} />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    labelText: {
        color: Colors.BLACK, fontWeight: 'bold', marginVertical: 5
    },
    inputContainer: {
        borderColor: Colors.GRAY_BORDER, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, height: 50, justifyContent: 'center'
    }

})