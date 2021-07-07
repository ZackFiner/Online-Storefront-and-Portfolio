import React, {Component} from 'react'
import styled from 'styled-components'

import {DragGrid, DragContainer} from '../components';

const Wrapper = styled.div.attrs({
})`
`

class SlidePageExample extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return <Wrapper>
            <DragGrid num_cols={4}>
                <DragContainer verticle="false">
                    <div>1</div>
                </DragContainer>
                <DragContainer verticle="false">
                    <div>2</div>
                </DragContainer>
                <DragContainer verticle="false">
                    <div>3</div>
                </DragContainer>
                <DragContainer verticle="false">
                    <div>4</div>
                </DragContainer>
                <DragContainer verticle="false">
                    <div>5</div>
                </DragContainer>
            </DragGrid>
        </Wrapper>
    }

}

export default SlidePageExample;