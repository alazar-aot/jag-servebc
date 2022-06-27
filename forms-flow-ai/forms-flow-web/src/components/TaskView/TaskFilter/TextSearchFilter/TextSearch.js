import React from "react";

const TextSearch = (props) => {
  return (
    <span className="SearchControl">
      <div>
        <span>Party name</span>
      </div>
      <div>
        <input
          ref={props.searchRef}
          type="text"
          className="form-control SearchInput"
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
