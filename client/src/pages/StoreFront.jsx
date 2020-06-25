import React, { Component } from 'react';
import styled from 'styled-components';

import {ItemGrid} from '../components';

const Wrapper = styled.div``;

class StoreFront extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return <ItemGrid />
    }
}

export default StoreFront;