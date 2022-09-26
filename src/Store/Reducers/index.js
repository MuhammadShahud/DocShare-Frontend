import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer'
import GeneralReducer from './GeneralReducer'
import PostReducer from './PostReducer'
import FriendsReducer from './FriendsReducer'
import ChatReducer from './ChatReducer'
import FilesReducer from './FilesReducer'
import NotificationReducer from './NotificationReducer'
import PaymentReducer from './PaymentReducer'


export const Reducer = combineReducers({
    AuthReducer,
    GeneralReducer,
    PostReducer,
    FriendsReducer,
    ChatReducer,
    FilesReducer,
    NotificationReducer,
    PaymentReducer
});