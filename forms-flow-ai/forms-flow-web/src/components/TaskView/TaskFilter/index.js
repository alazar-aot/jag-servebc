import React from "react";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';

const TaskFilter = React.memo(() => {

    const test = [ {
        "id": 1,
        "searchbar": "test",
      }];

    const columns = [{
        dataField: 'test',
        text: 'Party'
    }, {
        dataField: 'test',
        text: 'Court Tribunal File #'
    }, {
        dataField: 'test',
        text: 'Status'
    }, {
        dataField: 'test',
        text: 'Criminal?'
    }, {
        dataField: 'test',
        text: 'Responsibility'
    }, {
        dataField: 'test',
        text: 'Date Served'
    }, {
        dataField: 'test',
        text: 'Next Appearance Date'
    }];

    return (
        <BootstrapTable keyField='id' data={test} columns={columns} />
    );
});

export default TaskFilter;
