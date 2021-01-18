import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {isMemberofRole} from '../authorization';

// Spelling error bellow with 'collpase?
const Collapse = styled.div.attrs({
    className: 'collapse navbar-collapse',
})``

const List = styled.div.attrs({
    className:  'navbar-nav mr-auto',
})``

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse'
})``

class Links extends Component {
    render() {
        const {userdata, loggedin} = this.props;
        let link_items = null;
        if (isMemberofRole(userdata, 'admin')) {
            link_items = (<List>
                <Item>
                    <Link to="/items/list" className="nav-link">
                        List Items
                    </Link>
                </Item>
                <Item>
                    <Link to="/items/create" className="nav-link">
                        Post Item
                    </Link>
                </Item>
                <Item>
                    <Link to="/items/update/:id" className="nav-link">
                        Update Item
                    </Link>
                </Item>
            </List>);
        }
        return (
            <React.Fragment>
                <Link to="/" className="navbar-brand">
                    Boilerplate MERN App
                </Link>
                <Collapse>
                    {link_items}
                </Collapse>
            </React.Fragment>
        );
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
    null
)(Links)