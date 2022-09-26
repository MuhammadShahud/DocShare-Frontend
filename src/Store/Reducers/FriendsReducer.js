import { GET_FRIENDS, GET_USER, RESET_USER } from '../Types/actions_type';

let initialSate = {
    getFriends: null,
    getUserData: null,
    getUserList: []
};

const FriendsReducer = (state = initialSate, action) => {
    switch (action.type) {
        case GET_FRIENDS:
            state = { ...state, getFriends: action.payload }
            break;

        case GET_USER:
            let getUserList_copy = [];
            getUserList_copy = [
                ...state.getUserList,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getUserData: action.payload,
                getUserList: getUserList_copy,
            };
            break;
        case RESET_USER:
            state = {
                ...state,
                getUserData: null,
                getUserList: [],
            };
            break;
        default:
            break;
    }
    return state;
};

export default FriendsReducer;