import React, { useEffect, useRef, useState } from "react";
import { setFilterListSearchParams } from "../../../actions/bpmTaskActions";
import { useDispatch, useSelector } from "react-redux";
import classes from "./TaskFilter.scss";
import TextSearch from "./TextSearchFilter/TextSearch";
import DropdownFilter from "./DropdownFilter/DropdownFilter";
import DateFilter from "./DateFilter/DateFilter";

const TaskFilter = React.memo(() => {
  const searchRef = useRef();
  const criminalStatusRef = useRef();
  const serveDate = useRef();

  const filterSearchSelections = useSelector(
    (state) => state.bpmTasks.filterSearchSelections
  );

  console.log(
    "state.bpmTasks",
    useSelector((state) => state.bpmTasks)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("filterSearchSelections", filterSearchSelections);
  }, [filterSearchSelections]);

  const handleClick = (e) => {
    e.preventDefault();
    dispathFilter("partyName", "=", searchRef.current.value);
  };

  const handleSelectChagne = (e) => {
    e.preventDefault();
    dispathFilter("isCriminal", "=", criminalStatusRef.current.value);
  };

  const handleDateChange = (e) => {
    e.preventDefault();
    dispathFilter("servedDate", ">", serveDate.current.value);
  };

  const dispathFilter = (param, criteria, searchValue) => {
    dispatch(
      setFilterListSearchParams([
        {
          key: "processVariables",
          label: "Process Variables",
          name: param,
          operator: criteria,
          type: "variables",
          value: searchValue,
        },
      ])
    );
  };

  return (
    <div class="task-filter">
      <TextSearch searchRef={searchRef} handleClick={handleClick}></TextSearch>
      <DropdownFilter
        criminalStatusRef={criminalStatusRef}
        handleSelectChagne={handleSelectChagne}
      ></DropdownFilter>
      <DateFilter
        serveDate={serveDate}
        handleDateChange={handleDateChange}
      ></DateFilter>
    </div>
  );
});

export default TaskFilter;
