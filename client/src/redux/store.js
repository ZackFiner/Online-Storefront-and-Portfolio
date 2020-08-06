import { configureStore } from '@reduxjs/toolkit';
import { createStore } from 'redux';
import reducer from './reducers'
 // state is perserved between page refreshes via local storage, 
 // which i feel kind of defeats the point of using redux


 function saveToLocalStorage(state) {
    try {
        const stringifiedState = JSON.stringify(state);
        localStorage.setItem('state', stringifiedState);
    } catch (e) {
        console.log(e);
    }
 }

function loadFromLocalStorage() {
    try {
        const stringifiedState = localStorage.getItem('state');
        if (stringifiedState == null) return undefined;
        return JSON.parse(stringifiedState);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}
const persistedState = loadFromLocalStorage();
const store = createStore(
    reducer,
    persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.subscribe(() => saveToLocalStorage(store.getState()));
 //export default configureStore({reducer});

 export default store;