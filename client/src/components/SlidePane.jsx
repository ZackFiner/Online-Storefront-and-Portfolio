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

    setNext(_next) {
        this.next = _next;
    }

    setPrev(_prev) {
        this.prev = _prev;
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
        background-color: rgba(255.0,0.0,0.0,0.5);
        height: 100%;
        width: 50%;
        left: 0;
    }
    &.right {
        background-color: rgba(0.0,0.0,255.0,0.5);
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
        this.list_node = props.node;
        this.verticle = props.verticle ? props.verticle : false;

        this.dragStart = props.onDragStart;
        this.dragEnd = props.onDragEnd;
        this.dragOver = props.onDragOver;
        this.dragEnter1 = props.onDragEnter1;
        this.dragEnter2 = props.onDragEnter2;

        this.dragLeave = props.onDragLeave;
        this.drop1 = props.onDrop1;
        this.drop2 = props.onDrop2;
    }

    setParentGrid(parent) {
        this.parent_container = parent;
    }

    setNode(node) {
        this.list_node = node;
    }

    setOrientation(vert) {
        this.verticle = vert;
    }

    render() {
        const orientation = this.verticle ? 0 : 1;
        console.log("re-render cell")
        return (
        <DragWrapper
        draggable={true}
        onDragStart={this.dragStart}
        onDragEnd={this.dragEnd}
        >
            <DropZone id={`${orientation}`} zone={orientation}
            onDragLeave={this.dragLeave}
            onDragOver={this.dragOver}
            onDragEnter={this.dragEnter1}
            onDrop={this.drop1}
            ></DropZone>
            <DropZone id={`${orientation+1}`}zone={orientation+2}
            onDragLeave={this.dragLeave}
            onDragOver={this.dragOver}
            onDragEnter={this.dragEnter2}
            onDrop={this.drop2}></DropZone>
            <DragHandle>
                {this.props.children}
            </DragHandle>
        </DragWrapper>
        );// for some reason, these objects never seem to move, only their child data seems to move.
        // i think the issue with this code is that we are not re-creating these elements when the underlying
        // list is updated. in the frontpage, we re-created the cells every time an item was moved.
        // this is not the case here, and our grid is behaving erradically as a result.
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
            item_list.setData(React.cloneElement(children[0].props.children, 
                {
                }));
            let current = item_list;
            for (let i = 1; i <children.length; i++) {
                const new_node = new ListNode(i, null);
                new_node.setData(React.cloneElement(children[i].props.children, 
                    {
                    })); // clone the DragContainer that corresponds to this element. this should not change, only the data in the new_node should
                new_node.setPrev(current);
                current.setNext(new_node);

                current = current.getNext();
            }

            this.setState({item_list: item_list, item_list_length: children.length});
        }
    }

    reintializeChildren = () => {
        const {item_list} = this.state;

        let curr = item_list;
        while(curr) {
            console.log(curr.data.children ? curr.data.children : "null child");
            curr.setData(
                <DragContainer node={curr} parent_container={this} verticle={this.state.cols!=1}>
                    {curr.data.props.children}
                </DragContainer>,
                );
            curr = curr.getNext();
        }
    }

    itemStartDragging = (item_info) => (event) => {
        const index = event.target.id;
        event.dataTransfer.setData('drag_index', index);
        this.dragged_item = item_info;
        console.log(item_info);
        event.target.classList.add('dragging');
    }

    itemStopDragging = (item_info) => (event) => {
        event.target.classList.remove('dragging');
        this.dragged_item = null;
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
        event.preventDefault();
        const {item_list} = this.state;
        if (item_info != this.dragged_item) {
            let current_head = item_list;
            let replacement = this.dragged_item.removeAndMend();
            if (this.dragged_item == current_head) {
                current_head = replacement;
                current_head.setPrev(null);
            }
            if (orientation < 2) {
                if (item_info == current_head) {
                    current_head = this.dragged_item;
                    current_head.setPrev(null);
                }
                item_info.insertBefore(this.dragged_item);
            } else {
                item_info.insertAfter(this.dragged_item);
            }
            
            this.setState({
                item_list: current_head,
            }, () => {
                //this.reintializeChildren();
                const {item_list} = this.state;
                //this.printList(item_list);
                this.dragged_item = null;
            })
        }
        // use the orientation to either insert the item before or after another item
    }

    printList(list_head) {
        let curr = list_head;
        let a = '';
        while (curr) {
            a += `${curr.index}->`;
            curr = curr.next;
        }
        console.log(a);
    }

    render() {
        console.log("re-render");
        const {cols, item_list_length, item_list} = this.state;
        
        this.printList(item_list);
        const row_c = Math.ceil(item_list_length / cols);
        let row_arr = [];
        let current = item_list;
        for (let i = 0; i < row_c; i++) {
            let index = 0;
            let cell_arr = [];
            while(current && index < cols) {
                cell_arr.push(current);
                index += 1;
                current = current.getNext();
            }
            row_arr.push(cell_arr);
        }
        // for some reason, even though the integrity of the list is being maintained,
        // the wrong callback functions for onDragStart seem to be getting called
        // which means that the wrong item is being dragged
        const vert = this.state.cols!=1;
        const orientation = vert ? 0 : 1;
        console.log(row_arr);
        row_arr = row_arr.map((row, index) => {
            return (<Row id = {index} key={index}>{row.map((cell, _index)=>{
                return (<Cell id = {_index} key={_index} cols={cols}>
                        <DragContainer verticle={vert}
                            onDragStart={this.itemStartDragging(cell)}
                            onDragEnd={this.itemStopDragging(cell)}
                            onDragOver={this.dragOver(cell)}
                            onDragEnter1={this.dragEnter(cell, orientation)}
                            onDragEnter2={this.dragEnter(cell, orientation+2)}
                            onDragLeave={this.dragExit(cell)}
                            onDrop1={this.drop(cell, orientation)}
                            onDrop2={this.drop(cell, orientation+2)}
                            >
                            {cell.data}
                        </DragContainer>
                    </Cell>);
            })}</Row>);
        });
        return (<Wrapper>
            {row_arr}
        </Wrapper>)
    }
}

export {DragGrid, DragContainer, ListNode};