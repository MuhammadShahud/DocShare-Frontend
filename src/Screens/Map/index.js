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
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import LoadingAction from '../../Store/Actions/LoadingAction'
import { connect } from 'react-redux'

const GOOGLE_MAPS_APIKEY = 'AIzaSyBBVMEPDktEjcindc7_NjCpFWsSWVspyKI';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
class Map extends Component {
    state = {
        loader: false,
        sendMessageLoader: false,
        text: '',
        region: '',

    };
    componentDidMount() {
        this.currentLocation()
    }

    currentLocation = () => {

        const getLoaction = () => {
            this.props.showloading()
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;

                    this.setState({
                        region: {
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: 0.033274563211676025,
                            longitudeDelta: 0.032282180190086365,
                        }
                    })
                    this.props.hideloading()
                },
                error => {
                    console.log("Response---->", error);
                    this.props.hideloading()
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

    render() {
        const navigation = this.props.navigation;
        const map = this.props.route.params.map
        const region = this.state.region;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    leftIcon={back_arrow}
                    onPressLeftIcon={() => this.props.navigation.goBack()}
                    // rightIcon={video_white}
                    headerText={'Map'}
                />
                {/* <Text style={styles.msgDay}>Today</Text> */}


                <View>
                    {region ?
                        <MapView
                            showsUserLocation
                            initialRegion={region}

                            style={{ height: '100%', width: '100%' }}
                        >
                            <Marker
                                key={GOOGLE_MAPS_APIKEY}
                                coordinate={{
                                    latitude: map.lat,
                                    longitude: map.lng,
                                }}
                                title={'here'}
                                description={'I am /Here'}
                            />
                        </MapView>
                        : null}
                </View>

            </View>
        );
    }
}
const mapDisPatchToProps = (dispatch) => {
    return {
        showloading: () => dispatch(LoadingAction.ShowLoading()),
        hideloading: () => dispatch(LoadingAction.HideLoading())

    }
}
const mapStateToProps = (state) => {
    return {

    }
}

export default connect(mapStateToProps, mapDisPatchToProps)(Map)

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

    input: { flex: 1, paddingLeft: 14, color: '#636060' },
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
});
