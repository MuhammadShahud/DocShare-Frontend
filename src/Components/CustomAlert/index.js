import { Text, StyleSheet, View, Image } from 'react-native'
import React, { Component } from 'react'
import { Colors } from '../../Styles'
import { check_icon, cross_icon } from '../../Assets'
import Button from '../Button'
import Modal from '../Modal'
import AntDesign from 'react-native-vector-icons/AntDesign'


export default class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisible: true
        }
    }
    render() {
        const { type, Message, visible, onPress, onCancel } = this.props;

        return (
            <Modal animationType={'fade'} visible={visible} style={{ backgroundColor: Colors.CYAN }}>
                <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
                    <View style={{ alignSelf: 'center', marginVertical: 10 }}>
                        <AntDesign name={type === "Error" ? "closecircleo" : type === "logout" ? "questioncircleo" : "checkcircleo"} size={40} color={type === "Error" ? Colors.GMAIL_RED : type === "logout" ? Colors.CYAN : Colors.GREEN} />
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: 22, color: Colors.BLACK, textAlign: 'center' }}>{type}</Text>
                    <Text style={{ color: Colors.GRAY_LIGHT, textAlign: 'center', fontSize: 18 }} numberOfLines={3}>{Message}</Text>
                    {type != "logout" ?
                        <Button btnText={'Dismiss'} theme={'cyan'} style={{ marginVertical: 20 }}
                            onPress={onPress}
                        /> : null}
                    {type == "logout" ?
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-evenly' }}>
                            <Button btnText={'Not now'} theme={'white'}
                                onPress={onCancel}
                                style={{ width: '40%' }}
                            />
                            <Button btnText={'Logout'} theme={'cyan'}
                                onPress={onPress}
                                style={{ width: '40%' }}
                            />
                        </View>
                        : null}
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({})