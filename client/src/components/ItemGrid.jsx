import React, {Component} from 'react';

import styled from 'styled-components';
import ItemFrame from './ItemFrame';
import ItemSearchBar from './ItemSearchBar';
import api from '../api';

const Wrapper = styled.div.attrs({
    className: 'frame-group'
})`
    padding: 15px 15px 15px 15px;
    display: inline-grid;
    grid-template-columns: auto auto auto;
    grid-gap: 20px;
`

class ItemGrid extends Component {
    constructor(props) {
        super(props)

        this.state = {
            items: [],
            isLoading: false,
        };
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });

        api.getAllItems().then( items => {
            this.setState({
                items: items.data.data,
                isLoading: false,
            });
        })
    }

    displayItems = (items) => {
        this.setState({ isLoading: true });
        this.setState({
            items: items,
            isLoading: false,
        })
    }

    render() {
        const { items } = this.state;
        const itemFrames = items.map(itemData => {
            return <ItemFrame key={itemData._id} itemDataFromParent={itemData} />
        })
        return(
            <Wrapper>
                <Wrapper>
                    <ItemSearchBar onSearch={this.displayItems}/>
                </Wrapper>
                <Wrapper>
                    {itemFrames}
                </Wrapper>
            </Wrapper>
        );
    }
}

export default ItemGrid;
