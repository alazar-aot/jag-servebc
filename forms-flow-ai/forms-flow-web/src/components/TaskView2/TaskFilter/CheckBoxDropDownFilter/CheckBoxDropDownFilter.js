import React, { useState, useEffect } from "react";

const CheckBoxDropDownFilter = (props) => {
  const [display, setDisplay] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckBoxChange = (e) => {
    // console.log(e);
    let items = [...selectedItems];
    let selectedValue = e.target.value;
    let isChecked = e.target.checked;
    if (isChecked && items.indexOf(selectedValue) === -1) {
      items.push(selectedValue);
    } else if (!isChecked && items.indexOf(selectedValue) !== -1) {
      items.splice(items.indexOf(selectedValue), 1);
    }

    // console.log("items", items);
    setSelectedItems(items);
  };

  const checkIfExists = (item) => {
    return selectedItems.indexOf(item) !== -1 ? true : false;
  };

  useEffect(() => {}, [selectedItems]);

  return (
    <div className="custom-checkbox-dropdown-parent mx-2">
      <div>
        <span>
          <b>{props.label}</b>
        </span>
      </div>
      <input
        onKeyDown={(e) => {
          e.preventDefault();
          return false;
        }}
        type="text"
        className="form-control"
        onClick={() => {
          setDisplay(true);
        }}
      />
      <div
        className={`custom-checkbox-dropdown ${
          display ? "my-active" : "hidden"
        }`}
      >
        {props.options.map((x) => {
          return (
            <div key={x.id}>
              <input
                type="checkbox"
                value={x.value}
                checked={checkIfExists(x.value)}
                onChange={handleCheckBoxChange}
              ></input>
              <label>{x.name}</label>
            </div>
          );
        })}
        <div>
          <input
            type="button"
            className="checkbox-ok-btn"
            value="Ok"
            onClick={() => {
              setDisplay(false);
              props.handleSelection(selectedItems);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckBoxDropDownFilter;
