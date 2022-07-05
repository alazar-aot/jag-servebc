import React from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";

const DateFilter = (props) => {
  return (
    <div className="mx-2">
      <div>
        <span>
          <b>{props.label}</b>
        </span>
      </div>
      <div>
        <DateRangePicker onChange={props.onChange} value={props.dateRange} />
      </div>
    </div>
  );
};

export default DateFilter;
