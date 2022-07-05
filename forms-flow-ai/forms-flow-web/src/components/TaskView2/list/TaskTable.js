import React from "react";

// Import Table Components
import TableHeader from "./TableHeader";
import TableData from "./TableData";

// Import Constants
import {
  DOCUMENT_STATUS,
  PARTY_NAME,
  IS_CRIMINAL,
  NEXT_APPEARANCE_DATE,
  COURT_OR_TRIBUNAL_FILE_NUMBER,
  DATE_SERVED,
  LAWYER_NAME,
  REGISTRY,
  DOCUMENT_TYPE,
  STAFF_GROUP
} from "../constants/taskConstants";

import {Button} from 'react-bootstrap';



const TaskTable = React.memo(
  ({tableHeaders, taskServeLegalDocs, timeFormatter, sorter, onViewEditChanged}) => {
    return(
      <table>
        <thead className="custom-table-header">
        <tr>
          {tableHeaders.map((title) => (
            <TableHeader headerTitle={title} onClickHandler={sorter} />
          ))}
        </tr>
        </thead>
        <tbody>
          {taskServeLegalDocs.map((task) => (
            <>
              {/* {console.log('TASK: ', task)} */}
              <tr key={task.id} className="custom-th">
                {/* Party Name */}
                <TableData indexOfData={task._embedded.variable[PARTY_NAME].value} />
                {/* Status */}
                <TableData indexOfData={task._embedded.variable[DOCUMENT_STATUS].value} />
                {/* Responsibility */}
                <TableData indexOfData={task._embedded.variable[STAFF_GROUP].value} />
                {/* Criminal */}
                <TableData indexOfData={task._embedded.variable[IS_CRIMINAL].value} />
                {/* Court/Tribunal File # */}
                <TableData indexOfData={task._embedded.variable[COURT_OR_TRIBUNAL_FILE_NUMBER].value} />
                {/* Date Served */}
                <TableData indexOfData={task._embedded.variable[DATE_SERVED].value} formatter={timeFormatter} />
                {/* Next Appearance Date */}
                <TableData indexOfData={task._embedded.variable[NEXT_APPEARANCE_DATE].value} formatter={timeFormatter} />
                {/* Registry */}
                <TableData indexOfData={task._embedded.variable[REGISTRY].value} />
                {/* Document Type */}
                <TableData indexOfData={" "} />
                {/* <TableData indexOfData={task._embedded.variable[DOCUMENT_TYPE].value} /> */}
                {/* Lawyer Name */}
                <TableData indexOfData={task._embedded.variable[LAWYER_NAME].value} />
                {/* Edited by */}
                <TableData indexOfData={task.assignee} />
                {/* View/Edit Button */}
                <TableData indexOfData={
                  <Button
                    className="button-view-edit"
                    onClick={() => {
                      onViewEditChanged(task);
                    }}
                  >
                    View/Edit
                  </Button>
                } 
                />
              </tr>
            </>
          ))}
        </tbody>
      </table>
    );
  }
);

export default TaskTable;