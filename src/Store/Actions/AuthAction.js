import { IS_LOGIN, GET_USER_DATA, LOGOUT ,TERMS } from '../Types/actions_type';

class AuthAction {
    static isLogin = payload => {
        return {
            type: IS_LOGIN,
            payload: payload,
        };
    };

    static getUserData = payload => {
        return {
            type: GET_USER_DATA,
            payload: payload,
        };
    };
    static logout = payload => {
        return {
            type: LOGOUT,
            payload: payload,
        };
    };

    static isTerms = payload => {
        return {
            type: TERMS,
            payload: payload,
        };
    };

}

export default AuthAction;