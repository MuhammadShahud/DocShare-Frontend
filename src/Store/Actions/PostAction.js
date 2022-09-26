import { GET_POST, RESET_POST, DELETE_POST } from '../Types/actions_type';

class PostAction {

    static getPost = payload => {
        return {
            type: GET_POST,
            payload: payload,
        };
    };
    static resetPost = () => {
        return {
            type: RESET_POST,
        };
    };

    static deletePost = payload => {
        return {
            type: DELETE_POST,
            payload: payload,
        };
    };
}

export default PostAction;