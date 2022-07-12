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

    const getColumnValueFromList = (task, name) => {  

      let item =  task._embedded.variable.filter(v=>v.name==name);
      
      if (item.length ===0)
        return null;
      
      return item[0]; 
    }

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
                {getColumnValueFromList(task, PARTY_NAME) === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, PARTY_NAME).value} />}
                {/* Status */}
                {getColumnValueFromList(task, DOCUMENT_STATUS) === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, DOCUMENT_STATUS).value} />}
                {/* Responsibility */}
                {getColumnValueFromList(task, STAFF_GROUP) === null ? (
                  <td></td>
                ) : <TableData indexOfData={(getColumnValueFromList(task, STAFF_GROUP).value).toUpperCase()} />}
                {/* Criminal */}
                {getColumnValueFromList(task, IS_CRIMINAL) === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, IS_CRIMINAL).value} />}
                {/* Court/Tribunal File # */}
                {getColumnValueFromList(task, COURT_OR_TRIBUNAL_FILE_NUMBER) === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, COURT_OR_TRIBUNAL_FILE_NUMBER).value} />}
                {/* Date Served */}
                {task.due === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task.due} formatter={timeFormatter} />}
                {/* Next Appearance Date */}
                {task.followUp === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task.followUp} formatter={timeFormatter} />}
                {/* Registry */}
                {getColumnValueFromList(task, REGISTRY) === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, REGISTRY).value} />}
                {/* Document Type */}
                {getColumnValueFromList(task, DOCUMENT_TYPE) === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, DOCUMENT_TYPE).value} />}
                {/* Lawyer Name */}
                {getColumnValueFromList(task, LAWYER_NAME) === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, LAWYER_NAME).value} />}
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