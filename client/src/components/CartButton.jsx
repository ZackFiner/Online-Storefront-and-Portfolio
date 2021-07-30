import React, {Component} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {addItemToCart} from '../redux/actions/cartAct';

const Button = styled.button.attrs(props => ({
    ...props,
    type: "button",
    className: "btn btn-primary",
}))`
`

class CartAddButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemTarget : props.item
        }        
    }

    onClick = async (event) => {
        const {itemTarget} = this.state;
        this.props.addItemToCart(itemTarget);
    }

    componentDidUpdate = (prevProps) => {
        const props = this.props;
        if (props.item != prevProps.item) {
            this.setState({
                itemTarget: props.item,
            });
        }
    }

    render() {
        return <Button onClick={this.onClick}>Add to Cart</Button>
    }
}
/*
const mapStateToProps = (state) => {
    const payload = state.cartRedu;
    return {
        cartItems : payload.cartItems,
    };
}*/

export default connect(
    null,
    {addItemToCart}
)(CartAddButton);