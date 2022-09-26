import React, { Component } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Dimensions
} from 'react-native';
import {
    chat_attachment,
    chat_send,
    doc,
    face1,
    face2,
    face3,
    face4,
    face5,
    back_arrow,
    video_white,
} from '../../Assets';
import { Header, } from '../../Components';
import { Colors } from '../../Styles';
import MapView, { Marker } from 'react-native-maps';
import { back_arror_white } from '../../Assets';
import { KeycodeInput } from 'react-native-keycode'
import FilesMiddleware from '../../Store/Middleware/FilesMiddleware'
import { connect } from 'react-redux';
import { IMG_URL } from '../../Store/Apis';
import CustomAlert from '../../Components/CustomAlert'
class PassCode extends Component {
    state = {
        value: '',
        numeric: false,
        status: false

    };
    componentDidMount() {

    }

    checkPass = (pass) => {
        let item = this.props.route.params.item
        this.props.openDoc({
            document_id: this.props.route.params.item.id,
            key: pass
        })
            .then((data) => {
                if (data.success) {
                    this.props.navigation.navigate('FileEdit', { item: { name: item?.media, type: item?.type, url: IMG_URL + item?.name, screen: 'PassCode' } })
                } else {
                    this.setState({ status: true })
                }
            })
            .catch()
    }


    render() {
        const navigation = this.props.navigation;

        return (
            <View style={{ flex: 1 }}>
                <Header
                    leftIcon={back_arrow}
                    onPressLeftIcon={() => this.props.navigation.goBack()}
                    // rightIcon={video_white}
                    headerText={'Enter Passcode'}
                />
                {/* <Text style={styles.msgDay}>Today</Text> */}


                <View style={styles.container}>


                    <KeycodeInput
                        numeric={this.state.numeric}
                        value={this.state.value}
                        length={5}
                        onChange={(newValue) => this.setState({ value: newValue })}
                        onComplete={(completedValue) => {
                            this.checkPass(completedValue)
                        }} />

                    <View style={{ marginVertical: 50 }}>
                        <Text style={styles.text}>ENTER YOUR PASSCODE</Text>
                    </View>
                </View>

                <CustomAlert
                    visible={this.state.status}
                    onPress={() => { this.setState({ status: false }) }}
                    type={'Error'}
                    Message={'Incorrect password'} />

            </View>
        );
    }
}

const mapDisPatchToProps = (dispatch) => {
    return {
        openDoc: payload => dispatch(FilesMiddleware.openDocument(payload))
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

export default connect(mapStateToProps, mapDisPatchToProps)(PassCode)

const styles = StyleSheet.create({
    homeWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: Colors.WHITE_1,
    },
    headTitle: {
        marginTop: 20,
        fontWeight: 'bold',
        color: Colors.BLACK,
        fontSize: 22,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingBottom: 200
    },
});
