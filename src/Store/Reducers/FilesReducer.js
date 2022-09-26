import {
    GET_FILES,
    GET_RECENT_FILES,
    RESET_FILES,
    DELETE_FILE,
    GET_COMMENTS,
    RESET_COMMENTS,
    UPDATE_COMMENTS,
    DELETE_COMMENTS
} from '../Types/actions_type';

let initialSate = {
    getfiles: null,
    getfilelist: [],
    getRecentFiles: null,
    getRecentFilesList: [],
    getComments: [],
    getCommentsData: null
};

const FilesReducer = (state = initialSate, action) => {
    switch (action.type) {
        case GET_FILES:
            let getfilelist_copy = [];
            getfilelist_copy = [
                ...state.getfilelist,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getfiles: action.payload,
                getfilelist: getfilelist_copy,
            };
            break;
        case GET_RECENT_FILES:
            let getRecentFilesList_copy = [];
            getRecentFilesList_copy = [
                ...state.getRecentFilesList,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getRecentFiles: action.payload,
                getRecentFilesList: getRecentFilesList_copy,
            };
            break;
        case DELETE_FILE:
            let getFiles = [...state.getfilelist];

            let FileIndex = getFiles.findIndex(item => item.id === action.payload);
            getFiles.splice(FileIndex, 1);

            state = {
                ...state,
                getfilelist: getFiles
            };

            break;
        case RESET_FILES:
            state = {
                ...state,
                getfiles: null,
                getfilelist: [],
            };
            break;

        case GET_COMMENTS:
            let getCommentsList_copy = [];
            getCommentsList_copy = [
                ...state.getComments,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getCommentsData: action.payload,
                getComments: getCommentsList_copy,
            };
            break;

        case UPDATE_COMMENTS:
            let getCommentsList = [...state.getComments];
            getCommentsList.unshift(action.payload);
            state = {
                ...state,
                getComments: getCommentsList,
            };
            break;

        case RESET_COMMENTS:
            state = {
                ...state,
                getCommentsData: null,
                getComments: [],
            };
            break;

        case DELETE_COMMENTS:
            let getCommentlist = [...state.getComments];

            let commentIndex = getCommentlist.findIndex(item => item.id === action.payload);
            getCommentlist.splice(commentIndex, 1);

            state = {
                ...state,
                getComments: getCommentlist
            };

            break;
        default:
            break;
    }
    return state;
};

export default FilesReducer;