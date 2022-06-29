import React from "react";

const DateFilter = (props) => {
  return (
    <span className="SearchControl">
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
    </span>
  );
};

export default DateFilter;
