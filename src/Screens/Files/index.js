import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import React, { Component } from 'react';
import { Button, Header, SearchBar, TextInput, SearchBox } from '../../Components';
import {
  back_arrow,
  document,
  Logo,
  menu_white,
  notification_white,
  plus_white,
  search
} from '../../Assets';
import { Colors } from '../../Styles';
import MyFiles from './MyFiles';
import FileMenuModal from './FileMenuModal';
import FriendsTab from './Friends';
import Recent from './Recent';
import GroupUser from './GroupUser';
import { connect } from 'react-redux'

import FriendsMiddleware from '../../Store/Middleware/FriendsMiddleware'
import ChatMiddleware from '../../Store/Middleware/ChatMiddleware'
import FilesMiddleware from '../../Store/Middleware/FilesMiddleware'

const { height, width } = Dimensions.get('window');
class Files extends Component {
  constructor(props) {
    super(props);
    this.timeout = React.createRef(null)
    this.state = {
      loader: false,
      search: '',
      tabs: [
        {
          label: 'My Files',
          isActive: true,
          heading: 'Shared Files',
          header: 'FILES',
        },
        {
          label: 'Friends',
          isActive: false,
          heading: 'Friend list',
          header: 'Friends',
        },
        { label: 'Recent', isActive: false, heading: 'Recent', header: 'RECENT' },
        {
          label: 'Group',
          isActive: false,
          heading: 'Group',
          header: 'GROUP LIST',
        },
      ],
      isShowFileMenuModal: false,
    };
  }

  componentDidMount() {
    // this.props.navigation.addListener("focus", () => {
    this.props.getFriends({ search: '' });
    this.props.getGroups({ next_page_url: undefined, search: '' });
    this.props.getDocuments({ next_page_url: undefined })
    // })
  }
  onPressLabel = item => {
    this.state.tabs.map(x => {
      x.isActive = false;
    });
    item.isActive = !item.isActive;
    this.setState({});
  };
  toggleFileMenuModal = () => {
    this.setState({ isShowFileMenuModal: !this.state.isShowFileMenuModal });
  };
  onPressSearch = (value) => {
    const activeTabIndex = this.state.tabs.findIndex(x => x.isActive == true);
    const activeTab = this.state.tabs[activeTabIndex];
    clearTimeout(this.timeout.current)
    this.timeout.current = setTimeout(() => {
      if (activeTabIndex == 1) {
        this.setState({ loader: true })
        this.props.getFriends({ search: value })
          .then(() => this.setState({ loader: false }))
          .catch(() => this.setState({ loader: false }))
      }
      else if (activeTabIndex == 3) {
        this.props.getGroups({ next_page_url: undefined, search: value });
      }
    }, 1500);
  }
  render() {
    const activeTabIndex = this.state.tabs.findIndex(x => x.isActive === true);
    const activeTab = this.state.tabs[activeTabIndex];
    const { getFriendList, getGroupsList, getGroupsData, getfileList, getfileData } = this.props
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftIcon={back_arrow}
          rightIcon={activeTabIndex === 3 ? plus_white : notification_white}
          onPressLeftIcon={() => this.props.navigation.navigate('Home')}
          onPressRightIcon={() =>
            this.props.navigation.navigate(
              activeTabIndex === 3 ? 'CreateGroup' : 'Notification',
            )
          }
          headerText={activeTab.header}
        />
        <View
          style={{
            flex: 1,
            paddingHorizontal: 25,
            backgroundColor: Colors.WHITE_1,
          }}>
          {activeTabIndex != 2 && activeTabIndex != 0 ?
            <SearchBar
              icon={search} placeholder="Search here"
              // onSubmitEditing={this.onPressSearch}
              onChangeText={text => { this.setState({ search: text }), this.onPressSearch(text) }}
            />
            :
            <View style={{ height: 10 }}></View>
          }
          <View style={{}}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 22, color: Colors.BLACK }}>
              {activeTab.heading}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 15,
            }}>
            {this.state.tabs.map((x, i) => {
              return x.isActive ? (
                <View style={{ alignItems: 'center' }} key={i}>
                  <Text
                    style={{
                      color: Colors.BLACK,
                      fontWeight: 'bold',
                      fontSize: 15,
                    }}>
                    {x.label}
                  </Text>
                  <View
                    style={{
                      backgroundColor: Colors.BLACK,
                      height: 8,
                      width: 8,
                      borderRadius: 30,
                      marginVertical: 5,
                    }}
                  />
                </View>
              ) : (
                <TouchableOpacity key={i} onPress={() => this.onPressLabel(x)}>
                  <Text style={{ color: Colors.TEXT_GRAY }}>{x.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {activeTabIndex === 0 && (
            <MyFiles
              navigation={this.props.navigation}
              fileData={getfileData}
              filesList={getfileList}
            />
          )}
          {activeTabIndex === 1 && (
            !this.state.loader ?
              <FriendsTab
                toggleFileMenuModal={this.toggleFileMenuModal}
                navigation={this.props.navigation}
                users={getFriendList}
              /> : <ActivityIndicator size={'large'} color={Colors.CYAN} />
          )}
          {activeTabIndex === 2 && (
            <Recent
              toggleFileMenuModal={this.toggleFileMenuModal}
              navigation={this.props.navigation}
              fileData={getfileData}
              filesList={getfileList}
            />
          )}
          {activeTabIndex === 3 && (
            <GroupUser
              toggleFileMenuModal={this.toggleFileMenuModal}
              navigation={this.props.navigation}
              groupList={getGroupsList}
              groupData={getGroupsData}
            />
          )}
        </View>

      </View>
    );
  }
}

const mapDisPatchToProps = (dispatch) => {
  return {
    getFriends: payload => dispatch(FriendsMiddleware.getFriends(payload)),
    getGroups: payload => dispatch(ChatMiddleware.getGroups(payload)),
    getDocuments: payload => dispatch(FilesMiddleware.getFiles(payload))
  }
}
const mapStateToProps = (state) => {
  return {
    getFriendList: state.FriendsReducer.getFriends,
    getGroupsList: state.ChatReducer.GroupsList,
    getGroupsData: state.ChatReducer.GroupsData,
    getfileData: state.FilesReducer.getfiles,
    getfileList: state.FilesReducer.getfilelist,

  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(Files);

const styles = StyleSheet.create({});

