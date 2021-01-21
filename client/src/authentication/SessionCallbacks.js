import store from '../redux/store';
import {refreshAccount, freeAccount} from '../redux/actions/accountAct';

const SessionRefresh = () => {
    if (store.getState().loggedin)
        store.dispatch(refreshAccount());
};

const LogoutUser = () => {
    if (store.getState().loggedin)
        store.dispatch(freeAccount());
}

export {SessionRefresh, LogoutUser};