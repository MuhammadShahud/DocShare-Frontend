import Axios from 'axios';
import Apis from '../Apis';
import { getHeaders } from '../../Utils'
import LoadingAction from '../Actions/LoadingAction';

class HelpPrivacyTermsMiddleware {

    static getHelpPrivacyTerms = () => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    const { data } = await Axios.get(
                        Apis.helpPrivacyTerms,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        resolve(data.data)
                        dispatch(LoadingAction.HideLoading())
                    }
                    else{
                        dispatch(LoadingAction.HideLoading())
                    }
                } catch (error) {
                    reject(error)
                    alert("Network Error")
                    dispatch(LoadingAction.HideLoading())
                }

            })
        }
    }
    
}

export default HelpPrivacyTermsMiddleware;