import React, { Component } from 'react';
import styled from 'styled-components';

import placeholder_thumb from '../assets/placeholder.png'

const ThumbnailContainer = styled.img`
    margin: auto;
`
const ThumbnailFlexor = styled.div`
    min-width: 300px;
    min-height: 180px;
    background-color: lightgray;
`

class ItemThumbnail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item_id: this.props.item_id,
            item_img: this.props.item_img,
        }
    }

    render() {
        const {item_img} = this.state;
        return <ThumbnailFlexor><ThumbnailContainer src={item_img ? item_img.path : placeholder_thumb} alt="Missing Thumbnail" width="300" Height="180" /></ThumbnailFlexor>
    }
}
export default ItemThumbnail;