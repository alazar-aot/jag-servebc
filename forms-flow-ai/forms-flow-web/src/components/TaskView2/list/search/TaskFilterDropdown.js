import { taskFilters } from "../../constants/taskConstants";
import React from "react";

const TaskFilterDropdown = React.memo(({ onFilterSelect }) => {
  return (
    <div className="filter-items">
      {taskFilters.map((filter,index) => (
        <div
          key={index}
          className="clickable2 py-1 mb-2"
          onClick={() => onFilterSelect(filter)}
        >
          {filter.label}
        </div>
      ))}
    </div>
  );
});

export default TaskFilterDropdown;
