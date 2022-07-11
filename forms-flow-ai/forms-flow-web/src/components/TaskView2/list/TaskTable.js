import React from "react";

// Import Table Components
import TableHeader from "./TableHeader";
import TableData from "./TableData";

import {Button} from 'react-bootstrap';

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
                {getColumnValueFromList(task, 'partyName') === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, 'partyName').value} />}
                {/* Status */}
                {getColumnValueFromList(task, 'documentStatus') === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, 'documentStatus').value} />}
                {/* Responsibility */}
                {getColumnValueFromList(task, 'staffGroup') === null ? (
                  <td></td>
                ) : <TableData indexOfData={(getColumnValueFromList(task, 'staffGroup').value).toUpperCase()} />}
                {/* Criminal */}
                {getColumnValueFromList(task, 'isCriminal') === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, 'isCriminal').value} />}
                {/* Court/Tribunal File # */}
                {getColumnValueFromList(task, 'courtOrTribunalFileNbr') === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, 'courtOrTribunalFileNbr').value} />}
                {/* Date Served */}
                {task.due === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task.due} formatter={timeFormatter} />}
                {/* Next Appearance Date */}
                {task.followUp === undefined ? (
                  <td></td>
                ) : <TableData indexOfData={task.followUp} formatter={timeFormatter} />}
                {/* Registry */}
                {getColumnValueFromList(task, 'registry') === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, 'registry').value} />}
                {/* Document Type */}
                {getColumnValueFromList(task, 'documentType') === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, 'documentType').value} />}
                {/* Lawyer Name */}
                {getColumnValueFromList(task, 'lawyerName') === null ? (
                  <td></td>
                ) : <TableData indexOfData={getColumnValueFromList(task, 'lawyerName').value} />}
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