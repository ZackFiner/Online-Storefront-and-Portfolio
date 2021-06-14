import React, {Component} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

import ItemThumbnail from './ItemThumbnail'

const Card = styled.div.attrs({
    className: 'card item-card'
})`
    margin: 1rem;
    border-radius: 0 0 0.25rem 0.25rem;
    &:hover .item-card-title {
        text-decoration: underline;
    }
`
const FrameBody = styled.div.attrs({
    className: 'item-card-body card-body'
})`
    margin: 5px 5px 5px 5px;
    cursor: pointer;

`
const CardTitle = styled.h5.attrs({
    className: 'item-card-title card-title',
})`
    margin-left: 10px;
`

const CardDetails = styled.p.attrs({
    className: 'item-card-bottomtext card-text',
})`
    margin-left: 10px;
    font-color: gray;
    text-style: none;
`
const CardPrice = styled.h6.attrs({
    className: 'item-card-bottomtext card-text',
})`
    margin-left: 10px;
    font-color: gray;
    text-style: none;
`

const CardLink =  styled.a.attrs({
    className: 'item-card-content-link'
})`
    &,&:hover,&:visited {
        text-decoration: inherit;
        color: inherit;
    }
    &:hover .item-card-img {
        transform: scale(1.2,1.2) translate(0%, calc(-50% / 1.2));
    }
`

class ItemFrame extends Component {
    constructor(props) {
        super(props);

        const {_id, name, description, thumbnail_img, keywords, price} = this.props.itemDataFromParent;//this can be specified in the tag
        this.state = {
            id: _id,
            name: name,
            description: description,
            thumbnail_img: thumbnail_img,
            keywords,
            price,
        }
    }

    render() {
        const {id, name, description, thumbnail_img, keywords, price} = this.state;
        const price_text = price ? `$${price.$numberDecimal}`: "Not for Sale" 
        const keyword_text = keywords && keywords.length ? keywords.join(', '): 'none'; 
        return(
            
            <Card>
                <CardLink href={`/items/view/${id}`}>
                <ItemThumbnail item_id={id} item_img={thumbnail_img} />
                <FrameBody>
                
                <CardTitle>{name}</CardTitle>
                <CardPrice>Price: {price_text}</CardPrice>
                <CardDetails>Keywords: {keyword_text}</CardDetails>
                </FrameBody>
                </CardLink>
            </Card>
        );

    }
}


export default ItemFrame;