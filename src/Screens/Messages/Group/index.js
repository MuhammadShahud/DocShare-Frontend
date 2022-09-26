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
    Dimensions,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator,
    Modal as ImgModal
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
    search,
    file,
    Location,
    image,
    video_white,
    back_arrow
} from '../../../Assets';
import { Header, } from '../../../Components';
import { Colors } from '../../../Styles';
import MapView, { Marker } from 'react-native-maps';
import deviceInfoModule from 'react-native-device-info';
import Modal from '../../../Components/Modal'
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { connect } from 'react-redux'
import ChatMiddleware from '../../../Store/Middleware/ChatMiddleware';
import VideoMiddleware from '../../../Store/Middleware/VideoMiddleware'
import { IMG_URL } from '../../../Store/Apis'
import { OpenImagePicker } from '../../../Components/ImagePicker'
import DocumentPicker from 'react-native-document-picker';
import Pusher from 'pusher-js/react-native';
import ChatAction from '../../../Store/Actions/ChatAction'

const GOOGLE_MAPS_APIKEY = 'AIzaSyBBVMEPDktEjcindc7_NjCpFWsSWVspyKI';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
class Group extends Component {
    state = {
        loader: false,
        sendMessageLoader: false,
        text: '',
        attachment: false,
        imageModal: false,
        imagePath: '',
        region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },

    };
    componentDidMount() {
        console.log("sadsadasdas-------------",this.props.route.params.details.chatHead_id)
        this.setState({ loader: true }, () => {
            this.props.getGroupMessage({
                groupid: this.props.route.params.details.chatHead_id,
                next_page_url: undefined
            }).then(() => this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }))
        });
        this.initiatePusher()
    }
    componentWillUnmount() {
        this.props.resetChat();
        this.chatChannel?.unsubscribe();
    }

    initiatePusher = () => {
        const chathead_id = this.props.route?.params?.details.chatHead_id;
        this.pusher = new Pusher('2a8aef090fd9e011396f', { cluster: 'ap2' });
        this.chatChannel = this.pusher.subscribe(chathead_id.toString());
        this.chatChannel.bind('App\\Events\\Message', data => {
            if (chathead_id == data.data.group.id) {
                this.props.updateMessage(data.data);
            }
        });
    }
    sendMessage = () => {
        let { text, sendMessageLoader } = this.state;
        this.setState({ sendMessageLoader: true }, () => {
            this.props.sendMessage({
                type: 'message',
                groupid: this.props.route.params.details.chatHead_id,
                user_id: this.props.user.id,
                message: text
            })
                .then(() => this.setState({ text: '', sendMessageLoader: false }))
                .catch(() => this.setState({ sendMessageLoader: false }))
        })
    };
    renderMessages = ({ item }) => {
        let { user } = this.props;
        let profile_image =
            item?.messageFrom?.id == user.id ?
                item?.messageFrom?.profile_pic ?
                    `${IMG_URL}${item?.messageFrom?.profile_pic}` : null
                : item?.messageFrom?.profile_pic ? `${IMG_URL}${item?.messageFrom?.profile_pic}` : null;
        let cordinates = null;
        if (item.location) {
            cordinates = {
                lat: parseFloat(item.location?.lat),
                lng: parseFloat(item.location?.long),
            }
        }
        return (
            <View
                style={{
                    marginVertical: 12,
                    flexDirection: item?.messageFrom?.id == user.id ? 'row-reverse' : 'row',
                    alignItems: 'center',
                }}>
                <View style={{ paddingHorizontal: 10 }}>

                    <Image source={profile_image != null ? { uri: profile_image } : face1} style={styles.userImg} />

                </View>

                <View style={{ width: '70%', padding: 10, borderRadius: 5 }}>
                    {item.documents?.length > 0 ?
                        item.documents[0].type == 'image' ? (
                            <TouchableOpacity onPress={() => this.setState({ imageModal: true, imagePath: item.documents[0].name })}
                                style={{
                                    backgroundColor: Colors.WHITE,
                                    padding: 10,
                                    borderRadius: 10,
                                    height: 170,
                                    width: 170,
                                    justifyContent: 'center',
                                    alignSelf: item?.messageFrom?.id == user.id ? 'flex-end' : 'flex-start'
                                }}>
                                <Image
                                    source={{ uri: IMG_URL + item.documents[0].name }}
                                    style={{ width: 150, height: 150 }} />
                            </TouchableOpacity>
                        ) :
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate('FileEdit', { item: { name: item?.media, type: item?.type, url: IMG_URL + item?.media } })}
                                style={{ width: '100%', height: 60, backgroundColor: Colors.ChatDocL, borderRadius: 10 }}>
                                <View style={{ flexDirection: 'row', backgroundColor: Colors.WHITE, width: '95%', height: 60, alignItems: 'center', borderRadius: 10 }}>
                                    <View style={{ backgroundColor: Colors.WHITE, padding: 10, borderRadius: 10, height: 40, justifyContent: 'center' }}>
                                        <Image source={doc} style={{ width: 25, height: 30, }} />
                                    </View>
                                    <View style={{ justifyContent: 'center', marginHorizontal: 10 }}>
                                        <Text
                                            style={{
                                                textAlign: item?.messageFrom?.id == user.id ? 'right' : 'left',
                                                color: '#636060',
                                            }}>
                                            {item.documents[0].name}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        :
                        null
                    }

                    {item.location ?
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Map', {
                                map: {
                                    lat: cordinates.lat,
                                    lng: cordinates.lng,
                                    latDelta: LATITUDE_DELTA,
                                    lngDelta: LONGITUDE_DELTA,
                                }
                            })}
                            style={{ width: '100%', height: 100, backgroundColor: Colors.ChatDocL, borderRadius: 10 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: Colors.WHITE, width: '95%', height: 100, alignItems: 'center', borderRadius: 10 }}>


                                <MapView
                                    initialRegion={{
                                        latitude: cordinates.lat,
                                        longitude: cordinates.lng,
                                        latitudeDelta: LATITUDE_DELTA,
                                        longitudeDelta: LONGITUDE_DELTA,
                                    }}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <Marker
                                        key={GOOGLE_MAPS_APIKEY}
                                        coordinate={{ latitude: cordinates.lat, longitude: cordinates.lng }}
                                        title={'here'}
                                        description={'I am /Here'}
                                    />
                                </MapView>
                            </View>
                        </TouchableOpacity>
                        :
                        null
                    }

                    {item.message ?
                        <Text
                            style={{
                                textAlign: item?.messageFrom?.id == user.id ? 'right' : 'left',
                                color: '#636060',
                            }}>
                            {item.message}
                        </Text>
                        :
                        null
                    }

                    {item.type == 'shared_document' ?
                        <TouchableOpacity
                            onPress={() =>
                                item?.shared_document?.is_protected == 1 ?
                                    this.props.navigation.navigate('PassCode', { item: item?.shared_document })
                                    :
                                    this.props.navigation.navigate('FileEdit', { item: { name: item?.shared_document.media, type: item?.shared_document.type, url: IMG_URL + item?.shared_document.name } })}

                            style={{ width: '100%', height: 60, backgroundColor: Colors.ChatDocL, borderRadius: 10 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: Colors.WHITE, width: '95%', height: 60, alignItems: 'center', borderRadius: 10 }}>
                                <View style={{ backgroundColor: Colors.WHITE, padding: 10, borderRadius: 10, height: 40, justifyContent: 'center' }}>
                                    <Image source={doc} style={{ width: 25, height: 30, }} />
                                </View>
                                <View style={{ justifyContent: 'center', marginHorizontal: 10 }}>
                                    <Text
                                        style={{
                                            textAlign: item.id == 1 ? 'right' : 'left',
                                            color: '#636060',
                                        }}>
                                        {item.shared_document?.name}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        : null
                    }
                </View>
            </View>)

    }

    uploadImage = () => {
        OpenImagePicker(img => {
            let uri_script, name, document;
            uri_script = img.path.split('/');
            name = uri_script[uri_script.length - 1];
            document = [{
                file_code: 1,
                name,
                uri: img.path,
                size: img.size,
                type: img.mime,
            }];
            this.props.sendMessage({
                type: 'document',
                groupid: this.props.route.params.details.chatHead_id,
                user_id: this.props.user.id,
                documents: document
            })
                .then(() => this.setState({ attachment: false }))
                .catch(() => this.setState({ attachment: false }))
        });
    };

    onPressChooseFile = async () => {
        try {
            const res = await DocumentPicker.pickSingle({ type: "application/*" });
            let document = [{
                file_code: 2,
                name: res.name,
                fileCopyUri: res.fileCopyUri,
                size: res.size,
                type: res.type,
                uri: res.uri
            }]
            this.props.sendMessage({
                type: 'document',
                groupid: this.props.route.params.details.chatHead_id,
                user_id: this.props.user.id,
                documents: document
            })
                .then(() => this.setState({ attachment: false }))
                .catch(() => this.setState({ attachment: false }))
        } catch (err) {
            console.log(err);
        }
    };

    renderModal = () => {
        return (
            <Modal animationType={'fade'} visible={this.state.attachment} style={{ backgroundColor: Colors.WHITE, minHeight: 150 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>

                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.attachBtn} onPress={() => this.onPressChooseFile()}>
                            <Image source={file}
                                resizeMode={'contain'}
                                style={{ width: 30, height: 30 }} />

                        </TouchableOpacity>
                        <Text style={{ color: Colors.GRAY_3 }}>Document</Text>

                    </View>

                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.attachBtn} onPress={() => this.currentLocation()}>
                            <Image source={Location}
                                resizeMode={'contain'}
                                style={{ width: 30, height: 30, tintColor: Colors.CYAN }} />
                        </TouchableOpacity>
                        <Text style={{ color: Colors.GRAY_3 }}>Location</Text>
                    </View>

                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.attachBtn} onPress={() => this.uploadImage()}>
                            <Image source={image}
                                resizeMode={'contain'}
                                style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>
                        <Text style={{ color: Colors.GRAY_3 }}>Images</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.dismiss} onPress={() => this.setState({ attachment: false })}>
                    <Text style={{ color: Colors.WHITE }}>Dismiss</Text>
                </TouchableOpacity>
            </Modal>
        )
    }
    currentLocation = () => {
        const getLoaction = () => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;

                    let location = {
                        lat: latitude,
                        lng: longitude,
                    }
                    this.props.sendMessage({
                        type: 'location',
                        groupid: this.props.route.params.details.chatHead_id,
                        user_id: this.props.user.id,
                        location: location
                    })
                        .then(() => this.setState({ attachment: false }))
                        .catch(() => this.setState({ attachment: false }))

                },
                error => {
                    console.log(error);
                },
                {
                    enableHighAccuracy: false,
                    distanceFilter: 0,
                    interval: 1000,
                    fastestInterval: 2000,
                },
            );
        }

        if (Platform.OS === "android") {
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                interval: 10000,
                fastInterval: 5000,
            })
                .then(data => {
                    getLoaction();
                })
                .catch(err => {
                    console.log(err);
                });
        } else if (Platform.OS === "ios") {
            getLoaction()
        }
    }
    loadMoreMessages = () => {
        const { chatPagination } = this.props;
        const { loader } = this.state;
        const details = this.props.route?.params?.details;
        if (chatPagination?.links?.next && loader == false) {
            this.setState({ loader: true }, () => {
                this.props
                    .getGroupMessage({
                        next_page_url: chatPagination?.links?.next,
                        groupid: details.chatHead_id,
                    })
                    .then(() => this.setState({ loader: false }))
                    .catch(() => this.setState({ loader: false }));
            });
        }
    };

    renderImageModal = () => {
        return (
            <ImgModal transparent={true} animationType={'fade'} visible={this.state.imageModal}  >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }} >
                    {/* <View style={{ height: 300, alignItems: 'center' }} > */}
                    <Image
                        source={{ uri: IMG_URL + this.state.imagePath }}
                        style={{ width: '95%', height: 300, borderRadius: 10 }}
                        resizeMode={'contain'} />
                    {/* </View> */}

                    <TouchableOpacity style={styles.dismiss} onPress={() => this.setState({ imageModal: false })}>
                        <Text style={{ color: Colors.WHITE }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </ImgModal>
        )
    }



    render() {
        const navigation = this.props.navigation;
        let hasNotch = deviceInfoModule.hasNotch();
        let details = this.props.route.params.details;
        let { groupPagination, groupMessages } = this.props
        let ishide = this.props.isheaderhide;

        return (

            <View style={{ flex: 1 }}>
                {/* <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? (hasNotch ? 46 : 20) : undefined}
                    behavior={Platform.OS === 'ios' ? ('padding') : 'height'} > */}
                {ishide ? null :
                    <Header
                        leftIcon={back_arrow}
                        rightIcon={video_white}
                        onPressLeftIcon={() =>
                            this.props.navigation.goBack()
                        }
                        onPressRightIcon={() => {
                            this.props.generateToken({ id: this.props.route.params.details.chatHead_id, is_group: 1, dataString: JSON.stringify(details) })
                                .then(data => {
                                    this.props.navigation.navigate('VideoCallGroup', { Incoming: false, call_token: data.token, channelName: data.channel, totalmember: details.totalMember, details })
                                }).catch()

                        }
                        }
                        headerText={details.name}
                    />}

                {this.state.loader ?
                    <View style={{ marginVertical: 10 }}>
                        <ActivityIndicator size={"large"} color={Colors.CYAN} />
                    </View> : null
                }
                {groupPagination ?
                    <FlatList
                        data={groupMessages}
                        renderItem={this.renderMessages}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        inverted={groupMessages?.length > 0 ? true : false}
                        onEndReached={() => this.loadMoreMessages()}
                        onEndReachedThreshold={0.6}
                        ListEmptyComponent={
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingVertical: 40,
                                }}>
                                <Text style={{ fontSize: 17, color: Colors.GRAY_3 }}>
                                    No Chat Found
                                </Text>
                            </View>
                        }
                    />
                    :
                    <View style={{ flex: 1 }} />

                }

                <View style={styles.footer}>

                    <TextInput
                        value={this.state.text}
                        onChangeText={text => this.setState({ text })}
                        placeholder="Enter Message"
                        placeholderTextColor={'#8D8D8D'}
                        style={styles.input}
                    />
                    <TouchableOpacity style={{ marginLeft: 10, }} onPress={() => { this.setState({ attachment: true }) }}>
                        <Image source={chat_attachment} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={this.state.text ? false : true}
                        onPress={this.sendMessage}
                        style={{ paddingHorizontal: 10 }}>
                        {this.state.sendMessageLoader ?
                            <ActivityIndicator /> :
                            <Image source={chat_send} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
                        }
                    </TouchableOpacity>
                </View>
                {/* </KeyboardAvoidingView> */}
                {this.renderModal()}
                {this.renderImageModal()}
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {

        user: state.AuthReducer.user,
        groupPagination: state.ChatReducer.groupPagination,
        groupMessages: state.ChatReducer.GroupMessages,

    }
}
const mapDisPatchToProps = (dispatch) => {
    return {
        getGroupMessage: payload => dispatch(ChatMiddleware.getGroupMessages(payload)),
        sendMessage: payload => dispatch(ChatMiddleware.sendGroupMessage(payload)),
        updateMessage: payload => dispatch(ChatAction.updateGroupChatMessages(payload)),
        resetChat: () => dispatch(ChatAction.resetChat()),
        generateToken: payload => dispatch(VideoMiddleware.generateToken(payload))
    }
}

export default connect(mapStateToProps, mapDisPatchToProps)(Group)

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
    friendListWrapper: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
    },

    input: { flex: 1, paddingLeft: 14, color: '#636060', height: 40 },
    userImg: { width: 55, height: 55, borderRadius: 5 },
    msgDay: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        fontSize: 16,
    },
    footer: {
        paddingVertical: 4,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#8D8D8D',
        alignItems: 'center',
    },
    attachBtn: {
        backgroundColor: Colors.WHITE_1,
        width: 55,
        height: 55,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dismiss: {
        alignSelf: 'center',
        marginVertical: 15,
        backgroundColor: Colors.CYAN,
        paddingHorizontal: 15,
        paddingVertical: 2,
        borderRadius: 10
    }
});
