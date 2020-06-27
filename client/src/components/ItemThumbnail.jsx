import React, { Component } from 'react';
import styled from 'styled-components';

import placeholder_thumb from '../assets/placeholder.png'

const ThumbnailContainer = styled.img`
`

class ItemThumbnail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item_id: this.props.itemId,
            item_img: this.props.itemImg,
        }
    }

    render() {
        const {item_img} = this.state;
        return <ThumbnailContainer src={item_img ? item_img : placeholder_thumb} alt="Missing Thumbnail" width="300" Height="180" />
    }
}
export default ItemThumbnail;