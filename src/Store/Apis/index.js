//live
// const BASE_URL = `https://healthconet.com/docshare`;
// export const IMG_URL = `https://healthconet.com/docshare/public/images/`;

// 202 server
const BASE_URL = `http://202.142.180.146:90/docshare`;
export const IMG_URL = `http://202.142.180.146:90/docshare/public/images/`;

// local
// const BASE_URL = `http://192.168.0.110/DocShare2/docshare`;
// export const IMG_URL = `http://192.168.0.110/DocShare2/docshare/public/images/`;


const Apis = {
    //Auth
    login: `${BASE_URL}/api/login`,
    register: `${BASE_URL}/api/register`,
    sendForgotEmail: `${BASE_URL}/api/sendForgotPasswordEmail`,
    verifyPin: `${BASE_URL}/api/verifyForgotPin`,
    resetPassword: `${BASE_URL}/api/resetPassword`,
    changePassword: `${BASE_URL}/api/changePassword`,
    updateProfile: `${BASE_URL}/api/updateProfile`,
    socialLogin: `${BASE_URL}/api/socialLogin`,

    //Post
    getPost: next_page_url => next_page_url ? next_page_url : `${BASE_URL}/api/getPosts`,
    storePost: `${BASE_URL}/api/uploadPost`,
    deletePost: `${BASE_URL}/api/deletePost`,

    //Friends
    getFriends: `${BASE_URL}/api/friendsList`,
    getUsers: next_page_url => next_page_url ? next_page_url : `${BASE_URL}/api/searchUser`,
    sendRequest: `${BASE_URL}/api/sendRequest`,
    unfriend: `${BASE_URL}/api/unFriendUser`,
    acceptFriendRequest: `${BASE_URL}/api/acceptFriendRequest`,
    rejectFriendRequest: `${BASE_URL}/api/rejectFriendRequest`,

    //Chat
    getChatHead: `${BASE_URL}/api/chatIndex`,
    getChatMessages: (next_page_url, chatid) => next_page_url ? next_page_url : `${BASE_URL}/api/viewChatlist/${chatid}`,
    getGroupMessages: next_page_url => next_page_url ? next_page_url : `${BASE_URL}/api/getGroupMessages`,
    sendMessage: `${BASE_URL}/api/sendMessage`,
    createChat: `${BASE_URL}/api/chatSession`,
    sendGroupMessage: `${BASE_URL}/api/sendGroupMessage`,
    getGroups: next_page_url => next_page_url ? next_page_url : `${BASE_URL}/api/getGroups`,
    createGroup: `${BASE_URL}/api/createGroup`,
    deleteGroup: `${BASE_URL}/api/deleteGroup`,
    removeMember: `${BASE_URL}/api/removeMember`,
    updateGroup: `${BASE_URL}/api/updateGroup`,
    leaveGroup: `${BASE_URL}/api/leaveGroup`,

    //Video Call
    generateToken: `${BASE_URL}/api/generateToken`,
    declineCall: `${BASE_URL}/api/declineCall`,

    //Files 
    getDocuments: next_page_url => next_page_url ? next_page_url : `${BASE_URL}/api/getAllDocuments`,
    setPasscode: `${BASE_URL}/api/setDocumentPasscode`,
    deleteFile: `${BASE_URL}/api/deleteDocument`,
    exportAnnotations: `${BASE_URL}/api/realtime_document`,
    getComments: next_page_url => next_page_url ? next_page_url : `${BASE_URL}/api/documentComments`,
    addComment: `${BASE_URL}/api/commentDocument`,
    deleteComment: `${BASE_URL}/api/deleteDocumentComment`,
    shareDocument: `${BASE_URL}/api/shareDocument`,
    openDocument: `${BASE_URL}/api/openDocument`,
    updateDocument: `${BASE_URL}/api/updateDocument`,

    //Notifications 
    getNotifications: next_page_url => next_page_url ? next_page_url : `${BASE_URL}/api/getNotifications`,
    onOffNotification: `${BASE_URL}/api/onOffNotification`,

    //payment and plans  
    getAllPackages: `${BASE_URL}/api/getAllPackages`,
    getUserPlans: `${BASE_URL}/api/getSubHistory`,
    userCard: `${BASE_URL}/api/showMethod`,
    addCard: `${BASE_URL}/api/storeCard`,
    subscribe: `${BASE_URL}/api/subscribe`,
    deleteCard: `${BASE_URL}/api/deleteCard`,

    //HelpPrivacyTerms
    helpPrivacyTerms: `${BASE_URL}/api/helpPrivacyTerms`,


};

export default Apis;