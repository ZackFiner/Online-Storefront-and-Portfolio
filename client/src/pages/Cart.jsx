import React, {Component} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {removeItemFromCart} from '../redux/actions/cartAct';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: props.cartItems,
        }
    }

    componentDidUpdate = (prevProps) => {
        const props = this.props;
        if (props.cartItems != prevProps.cartItems) {
            this.setState({
                items: prevProps.cartItems
            });
        }
    }

    render() {
        return <div/>
    }
}

const mapStateToProps = state => {
    const payload = state.cartRedu;
    return {
        cartItems: payload.cartItems
    }
}

export default connect(
    mapStateToProps,
    {removeItemFromCart}
)(Cart);