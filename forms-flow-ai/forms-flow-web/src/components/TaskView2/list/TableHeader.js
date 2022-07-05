import React from "react";


const TableHeader = React.memo(
  ({headerTitle, onClickHandler: handleOnClick}) => {
    return (
      <th className="custom-th">
        {headerTitle}{" "}
        <i
          className="fa fa-angle-down fa-lg font-weight-light"
          dat-title="Descending"
          onClick={() => handleOnClick()}
        />
      </th>
    );
  }
);

export default TableHeader;