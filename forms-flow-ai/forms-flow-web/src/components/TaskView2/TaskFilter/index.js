import React, { useEffect, useRef, useState } from "react";
import { setFilterListSearchParams } from "../../../actions/bpmTaskActions";
import { useDispatch, useSelector } from "react-redux";
import classes from "./TaskFilter.scss";
import DropdownFilter from "./DropdownFilter/DropdownFilter";
import DateFilter from "./DateFilter/DateFilter";
import user from "../../../modules/userDetailReducer";
import TextSearch from "./TextSearchFilter/TextSearch";
import { Button } from "react-bootstrap";

const TaskFilter = React.memo(() => {
  const searchRef = useRef();
  const criminalStatusRef = useRef();
  const documentStatusRef = useRef();
  const serveDateRef = useRef();
  const fileNumberRef = useRef();
  const nextAppearanceDateRef = useRef();
  const editedByRef = useRef();

  const [partyName, setPartyName] = useState();

  const filterSearchSelections = useSelector(
    (state) => state.bpmTasks.filterSearchSelections
  );

  const setValueInControls = () => {};

  setValueInControls();
  console.log(
    "state.bpmTasks",
    useSelector((state) => state.bpmTasks)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("filterSearchSelections", filterSearchSelections);

    setValueInControls();
  }, [filterSearchSelections]);

  const handlePartyNameSearchClick = (e) => {
    e.preventDefault();
    dispathFilter("partyName", "=", searchRef.current.value);
  };

  const handleCourtFileNumberSearchClick = (e) => {
    e.preventDefault();
    dispathFilter("courtOrTribunalFileNbr", "=", searchRef.current.value);
  };

  const handleEditedBySearchClick = (e) => {
    e.preventDefault();
    dispathFilter("assignee", "like", editedByRef.current.value);
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
      if (param == "assignee") {
        dispatch(
          setFilterListSearchParams([
            ...searchParms,

            {
              key: "assignee",
              label: "Assignee",
              operator: criteria,
              type: "string",
              value: searchValue,
            },
          ])
        );
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
    }
  };

  const handleClearFilter = () => {
    searchRef.current.value = "";
    fileNumberRef.current.value = "";
    documentStatusRef.current.value = "";
    criminalStatusRef.current.value = "";
    serveDateRef.current.value = null;
    nextAppearanceDateRef.current.value = null;
    editedByRef.current.value = null;
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
    <div className="task-filter p-2">
      <TextSearch
        placeholdertext="Name"
        searchRef={searchRef}
        handleClick={handlePartyNameSearchClick}
        label="Party Name"
      ></TextSearch>
      <TextSearch
        placeholdertext="File #"
        searchRef={fileNumberRef}
        handleClick={handleCourtFileNumberSearchClick}
        label="Court/Tribunal File #"
      ></TextSearch>
      <TextSearch
        placeholdertext="Edited by"
        searchRef={editedByRef}
        handleClick={handleEditedBySearchClick}
        label="Edited by"
      ></TextSearch>
      <DropdownFilter
        label="Status"
        criminalStatusRef={documentStatusRef}
        handleSelectChagne={handleDocumentStatusSelectChagne}
        options={documentStatusOptions}
      ></DropdownFilter>
      <DropdownFilter
        label="Criminal Matter"
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
      {/* <span >
        <span className="p-1">
       
        </span>
      </span> */}
      <Button onClick={handleClearFilter} className="clearSearch m-1">
        Clear
        <i className="fa fa-solid fa-filter pr-1"></i>
      </Button>
    </div>
  );
});

export default TaskFilter;
