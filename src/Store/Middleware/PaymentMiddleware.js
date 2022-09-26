import Axios from 'axios';
import LoadingAction from '../Actions/LoadingAction'
import PaymentAction from '../Actions/PaymentAction'
import AuthAction from '../Actions/AuthAction';
import Apis from '../Apis';
import { getHeaders } from '../../Utils'
import Storage from '../../Utils/AsyncStorage'



class PaymentMiddleware {

    static getPlanList = () => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    const { data } = await Axios.get(
                        Apis.getAllPackages,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(PaymentAction.getPlanList(data?.data))
                        resolve(data.data)
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static getUserPlanList = () => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    const { data } = await Axios.get(
                        Apis.getUserPlans,
                        await getHeaders(),
                    );
                    console.log(data)
                    if (data?.success) {
                        dispatch(PaymentAction.getUserPlanList(data?.data))
                        resolve(data.data)
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static getUserCards = () => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    const { data } = await Axios.get(
                        Apis.userCard,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(PaymentAction.getCards(data?.data))
                        resolve(data.data)
                    }
                } catch (error) {
                    reject(error);
                    alert('Network Error');
                }
            });
        };
    };

    static addCard = ({ name, cardnumber, exp_date, cvv }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formdata = new FormData()
                    formdata.append('name', name)
                    formdata.append('card_number', cardnumber)
                    formdata.append('exp_date', exp_date)
                    formdata.append('cvc', cvv)

                    const { data } = await Axios.post(
                        Apis.addCard,
                        formdata,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        dispatch(PaymentMiddleware.getUserCards())
                        resolve(data)
                    } else {
                        dispatch(LoadingAction.HideLoading())
                        resolve(data)
                    }
                } catch (error) {
                    reject(error);
                    dispatch(LoadingAction.HideLoading())

                    alert('Network Error');
                }
            });
        };
    };

    static SubscribePlan = ({ plan_id, payment_id, price }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formdata = new FormData()
                    formdata.append('plan_id', plan_id)
                    formdata.append('price', price)
                    formdata.append('payment_method_id', payment_id)

                    const { data } = await Axios.post(
                        Apis.subscribe,
                        formdata,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        await Storage.set('@user', JSON.stringify(data.data));
                        dispatch(AuthAction.getUserData(data.data))
                        resolve(data)
                    } else {
                        dispatch(LoadingAction.HideLoading())
                        resolve(data)
                    }
                } catch (error) {
                    reject(error);
                    dispatch(LoadingAction.HideLoading())

                    alert('Network Error');
                }
            });
        };
    };

    static deleteCard = ({ stripe_id, id }) => {
        return dispatch => {
            dispatch(LoadingAction.ShowLoading())
            return new Promise(async (resolve, reject) => {
                try {
                    let formdata = new FormData()
                    formdata.append('stripe_source_id', stripe_id)

                    const { data } = await Axios.post(
                        Apis.deleteCard,
                        formdata,
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(LoadingAction.HideLoading())
                        dispatch(PaymentAction.deleteCard(id))
                        resolve(data)
                    } else {
                        dispatch(LoadingAction.HideLoading())
                        resolve(data)
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

export default PaymentMiddleware;