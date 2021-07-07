import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import { freeAccount } from '../redux/actions/accountAct'
import { connect } from 'react-redux';
import {isMemberofRole} from '../authorization';

const Wrapper = styled.div.attrs({
    className: 'login-indicator-wrp nav-link',
})`
`
const NavLink = styled.a.attrs({
    className: 'nav-link'
})`
    text-decoration: none;
    color: black;

    &:hover {
        color: black;
        background-color: #dfdfdf;
    }
`

const Dropdown = styled.div.attrs({
    className: 'simple-dropdown'
})`
    position:relative;
    display: inline-block;
    min-width: 160px;
    text-align: center;
    &:hover .dropdown-content {
        display:block;
    }

    &:hover {
        cursor: pointer;
    }

    &>span {
        color: lightgray;
    }
`


const DropdownContent =  styled.div.attrs({
    className: 'dropdown-content'
})`
    background-color: #efefef;
    position:absolute;
    display:none;
    width: 100%;
    z-index: 1;
`


class LoginIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {/**/};
    }

    handleLogout = (event) => {
        event.preventDefault();
        this.props.freeAccount(this.props.history);
    }

    render() {
        const {loggedin, userdata} = this.props;

        let creator_items = null;
        if (isMemberofRole(userdata, 'ROLE_ADMIN'))
            creator_items = [
                <NavLink href="/items/list">List Items</NavLink>, 
                <NavLink href="/items/create">Post Item</NavLink>
            ];
        if (!loggedin) {
            return (
                    [<Link to={'/login'} className='nav-link'>Login</Link>,
                    <Link to={'/createAccount'} className='nav-link'>Create Account</Link>]
            )
        } else {
            return (
                <Dropdown>
                    <span>{userdata.email}</span>
                    <DropdownContent>
                        {creator_items}
                        <NavLink onClick={this.handleLogout}>Logout</NavLink>
                    </DropdownContent>
                </Dropdown>
            )
        }
    }
}

const mapStateToProps = state => {
    const payload = state.accountRedu;
    return {
        userdata: payload.userdata,
        loggedin: payload.loggedin,
    };
}

export default connect(
    mapStateToProps,
    { freeAccount }
)(LoginIndicator);