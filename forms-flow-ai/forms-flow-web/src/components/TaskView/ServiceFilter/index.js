import React from "react";
import { Tabs, Tab } from "react-bootstrap";

const ServiceFilter = React.memo(() => {

    return (
        <>
            <Tabs defaultActiveKey="profile" id="tab-example" className="mb-3">
                <Tab eventKey="all" title="All Tasks">
                    <p>All Tasks</p>
                </Tab>
                <Tab eventKey="BCPS" title="BCPS Tasks">
                    <p>BCPS Tasks</p>
                </Tab>
                <Tab eventKey="Joint" title="Joint Tasks">
                    <p>Joint Tasks</p>
                </Tab>
                <Tab eventKey="LSB" title="LSB Tasks">
                    <p>LSB Tasks</p>
                </Tab>
            </Tabs>
        </>
    );
});

export default ServiceFilter;
