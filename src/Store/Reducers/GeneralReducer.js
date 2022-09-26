import { SHOW_LOADING, HIDE_LOADING, TOKEN_DETAILS, TERMS } from '../Types/actions_type';

let initialSate = {
    isloading: false,
    tokenData: null,
    isTerms: false
};

const GeneralReducer = (state = initialSate, action) => {
    switch (action.type) {
        case SHOW_LOADING:
            state = { ...state, isloading: true };
            break;

        case HIDE_LOADING:
            state = { ...state, isloading: false };
            break;

        case TOKEN_DETAILS:
            state = { ...state, tokenData: action.payload };
            break;
        case TERMS:
            state = { ...state, isTerms: action.payload };
            break;

        default:
            break;
    }
    return state;
};

export default GeneralReducer;