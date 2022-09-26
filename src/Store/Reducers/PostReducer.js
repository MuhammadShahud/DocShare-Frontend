import { GET_POST, RESET_POST, DELETE_POST } from '../Types/actions_type';

let initialSate = {
    getPost: null,
    getPostlist: []
};

const PostReducer = (state = initialSate, action) => {
    switch (action.type) {
        case GET_POST:
            let getPostList_copy = [];
            getPostList_copy = [
                ...state.getPostlist,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getPost: action.payload,
                getPostlist: getPostList_copy,
            };
            break;

        case DELETE_POST:
            let getPosts = [...state.getPostlist];

            let PostIndex = getPosts.findIndex(item => item.id === action.payload);
            getPosts.splice(PostIndex, 1);

            state = {
                ...state,
                getPostlist: getPosts
            };

            break;



        case RESET_POST:
            state = {
                ...state,
                getPost: null,
                getPostlist: [],
            };
            break;
        default:
            break;
    }
    return state;
};

export default PostReducer;