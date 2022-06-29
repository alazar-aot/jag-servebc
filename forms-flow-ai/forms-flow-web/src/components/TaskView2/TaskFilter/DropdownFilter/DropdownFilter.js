import React from "react";

const DropdownFilter = (props) => {
  return (
    <span className="SearchControl">
      <div>
        <span>
          <b>{props.label}</b>
        </span>
      </div>
      <div>
        <select
          className="form-control"
          ref={props.criminalStatusRef}
          onChange={props.handleSelectChagne}
        >
          {props.options.map((x) => {
            return (
              <option key={x.id} value={x.value}>
                {x.name}
              </option>
            );
          })}
        </select>
      </div>
    </span>
  );
};

export default DropdownFilter;
