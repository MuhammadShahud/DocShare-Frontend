import React, { Component } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
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
} from '../../Assets';
import { Header, SearchBox } from '../../Components';
import { Colors } from '../../Styles';
import { connect } from 'react-redux';
import ChatMiddleware from '../../Store/Middleware/ChatMiddleware'
import moment from 'moment';
import { IMG_URL } from '../../Store/Apis'
class Messages extends Component {
    constructor(props) {
        super(props)
        this.timeout = React.createRef(null)
        this.state = {
            loadmore: false,
            loader: false,
            isSearchbar: false,
            search: ''
        }
    }
    componentDidMount() {
        this.props.navigation.addListener("focus", () => {
            this.props.getChatHead({ search: '' })
        })
    }
    onRefreshEclass = () => {
        this.setState({ loader: true }, () => {
            this.props
                .getChatHead({ search: this.state.search })
                .then(data => { this.setState({ loader: false }) })
                .catch(() => this.setState({ loader: false }))
        });
    };
    onPressSearch = (value) => {
        clearTimeout(this.timeout.current)
        this.timeout.current = setTimeout(() => {
            this.props.getChatHead({ search: value })
        }, 1500);

    }
    render() {
        const navigation = this.props.navigation;
        let { user } = this.props;
        const chatMessages = ({ item }) => {
            //Find the user details for send messages
            let userDetails = null;
            if (item?.is_group == 0) {
                if (item?.to_user?.id == user.id) {
                    userDetails = item?.from_user;
                } else if (item?.from_user?.id == user.id) {
                    userDetails = item?.to_user;
                }
            }
            return (
                item?.is_group == 0 ?
                    <TouchableOpacity
                        key={item.id}
                        style={styles.chat_Component}
                        onPress={() => navigation.navigate('Chat', {
                            details: {
                                chatHead_id: item?.id,
                                recipient_user: userDetails?.id,
                                name: userDetails?.username
                            }
                        })}
                    >
                        <View style={styles.profile_view}>
                            <Image style={styles.profile_Img} source={userDetails?.profile_pic ? { uri: IMG_URL + userDetails?.profile_pic } : face1} />
                        </View>
                        <View style={styles.chat_view}>
                            <Text style={styles.chat_name}>{userDetails?.username}</Text>
                            <Text style={styles.chat_message}>{item?.last_message?.message}</Text>
                        </View>
                        <View style={styles.date_view}>
                            <Text style={styles.chat_date}>{moment(item?.last_message?.time).format('LT')}</Text>
                            {item?.message_count != 0 ?
                                <View style={styles.message_count}>
                                    <Text style={styles.message_countText}>{item?.message_count}</Text>
                                </View>
                                : null}
                        </View>
                    </TouchableOpacity>
                    :

                    <TouchableOpacity
                        key={item.id}
                        style={styles.chat_Component}
                        onPress={() => navigation.navigate('Group', {
                            details: {
                                chatHead_id: item?.id,
                                name: item?.name,
                                totalMember: item?.members.length
                            }
                        })}
                    >
                        <View style={styles.profile_view}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                {item?.members?.map((item, index) => {
                                    return (
                                        index < 3 ?
                                            <Image key={item.id} style={styles.group_profile_Img} source={item?.profile_pic ? { uri: IMG_URL + item.profile_pic } : face1} />
                                            : null)
                                })}
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: -5, justifyContent: 'center' }}>
                                {item?.members.length > 3 ? item?.members.map((item, index) => {
                                    return (
                                        index > 2 ?
                                            <Image key={item.id} style={styles.group_profile_Img} source={item?.profile_pic ? { uri: IMG_URL + item.profile_pic } : face1} />
                                            : null)
                                }) : null}
                            </View>
                        </View>
                        <View style={styles.chat_view}>
                            <Text style={styles.chat_name}>{item?.name}</Text>
                            <Text style={styles.chat_message}>{item?.members?.map((items, index) => {
                                return (
                                    item?.members?.length - 1 == index ?
                                        ` & ${items.username}` :
                                        item?.members?.length - 2 == index ?
                                            items.username : `${items.username}, `
                                )
                            })}</Text>
                        </View>
                        <View style={styles.date_view}>
                            <Text style={styles.chat_date}>{moment(item?.last_message?.created_at).format('LT')}</Text>
                            {item?.message_count != 0 ?
                                <View style={styles.message_count}>
                                    <Text style={styles.message_countText}>{item?.message_count}</Text>
                                </View>
                                : null}
                        </View>
                    </TouchableOpacity>


            );
        };
        const { chatHead } = this.props
        return (
            <View style={{ flex: 1 }}>
                <Header
                    leftIcon={search}
                    // rightIcon={message_white}
                    headerText={'Messages'}
                    onPressLeftIcon={() => this.setState({ isSearchbar: !this.state.isSearchbar })}
                />
                <View style={styles.homeWrapper}>
                    {this.state.isSearchbar ?
                        <SearchBox icon={search} placeholder="Search here"
                            // onSubmitEditing={this.onPressSearch}
                            onChangeText={text => { this.setState({ search: text }), this.onPressSearch(text) }}
                        /> : null}
                    {chatHead != null ?
                        <FlatList
                            data={chatHead}
                            renderItem={item => chatMessages(item)}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.loader}
                                    onRefresh={this.onRefreshEclass}
                                />
                            }
                            ListEmptyComponent={
                                <View style={{ marginVertical: 10, backgroundColor: Colors.WHITE, padding: 10, borderRadius: 5 }}>
                                    <Text style={{ textAlign: 'center', color: Colors.GRAY_3 }}>Chats not found</Text>
                                </View>
                            }

                        /> :
                        <View style={{ marginVertical: 10 }}>
                            <ActivityIndicator size={"large"} color={Colors.CYAN} />
                        </View>
                    }
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        chatHead: state.ChatReducer.chatHeads,
        user: state.AuthReducer.user
    }
}

const mapDisPatchToProps = (dispatch) => {
    return {
        getChatHead: payload => dispatch(ChatMiddleware.getChatHeads(payload))
    }
}

export default connect(mapStateToProps, mapDisPatchToProps)(Messages)

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

    chat_Component: {
        // backgroundColor: Colors.LIGHTBLUE,
        width: '100%',
        height: 80,
        paddingHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 10,
        marginVertical: 2,
    },
    profile_view: {
        width: '20%',
    },
    profile_Img: {
        width: 50,
        height: 50,
    },
    group_profile_Img: {
        width: 20,
        height: 20,
        borderRadius: 20,
        marginHorizontal: -2
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
    chat_message: {
        fontSize: 14,
        color: Colors.GRAY_3
    },
    chat_name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.GRAY_3
    },
    date_view: {
        width: '20%',
        alignItems: 'flex-end'
    },
    chat_date: {
        fontSize: 12,
        color: Colors.GRAY_3
    },
    message_count: {
        alignItems: 'center',
    },
    message_countText: {
        fontSize: 14,
        color: Colors.WHITE,
        fontWeight: 'bold',
        backgroundColor: Colors.COUNT_RED,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
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
        width: 100,
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
