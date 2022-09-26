import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import React, { Component } from 'react';
import { Colors } from '../../../Styles';
import { file_blue, menu_gray, menu_gray_vertical } from '../../../Assets';
import { connect } from 'react-redux'
import FilesMiddleware from '../../../Store/Middleware/FilesMiddleware'


class Recent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      loadmore: false,
      isShowFileMenuModal: false,
      file: '',
    };
  }
  renderFiles = ({ item, index }) => {
    const { navigation } = this.props
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('FileDetail', { item })}
        style={{
          backgroundColor: Colors.GRAY_2,
          borderRadius: 10,
          elevation: 3,
          marginVertical: 7,
        }}>
        <View
          style={{
            backgroundColor: Colors.GRAY_BG,
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
              {item.name}
            </Text>
            {/* <Text style={{fontSize: 12 , color:Colors.GRAY_3}}>{index + 1} mins ago</Text> */}
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Image
              source={menu_gray_vertical}
              style={{ height: 20, marginRight: 5 }}
              resizeMode={'contain'}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  onPressLoadMore = () => {
    this.setState({ loadmore: true }, () => {
      const { fileData } = this.props
      this.props
        .getDocuments({ next_page_url: fileData?.links?.next })
        .then(() => this.setState({ loadmore: false }))
        .catch(() => this.setState({ loadmore: false }));
    });
  };

  renderLoaderMoreButton = () => {
    const { fileData } = this.props
    const { loadmore } = this.state;
    return fileData?.links?.next != null ? (
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
        .getDocuments({ next_page_url: undefined })
        .then(data => { this.setState({ loader: false }) })
        .catch(() => this.setState({ loader: false }))
    });
  };


  render() {
    const { navigation, fileData, filesList } = this.props
    return (
      <View style={{ flex: 1 }}>
        {fileData && !this.state.loader ?
          <FlatList
            style={{ flex: 1 }}
            data={filesList}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={this.renderFiles}
            refreshControl={
              <RefreshControl
                refreshing={this.state.loader}
                onRefresh={this.onRefreshEclass}
              />
            }
            ListFooterComponent={this.renderLoaderMoreButton}
            ListEmptyComponent={
              <View style={{ marginVertical: 10, backgroundColor: Colors.WHITE, padding: 10, borderRadius: 5 }}>
                <Text style={{ textAlign: 'center', color: Colors.BLACK }}>Documents not found</Text>
              </View>
            }
          /> :
          <View style={{ marginVertical: 10 }}>
            <ActivityIndicator size={"large"} color={Colors.CYAN} />
          </View>
        }
      </View>
    );
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getDocuments: payload => dispatch(FilesMiddleware.getFiles(payload))
  }
}
const mapStateToProps = (state) => {
  return {


  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(Recent);
const styles = StyleSheet.create({
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
