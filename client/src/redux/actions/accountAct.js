import api from '../../api'

export const LOAD_ACCOUNT = 'LOAD_ACCOUNT';
export const FREE_ACCOUNT = 'FREE_ACCOUNT';
export const ERROR_ACCOUNT = 'ERROR_ACCOUNT';

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

export const loadAccount = (payload, history) => dispatch => {
    api.authUser(payload)
    .then( res => {
        if (res.status === 200 ) {
            const topdoc = this;
            api.getUserData().then(res => {
                if (res.status === 200) {
                    const store_payload = res.data;
                    dispatch({ type: LOAD_ACCOUNT, payload: store_payload});
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

export const freeAccount = () => dispatch => {
    api.logUserOut() // this should delete the authentication cookie
    .then( res => {
        if (res.status === 200) {
            dispatch({type: FREE_ACCOUNT,}); // remove the retrieved client info from the store
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