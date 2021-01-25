import React, { Component } from 'react';
import styled from 'styled-components';
import api from '../api';

const Wrapper = styled.div.attrs({
    className: `reviewbody-wrapper`
})`
    margin-top: 2rem;
    margin-bottom: 1rem;
    max-width: 50rem;
    & * {
        padding: 15px;
        padding-bottom: 0px;
        padding-right: 0px;
    }
`

const ReviewHeader = styled.div.attrs({

})`
    background-color: #cfcfcf;
    border-radius: 3px 3px 0px 0px;
`;

const ReviewBody = styled.div.attrs({

})`
    border-radius: 0px 0px 3px 3px;
    border-color: #cfcfcf;
    border-width: 2px;
    border-style: solid;
    border-style-top: none;
`

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
                <ReviewBody><p>{reviewText}</p></ReviewBody>
            </Wrapper>
        )
    }
}

export default ReviewView;