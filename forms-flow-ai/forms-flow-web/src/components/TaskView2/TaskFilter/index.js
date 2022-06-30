import React, { useEffect, useRef, useState } from "react";
import {
  setFilterListSearchParams,
  setIsVariableValueIgnoreCase,
} from "../../../actions/bpmTaskActions";
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
  const staffGroupRef = useRef();

  const [showTaskFilters, setShowTaskFilters] = useState(false);

  const filterSearchSelections = useSelector(
    (state) => state.bpmTasks.filterSearchSelections
  );

  const setValueInControls = () => {};

  useEffect(() => {
    dispatch(setIsVariableValueIgnoreCase(true));
  }, []);

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

  const handleShowFilters = () => {
    setShowTaskFilters(!showTaskFilters);
  };

  const handlePartyNameSearchClick = (e) => {
    e.preventDefault();
    dispathFilter("partyName", "like", searchRef.current.value);
  };

  const handleCourtFileNumberSearchClick = (e) => {
    e.preventDefault();
    dispathFilter("courtOrTribunalFileNbr", "like", searchRef.current.value);
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

  const handleStaffGroupClick = (e) => {
    e.preventDefault();
    dispathFilter("staffgroup", "like", staffGroupRef.current.value);
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
      } else if (param == "staffgroup") {
        dispatch(
          setFilterListSearchParams([
            {
              key: "name",
              label: "Staff Group",
              operator: "like",
              type: "string",
              value: searchValue,
            },
          ])
        );
      } else if (param == "servedDate") {
        dispatch(
          setFilterListSearchParams([
            ...searchParms,

            {
              key: "servedDate",
              label: "Served Date",
              name: param,
              operator: "before",
              type: "date",
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
              label: param,
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

  const handleDeleteFilter = (index) => {
    var filteredArr = [...filterSearchSelections];

    filteredArr.splice(index, 1);

    console.log(filteredArr);

    dispatch(setFilterListSearchParams(filteredArr));
  };

  const handleClearFilter = () => {
    searchRef.current.value = "";
    fileNumberRef.current.value = "";
    documentStatusRef.current.value = "";
    criminalStatusRef.current.value = "";
    serveDateRef.current.value = null;
    nextAppearanceDateRef.current.value = null;
    editedByRef.current.value = null;
    staffGroupRef.current.value = null;

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

  const staffGroup = [
    {
      id: 0,
      value: "",
      name: "",
    },
    {
      id: 1,
      value: "bcps",
      name: "bcps",
    },
    {
      id: 2,
      value: "lsb",
      name: "lsb",
    },
    {
      id: 3,
      value: "joint",
      name: "joint",
    },
  ];

  return (
    <div>
      <div class="my-2">
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
        <span className="float-right showFilter" onClick={handleShowFilters}>
          Show Filters <i className="fa fa-solid fa-filter pr-1"></i>
        </span>
      </div>
      <div>
        {filterSearchSelections.map((x, index) => {
          return (
            <span className="text-muted">
              {x.label} : {x.value}
              <span
                onClick={() => {
                  handleDeleteFilter(index);
                }}
              >
                <i className="fa fa-solid fa-close p-2"></i>
              </span>
            </span>
          );
        })}
      </div>
      <div className={`popup-box ${showTaskFilters ? "showbox" : ""}`}>
        <div className="box">
          <span className="close-icon" onClick={handleShowFilters}>
            x
          </span>
          <div className="task-filter p-2">
            <DropdownFilter
              label="Staff Group"
              criminalStatusRef={staffGroupRef}
              handleSelectChagne={handleStaffGroupClick}
              options={staffGroup}
            ></DropdownFilter>
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
            <div>
              <button
                className="btn btn-success m-2"
                value="Close"
                onClick={handleShowFilters}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TaskFilter;
