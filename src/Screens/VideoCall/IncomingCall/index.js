import React, { Component } from 'react';
import {
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
    StyleSheet,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { face1 } from '../../../Assets'

import { Colors } from '../../../Styles';
import VideoMiddleware from '../../../Store/Middleware/VideoMiddleware';
import { connect } from 'react-redux';
import SoundPlayer from 'react-native-sound-player'
import { IMG_URL } from '../../../Store/Apis'

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AnswerOrReject: false,
        };
    }
    componentDidMount = () => {
        let data = this.props.route.params?.data;

        let total = JSON.parse(this.props.route.params?.data?.from_call);
        let details = JSON.parse(data?.datastring)
        console.log("sadasdasda-",details)
        SoundPlayer.playSoundFile('ring', 'wav')
        setTimeout(() => {
            if (!this.state.AnswerOrReject) {
                SoundPlayer.stop();
                this.props.navigation.goBack();

            }
        }, 20000)
    }
    AnswerCall = () => {
        SoundPlayer.stop();
        this.setState({ AnswerOrReject: true })
        let data = this.props.route.params?.data;

        let total = JSON.parse(this.props.route.params?.data?.from_call);
        let details = JSON.parse(data?.datastring)
        if (data.is_group == 0) {
            this.props.navigation.navigate('VideoCall', { Incoming: true, call_token: data?.token, channelName: data?.channel, OpponentID: JSON.parse(data?.from_call).id, details })
        } else {
            this.props.navigation.navigate('VideoCallGroup', { Incoming: true, call_token: data?.token, channelName: data?.channel, OpponentID: JSON.parse(data?.from_call).id, totalmember: total?.members?.length, details })
        }
    }
    RejectCall = () => {
        SoundPlayer.stop();
        let data = JSON.parse(this.props.route.params?.data?.from_call)
        let is_group = this.props.route.params?.data.is_group;
        this.props.declineCall({ id: data.id, is_group: is_group })
            .then((data) => {
                this.props.navigation.goBack();
            })
            .catch((err) => console.log(err))

    }

    render() {
        let is_group = this.props.route.params?.data?.is_group;
        let Data = JSON.parse(this.props.route.params?.data?.from_call);
        return (
            <View style={styles.container}>
                <View style={{ flex: 0.75, backgroundColor: Colors.CYAN, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={
                        is_group == 0 ?
                            Data?.profile_pic ?
                                { uri: IMG_URL + Data?.profile_pic }
                                : face1
                            : Data?.image ?
                                { uri: IMG_URL + Data?.image }
                                : face1} style={{ width: 160, height: 160, resizeMode: 'contain' }} />
                    <Text style={{ marginVertical: 20, fontSize: 17, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Incoming Call From {"\n" + is_group == 0 ? Data?.username : Data?.name}...</Text>
                </View>
                <View style={{ flex: 0.25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <View >
                        <TouchableOpacity onPress={() => this.AnswerCall()} style={styles.button}>
                            <FontAwesome name={'phone'} size={60} color={'green'} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => this.RejectCall()} style={styles.button}>
                            <FontAwesome name={'phone'} size={60} color={'red'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.AuthReducer.user,
    };
};
const mapDispatchToProps = dispatch => ({

    declineCall: payload => dispatch(VideoMiddleware.declineCall(payload)),

});

export default connect(mapStateToProps, mapDispatchToProps)(index);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    button: {
        paddding: 40,
        backgroundColor: 'lightgrey',
        width: 90,
        height: 90,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center'

    },
})