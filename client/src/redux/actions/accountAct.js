export const LOAD_ACCOUNT = 'LOAD_ACCOUNT';
export const FREE_ACCOUNT = 'FREE_ACCOUNT';

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
}*/


export const loadAccount = userdata => { return {
    type: LOAD_ACCOUNT,
    payload: userdata
}}

export const freeAccount = () => {return {
    type: FREE_ACCOUNT,
}}


// actions are where you collect and package information for reducers, reducers are what actually manage
// the data thats in the store