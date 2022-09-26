import {
    Text,
    Dimensions,
    View,
    Image,
    TouchableOpacity,
    Platform,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    FlatList
} from 'react-native'
import React, { Component } from 'react'
import { file_edit, mail_white, pencil_white, cross_icon, chat_send, face1, delete_gray } from '../../Assets'
import { Colors } from '../../Styles'
import { DocumentView, RNPdftron, Config } from "@pdftron/react-native-pdf";
import { Actionsheet, useDisclose } from 'native-base';
import { connect } from 'react-redux'
import moment from 'moment';

import FilesMiddleware from '../../Store/Middleware/FilesMiddleware'
import { IMG_URL } from '../../Store/Apis';


const dimensions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};
export class FileEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            addCommentLoader: false,
            isOpen: false,
            loadmore: false,
            loader: false,
            total: ''
        }
        RNPdftron.initialize("");
        RNPdftron.enableJavaScript(true);
    }

    componentDidMount() {
        this.props.getComments({ id: this.props.route?.params?.item.id, next_page_url: undefined })
            .then(() => this.setState({ total: this.props.getCommentsData?.count }))
            .catch()
    }

    onLeadingNavButtonPressed = () => {
        console.log("leading nav button pressed");
        if (Platform.OS === "ios") {
            Alert.alert(
                "App",
                "onLeadingNavButtonPressed",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: true }
            );
        } else {
            //   BackHandler.exitApp();
        }
    };

    renderItem = ({ item, index }) => {
        let { user } = this.props
        return (
            <View style={{ height: 120, width: '100%', flexDirection: 'row', marginBottom: 10 }}>
                <View style={{ width: '70%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={item.user.profile_pic ? { uri: IMG_URL + item.user.profile_pic } : face1} style={{ width: 50, height: 50 }} resizeMode={'contain'} />
                        <Text style={{ color: Colors.BLACK, fontWeight: 'bold', fontSize: 14, marginHorizontal: 10 }}>{item.user.username}</Text>
                    </View>
                    <Text style={{ color: Colors.GRAY_3, fontSize: 10 }} numberOfLines={5}>{item.comment}</Text>
                </View>
                <View style={{ width: '30%', paddingLeft: 15, paddingTop: 10 }}>
                    <Text style={{ color: Colors.GRAY_3, fontSize: 12 }}>{moment(item?.created_at).format('LTS')}</Text>
                    <Text style={{ color: Colors.GRAY_3, fontSize: 10 }}>Last Edited On {moment(item?.updated_at).format('LL')}</Text>
                    {item.user.id == user.id ?
                        <TouchableOpacity
                            style={{ width: 40, height: 40, marginTop: 5 }}
                            onPress={() => this.deleteComments(item.id)}
                        >
                            <Image source={delete_gray} style={{ width: 20, height: 20 }} resizeMode={'contain'} />
                        </TouchableOpacity>
                        : null}
                </View>
            </View>
        )
    }

    onPressLoadMore = () => {
        this.setState({ loadmore: true }, () => {
            const { getCommentsData } = this.props
            this.props
                .getComments({ id: this.props.route?.params?.item.id, next_page_url: getCommentsData?.links?.next })
                .then(() => this.setState({ loadmore: false }))
                .catch(() => this.setState({ loadmore: false }));
        });
    };

    renderLoaderMoreButton = () => {
        const { getCommentsData } = this.props
        const { loadmore } = this.state;
        return getCommentsData?.links?.next != null ? (
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
                .getComments({ id: this.props.route?.params?.item.id, next_page_url: undefined })
                .then(data => { this.setState({ loader: false }) })
                .catch(() => this.setState({ loader: false }))
        });
    };

    addComment = () => {
        let { user } = this.props
        this.setState({ addCommentLoader: true }, () => {
            this.props.addComment({
                id: this.props.route?.params?.item?.id,
                user_id: user.id,
                comment: this.state.text
            })
                .then(() => this.setState({ addCommentLoader: false, text: '', total: this.state.total + 1 }))
                .catch(() => this.setState({ addCommentLoader: false }))
        })

    }

    deleteComments = id => {
        console.log(id)
        this.props.deleteComment({ id })
            .then(() => this.setState({ total: this.state.total - 1 }))
            .catch()
    }

    render() {
        const screen = this.props.route?.params?.item?.screen
        const file = this.props.route?.params?.item;
        const isEdit = this.props.route?.params.isEdit;
        const path = file.url;
        let data = [1, 2, 4, 5]
        const { getCommentList, getCommentsData } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <DocumentView
                    // style={{ flex: 1 }}
                    hideAnnotationToolbarSwitcher={true}
                    hideTopToolbars={true}
                    hideTopAppNavBar={true}
                    document={path}
                    padStatusBar={false}
                    readOnly={true}
                    disabledElements={[Config.Buttons.userBookmarkListButton]}
                    disabledTools={[Config.Tools.annotationCreateLine, Config.Tools.annotationCreateRectangle]}
                    onLeadingNavButtonPressed={this.onLeadingNavButtonPressed}
                />
                <View style={{ flexDirection: 'row', position: 'absolute', top: 15, right: 10, }}>

                    <TouchableOpacity
                        onPress={() => { screen == 'PassCode' ? (this.props.navigation.goBack(), this.props.navigation.goBack()) : this.props.navigation.goBack() }}
                        style={{
                            marginLeft: 10,
                            width: 30,
                            height: 30,
                            backgroundColor: Colors.BLUE,
                            borderRadius: 100,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Image source={cross_icon} style={{ width: 15, height: 15, tintColor: Colors.WHITE }} resizeMode={'contain'} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: 55, right: 10, }}>
                    {isEdit != false ?
                        <TouchableOpacity
                            onPress={() => { this.props.navigation.navigate('DrawFile', { item: file }) }}
                            style={{ width: 40, height: 40, backgroundColor: Colors.BLUE, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={pencil_white} style={{ width: 15, height: 15 }} resizeMode={'contain'} />
                        </TouchableOpacity>
                        : null}
                    <TouchableOpacity
                        onPress={() => this.setState({ isOpen: true })}
                        style={{ marginLeft: 10, width: 40, height: 40, backgroundColor: Colors.BLUE, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={mail_white} style={{ width: 15, height: 15 }} resizeMode={'contain'} />
                    </TouchableOpacity>
                </View>

                <Actionsheet isOpen={this.state.isOpen} size="full" hideDragIndicator>
                    <Actionsheet.Content style={{ backgroundColor: Colors.WHITE_1 }}>
                        <View style={{ height: 420, width: dimensions.width }}>
                            <View style={{ height: 360, marginBottom: 10 }}>
                                <View style={{ flexDirection: 'row', marginTop: 10, height: 40, width: dimensions.width, justifyContent: 'space-between' }}>
                                    <Text style={{ color: Colors.BLACK, fontWeight: 'bold', fontSize: 18, marginHorizontal: 20 }}>Comments ({this.state.total})</Text>
                                    <TouchableOpacity style={{ marginTop: 6 }} onPress={() => this.setState({ isOpen: false })}>
                                        <Text style={{ color: Colors.GRAY_3, fontSize: 12, marginHorizontal: 20 }}>Done</Text>

                                    </TouchableOpacity>
                                </View>
                                {getCommentsData ?
                                    <FlatList
                                        data={getCommentList}
                                        contentContainerStyle={{ margin: 20, paddingBottom: 15 }}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={item => item.id}
                                        renderItem={this.renderItem}
                                        // inverted={getCommentList?.length > 0 ? true : false}
                                        ListFooterComponent={this.renderLoaderMoreButton}
                                        ListEmptyComponent={
                                            <View style={{ marginVertical: 10, backgroundColor: Colors.WHITE, padding: 10, borderRadius: 5 }}>
                                                <Text style={{ textAlign: 'center', color: Colors.BLACK }}>No comment found</Text>
                                            </View>
                                        }
                                    /> :
                                    <ActivityIndicator
                                        size={'large'}
                                        color={Colors.CYAN}
                                        style={styles.loadMoreContentContainer}
                                    />
                                }
                            </View>
                            <View style={styles.footer}>

                                <TextInput
                                    value={this.state.text}
                                    onChangeText={text => this.setState({ text })}
                                    placeholder="Write a comment"
                                    placeholderTextColor={'#8D8D8D'}
                                    style={styles.input}
                                />

                                <TouchableOpacity
                                    disabled={this.state.text ? false : true}
                                    onPress={this.addComment}
                                    style={{ paddingHorizontal: 10 }}>
                                    {this.state.addCommentLoader ?
                                        <ActivityIndicator /> :
                                        <Image source={chat_send} style={{ width: 22, height: 22, resizeMode: 'contain', tintColor: Colors.CYAN }} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Actionsheet.Content>
                </Actionsheet>
            </View>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        getCommentsData: state.FilesReducer.getCommentsData,
        getCommentList: state.FilesReducer.getComments,
        user: state.AuthReducer.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getComments: payload => dispatch(FilesMiddleware.getComments(payload)),
        addComment: payload => dispatch(FilesMiddleware.addComment(payload)),
        deleteComment: payload => dispatch(FilesMiddleware.deleteComment(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileEdit)

const styles = StyleSheet.create({
    footer: {
        paddingVertical: 4,
        flexDirection: 'row',
        height: 60,
        backgroundColor: Colors.WHITE,
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 5
    },
    input: { flex: 1, paddingLeft: 14, color: '#636060', height: 40 },
    loadMoreText: {
        color: Colors.WHITE,
        fontWeight: '500',
        fontSize: 12,
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