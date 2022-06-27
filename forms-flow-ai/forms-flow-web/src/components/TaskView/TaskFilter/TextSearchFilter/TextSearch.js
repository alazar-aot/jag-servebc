import React from "react";

const TextSearch = (props) => {
  return (
    <span className="SearchControl">
      <div>
        <span>
          <b>{props.label}</b>
        </span>
      </div>
      <div className="fullbox">
        <input
          ref={props.searchRef}
          type="text"
          className="form-control SearchInput"
          placeholder={props.placeholdertext}
        ></input>
        <i
          className="fa-solid fa fa-search ml-1 SearchInputIcon"
          onClick={props.handleClick}
        ></i>
      </div>
    </span>
  );
};

export default TextSearch;
