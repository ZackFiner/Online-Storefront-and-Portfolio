import React, { Component } from 'react';
import styled from 'styled-components';
import {ReviewView, ImageSlide, PayPalGateway} from '../components'

import {connect} from 'react-redux'
import {isMemberofRole} from '../authorization'
import api from '../api';

const Wrapper = styled.div.attrs({
})`
    margin: 1rem;
    margin-top: 2rem;
    margin-bottom: 0;
`;

const Title = styled.h1.attrs({
    className: `Item-View-Title`,
})`
`
const ItemDetailsArea = styled.div.attrs({
    className: 'col col-sm-4'
})`
    border-radius: 5px 0px 0px 5px;
    background-color: #cfcfcf;
    padding: 2rem;
`
const RowWrapper = styled.div.attrs({
    className: 'row'
})`
`

const DescriptionArea = styled.div``
const DescriptionText = styled.div``
const Button = styled.button.attrs({
    className: `btn btn-danger`
})`
    & a,& a:hover,& a:visited{
        color: white;
        text-decoration: none;
    }
`;

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
                price: item.data.data.price,
                keywords: item.data.data.keywords,
                gallery_images: gallery_images,
                isLoading: false,
            })
        })
    }

    render() {
        const {loggedin, userdata} = this.props;

        const {id, name, description, reviews, thumbnail_img, gallery_images, price, keywords} = this.state;
        const price_text = price ? `$${price.$numberDecimal}` : 'Not For Sale';
        const reviewsSection = reviews ? reviews.map( review => {
            return <ReviewView itemId={id} key={review._id} id={review._id} reviewData={review}/>
        }) : [];
        let reviewArea = [];
        if (reviews && reviews.length)
            reviewArea = [
            <h2>Reviews</h2>,
            reviewsSection
        ];

        if (loggedin && isMemberofRole(userdata, 'ROLE_ADMIN'))
            reviewArea.push(<Button><a href={`/items/view/${id}/review`}>Post Review</a></Button>)
            
        return (
            <Wrapper>
                <Title>{name}</Title>
                <RowWrapper>
                    <div class="col col-sm-8"><ImageSlide items={gallery_images} />
                    <DescriptionArea>
                        <DescriptionText dangerouslySetInnerHTML={{__html: description}} />
                    </DescriptionArea></div>
                <ItemDetailsArea>
                    <h3>Price: {price_text}</h3>
                    <h4>Keywords: {keywords ? keywords.join(', ') : ''}</h4>
                </ItemDetailsArea>
                </RowWrapper>
                {reviewArea}
            </Wrapper>
        )
    }
}

const mapStateToProps = state => {
    const {userdata, loggedin} = state.accountRedu;
    return {
        userdata, loggedin
    }
}

export default connect(
    mapStateToProps,
    {}
)(ItemView);