import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div className="App">
                <h1>Test Storefront</h1>
                <Link to={'./testPage'}>
                    <button variant="raised">
                        testPage
                    </button>
                </Link>
            </div>
        );
    }
}
export default Home;