import React, { Component } from "react";
import { Result, Button } from "antd";

class Pages404 extends Component {
    constructor() {
        super();
        this.state = {
            //newCustomer: false
        };
    }

    componentWillMount() {}

    render() {
        return (
            <React.Fragment>
                <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center', height: '100vh' }} >
                    <Result
                        status="404"
                        title="404"
                        subTitle="Sorry, the page you visited does not exist."
                        extra={<Button type="primary">Back Home</Button>}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default Pages404;
