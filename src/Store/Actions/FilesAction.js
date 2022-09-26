import { DELETE_FILE, GET_FILES, GET_RECENT_FILES, RESET_FILES, GET_COMMENTS, RESET_COMMENTS, UPDATE_COMMENTS, DELETE_COMMENTS } from '../Types/actions_type';

class FilesAction {

    static getFiles = payload => {
        return {
            type: GET_FILES,
            payload: payload,
        };
    };

    static getRecentFile = payload => {
        return {
            type: GET_RECENT_FILES,
            payload: payload,
        };
    };

    static deleteFile = payload => {
        return {
            type: DELETE_FILE,
            payload: payload,
        }
    }

    static resetFiles = () => {
        return {
            type: RESET_FILES,
        };
    };

    static getComments = payload => {
        return {
            type: GET_COMMENTS,
            payload: payload
        }
    }

    static updateComments = payload => {
        return {
            type: UPDATE_COMMENTS,
            payload: payload
        }
    }
    static deleteComments = payload => {
        return {
            type: DELETE_COMMENTS,
            payload: payload
        }
    }

    static resetComments = () => {
        return {
            type: RESET_COMMENTS,
        };
    };



}

export default FilesAction;