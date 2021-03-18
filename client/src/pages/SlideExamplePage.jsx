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
                <DragContainer>
                    1
                </DragContainer>
                <DragContainer>
                    2
                </DragContainer>
                <DragContainer>
                    3
                </DragContainer>
                <DragContainer>
                    4
                </DragContainer>
                <DragContainer>
                    5
                </DragContainer>
            </DragGrid>
        </Wrapper>
    }

}

export default SlidePageExample;