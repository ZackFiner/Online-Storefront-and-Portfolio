import {ADD_ITEM_CART, REMOVE_ITEM_CART, ERROR_CART, CLEAR_CART} from '../actions/cartAct';

const defaultState = {
    cartItems: []
}

const cart = (state = defaultState, action) => {
    switch(action.type) {
        case ADD_ITEM_CART:
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload]
            };
        case REMOVE_ITEM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item != action.payload)
            };
        case CLEAR_CART:
            return defaultState;
        case ERROR_CART:
        default:
            return state;
    }
}

export default cart;