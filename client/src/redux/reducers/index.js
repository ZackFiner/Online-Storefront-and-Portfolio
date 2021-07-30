import {combineReducers} from 'redux';
import accountRedu from './accountRedu';
import cartRedu from './cartRedu';

export default combineReducers({
    accountRedu,
    cartRedu
})