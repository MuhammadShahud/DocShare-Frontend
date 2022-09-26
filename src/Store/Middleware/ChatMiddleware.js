import Axios from 'axios';
import ChatAction from '../Actions/ChatAction'
import Apis from '../Apis';
import { getHeaders } from '../../Utils'
import LoadingAction from '../Actions/LoadingAction';

class ChatMiddleware {

    static getChatHeads = ({ search }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('search', search)
                    const { data } = await Axios.post(
                        Apis.getChatHead,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(ChatAction.getChatHeads(data?.data))
                        resolve(data.data)
                    }
                } catch (error) {
                    reject(error)
                    alert("Network Error")
                }

            })
        }
    }
    static getChatMessages = ({ chatid, next_page_url }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    if (next_page_url == undefined) {
                        dispatch(ChatAction.resetChat())
                    }
                    const { data } = await Axios.get(
                        Apis.getChatMessages(next_page_url, chatid),
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(ChatAction.getChatMessages(data.data));
                        resolve(data.data);
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                    console.log(error);
                }
            });
        };
    };
    static sendMessage = ({ type, recipient_user, message, media, location }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formdata = new FormData();

                    formdata.append('user_id', recipient_user);
                    formdata.append('type', type);
                    if (type == 'text') {
                        formdata.append('message', message);
                    } else if (type == 'document') {
                        formdata.append('media', media);
                    } else if (type == 'image') {
                        formdata.append('image', media);
                    } else if (type == 'location') {
                        formdata.append('location[lat]', location.lat);
                        formdata.append('location[long]', location.long);
                    }
                    const { data } = await Axios.post(
                        Apis.sendMessage,
                        formdata,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        // dispatch(ChatAction.updateChatMessages(data.data));
                        resolve(data);
                    }
                } catch (error) {
                    reject(error);
                    console.log(error)
                    alert('Network Error');
                }
            });
        };
    };
    static CreateChat = ({ id }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('id', id)
                    const { data } = await Axios.post(
                        Apis.createChat,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        resolve(data.data)
                    } else {
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };
    static getGroupMessages = ({ groupid, next_page_url }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    if (next_page_url == undefined) {
                        dispatch(ChatAction.resetChat())
                    }
                    let formData = new FormData()
                    formData.append('group_id', groupid)
                    const { data } = await Axios.post(
                        Apis.getGroupMessages(next_page_url),
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(ChatAction.getGroupChatMessages(data.data));
                        resolve(data.data);
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                    console.log(error);
                }
            });
        };
    };
    static sendGroupMessage = ({ type, groupid, user_id, message, documents, location }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formdata = new FormData();
                    formdata.append('group_id', groupid);
                    formdata.append('user_id', user_id);
                    formdata.append('type', type);
                    if (type == 'message') {
                        formdata.append('message', message);
                    } else if (type == 'document') {
                        for (const [i, document] of documents.entries()) {
                            if (document.file_code == 1) {
                                formdata.append('documents[][type]', 'image');
                                formdata.append('documents[][document]', document);
                            } else {
                                formdata.append('documents[][type]', 'document');
                                formdata.append('documents[][document]', document);
                            }
                        }
                    } else if (type == 'location') {
                        formdata.append('location[lat]', location.lat);
                        formdata.append('location[long]', location.lng);
                    }
                    console.log(formdata)
                    const { data } = await Axios.post(
                        Apis.sendGroupMessage,
                        formdata,
                        await getHeaders(),
                    );

                    console.log(data)

                    if (data?.success) {
                        // dispatch(ChatAction.updateGroupChatMessages(data.data));
                        resolve(data);
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };
    static getGroups = ({ next_page_url, search }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    if (next_page_url == undefined || search) {
                        dispatch(ChatAction.resetGroups())
                    }
                    let formData = new FormData()
                    formData.append('search', search)
                    const { data } = await Axios.post(
                        Apis.getGroups(next_page_url),
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(ChatAction.getGroups(data?.data))
                        resolve(data?.data)
                    }
                } catch (error) {
                    reject(error);
                    // alert('Network Error');
                }
            });
        };
    };
    static createGroup = (userData) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData()
                    formData.append('name', userData?.groupName)
                    for (const [i, member] of userData?.selectedFriend.entries()) {
                        formData.append(`members[${i}][user_id]`, member?.id)
                        formData.append(`members[${i}][is_admin]`, 0)
                    }
                    const { data } = await Axios.post(
                        Apis.createGroup,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        dispatch(ChatMiddleware.getGroups({ next_page_url: undefined, search: '' }))
                        resolve(data)
                    }
                    else {
                        dispatch(LoadingAction.HideLoading())
                    }
                } catch (error) {
                    dispatch(LoadingAction.HideLoading())
                    reject(error);
                    // alert('Network Error');
                }
            });
        };
    };
    static deleteGroup = ({ id }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('group_id', id)
                    const { data } = await Axios.post(
                        Apis.deleteGroup,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        dispatch(ChatAction.deleteGroup(id))
                        resolve(data.data)
                    } else {
                        dispatch(LoadingAction.HideLoading())
                    }
                } catch (error) {
                    reject(error);
                    dispatch(LoadingAction.HideLoading())
                    alert('Network Error');
                }
            });
        };
    };
    static removeGroupMember = ({ user_id, group_id }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('group_id', group_id)
                    formData.append('user_id', user_id)
                    const { data } = await Axios.post(
                        Apis.removeMember,
                        formData,
                        await getHeaders(),
                    );
                    console.log(data)
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        resolve(data.data)
                    } else {
                        dispatch(LoadingAction.HideLoading())

                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                    dispatch(LoadingAction.HideLoading())

                }
            });
        };
    }
    static updateGroup = ({ name, group_id, selectedFriend }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('group_id', group_id)
                    formData.append('name', name)
                    for (const [i, member] of selectedFriend.entries()) {
                        formData.append(`members[${i}][user_id]`, member?.id)
                        formData.append(`members[${i}][is_admin]`, 0)
                    }
                    const { data } = await Axios.post(
                        Apis.updateGroup,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        resolve(data.data)
                        dispatch(LoadingAction.HideLoading())
                        dispatch(ChatMiddleware.getGroups({ next_page_url: undefined, search: '' }))
                    } else {
                        dispatch(LoadingAction.HideLoading())

                    }
                } catch (error) {
                    reject(error);
                    dispatch(LoadingAction.HideLoading())

                    alert('Network Error');
                }
            });
        };
    }
    static leaveGroup = ({ id }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('group_id', id)
                    const { data } = await Axios.post(
                        Apis.leaveGroup,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        dispatch(ChatMiddleware.getGroups({ next_page_url: undefined, search: '' }))
                        resolve(data.data)
                    } else {
                        dispatch(LoadingAction.HideLoading())
                    }
                } catch (error) {
                    reject(error);
                    dispatch(LoadingAction.HideLoading())
                    alert('Network Error');
                }
            });
        };
    };


}

export default ChatMiddleware