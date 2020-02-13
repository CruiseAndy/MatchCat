
import { LANGUAGE_CHANGE } from '../actions/types';

const INITIAL_STATE = { langCountry : "CN" };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LANGUAGE_CHANGE:
            return { ...state, langCountry: action.country };
        default:
            return state;
    }
}