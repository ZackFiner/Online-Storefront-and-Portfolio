import {LOAD_ACCOUNT, FREE_ACCOUNT, ERROR_ACCOUNT, REFRESH_ACCOUNT} from '../actions/accountAct';
// Reducers should be pure functions: don't modify state and return EVER
// Note: this means you need to be careful when returning certain JSON objects
// you can use the spread operator to deep copy json objects i.e. const stateCopy = { ...defaultState };
const defaultState = {
    userdata: {},
    loggedin: false,
    last_refresh: 0,
    refresh_timer: -1,
};

const accounts = (state = defaultState, action) => {
    switch(action.type) {
        case LOAD_ACCOUNT:
            return {
                ... state,
                userdata: {... action.payload},
                loggedin: true,
                last_refresh: Date.now(),
                refresh_timer: action.timerId,
            };
        case FREE_ACCOUNT:
            return {
                ... state,
                userdata: {},
                loggedin: false,
                last_refresh: 0,
                refresh_timer: -1
            };
        case REFRESH_ACCOUNT:
            return {
                ...state,
                last_refresh: Date.now(),
            }
        case ERROR_ACCOUNT:
        default:
            return { ...state }
    }
}

export default accounts;