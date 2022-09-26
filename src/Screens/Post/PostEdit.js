import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import { Header, SearchBar, Button, SearchBox, TagFrind } from '../../Components';
import {
    back_arrow,
    camera_icon,
    cross_icon,
    doucment_icon,
    face1,
    gallery1,
    gallery2,
    grey_plus_icon,
    Logo,
    notification_white,
    search,
    tag_friend_icon,
} from '../../Assets';
import { Colors } from '../../Styles';
import { Actionsheet, Icon, useDisclose } from 'native-base';
import ActionSheet from './ActionSheet';
import { useNavigation } from '@react-navigation/native';
import { OpenImagePicker } from '../../Components/ImagePicker'
import DocumentPicker from 'react-native-document-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useSelector, useDispatch } from 'react-redux'
import { IMG_URL } from '../../Store/Apis'
import PostMiddleware from '../../Store/Middleware/PostMiddleware'
import CustomAlert from '../../Components/CustomAlert'
import moment from 'moment';



const PostEdit = (props) => {
    const navigation = useNavigation()
    const { isOpen, onOpen, onClose } = useDisclose();
    const [tagFriendModal, setTagFriendModal] = useState(false);
    const [image, setimage] = useState([])
    const [tagFriends, setTagFriends] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [alert, setAlert] = useState({
        type: '',
        message: '',
        isVisible: false,
    })

    const renderItem = ({ item, index }) => {
        return (
            <>
                {item?.type == 'image' ? (
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            resizeMode="cover"
                            //   style={{width: 80, height: 80}}
                            style={{
                                backgroundColor: Colors.LIGHT_GREY_BUTTON,
                                width: '100%',
                                height: 200,
                                borderRadius: 20,
                                marginHorizontal: 5,
                                marginVertical: 5,
                            }}
                            source={{ uri: item?.url }}
                        />

                    </View>
                ) : item?.type == 'document' ? (
                    <TouchableOpacity onPress={() => navigation.navigate('FileEdit', { item, isEdit: false })} style={{ alignItems: 'center' }}>
                        <View
                            style={{
                                backgroundColor: Colors.WHITE,
                                width: '100%',
                                height: 200,
                                borderRadius: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginHorizontal: 5,
                                marginVertical: 5,
                                borderColor: Colors.WHITE_1,
                                borderWidth: 2
                            }}
                        >

                            <FontAwesome name="file-text-o" size={38} color={Colors.COUNT_RED} />
                            <Text style={{ color: Colors.BLACK, marginHorizontal: 15, marginTop: 2, textAlign: 'center' }}>{item.name}</Text>

                        </View>
                    </TouchableOpacity>
                ) : null}
            </>
        );
    };


    return (
        <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            <Header
                leftIcon={back_arrow}
                onPressLeftIcon={() => navigation.goBack()}
                rightIcon={notification_white}
                onPressRightIcon={() => navigation.navigate('Notification')}
                headerText={'POST'}
            />
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 20,
                    backgroundColor: Colors.WHITE_1,
                }}>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 30,
                        marginBottom: 10
                    }}>
                    <Image source={props?.route?.params?.item?.user?.profile_pic ? { uri: IMG_URL + props?.route?.params?.item?.user?.profile_pic } : face1} style={{ width: 40, height: 40 }} />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: Colors.BLACK, fontWeight: 'bold' }}>
                            {props?.route?.params?.item?.user?.username}
                        </Text>
                        <Text style={{ color: Colors.BLACK }}>
                            {moment(props?.route?.params?.item?.created_at).format('LL')}
                        </Text>

                    </View>
                </View>

                <View
                    style={{
                        width: '100%',
                        flex: 2,
                        paddingHorizontal: 10
                    }}>

                    <FlatList
                        // numColumns={2}
                        data={props?.route?.params?.item?.documents}
                        renderItem={(item, index) => renderItem(item, index)}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

            </View>
            <CustomAlert
                visible={alert.isVisible}
                onPress={() => { setAlert({ isVisible: false }), alert.type == 'Success' ? navigation.goBack() : null }}
                type={alert.type}
                Message={alert.message} />
        </View>
    );
};


export default PostEdit;

const styles = StyleSheet.create({});
