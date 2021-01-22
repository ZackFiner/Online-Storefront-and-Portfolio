import React, {Component} from 'react';

import styled from 'styled-components';
import ItemFrame from './ItemFrame';
import ItemSearchBar from './ItemSearchBar';
import api from '../api';

const Wrapper = styled.div`
`

const ItemGridSquare = styled.div.attrs({
    className: 'col-sm-4'
})`
`

const ItemFrames = styled.div.attrs({
    className: 'frame-group row'
})`
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
            return (<ItemGridSquare><ItemFrame key={itemData._id} itemDataFromParent={itemData} /></ItemGridSquare>)
        })
        return(
            <Wrapper>
                <Wrapper>
                    <ItemSearchBar onSearch={this.displayItems}/>
                </Wrapper>
                <ItemFrames>
                    {itemFrames}
                </ItemFrames>
            </Wrapper>
        );
    }
}

export default ItemGrid;
