import React, { Component } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div.attrs({

})`
`

const Row = styled.div.attrs({
})`
    width: 100%;
`

const Cell = styled.div.attrs({
    className: 'cell_debug'
})`
    display: inline-block;
    width: ${props => `${100/props.cols}%`};
    margin-left:0;
    margin-right:0;
`

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

    setData(data) {
        this.data = data;
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

const DragWrapper = styled.div.attrs({

})`
    position: relative;
`


class DragContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parent_container: null,
        }
        this.parent_container = props.parent_container;
        this.node = props.node;
        this.verticle = props.verticle ? props.verticle : false;
    }

    setParentGrid(parent) {
        this.parent_container = parent;
    }

    setNode(node) {
        this.node = node;
    }

    setOrientation(vert) {
        this.verticle = vert;
    }

    render() {
        const orientation = this.verticle ? 0 : 1;
        return (
        <DragWrapper
        draggable={true}
        onDragStart={this.parent_container.itemStartDragging(this.node)}
        onDragEnd={this.parent_container.itemStopDragging(this.node)}
        >
            <DropZone zone={orientation}
            onDragLeave={this.parent_container.dragExit(this.node)}
            onDragOver={this.parent_container.dragOver(this.node)}
            onDragEnter={this.parent_container.dragEnter(this.node, orientation)}
            onDrop={this.parent_container.drop(this.node, orientation)}
            ></DropZone>
            <DropZone zone={orientation+2}
            onDragLeave={this.parent_container.dragExit(this.node)}
            onDragOver={this.parent_container.dragOver(this.node)}
            onDragEnter={this.parent_container.dragEnter(this.node, orientation+2)}
            onDrop={this.parent_container.drop(this.node, orientation+2)}></DropZone>
            <DragHandle>
                {this.props.children}
            </DragHandle>
        </DragWrapper>
        );
    }
}

class DragGrid extends Component {
    constructor(props) {
        super(props);
        // this.props.children should all be DragContainers
        /*
            
        */
        const {num_rows, num_cols} = this.props;
        this.state = {
            item_list: null,
            item_list_length: 0,
            rows: num_rows,
            cols: num_cols ? num_cols : 1,
        }
        this.dragged_item = null;
    }

    componentDidMount = () => {
        if (this.props.children.length) {
            const children = this.props.children;

            let item_list = new ListNode(0, null);
            item_list.setData(React.cloneElement(children[0], 
                {
                    node: item_list, 
                    parent_container: this, 
                    verticle:this.state.cols!=1
                }));
            let current = item_list;
            for (let i = 1; i <children.length; i++) {
                const new_node = new ListNode(i, null);
                new_node.setData(React.cloneElement(children[i], 
                    {
                        node: new_node, 
                        parent_container: this, 
                        verticle:this.state.cols!=1
                    }));
                new_node.setPrev(current);
                current.setNext(new_node);

                current = current.getNext();
            }

            this.setState({item_list: item_list, item_list_length: children.length});
        }
    }

    itemStartDragging = (item_info) => (event) => {
        console.log(item_info);
        this.dragged_item = item_info;
        event.target.classList.add('dragging');
    }

    itemStopDragging = (item_info) => (event) => {
        event.target.classList.remove('dragging');
        //this.dragged_item = null;
    }

    dragEnter = (item_info, orientation) => (event) => {
        event.preventDefault();
    }

    dragExit = (item_info) => (event) => {
        event.preventDefault();
    }

    dragOver = (item_info) => (event) => {
        event.preventDefault();
    }

    drop = (item_info, orientation) => (event) => {
        console.log(item_info);
        event.preventDefault();
        if (item_info != this.dragged_item) {
            
            let current_head = this.state.item_list;
            this.dragged_item.removeAndMend();
            if (orientation < 2) {
                item_info.insertBefore(this.dragged_item);
                if (item_info == current_head) {
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
        console.log("re-render");
        const {cols, item_list_length, item_list} = this.state;
        const row_c = Math.ceil(item_list_length / cols);
        let row_arr = [];
        let current = item_list;
        for (let i = 0; i < row_c; i++) {
            let index = 0;
            let cell_arr = [];
            while(current && index < cols) {
                cell_arr.push(current.data);
                index += 1;
                current = current.getNext();
            }
            row_arr.push(cell_arr);
        }
        row_arr = row_arr.map((row) => {
            return (<Row>{row.map((cell)=>{
                return (<Cell cols={cols}>{cell}</Cell>);
            })}</Row>);
        });
        return (<Wrapper>
            {row_arr}
        </Wrapper>)
    }
}

export {DragGrid, DragContainer, ListNode};