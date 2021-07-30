import React, {Component} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {removeItemFromCart} from '../redux/actions/cartAct';

const CartItem = (props) => {
    const {name, price, qty} =  props.item;
    return <tr><td>{name}</td><td>${price["$numberDecimal"]}</td><td>{1}</td><td><button onClick={props.removeCallback}>Remove</button></td></tr>
}

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
                items: props.cartItems
            });
        }
    }

    removeItem = (item) => () => {
        this.props.removeItemFromCart(item);
    }

    render() {
        const cartItemRows = this.state.items.map(item => {return <CartItem item={item} removeCallback={this.removeItem(item)}/>});
        return <table><tr><th>Name</th><th>Price</th><th>Quantity</th></tr>{cartItemRows}</table>
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