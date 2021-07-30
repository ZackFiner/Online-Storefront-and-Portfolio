export const ADD_ITEM_CART = "ADD_ITEM_CART";
export const REMOVE_ITEM_CART = "REMOVE_ITEM_CART";
export const ERROR_CART = "ERROR_CART";
export const CLEAR_CART = "CLEAR_CART";

export const addItemToCart = (item) => dispatch => {
    dispatch({
        type: ADD_ITEM_CART,
        payload: item
    });
}

export const removeItemFromCart = (item) => dispatch => {
    dispatch({
        type: REMOVE_ITEM_CART,
        payload: item
    })
}

export const clearCart = () => dispatch => {
    dispatch({
        type: CLEAR_CART
    })
}