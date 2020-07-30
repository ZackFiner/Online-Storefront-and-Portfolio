import {LOAD_ACCOUNT, FREE_ACCOUNT} from '../actions/accountAct';
// Reducers should be pure functions: don't modify state and return EVER
// Note: this means you need to be careful when returning certain JSON objects
// you can use the spread operator to deep copy json objects i.e. const stateCopy = { ...defaultState };
const defaultState = {
    userdata: {},
    loggedin: false,
};

const accounts = (state = defaultState, action) => {
    switch(action.type) {
        case LOAD_ACCOUNT:
            return {
                ... state,
                userdata: {... action.userdata},
                loggedin: true,
            };
        case FREE_ACCOUNT:
            return {
                ... state,
                userdata: {},
                loggedin: false,
            };
        default:
            return state
    }
}

export default accounts;