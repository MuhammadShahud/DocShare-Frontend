import { IS_LOGIN, GET_USER_DATA, LOGOUT } from '../Types/actions_type';

let initialSate = {
    isLogin: false,
    user: null
};

const AuthReducer = (state = initialSate, action) => {
    switch (action.type) {
        case IS_LOGIN:
            state = { ...state, isLogin: action.payload };
            break;

        case GET_USER_DATA:
            state = { ...state, user: action.payload };
            break;

        case LOGOUT:
            state = { user: null };
            break;
        default:
            break;
    }
    return state;
};

export default AuthReducer;