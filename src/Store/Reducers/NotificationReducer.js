import { GET_NOTIFICATION, RESET_NOTIFICATION, UPDATE_NOTIFICATION } from '../Types/actions_type';

let initialSate = {
    getNotification: null,
    getNotificationlist: []
};

const NotificationReducer = (state = initialSate, action) => {
    switch (action.type) {
        case GET_NOTIFICATION:
            let getNotificationlist_copy = [];
            getNotificationlist_copy = [
                ...state.getNotificationlist,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getNotification: action.payload,
                getNotificationlist: getNotificationlist_copy,
            };
            break;

        case UPDATE_NOTIFICATION:
            let getNotification_copy = [...state.getNotificationlist];
            let Index = getNotification_copy.findIndex(item => item.id === action.payload);
            getNotification_copy.splice(Index, 1);
            state = {
                ...state,
                getNotificationlist: getNotification_copy
            };
            break;

        case RESET_NOTIFICATION:
            state = {
                ...state,
                getNotification: null,
                getNotificationlist: []
            };
            break;
        default:
            break;
    }
    return state;
};

export default NotificationReducer;