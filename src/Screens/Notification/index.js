import React, { Component } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import {
    face1,
    face2,
    face3,
    face4,
    face5,
    notification_white,
    plus_icon,
    search,
    message_white,
    back_arrow,
    attachmentsent,
    joined,
    request,
    pdf, person_crose
} from '../../Assets';
import { Header } from '../../Components';
import PostCard from '../../Components/Home/PostCard';
import { Colors } from '../../Styles';
import { connect } from 'react-redux'
import NotificationMiddleware from '../../Store/Middleware/NotificationMiddleware'
import FriendsMiddleware from '../../Store/Middleware/FriendsMiddleware'
import { IMG_URL } from '../../Store/Apis';
import moment from 'moment';
import CustomAlert from '../../Components/CustomAlert'

class Notification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            home: false,
            next_page_url: undefined,
            loader: false,
            loadmore: false,
            isAccepted: '',
            isVisible: false,
            type: '',
            message: ''
        }
    }

    componentDidMount() {
        this.props.getNotifications({ next_page_url: undefined })
    }

    renderNotifications = ({ item, index }) => {
        return (
            <>

                {item?.type == 'friend_request' ?
                    <View
                        style={styles.Notification_container}
                    >
                        {item?.is_read == 0 ?
                            <View style={{ width: '5%' }}>
                                <View style={styles.redDot}></View>
                            </View> : null}
                        <View style={{ width: '65%' }}>
                            <View style={styles.profile_view}>
                                <Image style={styles.profile_Img}
                                    source={item?.sender?.profile_pic ?
                                        { uri: IMG_URL + item?.sender?.profile_pic }
                                        : face1} />
                                <Text style={styles.user_name}>{item?.sender?.username}</Text>
                                <Text style={styles.user_date}>{moment(item?.created_at).format('LT')}</Text>
                            </View>
                            <View>
                                <Text style={styles.notification_body}>{item?.title}</Text>
                            </View>
                        </View>
                        <View style={styles.date_view}>
                            <TouchableOpacity
                                style={[styles.joinedBg, { marginHorizontal: 0, width: 45 }]}
                                onPress={() => this.acceptFriendRequest(item.sender.id, item.id)}
                            >
                                <Image style={styles.joinedIcon} source={request} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.joinedBg, { marginHorizontal: 2, width: 45 }]}
                                onPress={() => this.rejectFriendRequest(item.sender.id, item.id)}

                            >
                                <Image style={[styles.joinedIcon, { tintColor: Colors.BLACK }]} source={person_crose} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View
                        style={styles.Notification_container}
                    >
                        {item?.is_read == 0 ?
                            <View style={{ width: '5%' }}>
                                <View style={styles.redDot}></View>
                            </View>
                            : null}
                        <View style={{ width: '95%' }}>
                            <View style={styles.profile_view}>
                                <Image style={styles.profile_Img}
                                    source={item?.sender?.profile_pic ?
                                        { uri: IMG_URL + item?.sender?.profile_pic }
                                        : face1} />
                                <Text style={styles.user_name}>{item?.sender?.username}</Text>
                                <Text style={styles.user_date}>{moment(item?.created_at).format('LT')}</Text>
                            </View>
                            <View>
                                <Text style={styles.notification_body}>{item?.title}</Text>
                            </View>
                        </View>

                    </View>

                }

                {/* {item?.type == 'post' ?
                    <View
                        style={styles.Notification_container}
                    // onPress={() => navigation.navigate('Chat')}
                    >
                        <View style={{ width: '10%' }}>
                            <View style={styles.redDot}></View>
                        </View>
                        <View style={{ width: '70%' }}>
                            <View style={styles.profile_view}>
                                <Image style={styles.profile_Img} source={face1} />
                                <Text style={styles.user_name}>Jacob</Text>
                                <Text style={styles.user_date}>6 min</Text>
                            </View>
                            <View>
                                <Text style={styles.notification_body}>Shared a photo with you</Text>
                            </View>
                        </View>
                        <View style={styles.date_view}>
                            <View style={styles.message_count}>
                                <Image style={styles.sentAttachment} source={attachmentsent} />
                            </View>
                        </View>
                    </View>
                    :
                   null
                }

                {item?.type == 'joined' ?
                    <View
                        style={styles.Notification_container}
                    // onPress={() => navigation.navigate('Chat')}
                    >
                        <View style={{ width: '10%' }}>
                            <View style={styles.redDot}></View>
                        </View>
                        <View style={{ width: '70%' }}>
                            <View style={styles.profile_view}>
                                <Image style={styles.profile_Img} source={face3} />
                                <Text style={styles.user_name}>David</Text>
                                <Text style={styles.user_date}>6 min</Text>
                            </View>
                            <View>
                                <Text style={styles.notification_body}>Joined Docshr</Text>
                            </View>
                        </View>
                        <View style={styles.date_view}>
                            <View style={styles.joinedBg}>
                                <Image style={styles.joinedIcon} source={joined} />
                            </View>
                        </View>
                    </View>
                    : null} */}


                {/* {item?.type == 'comment' ?
                    <View
                        style={styles.Notification_container}
                    // onPress={() => navigation.navigate('Chat')}
                    >
                        <View style={{ width: '10%' }}>
                            <View style={styles.redDot}></View>
                        </View>
                        <View style={{ width: '70%' }}>
                            <View style={styles.profile_view}>
                                <Image style={styles.profile_Img} source={face4} />
                                <Text style={styles.user_name}>Sam</Text>
                                <Text style={styles.user_date}>6 min</Text>
                            </View>
                            <View>
                                <Text style={styles.notification_body}>New Comment Added on Doc.pdf</Text>
                            </View>
                        </View>
                        <View style={styles.date_view}>
                            {/* <View style={styles.joinedBg}> 
                            <Image style={styles.pdfIcon} source={pdf} />
                            {/* </View> 
                        </View>
                    </View>
                    : null} */}
            </>
        )
    }

    onPressLoadMore = () => {
        this.setState({ loadmore: true }, () => {
            const { paginationData } = this.props
            this.props
                .getNotifications({ next_page_url: paginationData?.next_page_url })
                .then(() => this.setState({ loadmore: false }))
                .catch(() => this.setState({ loadmore: false }));
        });
    };

    renderLoaderMoreButton = () => {
        const { paginationData } = this.props
        const { loadmore } = this.state;
        return paginationData?.next_page_url != null ? (
            loadmore ? (
                <ActivityIndicator
                    size={'large'}
                    color={Colors.CYAN}
                    style={styles.loadMoreContentContainer}
                />
            ) : (
                <TouchableOpacity
                    style={styles.loadMoreContentContainer}
                    onPress={this.onPressLoadMore}>
                    <View style={styles.loadMoreContainer}>
                        <Text style={styles.loadMoreText}>Load more</Text>
                    </View>
                </TouchableOpacity>
            )
        ) : null;
    };

    onRefreshEclass = () => {
        this.setState({ loader: true }, () => {
            this.props
                .getNotifications({ next_page_url: undefined })
                .then(data => { this.setState({ loader: false }) })
                .catch(() => this.setState({ loader: false }))
        });
    };

    acceptFriendRequest = (id, notification_id) => {
        this.props.acceptRequest({ id, notification_id })
            .then(() => {
                this.setState({
                    type: 'Success',
                    message: 'Request accepted successfully',
                    isVisible: true
                })

            })
            .catch();

    }

    rejectFriendRequest = (id, notification_id) => {
        this.props.rejectRequest({ id, notification_id })
            .then(() => {
                this.setState({
                    type: 'Success',
                    message: 'Request rejected successfully',
                    isVisible: true
                })
            }

            )
            .catch()
    }

    render() {
        const navigation = this.props.navigation;
        const { paginationData, getNotification } = this.props
        return (
            <View style={{ flex: 1 }}>
                <Header
                    leftIcon={back_arrow}
                    onPressLeftIcon={() => this.props.navigation.goBack()}
                    // rightIcon={message_white}
                    headerText={'Notifications'}
                />
                <View style={styles.homeWrapper}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            Notifications
                        </Text>
                        {paginationData?.meta?.total ?
                            <View style={styles.message_count}>
                                <Text style={styles.message_countText}>{paginationData?.meta?.total}</Text>
                            </View>
                            : null}
                    </View>
                    {paginationData ?
                        <FlatList
                            data={getNotification}
                            showsVerticalScrollIndicator={false}
                            renderItem={this.renderNotifications}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.loader}
                                    onRefresh={this.onRefreshEclass}
                                />
                            }
                            ListEmptyComponent={
                                <View style={{ marginVertical: 10, backgroundColor: Colors.WHITE, padding: 10, borderRadius: 5 }}>
                                    <Text style={{ textAlign: 'center', color: Colors.BLACK }}>No notification found</Text>
                                </View>
                            }
                            ListFooterComponent={this.renderLoaderMoreButton}
                        />
                        :
                        <ActivityIndicator size={'large'} color={Colors.CYAN} />

                    }


                </View>
                <CustomAlert
                    visible={this.state.isVisible}
                    type={this.state.type}
                    Message={this.state.message}
                    onPress={() => this.setState({ isVisible: false })}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        paginationData: state.NotificationReducer.getNotification,
        getNotification: state.NotificationReducer.getNotificationlist
    }
}
const mapDisPatchToProps = (dispatch) => {
    return {
        getNotifications: payload => dispatch(NotificationMiddleware.getNotifications(payload)),
        acceptRequest: payload => dispatch(FriendsMiddleware.acceptRequest(payload)),
        rejectRequest: payload => dispatch(FriendsMiddleware.rejectRequest(payload))
    }
}

export default connect(mapStateToProps, mapDisPatchToProps)(Notification)

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

    Notification_container: {
        // backgroundColor: Colors.LIGHTBLUE,
        width: '100%',
        height: 80,
        // paddingHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 10,
        marginVertical: 2,
    },
    profile_view: {
        // width: '20%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    profile_Img: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    sentAttachment: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    joinedIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    pdfIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    friendCardWrapper: {
        // width: 45,
        // height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: Colors.BORDER_BLUE_COLOR,
        borderWidth: 2,
        borderStyle: 'solid',
        marginHorizontal: 10,
    },
    chat_view: {
        marginHorizontal: 5,
        width: '55%',
    },
    notification_body: {
        fontSize: 14,
        marginHorizontal: 5
    },
    user_name: {
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 10
    },
    date_view: {
        // backgroundColor:Colors.BLACK,
        // width: '10%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    user_date: {
        fontSize: 14,
    },
    message_count: {
        alignItems: 'center',
        marginHorizontal: 10
    },
    joinedBg: {
        alignItems: 'center',
        marginHorizontal: 10,
        backgroundColor: '#E3E3E5',
        padding: 10,
        borderRadius: 10,
    },
    message_countText: {
        fontSize: 16,
        color: Colors.WHITE,
        fontWeight: 'bold',
        backgroundColor: Colors.COUNT_RED,
        paddingHorizontal: 15,
        // paddingVertical: 5,
        borderRadius: 8,
    },
    redDot: {
        height: 10,
        width: 10,
        borderRadius: 10,
        backgroundColor: Colors.COUNT_RED,
        marginHorizontal: 0
    },
    loadMoreText: {
        color: Colors.WHITE,
        fontWeight: '500',
        fontSize: 14,
        alignSelf: 'center'
    },
    loadMoreContentContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: 120,
        marginVertical: 20,
    },
    loadMoreContainer: {
        paddingHorizontal: 10,
        backgroundColor: Colors.CYAN,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
});
