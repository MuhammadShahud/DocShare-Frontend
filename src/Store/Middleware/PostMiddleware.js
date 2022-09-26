import Axios from 'axios';
import PostAction from '../Actions/PostAction'
import LoadingAction from '../Actions/LoadingAction'
import FilesMiddleware from '../../Store/Middleware/FilesMiddleware'
import Apis from '../Apis';
import { getHeaders } from '../../Utils'


class PostMiddleware {

    static getPost = ({ next_page_url }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    if (next_page_url == undefined) {
                        dispatch(PostAction.resetPost())
                    }
                    const { data } = await Axios.get(
                        Apis.getPost(next_page_url),
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(PostAction.getPost(data?.data))
                        resolve(data.data)
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static storePost = ({ title, description, documents, friends }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('title', title)
                    formData.append('description', description)
                    for (const [i, document] of documents.entries()) {
                        if (document.file_code == 1) {
                            formData.append('documents[][type]', 'image');
                            formData.append('documents[][document]', document);
                        } else {
                            formData.append('documents[][type]', 'document');
                            formData.append('documents[][document]', document);
                        }
                    }
                    if (friends.length > 0) {
                        for (const [i, friend] of friends.entries()) {
                            formData.append('tagFriends[]', friend.id)
                        }
                    }

                    const { data } = await Axios.post(
                        Apis.storePost,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        dispatch(PostMiddleware.getPost({ next_page_url: undefined }))
                        resolve(data.data)
                    } else {
                        dispatch(LoadingAction.HideLoading())
                    }
                } catch (error) {
                    reject(error);
                    dispatch(LoadingAction.HideLoading())
                    alert('Network Error');
                }
            });
        };
    };

    static deletePost = ({ id }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('post_id', id)
                    const { data } = await Axios.post(
                        Apis.deletePost,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        dispatch(FilesMiddleware.getFiles({ next_page_url: undefined }))
                        dispatch(PostAction.deletePost(id))
                        resolve(data.data)
                    } else {
                        dispatch(LoadingAction.HideLoading())
                    }
                } catch (error) {
                    reject(error);
                    dispatch(LoadingAction.HideLoading())
                    alert('Network Error');
                }
            });
        };
    };

}

export default PostMiddleware;