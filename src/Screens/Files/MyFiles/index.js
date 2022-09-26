import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import React, { Component } from 'react';
import {
  document,
  file_gradient,
  lock_white,
  menu_white,
  red_three_dots,
} from '../../../Assets';
import { Colors } from '../../../Styles';
import FileMenuModal from '../FileMenuModal';
import { connect } from 'react-redux'
import FilesMiddleware from '../../../Store/Middleware/FilesMiddleware'
class MyFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      loadmore: false,
      isShowFileMenuModal: false,
      file: '',

    };
  }
  toggleFileMenuModal = () => {
    this.setState({ isShowFileMenuModal: !this.state.isShowFileMenuModal });
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
            numColumns={2}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index + 1}
                onPress={() => navigation.navigate('FileDetail', { item })}
                style={{ flex: 1, margin: 10 }}>
                <Image
                  source={item.type == "document" ? document : { uri: item.url }}
                  style={{
                    width: '100%',
                    height: 230,
                    borderRadius: 14,
                    borderWidth: 0.7,
                    borderColor: Colors.TEXT_GRAY,
                    resizeMode: 'cover'
                  }}
                />
                <TouchableOpacity
                  onPress={() => { this.toggleFileMenuModal(), this.setState({ file: item }) }}
                  style={{
                    width: 10,
                    height: 25,
                    position: 'absolute',
                    right: 12,
                    top: 25,
                  }}>
                  <Image
                    source={red_three_dots}
                    style={{
                      width: 18,
                      height: 25,
                      right: 5,
                      tintColor: Colors.WHITE_1
                    }}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                {item.is_protected != 0 ?
                  <Image
                    source={lock_white}
                    style={{ height: 25, position: 'absolute', top: 25 }}
                    resizeMode={'contain'}
                  /> : null}
                <View
                  style={{
                    width: '100%',
                    position: 'absolute',
                    bottom: 10,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize: 15, textAlign: 'center', marginHorizontal: 15 }}>
                    {item.name}
                  </Text>
                  {/* <Text style={{ fontSize: 10, color: Colors.WHITE, textAlign: 'center' }}>
                    Contract Rev 1
                  </Text> */}
                </View>
              </TouchableOpacity>
            )}
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
        <FileMenuModal
          isVisible={this.state.isShowFileMenuModal}
          toggleFileMenuModal={this.toggleFileMenuModal}
          file={this.state.file}
        />
      </View>
    );
  };
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
export default connect(mapStateToProps, mapDisPatchToProps)(MyFiles);

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
