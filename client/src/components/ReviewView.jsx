import React, { Component } from 'react';
import styled from 'styled-components';
import api from '../api';

const Wrapper = styled.div.attrs({
    className: `reviewbody-wrapper`
})`
`

class ReviewView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
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
                <p>Written By: {author}</p>
                <p>Rating: {rating}</p>
                <p>{reviewText}</p>
            </Wrapper>
        )
    }
}

export default ReviewView;