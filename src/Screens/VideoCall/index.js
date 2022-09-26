import React, { useRef, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  bg,
  user,
  videoCall,
  attachmentCall,
  micCall,
  endVideoCall,
  message_white
} from '../../Assets';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import { Header } from '../../Components';
import { Colors } from '../../Styles';
import ActionSheet from './ActionSheet';
import { Actionsheet as NBActionSheet, useDisclose } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import requestCameraAndAudioPermission from '../../../components/Permissions'
import style from '../../../components/style'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import SoundPlayer from 'react-native-sound-player'
import DocumentPicker from 'react-native-document-picker';
import { OpenImagePicker } from '../../Components/ImagePicker'
import ChatMiddleware from '../../Store/Middleware/ChatMiddleware'
import Chat from '../Messages/Chat';
import { useNavigation } from '@react-navigation/native';

export default function VideoCall(props) {
  const navigation = useNavigation()
  const call_token = props?.route?.params?.call_token;
  const channelName = props?.route?.params?.channelName;
  const _engine = useRef(null);
  const _timeout = useRef(null);
  const dispatch = useDispatch();
  const [isJoined, setJoined] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [CallVisible, setCallVisible] = useState(false);
  const [disableVideoCamera, SetDisableVideoCamera] = useState(false);
  const [disableAudio, SetDisableAudio] = useState(false);
  const AuthState = useSelector(state => state.AuthReducer);
  const { isOpen, onOpen, onClose } = useDisclose();

  const [isdocument, setdocument] = useState(false)

  const config = {
    appId: 'ac7d15a624f648e3b96bb1829c8d7275',
    token: call_token,
    channelName: channelName,
  };

  useEffect(async () => {
    // SoundPlayer.playSoundFile('dail', 'wav')
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
      });
    }
    await init();
    startCall();

    _timeout.current = setTimeout(() => {
      endCall();
    }, 20000)

  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(_timeout.current)
    }
  }, [])

  const init = async () => {
    const { appId } = config;
    _engine.current = await RtcEngine.create(appId);
    await _engine.current.enableVideo();
    _engine.current.addListener('Warning', (warn) => {
    });

    _engine.current.addListener('Error', (err) => {
    });

    _engine.current.addListener('UserJoined', (uid, elapsed) => {
      if (peerIds.indexOf(uid) === -1) {
        setPeerIds((prev) => [...prev, uid]);
        SoundPlayer.stop()
        clearTimeout(_timeout.current);
      }
    });
    _engine.current.addListener('LeaveChannel', (stats) => {
    });

    _engine.current.addListener('UserOffline', (uid, reason) => {
      setPeerIds((prev) => prev.filter((id) => id !== uid));
    });

    // If Local user joins RTC channel
    _engine.current.addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        // console.log('JoinChannelSuccess', channel, uid, elapsed);
        // Set state variable to true
        setJoined(true);
      }
    );
  };

  useEffect(() => {
    if (peerIds.length == 0) {
      endCall();
    }
  }, [peerIds]);

  const startCall = async () => {
    setCallVisible(true)
    setJoined(true)
    // EnableCameraMobile()
    //EnableAudio()
    // Join Channel using null token and channel name
    await _engine.current?.joinChannel(
      // call_token,
      // channelName,
      config.token,
      config.channelName,
      null,
      0
    );
  };

  const endCall = async () => {
    await _engine.current.leaveChannel();
    _engine.current.destroy();
    setPeerIds([]);
    setJoined(false);
    if (props?.route?.params?.Incoming) {
      props.navigation.navigate('BottomTabs', { screen: 'Messages' })
    } else {
      props.navigation.goBack()
    }
  };
  const switchCameraMobile = async () => {
    await _engine.current?.switchCamera();
  };
  const DisableCameraMobile = async () => {
    SetDisableVideoCamera(true)
    await _engine.current?.enableLocalVideo(false);
  };
  const EnableCameraMobile = async () => {
    SetDisableVideoCamera(false)
    await _engine.current?.enableLocalVideo(true);
  };
  const DisableAudio = async () => {
    SetDisableAudio(true)
    await _engine.current?.enableLocalAudio(false);
  };
  const EnableAudio = async () => {
    SetDisableAudio(false)
    await _engine.current?.enableLocalAudio(true);
  };

  const _renderVideos = () => {
    return isJoined ? (
      <View style={styles.backgroundImg}>
        <RtcLocalView.SurfaceView
          style={styles.backgroundImg}
          channelId={config.channelName.toString()}
          renderMode={VideoRenderMode.Hidden}
        />
        {_renderRemoteVideos()}
      </View>
    ) : null;
  };

  const _renderRemoteVideos = () => {
    return (
      <ScrollView
        style={style.remoteContainer}
        contentContainerStyle={style.padding}
        horizontal={true}
      >
        {peerIds.map((value) => {
          return (
            <RtcRemoteView.SurfaceView
              style={style.remote}
              uid={value}
              channelId={config.channelName.toString()}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  };

  const uploadImage = () => {
    let user_id = props.route.params.user_id

    OpenImagePicker(img => {
      let uri_script, name, image;
      uri_script = img.path.split('/');
      name = uri_script[uri_script.length - 1];
      image = {
        file_code: 1,
        name,
        uri: img.path,
        size: img.size,
        type: img.mime,
      };
      dispatch(ChatMiddleware.sendMessage({
        type: 'image',
        recipient_user: user_id,
        media: image
      }))
        .then()
        .catch()
    });
  };

  const onPressChooseFile = async () => {
    let user_id = props.route.params.user_id

    try {
      const res = await DocumentPicker.pickSingle({ type: "application/*" });
      let document = {
        file_code: 2,
        name: res.name,
        fileCopyUri: res.fileCopyUri,
        size: res.size,
        type: res.type,
        uri: res.uri
      }
      dispatch(ChatMiddleware.sendMessage({
        type: 'document',
        recipient_user: user_id,
        media: document
      }))
        .then(() => { onOpen(), setdocument(true) })
        .catch()
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        // leftIcon={search}
        rightIcon={message_white}
        onPressRightIcon={() => { onOpen(), setdocument(true) }}
        headerText={'Video Call'}
      />

      <View style={{ backgroundColor: 'white', flex: 0.9 }}>
        {_renderVideos()}
        {/* <View style={{ position: 'absolute', right: 20, top: 20 }}>
          <Image style={styles.userImg} source={user} />
        </View> */}
        {/* <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 20,
            backgroundColor: '#000000',
            padding: 10,
          }}>
          <Text style={{ color: Colors.WHITE }}>Stacy</Text>
        </View> */}
      </View>
      {/* {
        peerIds.length == 0 && !props?.route?.params?.Incoming ?
          <View style={{ justifyContent: "center", alignItems: 'center', ...StyleSheet.absoluteFill }}>
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 20 }}>
              Ringing..
            </Text>
          </View> : null
      } */}
      <View
        style={{
          flex: 0.1,
          backgroundColor: Colors.WHITE,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
        }}>
        <TouchableOpacity style={styles.btn} onPress={() => disableAudio ? EnableAudio() : DisableAudio()}>
          <Feather size={24} color={Colors.WHITE} name={disableAudio ? "mic-off" : "mic"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => disableVideoCamera ? EnableCameraMobile() : DisableCameraMobile()}>
          <FontAwesome5 size={24} color={Colors.WHITE} name={disableVideoCamera ? "video" : "video-slash"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => switchCameraMobile()}>
          <MaterialIcons size={24} color={Colors.WHITE} name={"flip-camera-ios"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { onOpen(), setdocument(false) }}>
          <Image style={styles.icon} source={attachmentCall} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { endCall(), SoundPlayer.stop(); }}>
          <Image style={styles.icon} source={endVideoCall} />
        </TouchableOpacity>
      </View>
      {!isdocument ?
        <ActionSheet
          isOpen={isOpen}
          onClose={onClose}
          onPressAddPhoto={() => { uploadImage(), onClose() }}
          onPressAddFiles={() => { onPressChooseFile(), onClose() }}
        />
        :
        <NBActionSheet isOpen={isOpen} onClose={onClose} size="full">
          <NBActionSheet.Content>
            <View style={{ height: 500, width: "100%" }}>
              <Chat isheaderhide={true} route={{ params: { details: props.route.params.details } }} navigation={navigation} />
            </View>
            <NBActionSheet.Item
              onPress={() => {
                onClose()
              }}></NBActionSheet.Item>
          </NBActionSheet.Content>
        </NBActionSheet>
      }
    </View>
  );
}

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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingBottom: 200,
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userImg: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  icon: {
    width: 50,
    height: 50,
  },
  btn: {
    height: 50, width: 50, backgroundColor: Colors.GRAY_BTN, borderRadius: 100,
    justifyContent: 'center',
    alignItems: "center",
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
  },
});
