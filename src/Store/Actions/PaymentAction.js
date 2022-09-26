import { GET_PLANS, RESET_PLANS, GET_USERPLANS, GET_CARDS, UPDATE_PLANDETAIL, DELETE_CARD } from '../Types/actions_type';

class PaymentAction {

    static getPlanList = payload => {
        return {
            type: GET_PLANS,
            payload: payload,
        };
    };
    static getUserPlanList = payload => {
        return {
            type: GET_USERPLANS,
            payload: payload,
        };
    };
    static getCards = payload => {
        return {
            type: GET_CARDS,
            payload: payload,
        };
    };
    static updatePlan = payload => {
        return {
            type: UPDATE_PLANDETAIL,
            payload: payload,
        };
    };
    static deleteCard = payload => {
        return {
            type: DELETE_CARD,
            payload: payload,
        };
    };
    static resetPlans = () => {
        return {
            type: RESET_PLANS,
        };
    };
}

export default PaymentAction;