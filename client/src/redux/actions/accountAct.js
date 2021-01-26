import api from '../../api';
export const LOAD_ACCOUNT = 'LOAD_ACCOUNT';
export const FREE_ACCOUNT = 'FREE_ACCOUNT';
export const ERROR_ACCOUNT = 'ERROR_ACCOUNT';
export const REFRESH_ACCOUNT = 'REFRESH_ACCOUNT';

// so apparently redux requires higher level functions
// loadAccount is a higher level function, as it accepts an account_id and returns a function
// which accepts an asynchronus function called dispatch
// (a higher level function which creates a function that accepts a function)
// THIS IS HOW ASYNCHRONUS ACTIONS ARE ACCOMPLISHED IN REDUX
/*export const loadAccount = account_id =>  {
    return async (dispatch) => {
        // do some account loading stuff here
        dispatch({type: LOAD_ACCOUNT ,account_id}) // note that async is a paremeter for this function 
        // here, we are passing the action into it as a json
    }
}


export const loadAccount = userdata => { return {
    type: LOAD_ACCOUNT,
    payload: userdata
}}*/

export const refreshAccount = () => dispatch => {
    api.refreshUserToken() // this will only work if our token is still valid
    .then( res => {
        if (res.status === 200) {
            const timerId = setTimeout(()=>{dispatch(refreshAccount())}, 5*60*1000);
            dispatch({type: REFRESH_ACCOUNT, timerId}); // notify our store that the account was refreshed
        } else {
           const error = new Error(res.error);
            throw error;
        }
    })
    .catch( err => {
        dispatch({type: ERROR_ACCOUNT, payload: err});
        dispatch(freeAccount()); // if the token couldn't be refreshed, notify the user that their session has ended
    });
}

export const loadAccount = (payload, history) => dispatch => {
    api.authUser(payload)
    .then( res => {
        if (res.status === 200 ) {
            const topdoc = this;
            api.getUserData().then(res => {
                if (res.status === 200) {
                    const store_payload = res.data;
                    const timerId = setTimeout(()=>{dispatch(refreshAccount())}, 5*60*1000); // refresh the token every 5 mins
                    dispatch({ type: LOAD_ACCOUNT, payload: store_payload, timerId});
                    history.push('/');
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
        } else {
            const error = new Error(res.error);
            throw error;
        }
    })
    .catch( err => {
        dispatch({type: ERROR_ACCOUNT, payload: err});
    })
}

export const freeAccount = (history) => (dispatch, getState) => {
    api.logUserOut() // this should delete the authentication cookie
    .then( res => {
        if (res.status === 200) {
            clearTimeout(getState().accountRedu.refresh_timer); // clear the refresh timer
            dispatch({type: FREE_ACCOUNT,}); // remove the retrieved client info from the store
            history.push('/');
        } else {
            const error = new Error(res.error);
            throw error;
        }
    })
    .catch( err => {
        dispatch({type: ERROR_ACCOUNT, payload: err});
    })
}

// actions are where you collect and package information for reducers, reducers are what actually manage
// the data thats in the store