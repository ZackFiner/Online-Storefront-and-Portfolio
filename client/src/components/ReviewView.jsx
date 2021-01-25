import React, { Component } from 'react';
import styled from 'styled-components';
import api from '../api';

const Wrapper = styled.div.attrs({
    className: `reviewbody-wrapper`
})`
    border-style: solid;
    border-color: #cfcfcf;
    border-width: 2px;
    border-radius: 3px;
    margin-top: 2rem;
    margin-bottom: 1rem;
    & * {
        padding: 15px;
        padding-bottom: 0px;
        padding-right: 0px;
    }
`

const ReviewHeader = styled.p.attrs({

})`
    border-bottom-style:solid;
    border-bottom-width: 2px;
    border-color: #cfcfcf;
`;

class ReviewView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            author: '',
            reviewText: '',
            rating: -1,
        }
    }

    componentDidMount = async () => {
        api.getReviewById(this.state.id).then( review => {
            this.setState({
                author: review.data.data.author,
                reviewText: review.data.data.reviewText,
                rating: review.data.data.rating,
            })
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        const {author, reviewText, rating} = this.state;
        return (
            <Wrapper>
                <ReviewHeader>Written By: {author} | Rating: {rating}</ReviewHeader>
                <p>{reviewText}</p>
            </Wrapper>
        )
    }
}

export default ReviewView;