import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, { Component } from 'react';
import { Colors } from '../../../Styles';
import {
  delete_gray,
  edit_black,
  file_blue,
  menu_gray,
  menu_gray_vertical,
  delete_black,
} from '../../../Assets';
import { IMG_URL } from '../../../Store/Apis';
import { connect } from 'react-redux';
import ChatMiddleware from '../../../Store/Middleware/ChatMiddleware';
import { ScrollView } from 'native-base';
import CustomAlert from '../../../Components/CustomAlert'

class GroupUser extends Component {

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

  onPressLoadMore = () => {
    this.setState({ loadmore: true }, () => {
      const { groupData } = this.props
      this.props
        .getGroups({ next_page_url: groupData?.links?.next })
        .then(() => this.setState({ loadmore: false }))
        .catch(() => this.setState({ loadmore: false }));
    });
  };

  renderLoaderMoreButton = () => {
    const { groupData } = this.props
    const { loadmore } = this.state;
    return groupData?.links?.next != null ? (
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
        .getGroups({ next_page_url: this.state.next_page_url, search: '' })
        .then(data => { this.setState({ loader: false }) })
        .catch(() => this.setState({ loader: false }))
    });
  };

  onPressGroupDelete = (id) => {
    this.props
      .deleteGroup({ id })
      .then(data => {
        this.setState({
          alert: { isVisible: true, type: 'Success', message: 'Group deleted successfully.' }
        })
      })
      .catch();
  }

  renderFileButton = ({ item, index }) => {
    return (
      <View
        style={{
          backgroundColor: Colors.GRAY_2,
          borderRadius: 10,
          elevation: 3,
          marginVertical: 7,
          marginHorizontal: 5
        }}>
        <View
          style={{
            backgroundColor: Colors.WHITE,
            flexDirection: 'row',
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 10,
            marginRight: 20,
          }}>
          <View
            style={{
              backgroundColor: Colors.WHITE,
              height: 60,
              width: 60,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={file_blue}
              style={{ height: 40, width: 40 }}
              resizeMode={'contain'}
            />
          </View>
          <View
            style={{ flex: 1, marginHorizontal: 10, justifyContent: 'center' }}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', color: Colors.GRAY_1 }}>
              {item?.name}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.BLACK }}>{item?.members.length} Participants</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('EditGroup', { item })}>
              <Image
                source={edit_black}
                style={{ height: 20, marginTop: 10 }}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            {item?.is_admin == 1 ?
              <TouchableOpacity
                onPress={() => this.onPressGroupDelete(item?.id)}
              >
                <Image
                  source={delete_black}
                  style={{ height: 20, marginTop: 10 }}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              : null}
          </View>

        </View>
      </View>
    );
  };

  render() {
    const { groupList } = this.props
    const { groupData } = this.props
    return (
      <View style={{ flex: 1 }}>
        {groupData ?
          <FlatList
            showsVerticalScrollIndicator={false}
            data={groupList}
            renderItem={this.renderFileButton}
            refreshControl={
              <RefreshControl
                refreshing={this.state.loader}
                onRefresh={this.onRefreshEclass}
              />
            }
            ListEmptyComponent={
              <View style={{ marginVertical: 10, backgroundColor: Colors.WHITE, padding: 10, borderRadius: 5 }}>
                <Text style={{ textAlign: 'center', color: Colors.BLACK }}>No group found</Text>
              </View>
            }
            ListFooterComponent={this.renderLoaderMoreButton}
          /> :
          <View style={{ marginVertical: 10 }}>
            <ActivityIndicator size={"large"} color={Colors.CYAN} />
          </View>
        }
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
    getGroups: payload => dispatch(ChatMiddleware.getGroups(payload)),
    deleteGroup: payload => dispatch(ChatMiddleware.deleteGroup(payload))
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps, mapDisPatchToProps)(GroupUser)

const styles = StyleSheet.create({
  loadMoreText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
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
