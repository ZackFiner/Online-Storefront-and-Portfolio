import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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
        return (
            <React.Fragment>
                <Link to="/" className="navbar-brand">
                    Boilerplate MERN App
                </Link>
                <Collapse>
                    <List>
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
                    </List>
                </Collapse>
            </React.Fragment>
        );
    }
}

export default Links