import {
    GET_CHATS_MESSAGES,
    GET_CHAT_HEADS,
    RESET_CHAT,
    UPDATE_CHAT_MESSAGES,
    GET_GROUPCHAT_HEADS,
    GET_GROUPCHATS_MESSAGES,
    UPDATE_GROUPCHAT_MESSAGES,
    GET_GROUPS,
    RESET_GROUPS,
    DELETE_GROUP,
    TOKEN_DETAILS
} from '../Types/actions_type';

class ChatAction {
    static getChatHeads = payload => {
        return {
            type: GET_CHAT_HEADS,
            payload: payload,
        };
    };
    static getGroupChatMessages = payload => {
        return {
            type: GET_GROUPCHATS_MESSAGES,
            payload: payload,
        };
    };
    static getChatMessages = payload => {
        return {
            type: GET_CHATS_MESSAGES,
            payload: payload,
        };
    };
    static updateChatMessages = payload => {
        return {
            type: UPDATE_CHAT_MESSAGES,
            payload: payload,
        };
    };

    static updateGroupChatMessages = payload => {
        return {
            type: UPDATE_GROUPCHAT_MESSAGES,
            payload: payload,
        };
    };
    static resetChat = () => {
        return {
            type: RESET_CHAT,
        };
    };
    static getGroups = payload => {
        return {
            type: GET_GROUPS,
            payload: payload,
        };
    };
    static resetGroups = () => {
        return {
            type: RESET_GROUPS,
        };
    };
    static deleteGroup = payload => {
        return {
            type: DELETE_GROUP,
        }
    }
    static tokenDetail = payload => {
        return {
            type: TOKEN_DETAILS,
            payload: payload,
        };
    };
}

export default ChatAction;
