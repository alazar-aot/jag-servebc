import React, { useEffect, useRef, useState } from "react";
import { setFilterListSearchParams } from "../../../actions/bpmTaskActions";
import { useDispatch, useSelector } from "react-redux";
import classes from "./TaskFilter.scss";
import DropdownFilter from "./DropdownFilter/DropdownFilter";
import DateFilter from "./DateFilter/DateFilter";
import user from "../../../modules/userDetailReducer";
import TextSearch from "./TextSearchFilter/TextSearch";

const TaskFilter = React.memo(() => {
  const searchRef = useRef();
  const criminalStatusRef = useRef();
  const documentStatusRef = useRef();
  const serveDateRef = useRef();
  const fileNumberRef = useRef();
  const nextAppearanceDateRef = useRef();

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

  const handlePartyNameSearchClick = (e) => {
    e.preventDefault();
    dispathFilter("partyName", "=", searchRef.current.value);
  };

  const handleCourtFileNumberSearchClick = (e) => {
    e.preventDefault();
    dispathFilter("courtOrTribunalFileNbr", "=", searchRef.current.value);
  };

  const handleSelectChagne = (e) => {
    e.preventDefault();
    dispathFilter("isCriminal", "=", criminalStatusRef.current.value);
  };

  const handleDocumentStatusSelectChagne = (e) => {
    e.preventDefault();
    dispathFilter("documentStatus", "=", documentStatusRef.current.value);
  };

  const handleDateChange = (e) => {
    e.preventDefault();
    dispathFilter("servedDate", ">", serveDateRef.current.value);
  };

  const nextAppearanceDateHandler = (e) => {
    e.preventDefault();
    dispathFilter(
      "nextAppearanceDate",
      ">",
      nextAppearanceDateRef.current.value
    );
  };

  const dispathFilter = (param, criteria, searchValue) => {
    let searchParms = filterSearchSelections.filter((x) => x.name != param);

    if (searchValue == "" || searchValue == null) {
      dispatch(setFilterListSearchParams([...searchParms]));
    } else {
      dispatch(
        setFilterListSearchParams([
          ...searchParms,

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
    }
  };

  const handleClearFilter = () => {
    searchRef.current.value = "";
    fileNumberRef.current.value = "";
    documentStatusRef.current.value = "";
    criminalStatusRef.current.value = "";
    serveDateRef.current.value = null;
    nextAppearanceDateRef.current.value = null;
    console.log();
    dispatch(setFilterListSearchParams([]));
  };

  const crimalStatusOptions = [
    {
      id: 0,
      value: "",
      name: "",
    },
    {
      id: 1,
      value: "Yes",
      name: "Yes",
    },
    {
      id: 2,
      value: "No",
      name: "No",
    },
  ];

  const documentStatusOptions = [
    {
      id: 0,
      value: "",
      name: "",
    },
    {
      id: 1,
      value: "New",
      name: "New",
    },
    {
      id: 2,
      value: "Inprogress",
      name: "In Progress",
    },
    {
      id: 3,
      value: "Closed",
      name: "Closed",
    },
  ];

  return (
    <div class="task-filter p-2">
      <TextSearch
        searchRef={searchRef}
        handleClick={handlePartyNameSearchClick}
        label="Party Name"
      ></TextSearch>
      <TextSearch
        searchRef={fileNumberRef}
        handleClick={handleCourtFileNumberSearchClick}
        label="Court Tribunal File#"
      ></TextSearch>
      <DropdownFilter
        label="Status"
        criminalStatusRef={documentStatusRef}
        handleSelectChagne={handleDocumentStatusSelectChagne}
        options={documentStatusOptions}
      ></DropdownFilter>
      <DropdownFilter
        label="Criminal Status"
        criminalStatusRef={criminalStatusRef}
        handleSelectChagne={handleSelectChagne}
        options={crimalStatusOptions}
      ></DropdownFilter>
      <DateFilter
        label="Serve Date"
        serveDate={serveDateRef}
        handleDateChange={handleDateChange}
      ></DateFilter>
      <DateFilter
        label="Next Apperance Date"
        serveDate={nextAppearanceDateRef}
        handleDateChange={nextAppearanceDateHandler}
      ></DateFilter>
      <span onClick={handleClearFilter} className="clearSearch m-1">
        <span className="p-1">
          <span className="px-1">Clear</span>
          <i className="fa fa-solid fa-filter pr-1"></i>
        </span>
      </span>
    </div>
  );
});

export default TaskFilter;
