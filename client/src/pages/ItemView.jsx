import React, { Component } from 'react';
import styled from 'styled-components';
import ImageGallery from 'react-image-gallery';
import '../../node_modules/react-image-gallery/styles/css/image-gallery.css' // AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
import {ReviewView, ImageSlide} from '../components'

import api from '../api';

const Wrapper = styled.div`
`;

const Title = styled.h1.attrs({
    className: `Item-View-Title`,
})`
`
const DescriptionArea = styled.div``
const DescriptionText = styled.p``
const Button = styled.button.attrs({
    className: `btn btn-danger`
})``;

class ItemView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            name: '',
            description: '',
            reviews: [],
            thumbnail_img: '',
            gallery_images: [],
            isLoading: false,
        };
    }

    componentDidMount = async () => {
        this.setState({isLoading: true});
        
        
        api.getItemById(this.state.id).then( item => {
            let gallery_images = [];
            if (item.data.data.gallery_images) {
                gallery_images = item.data.data.gallery_images.map( img => ({original: img.path, thumbnail: img.path}) );
            }
    
            this.setState({
                name: item.data.data.name,
                description: item.data.data.description,
                reviews: item.data.data.reviews,
                thumbnail_img: item.data.data.thumbnail_img,
                gallery_images: gallery_images,
                isLoading: false,
            })
        })
    }

    render() {
        const {id, name, description, reviews, thumbnail_img, gallery_images} = this.state;
        const reviewsSection = reviews ? reviews.map( reviewId => {
            return <ReviewView id={reviewId}/>
        }) : [];
        return (
            <Wrapper>
                <Title>{name}</Title>
                <ImageSlide items={gallery_images} />
                <DescriptionArea>
                    <DescriptionText>{description}</DescriptionText>
                </DescriptionArea>
                <Button><a href={`/items/view/${id}/review`}>Post Review</a></Button>
                {reviewsSection}
            </Wrapper>
        )
    }
}

export default ItemView;