import { SHOW_LOADING, HIDE_LOADING } from '../Types/actions_type';

class LoadingAction {
    static ShowLoading = () => {
        return {
            type: SHOW_LOADING,
        };
    };
    static HideLoading = () => {
        return {
            type: HIDE_LOADING,
        };
    };

}

export default LoadingAction;