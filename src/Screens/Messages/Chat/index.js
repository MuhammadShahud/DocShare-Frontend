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
import ChatMiddleware from '../../../Store/Middleware/ChatMiddleware'
import VideoMiddleware from '../../../Store/Middleware/VideoMiddleware'
import { IMG_URL } from '../../../Store/Apis'
import Pusher from 'pusher-js/react-native';
import ChatAction from '../../../Store/Actions/ChatAction'

import { OpenImagePicker } from '../../../Components/ImagePicker'
import DocumentPicker from 'react-native-document-picker';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBBVMEPDktEjcindc7_NjCpFWsSWVspyKI';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
class Chat extends Component {
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
        messages: [

            {
                id: 2,
                message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.',
            },
            {
                id: 1,
                message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
            },
            {
                id: 2,
                message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.',
            },
            {
                id: 1,
                message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
            },
            {
                id: 2,
                message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.',
            },
            {
                id: 2,
                docName: 'Document school.pdf',
            },

        ],
    };
    componentDidMount() {
        this.setState({ loader: true }, () => {
            this.props.getMessages({
                chatid: this.props.route.params.details.chatHead_id,
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
            if (chathead_id == data.data.chatlist_id) {
                this.props.updateMessage(data.data);
            }
        });
    }

    sendMessage = () => {
        let { text, sendMessageLoader } = this.state;
        let user_id = this.props.route.params.details.recipient_user
        this.setState({ sendMessageLoader: true }, () => {
            this.props.sendMessage({
                type: 'text',
                recipient_user: user_id,
                message: text
            })
                .then(() => this.setState({ text: '', sendMessageLoader: false }))
                .catch(() => this.setState({ sendMessageLoader: false }))
        })
    };

    renderMessages = ({ item }) => {
        let { user } = this.props;
        let profile_image =
            item?.sent_from?.id == user.id ?
                item?.sent_from?.profile_pic ?
                    `${IMG_URL}${item?.sent_from?.profile_pic}`
                    : null : item?.sent_from?.profile_pic ?
                    `${IMG_URL}${item?.sent_from?.profile_pic}` : null;
        let cordinates = null;
        if (item.location != null) {
            cordinates = {
                lat: parseFloat(item.location?.lat),
                lng: parseFloat(item.location?.long),
            }
        }
        return (
            <View
                style={{
                    marginVertical: 12,
                    flexDirection: item?.sent_from?.id == user.id ? 'row-reverse' : 'row',
                    alignItems: 'center',
                }}>
                <View style={{ paddingHorizontal: 10 }}>

                    <Image source={profile_image != null ? { uri: profile_image } : face2} style={styles.userImg} />

                </View>

                <View style={{ width: '70%', padding: 10, borderRadius: 5 }}>
                    {item.type == 'document' ?
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
                                            textAlign: item.id == 1 ? 'right' : 'left',
                                            color: '#636060',
                                        }}>
                                        {item.media}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        : item.type == 'image' ?
                            <TouchableOpacity onPress={() => this.setState({ imageModal: true, imagePath: item.image })} style={{
                                backgroundColor: Colors.WHITE,
                                padding: 10,
                                borderRadius: 10,
                                height: 170,
                                width: 170,
                                justifyContent: 'center',
                                alignSelf: 'flex-end'
                            }}>
                                <Image
                                    source={{ uri: IMG_URL + item.image }}
                                    style={{ width: 150, height: 150 }} />
                            </TouchableOpacity> : null
                    }

                    {item.type == 'location' && item.location != null ?
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
                                textAlign: item?.sent_from?.id == user.id ? 'right' : 'left',
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
        let user_id = this.props.route.params.details.recipient_user
        const getLoaction = () => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;

                    let location = {
                        lat: latitude,
                        long: longitude,
                    }
                    this.props.sendMessage({
                        type: 'location',
                        recipient_user: user_id,
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

        if (Platform.OS === 'android') {
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
        } else if (Platform.OS === 'ios') {
            getLoaction()
        }
    }

    loadMoreMessages = () => {
        const { chatPagination } = this.props;
        const { loader } = this.state;
        const details = this.props.route?.params?.details;
        if (chatPagination.next_page_url && loader == false) {
            this.setState({ loader: true }, () => {
                this.props
                    .getMessages({
                        next_page_url: chatPagination.next_page_url,
                        recipient_user: details.chatHead_id,
                    })
                    .then(() => this.setState({ loader: false }))
                    .catch(() => this.setState({ loader: false }));
            });
        }
    };

    uploadImage = () => {
        let user_id = this.props.route.params.details.recipient_user

        OpenImagePicker(img => {
            let uri_script, name, image;
            uri_script = img.path.split('/');
            name = uri_script[uri_script.length - 1];
            image = {
                file_code: 1,
                name,
                uri: img.path,
                size: img.size,
                type: img.mime,
            };
            this.props.sendMessage({
                type: 'image',
                recipient_user: user_id,
                media: image
            })
                .then(() => this.setState({ attachment: false }))
                .catch(() => this.setState({ attachment: false }))
        });
    };

    onPressChooseFile = async () => {
        let user_id = this.props.route.params.details.recipient_user

        try {
            const res = await DocumentPicker.pickSingle({ type: "application/*" });
            let document = {
                file_code: 2,
                name: res.name,
                fileCopyUri: res.fileCopyUri,
                size: res.size,
                type: res.type,
                uri: res.uri
            }
            this.props.sendMessage({
                type: 'document',
                recipient_user: user_id,
                media: document
            })
                .then(() => this.setState({ attachment: false }))
                .catch(() => this.setState({ attachment: false }))
        } catch (err) {
            console.log(err);
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
        let { chatMessages, chatPagination, tokenData } = this.props;
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
                        onPressRightIcon={() =>
                            this.props.generateToken({ id: this.props.route.params.details.recipient_user, is_group: 0, dataString: JSON.stringify(this.props.route.params.details) })
                                .then(data => {
                                    this.props.navigation.navigate('VideoCall', { Incoming: false, call_token: data.token, channelName: data.channel, user_id: this.props.route.params.details.recipient_user, details })
                                }).catch()

                        }
                        headerText={details.name}
                    />}
                {this.state.loader ?
                    <View style={{ marginVertical: 10 }}>
                        <ActivityIndicator size={"large"} color={Colors.CYAN} />
                    </View> : null
                }
                {chatPagination ?
                    <FlatList
                        data={chatMessages}
                        renderItem={this.renderMessages}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        inverted={chatMessages?.length > 0 ? true : false}
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
        chatMessages: state.ChatReducer.chatMessages,
        chatPagination: state.ChatReducer.chatMessagesPaginatedObj,
        tokenData: state.GeneralReducer.tokenData
    }
}
const mapDisPatchToProps = (dispatch) => {
    return {
        getMessages: payload => dispatch(ChatMiddleware.getChatMessages(payload)),
        sendMessage: payload => dispatch(ChatMiddleware.sendMessage(payload)),
        updateMessage: payload => dispatch(ChatAction.updateChatMessages(payload)),
        resetChat: () => dispatch(ChatAction.resetChat()),
        generateToken: payload => dispatch(VideoMiddleware.generateToken(payload))
    }
}

export default connect(mapStateToProps, mapDisPatchToProps)(Chat)

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
