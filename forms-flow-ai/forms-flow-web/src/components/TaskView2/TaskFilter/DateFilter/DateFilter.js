import React from "react";

const DateFilter = (props) => {
  return (
    <div className="mx-2">
      <div>
        <span>
          <b>{props.label}</b>
        </span>
      </div>
      <div>
        <input
          className="form-control"
          ref={props.serveDate}
          onChange={props.handleDateChange}
          type="date"
        />
      </div>
    </div>
  );
};

export default DateFilter;
