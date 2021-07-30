import React, {Components} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {addItemToCart} from '../redux/actions/cartAct';

class CartAddButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemTarget : props.item
        }        
    }

    onPress = async (event) => {
        const {itemTarget} = this.state;
        this.props.addItemToCart(itemTarget);
    }

    render() {
        return <div/>
    }
}

const mapStateToProps = (state) => {
    const payload = state.cartRedu;
    return {
        cartItems : payload.cartItems,
    };
}

export default connect(
    mapStateToProps,
    {addItemToCart}
)(CartAddButton);