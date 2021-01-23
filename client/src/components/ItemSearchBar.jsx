import React, {Component} from 'react';
import styled from 'styled-components';

import api from '../api';


const SearchArea = styled.input.attrs({
    type: 'text'
})`
    border-style: none;
    border-style: solid;
    border-radius: 5px 0px 0px 5px;
    border-right: none;
    width: auto;
    min-width: 0px;
    background-color: #ffffff;
    overflow: hidden;
    &:active,&:focus {
        outline:none;
    }
`
const SearchButton = styled.button.attrs({
    
})`
    border-style: none;
    border-style: solid;
    border-radius: 0px 5px 5px 0px;
    border-left: none;
    background-color: #f1f1f1;

    &:hover {
        background-color: #e7e7e7;
    }
`
const BarContainer = styled.div.attrs({

})`
`

class ItemSearchBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchtext: '',
            updateHandler: props.onSearch,
        };
    }

    componentDidMount = () => {
        // page load stuff here
    }

    handleChangeText = event => {
        const value = event.target.value;
        this.setState( {searchtext: value} );
    }

    executeSearch = () => {
        const {searchtext} = this.state;
        const payload = {searchtext};
        console.log(payload);
        api.searchItems(payload).then( res => {
            if (this.state.updateHandler)
                this.state.updateHandler(res.data.data);
        });
    }

    render() {
        return (<BarContainer>
            <SearchArea onChange={this.handleChangeText} />
            <SearchButton onClick={this.executeSearch}>Search</SearchButton>
        </BarContainer>)
    }
}

export default ItemSearchBar;