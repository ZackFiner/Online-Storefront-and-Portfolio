import React, {Component} from 'react';

import styled from 'styled-components';
import {ItemFrame, ItemSearchBar} from '../components';
import api from '../api';

const Wrapper = styled.div.attrs({
    className: 'modified-row row'
})`
    margin-left: 0px;
    margin-right: 0px;
`

const ItemGridSquare = styled.div.attrs({
    className: 'item-square col-4'
})`
    min-width: 450px;
`

const ItemFrames = styled.div.attrs({
    className: 'frame-group row'
})`
    margin-left: 0px;
    margin-right: 0px;
`

const TopSearchBar = styled.div.attrs({
    className: "search-topbar row"
})`
    padding: 20px;
    background-color: #cfcfcf;
    width: 100%;
    margin-left: 0px;
    margin-right: 0px;
    &>* {
        margin-left: auto;
    }
`;

class StoreFront extends Component {
    constructor(props) {
        super(props)

        this.state = {
            items: [],
            isLoading: false,
            search_text: '',
        };
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        api.getAllItems().then( items => {
            this.setState({
                items: items.data.data,
                isLoading: false,
            }, () => {
                this.props.history.push({ // save search history
                    pathname: '/storefront',
                    search: '',
                    state: this.state
                });
            });
        })
    }

    componentDidUpdate = async () => {
        if (this.props.location && this.props.location.state) // check if there is history information for this page
            if (this.state.search_text != this.props.location.state.search_text) { // if the search_text for state isn't equal to the history
                this.setState(this.props.location.state); // update our state from the historry
            }
    }

    displayItems = (items, searchtext) => {
        this.setState({ isLoading: true });

        this.setState({
            items: items,
            isLoading: false,
            search_text: searchtext,
        }, () => {
            this.props.history.push({ // save history
                pathname: '/storefront',
                search: `?searchtext=${encodeURIComponent(this.state.search_text)}`,
                state: this.state
            });
        })
    }

    render() {
        const { items } = this.state;
        const itemFrames = items.map(itemData => {
            return (<ItemGridSquare><ItemFrame key={itemData._id} itemDataFromParent={itemData} /></ItemGridSquare>)
        })
        return(
            <Wrapper>
                <TopSearchBar><ItemSearchBar onSearch={this.displayItems}/></TopSearchBar>
                <ItemFrames>
                    {itemFrames}
                </ItemFrames>
            </Wrapper>
        );
    }
}

export default StoreFront;
