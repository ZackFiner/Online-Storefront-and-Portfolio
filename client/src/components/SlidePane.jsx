import React, { Component } from 'react'
import styled from 'styled-components'

class ListNode {
    constructor(index, data) {
        this.index = index;
        this.data = data;
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

class LinkedList {
    constructor(data) {
        this.list_head = null;

        if (data.length) {
            this.list_head = new ListNode(0, data[0]);
            let current = this.list_head;
            this.length = data.length;
        
            for (let i = 1; i < this.length; i++) {
                current.setNext(new ListNode(i, data[i]));
                current = current.getNext();
            }
        }
    }

    insertAfter(location, node) {
        if (!node || !location || location.getNext() == node )
            return;
        node.removeAndMend();
        location.insertAfter(node);
    }

    insertBefore(location, node) {
        if (!node || !location || location.getPrev() == node)
            return;
        node.removeAndMend();
        location.insertBefore(node);
        if (location==this.list_head) {
            this.list_head = node;
            this.list_head.setPrev(null);
        }
    }

    arr_map(fn) { 
        let return_arr = [];
        let current = this.list_head;
        while(current) {
            return_arr.push(fn(current.data));
            current = current.getNext();
        }
    }
}

export default ListNode;
const zone_types = ['left', 'up', 'right', 'down'];

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
        super(props);
        // this.props.children should all be DragContainers
        /*
            
        */
        this.state = {
            item_list: null,
            item_list_length: 0,
        }
        this.dragged_item = null;
    }

    itemStartDragging = (item_info) => (event) => {
        this.dragged_item = item_info;
        event.target.classList.add('dragging');
    }

    itemStopDragging = (item_info) => (event) => {
        event.target.classList.remove('remove');
        this.dragged_item = null;
    }

    dragEnter = (item_info, orientation) => (event) => {
        event.preventDefault();
    }

    dragExit = (item_info) => (event) => {
        event.preventDefault();
    }

    drop = (item_info, orientation) => (event) => {
        event.preventDefault();
        if (item_info != this.dragged_item) {
            
            let current_head = this.state.item_list;
            this.dragged_item.removeAndMend();
            if (orientation < 2) {
                item_info.insertBefore(this.dragged_item);
                if (item_info == this.dragged_item) {
                    current_head = this.dragged_item;
                    current_head.setPrev(null);
                }
            } else {
                item_info.insertAfter(this.dragged_item);
            }
            this.setState({
                item_list:current_head,
            }, () => {
                this.dragged_item = null;
            })
        }
        // use the orientation to either insert the item before or after another item
    }

    render() {
        return (<div/>)
    }
}