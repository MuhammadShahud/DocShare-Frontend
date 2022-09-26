import Axios from 'axios';
import LoadingAction from '../Actions/LoadingAction'
import ChatAction from '../Actions/ChatAction'
import Apis from '../Apis';
import { getHeaders } from '../../Utils'

class VideoMiddleware {

    static generateToken = ({ id, is_group, dataString }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    console.log(id, is_group)
                    let formData = new FormData();
                    formData.append('id', id)
                    formData.append('is_group', is_group)
                    formData.append('dataString', dataString)
                    const { data } = await Axios.post(
                        Apis.generateToken,
                        formData,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        dispatch(ChatAction.tokenDetail(data.data))
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

    static declineCall = ({ id, is_group }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('id', id)
                    formData.append('is_group', is_group)
                    const { data } = await Axios.post(
                        Apis.declineCall,
                        formData,
                        await getHeaders(),
                    );
                    console.log(formData)
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

}

export default VideoMiddleware;