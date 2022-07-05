import React from "react";

const TableData = React.memo(
  ({indexOfData: data, formatter: timeFormatter}) => {
    if(timeFormatter != null){
      return (
        <td>
          {timeFormatter(data)}
        </td>
      );
    } else {
      return (
        <td>
          {data}
        </td>
      );
    }
  }
);

export default TableData;