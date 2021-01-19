import React, { Component } from 'react';
import {Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {hasRole} from '../authorization';

/*
    This is a wrapper component for routes that checks to see whether users are authorized
    to view the page.
*/
class AuthorizedRoute extends Route {
    render() {
        const allowed_roles = this.props.roles;
        const {loggedin, userdata} = this.props;
        if (loggedin) {
            if (hasRole(userdata, allowed_roles)) {// render the component
                return super.render();
            } else {// Tell the user they don't have access to that page
                return <div><h1>Access Denied</h1>
                <p>Sorry, but this section of the website is off-limits</p></div>
            }
        } else {// redirect them to the login page
            return <Redirect to={{pathname: '/login'}}/>;
        }
    }
}

const mapStateToProps = state => {
    const payload = state.accountRedu;
    return {
        userdata: payload.userdata,
        loggedin: payload.loggedin,
    };
};

export default connect(
    mapStateToProps, 
    null
)(AuthorizedRoute);