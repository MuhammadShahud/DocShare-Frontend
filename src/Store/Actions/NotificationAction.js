import { GET_NOTIFICATION, RESET_NOTIFICATION, UPDATE_NOTIFICATION } from '../Types/actions_type';

class NotificationAction {

    static getNotification = payload => {
        return {
            type: GET_NOTIFICATION,
            payload: payload,
        };
    };

    static updateNotification = payload => {
        return {
            type: UPDATE_NOTIFICATION,
            payload: payload,
        };
    };
    static reset = () => {
        return {
            type: RESET_NOTIFICATION,
        };
    };


}

export default NotificationAction;