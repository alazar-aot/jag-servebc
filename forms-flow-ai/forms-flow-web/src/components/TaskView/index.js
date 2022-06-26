import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { ALL_TASKS } from "../ServiceFlow/constants/taskConstants";
import { setSelectedBPMFilter } from "../../actions/bpmTaskActions";

import ServiceFilter from "./ServiceFilter";
import TaskFilter from "./TaskFilter";
import TaskTable from "./TaskTable";

export default React.memo(() => {

  const dispatch = useDispatch();
  const filterList = useSelector((state) => state.bpmTasks.filterList);
  const isFilterLoading = useSelector(
    (state) => state.bpmTasks.isFilterLoading
  );
  const selectedFilter = useSelector((state) => state.bpmTasks.selectedFilter);

  useEffect(() => {
    if (!isFilterLoading && filterList.length && !selectedFilter) {
      let filterSelected;
      if (filterList.length > 1) {
        filterSelected = filterList.find((filter) => filter.name === ALL_TASKS);
        if (!filterSelected) {
          filterSelected = filterList[0];
        }
      } else {
        filterSelected = filterList[0];
      }
      dispatch(setSelectedBPMFilter(filterSelected));
    }
  }, [filterList, isFilterLoading, selectedFilter, dispatch]);

  return (
    <div className="container" id="main">
      {/* Task Title */}
      <div className="flex-container">
        <div className="flex-item-left">
          <div style={{ display: "flex" }}>
            <h3 className="task-head">
              {" "}
              <span className="forms-text" style={{ marginLeft: "1px" }}>
                Tasks
              </span>
            </h3>
          </div>
        </div>
      </div>

      <ServiceFilter />

      <TaskFilter />

      <TaskTable />

    </div>
  );
});
