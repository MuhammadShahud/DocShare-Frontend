import React, { Component } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
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
  gallery1,
  gallery2,
  camera_icon,
  grey_delete_bucket,
} from '../../Assets';
import { Header } from '../../Components';
import { Colors } from '../../Styles';
import { connect } from 'react-redux'
import PostMiddleware from '../../Store/Middleware/PostMiddleware'
import FriendsMiddleware from '../../Store/Middleware/FriendsMiddleware'
import moment from 'moment';
import { IMG_URL } from '../../Store/Apis'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CustomAlert from '../../Components/CustomAlert'
import messaging from '@react-native-firebase/messaging';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      home: false,
      next_page_url: undefined,
      loader: false,
      loadmore: false,
      alert: {
        isVisible: false,
        type: '',
        message: ''
      }
    };
  }
  componentDidMount() {
    this.props
      .getPostData({ next_page_url: this.state.next_page_url })
      .then(data => { this.setState({ loader: false }) })
      .catch(() => this.setState({ loader: false }))
    this.props.getFriends({ search: '' });
    messaging().onMessage(this.onMessageReceived)
    messaging().getInitialNotification().then((message) => {

      if (message.notification.title.includes('Incoming Video Call'))
        this.props.navigation.navigate('IncomingCall', { data: message.data })
    })
  }

  onMessageReceived = (message) => {
    if (message.notification.title.includes('Incoming Video Call'))
      this.props.navigation.navigate('IncomingCall', { data: message.data })
    console.log(message)
  }

  onPressLoadMore = () => {
    this.setState({ loadmore: true }, () => {
      const { postData } = this.props;
      this.props
        .getPostData({ next_page_url: postData?.links?.next })
        .then(() => this.setState({ loadmore: false }))
        .catch(() => this.setState({ loadmore: false }));
    });
  };
  renderLoaderMoreButton = () => {
    const { postData } = this.props;
    const { loadmore } = this.state;
    return postData?.links?.next != null ? (
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
        .getPostData({ next_page_url: this.state.next_page_url })
        .then(data => { this.setState({ loader: false }) })
        .catch(() => this.setState({ loader: false }))
    });
  };
  deletePost = (id) => {
    this.props
      .deletePost({ id })
      .then(data => {
        this.setState({
          alert: { isVisible: true, type: 'Success', message: 'Post deleted successfully.' }
        })
      })
      .catch();
  }
  friendCarts = ({ item }) => {
    return (
      <View style={styles.friendCardWrapper}>
        <Image
          source={item?.profile_pic ? { uri: IMG_URL + item?.profile_pic } : face1}
          resizeMode="contain"
          style={{ width: 40, height: 40 }}
        />
      </View>
    );
  };
  postCard = ({ item }) => {
    let user = item?.user;
    let userdata = this.props.user;
    let imageArray = [];
    let document = [];
    if (item?.documents.length > 0) {
      for (const [i, file] of item?.documents.entries()) {
        if (file.type == 'image') {
          imageArray.push(file)
        } else if (file.type == 'document') {
          document.push(file)
        }
      }
    }
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('PostEdit', { item })}
        style={styles.postCardContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={user?.profile_pic ? { uri: IMG_URL + user.profile_pic } : face2} style={{ width: 40, height: 40 }} />

            <View style={{ marginLeft: 10 }}>
              <Text style={{ color: Colors.GRAY_3 }}>{user.username}</Text>
              <Text style={{ color: Colors.GRAY_3 }}>{moment(item?.created_at).format('LL')}</Text>
            </View>
          </View>
          {user.id == userdata.id ?
            <TouchableOpacity style={{ width: 25, height: 25 }} onPress={() => this.deletePost(item.id)}>
              <Image
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
                source={grey_delete_bucket}
              />
            </TouchableOpacity>
            : null}
        </View>

        {/* ///input field */}
        {/* <View style={{ backgroundColor: 'white' }}>
          <TextInput placeholder="Write Your First message" />
        </View> */}

        {/* ///Card BODY/// */}
        <View
          style={styles.postCardBody}>
          {/* ///card content */}

          <View
            style={styles.documentContainer}>
            <Text
              style={{
                fontSize: 20,
                marginVertical: 10,
                fontWeight: '300',
                color: Colors.BLACK,
              }}>
              {item.title}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 10, color: Colors.GRAY_3 }} numberOfLines={5} ellipsizeMode={'tail'}>
                {item.description}
              </Text>
            </ScrollView>
          </View>
          {/* ///card Images // */}
          <View
            style={{
              flex: 1,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            {item?.documents.length > 0 && document.length > 0 ?
              <View
                style={{
                  width: 100,
                  height: 80,
                  borderRadius: 10,
                  backgroundColor: Colors.WHITE,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 5,
                  marginVertical: 5,
                  borderColor: Colors.WHITE_1,
                  borderWidth: 2,
                }}>
                {item.total_documents > 1 ? <>
                  <FontAwesome name="file-text-o" size={28} color={Colors.COUNT_RED} />
                  <Text style={{ color: Colors.COUNT_RED }}>{item.total_documents}</Text>
                </>
                  :
                  <>
                    <FontAwesome name="file-text-o" size={28} color={Colors.COUNT_RED} />
                    <Text style={{ color: Colors.COUNT_RED, marginHorizontal: 10, textAlign: 'center' }}>{document[0].name}</Text>
                  </>
                }
              </View>
              : null}
            <View>
              {item?.documents.length > 0 && imageArray.length > 0 ?
                <ImageBackground
                  source={{ uri: imageArray[0].url }}
                  resizeMode="contain"
                  imageStyle={{ borderRadius: 10 }}
                  style={{
                    width: 100,
                    height: 80,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  {item.total_images > 1 ? <>
                    <Image
                      source={camera_icon}
                      resizeMode="contain"
                      style={{ width: 20, height: 20 }}
                    />
                    <Text style={{ color: Colors.WHITE, marginHorizontal: 2 }}>{item.total_images}</Text>
                  </>
                    : null}
                </ImageBackground>
                : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  render() {
    const navigation = this.props.navigation;
    const { postList, postData, getFriendList } = this.props
    return (
      <View style={{ flex: 1 }}>
        <Header
          fontSize={14}
          leftIcon={search}
          rightIcon={notification_white}
          onPressRightIcon={() =>
            this.props.navigation.navigate('Notification')
          }
          onPressLeftIcon={() => navigation.navigate('SearchFriend')}
          headerText={'Home'}
        />
        <View style={styles.homeWrapper}>
          <Text style={styles.headTitle}>Friends</Text>

          <View style={styles.friendListWrapper}>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('SearchFriend')}>
              <Image style={styles.iconImg} source={plus_icon} />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              {getFriendList ?
                <FlatList
                  data={getFriendList}
                  renderItem={this.friendCarts}
                  keyExtractor={item => item.id}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={
                    <Text style={{ alignSelf: 'center', color: Colors.GRAY_3 }}>Friends not found</Text>
                  }
                /> :
                <View style={{ alignSelf: 'flex-start' }}>
                  <ActivityIndicator size={"small"} color={Colors.CYAN} />
                </View>
              }
            </View>
          </View>
          <View style={{ flex: 1 }}>

            {postData ?
              <FlatList
                data={postList}
                renderItem={this.postCard}
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
                    <Text style={{ textAlign: 'center', color: Colors.GRAY_3 }}>Posts not found</Text>
                  </View>
                }
                ListFooterComponent={this.renderLoaderMoreButton}
              /> :
              <View style={{ marginVertical: 10 }}>
                <ActivityIndicator size={"large"} color={Colors.CYAN} />
              </View>
            }
          </View>
        </View>
        <CustomAlert
          visible={this.state.alert.isVisible}
          onPress={() => { this.setState({ alert: { isVisible: false } }) }}
          type={this.state.alert.type}
          Message={this.state.alert.message} />
      </View>
    );
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getPostData: payload => dispatch(PostMiddleware.getPost(payload)),
    getFriends: payload => dispatch(FriendsMiddleware.getFriends(payload)),
    deletePost: payload => dispatch(PostMiddleware.deletePost(payload))
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.AuthReducer.user,
    postList: state.PostReducer.getPostlist,
    postData: state.PostReducer.getPost,
    getFriendList: state.FriendsReducer.getFriends
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(Home)
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

  addBtn: {
    backgroundColor: Colors.LIGHTBLUE,
    marginRight: 10,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconImg: {
    width: 18,
    height: 18,
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
  postCardContainer: {
    backgroundColor: Colors.WHITE,
    width: '100%',
    height: 250,
    padding: 15,
    borderRadius: 20,
    marginVertical: 10,
  },
  postCardBody: {
    backgroundColor: Colors.WHITE,
    // flex: 1,
    flexDirection: 'row',
    height: 170,
    justifyContent: 'space-around',
    marginTop: 10,
  },
  documentContainer: {
    flex: 1.5,
    paddingHorizontal: 10,
    marginRight: 10,
    borderColor: Colors.GRAY_BORDER,
    borderWidth: 1,
    borderRadius: 12,
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
