import React, {Component} from 'react';
import styled from "styled-components";
import { StyledComponents } from "../components";

// simple display which lists the items in the order

const Wrapper = styled.div`
`

const BreakoutList = styled.ul.attrs(props => ({
}))`

list-style-type: none;
margin: 30px;
& > li {
    font-size: 24px;
}

& .cart-list-details {
    font-size: 12px;
    list-style-type: none;
}
`
const BreakoutListItem = props => (<li class="cart-list-item">
        {props.item.name}
        <ul class="cart-list-details">
            <li class="cart-list-detail">Price: ${props.item.price}</li>
            <li class="cart-list-detail">Qty: {props.item.qty}</li>
        </ul>
    </li>)

class OrderBreakout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: props.items
        }
    }

    render() {
        const {items} = this.state;
        const breakout = items.map(item => <BreakoutListItem item={item}></BreakoutListItem>)
        return <Wrapper><BreakoutList>{breakout}</BreakoutList></Wrapper>;
    }
}

export default OrderBreakout;