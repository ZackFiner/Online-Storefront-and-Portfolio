import React, {Component} from 'react';
import ReactTable from 'react-table-6';
import api from '../api';

import styled from 'styled-components';

import 'react-table-6/react-table.css';

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`
const Update = styled.div`
    color: #00ff00;
    cursor: pointer;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`


class UpdateItem extends Component {
    updateItem = event => {
        event.preventDefault();

        window.location.href = `/items/update/${this.props.id}`;
    }

    render() {
        return <Update onClick={this.updateUser}>Update</Update>
    }
}

class DeleteItem extends Component {
    deleteItem = event => {
        event.preventDefault();

        if (
            window.confirm(
                `Are you sure you want to delete the item ${this.props.id} permanently?`,
            )
        ) {
            api.deleteItemById(this.props.id);
            window.location.reload();
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>
    }
}


class ItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        
        await api.getAllItems().then(items => {
            this.setState({
                items: items.data.data,
                isLoading: false,
            })
        });
    }

    render() {
        const {items, isLoading} = this.state;
        console.log('Test: ItemList -> render -> items', items);
        const columns = [
            {
                Header: 'ID',
                accessor: '_id',
                filterable: true,
            },
            {
                Header: 'Name',
                accessor: 'name',
                filterable: true,
            },
            {
                Header: 'Description',
                accessor: 'description',
                filterable: true,
            },
            {
                Header: 'Time',
                accessor: 'createdAt',
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeleteItem id={props.original._id} />
                        </span>
                    )
                },
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <UpdateItem id={props.original._id} />
                        </span>
                    )
                },
            },
        ]

        let showTable = true;
        if (!items.length) {
            showTable = false;
        }

        return(
            <Wrapper>
                {showTable && (
                    <ReactTable
                        data={items}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
            </Wrapper>
        );
    }
}

export default ItemList;