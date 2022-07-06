import { useSelector } from "react-redux";

import React, { useEffect } from "react";

const Filters = (props) => {
  const filterSearchSelections = useSelector(
    (state) => state.bpmTasks.filterSearchSelections
  );

  useEffect(() => {
    console.log("filterSearchSelections", filterSearchSelections);
  }, [filterSearchSelections]);

  const filters = filterSearchSelections.map((x, index) => {
    return (
      <span key={index} className="filters m-1 p-1">
        {x.label} : {x.value}
        <span
          onClick={() => {
            props.handleDeleteFilter(index);
          }}
        >
          <i className="fa fa-solid fa-close p-2"></i>
        </span>
      </span>
    );
  });

  return filters;
};

export default Filters;
