import { GET_PLANS, GET_USERPLANS, RESET_PLANS, GET_CARDS, UPDATE_PLANDETAIL, DELETE_CARD } from '../Types/actions_type';

let initialSate = {
    getPlans: [],
    userPlans: [],
    userCards: [],
    PlansRecords: false
};

const PaymentReducer = (state = initialSate, action) => {
    switch (action.type) {
        case GET_PLANS:
            state = { ...state, getPlans: action.payload };
            break;

        case GET_USERPLANS:
            state = { ...state, userPlans: action.payload };
            break;

        case GET_CARDS:
            state = { ...state, userCards: action.payload };
            break;

        case UPDATE_PLANDETAIL:
            state = { ...state, PlansRecords: action.payload };
            break;

        case DELETE_CARD:
            let getcards = [...state.userCards];

            let cardIndex = getcards.findIndex(item => item.id === action.payload);
            getcards.splice(cardIndex, 1);

            state = {
                ...state,
                userCards: getcards
            };

            break;

        case RESET_PLANS:
            state = {
                ...state,
                getPlans: [],
                userPlans: [],
            };
            break;

        default:
            break;
    }
    return state;
};

export default PaymentReducer;