import React, { Component } from 'react';
import styled from 'styled-components';

import placeholder_thumb from '../assets/placeholder.png'

const ThumbnailContainer = styled.div.attrs({})`
    text-align: center;
    min-height: 300px;
    background-color: black;
    position: relative;
    overflow: hidden;
`

const ThumbnailImage = styled.img.attrs(props => ({
    ...props,
    className: 'card-img-top item-card-img'
}))`
    margin: auto;
    max-height: 300px;
    object-fit: cover;
    position: absolute;
    border-radius: 0;
    top: 50%;
    left: 0%;
    transform: translate(0%, -50%);
    transition: all .3s;
`
const ThumbnailFlexor = styled.div.attrs({})`
    max-height: 300px;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;

    &:hover {
        transform: scale(2,2);
    }

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
        return <ThumbnailContainer><ThumbnailImage src={item_img ? item_img.path : placeholder_thumb} alt="Missing Thumbnail" width="300" Height="180" /></ThumbnailContainer>
    }
}
export default ItemThumbnail;