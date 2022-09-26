import Axios from 'axios';
import FriendsAction from '../Actions/FriendsAction'
import LoadingAction from '../Actions/LoadingAction'
import NotificationAction from '../Actions/NotificationAction'
import Apis from '../Apis';
import { getHeaders } from '../../Utils'


class FriendsMiddleware {

    static getFriends = ({ search }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formdata = new FormData()
                    formdata.append('search', search)
                    const { data } = await Axios.post(
                        Apis.getFriends,
                        formdata,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(FriendsAction.getFriends(data?.data))
                        resolve(data.data)
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static getUsers = ({ next_page_url, search }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    if (next_page_url == undefined || search) {
                        if (next_page_url && search) {
                        } else {
                            dispatch(FriendsAction.resetUsers())
                        }
                    }
                    let formData = new FormData()
                    formData.append('search', search)
                    const { data } = await Axios.post(
                        Apis.getUsers(next_page_url),
                        formData,
                        await getHeaders(),
                    );

                    if (data?.success) {
                        dispatch(FriendsAction.getUsers(data))
                        resolve(data.data)
                    }
                } catch (error) {
                    reject(error);
                    // alert('Network Error');
                }
            });
        };
    };

    static sendFriendRequest = ({ id }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData()
                    formData.append('requested_user_id', id)
                    const { data } = await Axios.post(
                        Apis.sendRequest,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        dispatch(FriendsMiddleware.getUsers({ next_page_url: undefined, search: '' }))
                        resolve(data.data)
                    }
                } catch (error) {
                    dispatch(LoadingAction.HideLoading())
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static unfriend = ({ id, screen }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    const { data } = await Axios.get(
                        `${Apis.unfriend}/${id}`,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        if (screen === "Search") {
                            dispatch(FriendsMiddleware.getUsers({ next_page_url: undefined, search: '' }))
                        } else {
                            dispatch(FriendsMiddleware.getFriends({ search: '' }))
                        }
                        resolve(data.data)
                    } else {
                        dispatch(LoadingAction.HideLoading())
                    }
                } catch (error) {
                    dispatch(LoadingAction.HideLoading())
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static acceptRequest = ({ id, notification_id }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formdata = new FormData()
                    formdata.append('notification_id', notification_id)
                    formdata.append('id', id)

                    const { data } = await Axios.post(
                        Apis.acceptFriendRequest,
                        formdata,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        dispatch(FriendsMiddleware.getFriends({ search: '' }))
                        dispatch(NotificationAction.updateNotification(notification_id))
                        resolve(data.data)
                    } else {
                        dispatch(LoadingAction.HideLoading())
                    }
                } catch (error) {
                    dispatch(LoadingAction.HideLoading())
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static rejectRequest = ({ id, notification_id }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formdata = new FormData()
                    formdata.append('notification_id', notification_id)
                    formdata.append('id', id)

                    const { data } = await Axios.post(
                        Apis.rejectFriendRequest,
                        formdata,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        dispatch(NotificationAction.updateNotification(notification_id))
                        // dispatch(FriendsMiddleware.getFriends({ search: '' }))
                        resolve(data.data)
                    } else {
                        dispatch(LoadingAction.HideLoading())
                    }
                } catch (error) {
                    dispatch(LoadingAction.HideLoading())
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

}

export default FriendsMiddleware;