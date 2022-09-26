import {
  Text,
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import React, { Component } from 'react';
import { face1, face2, face3, face4, person_crose } from '../../../Assets';
import { Colors } from '../../../Styles';
import { IMG_URL } from '../../../Store/Apis'
import { connect } from 'react-redux'
import FriendsMiddleware from '../../../Store/Middleware/FriendsMiddleware'

class FriendsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
    };
  }
  renderOneFriend = ({ item }) => {
    return (
      <View
        style={{ flexDirection: 'row', marginVertical: 10 }}>
        <View>
          <Image
            source={item?.profile_pic ? { uri: IMG_URL + item?.profile_pic } : face1}
            style={{ height: 70, width: 70 }}
            resizeMode={'contain'}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginHorizontal: 10,
          }}>
          <Text style={{ color: Colors.BLACK, fontSize: 18, fontWeight: 'bold' }}>
            {item.username}
          </Text>
          <Text style={{ color: Colors.TEXT_GRAY }}>{item.email}</Text>
        </View>
        <TouchableOpacity style={styles.iconContainer}
          onPress={() => {
            this.props.navigation.navigate('Profile', { item: { ...item, is_friend: true, status: "approved" }, screen: "Friends" });
          }}
        >
          <Image source={person_crose} style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  };

  onRefreshEclass = () => {
    this.setState({ loader: true }, () => {
      this.props
        .getFriends({ search: '' })
        .then(data => { this.setState({ loader: false }) })
        .catch(() => this.setState({ loader: false }))
    });
  };


  render() {
    const { users } = this.props
    return (
      <View style={{ flex: 1 }}>
        {users ?
          <FlatList
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            data={users}
            keyExtractor={item => item.id}
            renderItem={this.renderOneFriend}
            refreshControl={
              <RefreshControl
                refreshing={this.state.loader}
                onRefresh={this.onRefreshEclass}
              />
            }
            ListEmptyComponent={
              <View style={{ marginVertical: 10, backgroundColor: Colors.WHITE, padding: 10, borderRadius: 5 }}>
                <Text style={{ textAlign: 'center', color: Colors.BLACK }}>Friends not found</Text>
              </View>
            }
          />
          :
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
    getFriends: payload => dispatch(FriendsMiddleware.getFriends(payload)),

  }
}
const mapStateToProps = (state) => {
  return {


  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(FriendsTab);


const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: Colors.CYAN,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    elevation: 5,
  },
  icon: { width: 20, height: 20 },
});
