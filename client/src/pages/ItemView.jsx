import React, { Component } from 'react';
import styled from 'styled-components';

import api from '../api';

const Wrapper = styled.div`
`;

const Title = styled.h1.attrs({
    className: `Item-View-Title`,
})`
`
const DescriptionArea = styled.div``
const DescriptionText = styled.p``

class ItemView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            name: '',
            description: '',
            reviews: [],
            thumbnail_img: '',

            isLoading: false,
        };
    }

    componentDidMount = async () => {
        this.setState({isLoading: true});

        api.getItemById(this.state.id).then( itemData => {
            this.setState({
                name: itemData.name,
                description: itemData.description,
                reviews: itemData.thumbnail_img,
                thumbnail_img: itemData.thumbnail_img,

                isLoading: false,
            })
        })
    }

    render() {
        const {name, description, reviews, thumbnail_img} = this.state;
        return (
            <Wrapper>
                <Title>{name}</Title>
                <DescriptionArea>
                    <DescriptionText>{description}</DescriptionText>
                </DescriptionArea>
            </Wrapper>
        )
    }
}

export default ItemView;