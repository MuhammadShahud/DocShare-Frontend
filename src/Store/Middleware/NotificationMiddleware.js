import Axios from 'axios';
import NotificationAction from '../Actions/NotificationAction'
import LoadingAction from '../Actions/LoadingAction'
import Apis from '../Apis';
import { getHeaders } from '../../Utils'


class NotificationMiddleware {

    static getNotifications = ({ next_page_url }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    if (next_page_url == undefined) {
                        dispatch(NotificationAction.reset())
                    }
                    const { data } = await Axios.get(
                        Apis.getNotifications(next_page_url),
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(NotificationAction.getNotification(data?.data))
                        resolve(data.data)
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static toggleNotifcation = ({ is_notify }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formdata = new FormData()
                    formdata.append('is_notify', is_notify)
                    const { data } = await Axios.post(
                        Apis.onOffNotification,
                        formdata,
                        await getHeaders(),
                    );
                    console.log(data)
                    if (data?.success) {
                        resolve(data.data)
                        dispatch(LoadingAction.HideLoading())

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

export default NotificationMiddleware;