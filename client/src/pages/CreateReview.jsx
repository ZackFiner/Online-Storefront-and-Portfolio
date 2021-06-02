import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import styled from 'styled-components';

import api from '../api';

const InputGrid = styled.div.attrs({
    className: `rating-input-wrapper`
})`
    display: inline-grid;
    grid-template-columns: ${'auto '.repeat(11)};
    grid-gap: 10px;
    justify-content: left;
`
const RatingRadioButton = styled.input.attrs( ({ key, val, selectFunc }) => ({
    className: `rating-input-btn`,
    type: `radio`,
    value: val,
    key: key,
    onChange: selectFunc,
    name: `rating-select-button`
}))`
`
class RatingSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedVal: props.defaultValue || 5 ,
            min: props.min || 0,
            max: props.max || 10,
            inputHandler: props.onChange,
        }
    }

    render() {
        const { inputHandler } = this.state;
        const inputElements = [ ...Array(11)].map( (value, index, _) => {
            return (
                <RatingRadioButton key={index} val={index} selectFunc={inputHandler}/>
            )
        });
        return (
            <InputGrid>
            {inputElements}
            </InputGrid>
        );
    }
}

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
    display: block;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 15px;
`
const CancelButton = styled.button.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 15px;
`
class CreateReview extends Component {
    constructor(props) {
        super(props);
        // we'll need to pull item id from the url or something
        // furthermore, we should validate the id to make sure it's actually valid, 
        this.state={
            rating: 5,
            author: 'testauth',
            reviewText: '',
            itemId: this.props.match.params.id,
        }
    }

    componentDidMount = async () => {}

    handleChangeInputRating = async event => {
        const value = event.target.value;
        this.setState({rating: value});
    }

    handleChangeInputText = async event => {
        const value = event.target.value;
        this.setState({reviewText: value});
    }

    handleSubmitReview = async () => {
        const {rating, author, reviewText, itemId} = this.state;
        const payload = {rating, author, reviewText};
        
        api.insertReview(itemId, payload).then( res => {
            window.alert('Review Successfully Submission');
            this.setState({
                rating: 5,
                author: '',
                reviewText: '',
                itemId: this.props.match.params.id,
            });
        });
        //TODO: re-route us back to the item view page
    }

    render() {
        const { itemId, author } = this.state;
        return (
            <Wrapper>
                <Label>Author: {author}</Label>
                <Label>Rating Value:</Label>
                <RatingSelect onChange={this.handleChangeInputRating} />
                <Label>Review Text:</Label>
                <InputText onChange={this.handleChangeInputText} />
                <Button onClick={this.handleSubmitReview}>
                        Submit
                    </Button>
                    <CancelButton>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default CreateReview;