import React, {Component} from 'react';
import styled from 'styled-components';

import ItemThumbnail from './ItemThumbnail'

const Wrapper = styled.div`
    
`
const FrameBody = styled.div.attrs({
    className: 'item-card-body'
})`
    border-style: solid;
    border-width: 1px;
    border-color: black;
    margin: 5px 5px 5px 5px;
    cursor: pointer;
`
const CardTitle = styled.h1.attrs({
    className: 'item-card-title',
})`
    margin-left: 10px;
`

const CardDetails = styled.p.attrs({
    className: 'item-card-bottomtext',
})`
    margin-left: 10px;
    font-color: gray;
`



class ItemFrame extends Component {
    constructor(props) {
        super(props);

        const {_id, name, description, thumbnail_img} = this.props.itemDataFromParent;//this can be specified in the tag
        this.state = {
            id: _id,
            name: name,
            description: description,
            thumbnail_img: thumbnail_img,
        }
    }

    render() {
        const {id, name, description, thumbnail_img} = this.state;
        return(
            <Wrapper>
                <FrameBody>
                <ItemThumbnail item_id={id} item_img={thumbnail_img} />
                <CardTitle>{name}</CardTitle>
                <CardDetails>Id: {id}</CardDetails>
                </FrameBody>
            </Wrapper>
        );

    }
}


export default ItemFrame;