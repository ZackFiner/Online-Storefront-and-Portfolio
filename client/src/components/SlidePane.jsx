import React, { Component } from 'react'
import styled from 'styled-components'

class ListNode {
    constructor(id, index, _id) {
        this.index = index;
        this.id = id;
        this._id = _id;
        this.prev = null;
        this.next = null;
    }

    setNext(next) {
        this.next = next;
    }

    setPrev(prev) {
        this.prev = prev;
    }

    getNext() {
        return this.next;
    }

    getPrev() {
        return this.prev;
    }

    insertBefore(target) {
        if (target != this.getPrev()) {
            const prev = this.getPrev();
            this.setPrev(target);
            target.setNext(this);
            target.setPrev(prev);
            if (prev) {
                prev.setNext(target);
            }
        }
        return target;
    }

    insertAfter(target) {
        if (target != this.getNext()) {
            const next = this.getNext();
            this.setNext(target);
            target.setPrev(this);
            target.setNext(next);
            if (next) {
                next.setPrev(target);
            }
        }
        return target;
    }

    removeAndMend() {
        const prev = this.getPrev();
        const next = this.getNext();

        if (prev) {
            prev.setNext(next);
        }
        if (next) {
            next.setPrev(prev);
        }

        return next ? next : prev;
    }
}

export default ListNode;
const zone_types = ['left', 'right', 'up', 'down'];

const DropZone = styled.div.attrs(props => ({
    ...props,
    className: props.zone >= 0 && props.zone < 4 ? zone_types[props.zone] : '',
}))`
    position: absolute;
    z-index: 250;

    &.left {
        height: 100%;
        width: 50%;
        left: 0;
    }
    &.right {
        height: 100%;
        width:50%;
        left: 50%;
    }
    &.up {
        height: 50%;
        width: 100%;
        top: 0;
    }
    &.down {
        height: 50%;
        width: 100%;
        top: 50%;
    }
`



const DragHandle = styled.div.attrs({

})`
`

const DragContainer = styled.div.attrs({

})`
`


class DragContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parent_container: null,
        }
        this.parent_container = props.parent_container;
        this.verticle = props.verticle ? props.verticle : false;
    }

    render() {
        return (
        <DragContainer>
            <DragHandle>
                {this.props.children}
            </DragHandle>
        </DragContainer>
        );
    }
}

class DragGrid extends Component {
    constructor(props) {
        super(prrops);

        this.dragged_item = null;
    }

    itemStartDragging = (item_info) => (event) => {
        this.dragged_item = item_info;
    }

    itemStopDragging = (item_info) => (event) => {

    }

    itemDragging = (item_info) => (event) => {

    }

    dragEnter = (item_info) => (event) => {

    }

    dragExit = (item_info) => (event) => {

    }

    drop = (item_info, orientation) => (event) => {
        // use the orientation to either insert the item before or after another item
    }
}