import { GET_FRIENDS, GET_USER, RESET_USER } from '../Types/actions_type';

class FriendsAction {

    static getFriends = payload => {
        return {
            type: GET_FRIENDS,
            payload: payload,
        };
    };

    static getUsers = payload => {
        return {
            type: GET_USER,
            payload: payload,
        };
    };
    static resetUsers = () => {
        return {
            type: RESET_USER,
        };
    };

}

export default FriendsAction;