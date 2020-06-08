import React, {Component} from 'react';

class Test extends Component {
    constructor(props){
        super(props);
        this.state = {
            testString: ""
        }
    }

    // called when the component first mounts
    componentDidMount() {
        this.doStuff();
    }

    doStuff = () => {
        fetch('api/testAPI')
        .then(res => res.json())
        .then(testString => this.setState({testString}))
    }

    render() {
        const {testString} = this.state;
        return (
            <div className="App">
                <h1>Test API String</h1>
                <p>{testString}</p>
            </div>
        );
    }
}

export default Test;