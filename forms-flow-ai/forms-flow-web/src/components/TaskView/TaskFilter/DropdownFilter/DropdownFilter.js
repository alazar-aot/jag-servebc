import React from "react";

const DropdownFilter = (props) => {
  return (
    <span className="SearchControl">
      <div>
        <span>Criminal Status</span>
      </div>
      <div>
        <select
          className="form-control"
          ref={props.criminalStatusRef}
          onChange={props.handleSelectChagne}
        >
          <option key="0" value=""></option>
          <option key="1" value="Yes">
            Yes
          </option>
          <option key="2" value="No">
            No
          </option>
        </select>
      </div>
    </span>
  );
};

export default DropdownFilter;
