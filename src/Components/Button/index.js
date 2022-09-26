import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import { Colors } from '../../Styles';
import { Text } from '../../Components'

export class Button extends Component {
    render() {
        const { btnText, theme, style, onPress } = this.props;
        return (
            <TouchableOpacity onPress={onPress} style={[styles.container, styles[theme], style]}>
                <Text style={[styles.btnText, styles[`${theme}Text`]]}>{btnText}</Text>
            </TouchableOpacity>
        )
    }
}

export default Button
const styles = StyleSheet.create({
    container: {
        height: 50, backgroundColor: Colors.CYAN, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 4
    },
    btnText: {
        fontWeight: 'bold', color: Colors.WHITE, fontSize: 16
    },
    blue: {
        backgroundColor: Colors.BLUE,
    },
    cyan: {
        backgroundColor: Colors.CYAN
    },
    white: {
        backgroundColor: Colors.WHITE_1
    },
    blueText: {
        color: Colors.WHITE,
    },
    cyanText: {
        color: Colors.WHITE
    },
    whiteText: {
        color: Colors.GRAY_LIGHT
    }
})