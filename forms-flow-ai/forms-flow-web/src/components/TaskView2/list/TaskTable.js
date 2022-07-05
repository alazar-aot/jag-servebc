import React from "react";

// Import Table Components
import TableHeader from "./TableHeader";
import TableData from "./TableData";

import {Button} from 'react-bootstrap';

// Import Constants
import {
  DOCUMENT_STATUS,
  PARTY_NAME,
  IS_CRIMINAL,
  COURT_OR_TRIBUNAL_FILE_NUMBER,
  LAWYER_NAME,
  REGISTRY,
  DOCUMENT_TYPE,
  STAFF_GROUP,
} from "../constants/taskConstants";

const TaskTable = React.memo(
  ({tableHeaders, taskServeLegalDocs, timeFormatter, onViewEditChanged}) => {
    return(
      <table>
        <thead className="custom-table-header">
          <tr>
            {tableHeaders.map((header) => (
              <TableHeader header={header} key={header.key}/>
            ))}
          </tr>
        </thead>
        <tbody>
          {taskServeLegalDocs.map((task) => (
              <tr key={task.id} className="custom-th">
                {/* Party Name */}
                {task._embedded.variable[PARTY_NAME] === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task._embedded.variable[PARTY_NAME].value} />}
                {/* Status */}
                {task._embedded.variable[DOCUMENT_STATUS] === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task._embedded.variable[DOCUMENT_STATUS].value} />}
                {/* Responsibility */}
                {task._embedded.variable[STAFF_GROUP] === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task._embedded.variable[STAFF_GROUP].value} />}
                {/* Criminal */}
                {task._embedded.variable[IS_CRIMINAL] === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task._embedded.variable[IS_CRIMINAL].value} />}
                {/* Court/Tribunal File # */}
                {task._embedded.variable[COURT_OR_TRIBUNAL_FILE_NUMBER] === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task._embedded.variable[COURT_OR_TRIBUNAL_FILE_NUMBER].value} />}
                {/* Date Served */}
                {task.due === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task.due} formatter={timeFormatter} />}
                {/* Next Appearance Date */}
                {task.followUp === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task.followUp} formatter={timeFormatter} />}
                {/* Registry */}
                {task._embedded.variable[REGISTRY] === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task._embedded.variable[REGISTRY].value} />}
                {/* Document Type */}
                {task._embedded.variable[DOCUMENT_TYPE] === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task._embedded.variable[DOCUMENT_TYPE].value} />}
                {/* Lawyer Name */}
                {task._embedded.variable[LAWYER_NAME] === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task._embedded.variable[LAWYER_NAME].value} />}
                {/* Edited by */}
                {task.assignee === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task.assignee}/>}
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
            
          ))}
        </tbody>
      </table>
    );
  }
);

export default TaskTable;