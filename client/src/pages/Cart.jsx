import React, {Component} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {removeItemFromCart} from '../redux/actions/cartAct';

const Wrapper = styled.div`

    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
`;

const CartTable = styled.table.attrs(props => ({
    ...props,
    className: 'table'
}))`
`;

const DeleteButton = styled.button.attrs(props => ({
    ...props,
    className: 'btn btn-danger'
}))`

`

const CheckoutButton = styled.a.attrs(props => ({
    ...props,
    className: 'btn btn-primary'
}))``;

const CartItem = (props) => {
    const {name, price, qty} =  props.item;
    return (<tr>
        <td>{name}</td>
        <td>${price["$numberDecimal"]}</td>
        <td>{qty}</td>
        <td><DeleteButton onClick={props.removeCallback}>X</DeleteButton></td>
    </tr>);
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
        const cartItemRows = this.state.items.map(item => {return <CartItem item={{...item, qty: 1}} removeCallback={this.removeItem(item)}/>});
        return (<Wrapper>
            <h1>Cart</h1>
            <CartTable>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                </tr>
                {cartItemRows}
            </CartTable>
            <CheckoutButton href="/storefront/checkout">Checkout</CheckoutButton>
        </Wrapper>);
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