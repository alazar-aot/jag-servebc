import React from "react";

const TableData = React.memo(
  ({indexOfData: data, formatter: timeFormatter}) => {
    if(timeFormatter != null){
      return (
        <td>
          {timeFormatter(data)}
        </td>
      );
    } else if (data === 'noticeOfConstitutionalQuestionAndSupportingDocuments'){
      // Display the abbreviation for the document type instead of the full title
      return (
        <td>
          {"NCQ"}
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