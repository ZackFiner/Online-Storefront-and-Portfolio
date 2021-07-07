import React, {Component} from 'react';
import styled from 'styled-components';

const SearchBar = styled.form.attrs({
})`
    min-width: 400px;
`

const SearchArea = styled.input.attrs(props => ({
    ...props,
    type: 'search'
}))`
    position:relative;
    border-style: none;
    border-radius: 5px 0px 0px 5px;
    border-right: none;
    width: 200px;
    min-width: 0px;
    background-color: #ffffff;
    overflow: hidden;
    height: 30px;
    transition: all .3s;
    &:active,&:focus {
        outline:none;
        width:300px;
    }
`
const SearchButton = styled.input.attrs(props => ({
    ...props,
    type:'submit'
}))`
    border-style: none;
    border-radius: 0px 5px 5px 0px;
    border-left: none;
    background-color: #f1f1f1;
    height: 30px;
    line-height: normal;
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

    executeSearch = (event) => {
        event.preventDefault();
        const {searchtext} = this.state;
        if (this.state.updateHandler)
            this.state.updateHandler(searchtext)
    }

    render() {
        return (
        <BarContainer>
            <SearchBar onSubmit={this.executeSearch}>
                <SearchArea id='store-search' onChange={this.handleChangeText} />
                <SearchButton value='Search' />
            </SearchBar>
        </BarContainer>)
    }
}

export default ItemSearchBar;