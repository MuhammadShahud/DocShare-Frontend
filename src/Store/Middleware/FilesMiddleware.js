import Axios from 'axios';
import Apis from '../Apis';
import FilesAction from '../Actions/FilesAction'
import LoadingAction from '../Actions/LoadingAction'
import { getHeaders, platform } from '../../Utils'
import RNFetchBlob from 'rn-fetch-blob';

class FilesMiddleware {
    static getFiles = ({ next_page_url }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    if (next_page_url == undefined) {
                        dispatch(FilesAction.resetFiles())
                    }
                    const { data } = await Axios.get(
                        Apis.getDocuments(next_page_url),
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(FilesAction.getFiles(data?.data))
                        resolve(data.data)
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static setPasscode = ({ id, passcode }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('id', id)
                    formData.append('passcode', passcode)
                    const { data } = await Axios.post(
                        Apis.setPasscode,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())

                        dispatch(FilesMiddleware.getFiles({ next_page_url: undefined }))
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

    static deleteFile = ({ id }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('document_id', id)

                    const { data } = await Axios.post(
                        Apis.deleteFile,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        dispatch(FilesAction.deleteFile(id))
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

    static DownloadAttachment = ({ selectedItem, }) => {
        let dirs = RNFetchBlob.fs.dirs
        return async dispatch => {
            let headers = (await getHeaders()).headers
            await RNFetchBlob
                .config({
                    timeout: 60 * 60,
                    fileCache: true,
                    path: dirs.DownloadDir + '/' + selectedItem,
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        // mime: 'application/pdf',
                        title: selectedItem.name,
                        path: platform.OS == 'ios' ? dirs.DocumentDir + '/' + selectedItem.name : dirs.DownloadDir + '/' + selectedItem.name,
                    },
                })
                .fetch("GET", selectedItem.url,
                    headers,
                )
                .then((res) => {
                    platform.OS == 'ios' ? RNFetchBlob.ios.openDocument(res.data)
                        :
                        null;

                }).catch((err) => {
                    console.warn(err);
                })

        };
    };

    static exportAnnotations = ({ id, string, annotation, tag }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('id', id)
                    formData.append('string', string)
                    for (const [i, item] of annotation.entries()) {
                        formData.append('annotation[id]', item.id)
                        formData.append('annotation[pageNumber]', item.pageNumber)
                        formData.append('annotation[type]', item.type)

                    }
                    formData.append('tag', tag)
                    const { data } = await Axios.post(
                        Apis.exportAnnotations,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        resolve(data.data)
                    } else {
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static getComments = ({ id, next_page_url }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    if (next_page_url == undefined) {
                        dispatch(FilesAction.resetComments())
                    }
                    let formdata = new FormData();
                    formdata.append('document_id', id)
                    const { data } = await Axios.post(
                        Apis.getComments(next_page_url),
                        formdata,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(FilesAction.getComments(data?.data))
                        resolve(data.data)
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static addComment = ({ id, user_id, comment }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formdata = new FormData();
                    formdata.append('document_id', id)
                    formdata.append('user_id', user_id)
                    formdata.append('comment', comment)
                    const { data } = await Axios.post(
                        Apis.addComment,
                        formdata,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(FilesAction.updateComments(data?.data))
                        resolve(data.data)
                        dispatch(LoadingAction.HideLoading())
                    } else {
                        dispatch(LoadingAction.HideLoading())
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static deleteComment = ({ id }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formdata = new FormData();
                    formdata.append('comment_id', id)
                    const { data } = await Axios.post(
                        Apis.deleteComment,
                        formdata,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(FilesAction.deleteComments(id))
                        resolve(data.data)
                        dispatch(LoadingAction.HideLoading())
                    } else {
                        dispatch(LoadingAction.HideLoading())
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                    dispatch(LoadingAction.HideLoading())

                }
            });
        };
    };

    static shareDocument = ({ document_id, type, to }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('document_id', document_id)
                    formData.append('type', type)
                    formData.append('to', to)

                    const { data } = await Axios.post(
                        Apis.shareDocument,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())

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
    }
    static openDocument = ({ document_id, key }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('document_id', document_id)
                    formData.append('key', key)
                    const { data } = await Axios.post(
                        Apis.openDocument,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())

                        resolve(data)
                    } else {
                        resolve(data)

                        dispatch(LoadingAction.HideLoading())

                    }
                } catch (error) {
                    reject(error);
                    dispatch(LoadingAction.HideLoading())

                    alert('Network Error');
                }
            });
        };
    }
    static updateDocument = ({ document_id, document }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('id', document_id)
                    formData.append('document', document)
                    console.log(document_id , document)
                    const { data } = await Axios.post(
                        Apis.updateDocument,
                        formData,
                        await getHeaders(),
                    );
                    console.log(data)
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        resolve(data)
                    } else {
                        resolve(data)
                        dispatch(LoadingAction.HideLoading())

                    }
                } catch (error) {
                    reject(error);
                    dispatch(LoadingAction.HideLoading())

                    alert('Network Error');
                }
            });
        };
    }

}

export default FilesMiddleware;