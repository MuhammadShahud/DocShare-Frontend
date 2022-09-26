import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import React, { Component } from 'react';
import { Button, Header, SearchBar, SearchBox } from '../../Components';
import {
  back_arrow,
  face1,
  face2,
  face3,
  face4,
  face5,
  Logo,
  notification_white,
  search,
} from '../../Assets';
import { Colors } from '../../Styles';
import { connect } from 'react-redux'
import FriendsMiddleware from '../../Store/Middleware/FriendsMiddleware'

import { IMG_URL } from '../../Store/Apis'



class SearchFriend extends Component {
  constructor(props) {
    super(props);
    this.timeout = React.createRef(null)

    this.state = {
      search: '',
      next_page_url: undefined,
      loader: false,
      loadmore: false
    };
  }

  componentDidMount() {
    this.props.
      getUser({ next_page_url: this.state.next_page_url, search: '' })
  }

  onPressSearch = (val) => {
    clearTimeout(this.timeout.current)
    this.timeout.current = setTimeout(() => {
      this.props.
        getUser({ next_page_url: this.state.next_page_url, search: val })
    }, 1500);

  }

  onPressLoadMore = () => {
    this.setState({ loadmore: true }, () => {
      const { getUserdata, getUsersList } = this.props;
      this.props
        .getUser({ next_page_url: getUserdata?.links?.next, search: this.state.search })
        .then(() => this.setState({ loadmore: false }))
        .catch(() => this.setState({ loadmore: false }));
    });
  };
  renderLoaderMoreButton = () => {
    const { getUserdata, getUsersList } = this.props;
    const { loadmore } = this.state;
    return getUserdata?.links?.next != null ? (
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
        .getUser({ next_page_url: this.state.next_page_url, search: this.state.search })
        .then(data => { this.setState({ loader: false }) })
        .catch(() => this.setState({ loader: false }))
    });
  };

  render() {
    const friendList = ({ item }) => {
      return (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Profile', { item: item, screen: "Search" })}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <Image
            resizeMode="contain"
            source={item?.profile_pic ? { uri: IMG_URL + item?.profile_pic } : face2}
            style={{ width: 55, height: 55, borderRadius: 50 }}
          />
          <Text style={{ marginLeft: 20, color: Colors.GRAY_LIGHT }}>
            {item.username}
          </Text>
        </TouchableOpacity>
      );
    };

    const { getUserdata, getUsersList } = this.props

    return (
      <View style={{ flex: 1 }}>
        <Header
          rightIcon={notification_white}
          leftIcon={back_arrow}
          onPressLeftIcon={() => this.props.navigation.navigate('Home')}
          onPressRightIcon={() =>
            this.props.navigation.navigate('Notification')
          }
          headerText={'USER'}
        />

        <View style={styles.screenWrapper}>
          <View
            style={{
              marginTop: 20,
            }}>
            <Text style={styles.headingTitle}>Search Users</Text>
          </View>
          <SearchBox icon={search} placeholder="Search User"
            // onSubmitEditing={this.onPressSearch}
            onChangeText={text => { this.setState({ search: text }), this.onPressSearch(text) }}
          />
          <View style={styles.friendListWrapper}>
            {getUserdata ?
              <FlatList
                data={getUsersList}
                renderItem={friendList}
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
                    <Text style={{ textAlign: 'center' }}>Users not found</Text>
                  </View>
                }
                ListFooterComponent={this.renderLoaderMoreButton}
              /> : <View style={{ marginVertical: 10 }}>
                <ActivityIndicator size={"large"} color={Colors.CYAN} />
              </View>}
          </View>
        </View>
      </View>
    );
  }
}

const mapDisPatchToProps = (dispatch) => {
  return {
    getUser: payload => dispatch(FriendsMiddleware.getUsers(payload))
  }
}
const mapStateToProps = (state) => {
  return {
    getUserdata: state.FriendsReducer.getUserData,
    getUsersList: state.FriendsReducer.getUserList
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(SearchFriend)

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: Colors.WHITE,
  },
  headingTitle: {
    color: Colors.BLACK,
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
  },
  friendListWrapper: {
    backgroundColor: 'white',
    flex: 1,
    marginTop: 20
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
