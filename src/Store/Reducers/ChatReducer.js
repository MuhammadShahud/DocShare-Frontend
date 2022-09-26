import {
    GET_CHATS_MESSAGES,
    GET_CHAT_HEADS,
    LOGOUT,
    RESET_CHAT,
    UPDATE_CHAT_MESSAGES,
    GET_GROUPCHAT_HEADS,
    GET_GROUPCHATS_MESSAGES,
    UPDATE_GROUPCHAT_MESSAGES,
    GET_GROUPS,
    RESET_GROUPS,
    DELETE_GROUP
} from '../Types/actions_type';

let initialSate = {
    chatHeads: null,
    chatHeadsData: null,
    chatMessages: [],
    chatMessagesPaginatedObj: null,
    groupPagination: null,
    GroupChatHeads: null,
    GroupMessages: [],
    GroupsData: null,
    GroupsList: []
};

const ChatReducer = (state = initialSate, action) => {
    switch (action.type) {
        case GET_CHAT_HEADS:
            state = { ...state, chatHeads: action.payload };
            break;
        case UPDATE_CHAT_MESSAGES:
            let messagesCopy = [...state.chatMessages];
            messagesCopy.unshift(action.payload);
            state = { ...state, chatMessages: messagesCopy };
            break;
        case GET_CHATS_MESSAGES:
            let chat_messages_list_copy = [];
            chat_messages_list_copy = [
                ...state.chatMessages,
                ...action.payload.data
            ];
            state = {
                ...state,
                chatMessagesPaginatedObj: action.payload,
                chatMessages: chat_messages_list_copy,
            };
            break;
        case GET_GROUPCHATS_MESSAGES:
            let Groupchat_messages_list_copy = [];
            Groupchat_messages_list_copy = [
                ...state.GroupMessages,
                ...action.payload.data
            ];
            state = {
                ...state,
                groupPagination: action.payload,
                GroupMessages: Groupchat_messages_list_copy,
            };
            break;

        case UPDATE_GROUPCHAT_MESSAGES:
            let GroupmessagesCopy = [...state.GroupMessages];
            GroupmessagesCopy.unshift(action.payload);
            state = { ...state, GroupMessages: GroupmessagesCopy };
            break;
        case RESET_CHAT:
            state = {
                ...state,
                chatMessagesPaginatedObj: null,
                chatMessages: [],
                groupPagination: null,
                GroupMessages: [],
            };
            break;
        case GET_GROUPS:
            let Groups_list_copy = [];
            Groups_list_copy = [
                ...state.GroupsList,
                ...action.payload.data
            ];
            state = {
                ...state,
                GroupsData: action.payload,
                GroupsList: Groups_list_copy,
            };
            break;
        case RESET_GROUPS:
            state = {
                ...state,
                GroupsData: null,
                GroupsList: [],
            };
            break;

        case DELETE_GROUP:
            let getGroup = [...state.GroupsList];
            let GroupIndex = getGroup.findIndex(item => item.id == action.payload);
            getGroup.splice(GroupIndex, 1);
            state = {
                ...state,
                GroupsList: getGroup
            };

            break;

        case LOGOUT:
            state = {
                chatHeads: null,
                chatMessages: [],
                chatMessagesPaginatedObj: null,
            };
            break;

        default:
            break;
    }
    return state;
};

export default ChatReducer;
