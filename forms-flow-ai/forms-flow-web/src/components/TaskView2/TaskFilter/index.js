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
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import CheckBoxDropDownFilter from "./CheckBoxDropDownFilter/CheckBoxDropDownFilter";

const TaskFilter = React.memo(() => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [nxtApperanceStartDate, setNxtApperanceStartDate] = useState(null);
  const [nxtApperanceEndDate, setNxtApperanceEndDate] = useState(null);

  //const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  const searchRef = useRef();
  const criminalStatusRef = useRef();
  const documentStatusRef = useRef();
  const serveDateRef = useRef();
  const fileNumberRef = useRef();
  const documentTypeRef = useRef();
  const nextAppearanceDateRef = useRef();
  const editedByRef = useRef();
  const staffGroupRef = useRef();

  const [showTaskFilters, setShowTaskFilters] = useState(false);

  const filterSearchSelections = useSelector(
    (state) => state.bpmTasks.filterSearchSelections
  );

  const [selectedStaffGroups, setSelectedStaffGroups] = useState([]);

  const [filterList, setFilterList] = useState([]);
  const [searchList, setSearchList] = useState([]);

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

  const applyFilter = () => {
    let newSearchArray = [];

    if (staffGroupRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "Responsibility",
        name: "staffGroup",
        operator: "=",
        type: "variables",
        value: staffGroupRef.current.value,
      });
    }

    if (criminalStatusRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "isCriminal",
        name: "isCriminal",
        operator: "=",
        type: "variables",
        value: criminalStatusRef.current.value,
      });
    }

    if (documentStatusRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "documentStatus",
        name: "documentStatus",
        operator: "=",
        type: "variables",
        value: documentStatusRef.current.value,
      });
    }

    if (documentTypeRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "documentType",
        name: "documentType",
        operator: "=",
        type: "variables",
        value: documentTypeRef.current.value,
      });
    }

    selectedStaffGroups.map((x) => {
      newSearchArray.push({
        key: "name",
        label: "Staff Group",
        operator: "like",
        type: "string",
        value: x,
      });
    });

    if (nxtApperanceStartDate != null) {
      newSearchArray.push({
        key: "followUp",
        label: "Follow up Date",
        operator: "after",
        type: "date",
        value: `${nxtApperanceStartDate.getFullYear()}-${
          nxtApperanceStartDate.getMonth() + 1
        }-${nxtApperanceStartDate.getDate()}T00:00:00.000-0000`,
      });

      newSearchArray.push({
        key: "followUp",
        label: "Follow up Date",
        operator: "before",
        type: "date",
        value: `${nxtApperanceEndDate.getFullYear()}-${
          nxtApperanceEndDate.getMonth() + 1
        }-${nxtApperanceEndDate.getDate()}T23:59:00.000-0000`,
      });
    }

    if (startDate != null) {
      newSearchArray.push({
        key: "dueDate",
        label: "Due Date",
        operator: "after",
        type: "date",
        value: `${startDate.getFullYear()}-${
          startDate.getMonth() + 1
        }-${startDate.getDate()}T00:00:00.000-0000`,
      });

      newSearchArray.push({
        key: "dueDate",
        label: "Due Date",
        operator: "before",
        type: "date",
        value: `${endDate.getFullYear()}-${
          endDate.getMonth() + 1
        }-${endDate.getDate()}T23:59:00.000-0000`,
      });
    }

    setFilterList(newSearchArray);

    dispatch(setFilterListSearchParams([...searchList, ...newSearchArray]));
  };

  const applySearch = () => {
    let newSearchArray = [];

    if (searchRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "partyName",
        name: "partyName",
        operator: "like",
        type: "variables",
        value: searchRef.current.value,
      });
    }

    if (fileNumberRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "courtOrTribunalFileNbr",
        name: "courtOrTribunalFileNbr",
        operator: "like",
        type: "variables",
        value: fileNumberRef.current.value,
      });
    }

    if (editedByRef.current.value != "") {
      newSearchArray.push({
        key: "assignee",
        label: "Assignee",
        operator: "like",
        type: "string",
        value: editedByRef.current.value,
      });
    }

    dispatch(setFilterListSearchParams([...filterList, ...newSearchArray]));

    setSearchList(newSearchArray);

    console.log("Updated Search Array", newSearchArray);
  };

  const handleStaffGroupClick = (selectedItems) => {
    //e.preventDefault();
    console.log("selectedItems", selectedItems);
    setSelectedStaffGroups(selectedItems);
    //dispathFilter("staffgroup", "like", staffGroupRef.current.value);
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

  const documentType = [
    {
      id: 0,
      value: "",
      name: "",
    },
    {
      id: 1,
      value: "noticeOfConstitutionalQuestionAndSupportingDocuments",
      name: "Notice Of Constitutional Question And Supporting Documents",
    },
  ];

  const staffGroup = [
    {
      id: 0,
      value: "",
      name: "Select",
      isSelected: false,
    },
    {
      id: 1,
      value: "bcps",
      name: "BCPS",
      isSelected: true,
    },
    {
      id: 2,
      value: "lsb",
      name: "LSB",
      isSelected: false,
    },
    {
      id: 3,
      value: "joint",
      name: "JOINT",
      isSelected: false,
    },
  ];

  return (
    <div>
      <div className="my-2">
        <TextSearch
          placeholdertext="Name"
          searchRef={searchRef}
          handleClick={applySearch}
          label="Party Name"
        ></TextSearch>
        <TextSearch
          placeholdertext="File #"
          searchRef={fileNumberRef}
          handleClick={applySearch}
          label="Court/Tribunal File #"
        ></TextSearch>
        <TextSearch
          placeholdertext="Edited by"
          searchRef={editedByRef}
          handleClick={applySearch}
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
      <Modal show={showTaskFilters} onHide={handleShowFilters} keyboard={false}>
        <Modal.Header closeButton className="btn-primary modal-header-custom">
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-2">
            <div className="col-6">
              <DropdownFilter
                label="Responsiblity"
                controlRef={staffGroupRef}
                options={staffGroup}
              ></DropdownFilter>
              {/* <CheckBoxDropDownFilter
                label="Responsiblity"
                options={staffGroup}
                handleSelection={handleStaffGroupClick}
              ></CheckBoxDropDownFilter> */}
            </div>
            <div className="col-6">
              <DropdownFilter
                label="Document Status"
                controlRef={documentStatusRef}
                options={documentStatusOptions}
              ></DropdownFilter>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <DropdownFilter
                label="Criminal Matter"
                controlRef={criminalStatusRef}
                options={crimalStatusOptions}
              ></DropdownFilter>
            </div>
            <div className="col-6 mb-2">
              <DropdownFilter
                label="Document Type"
                controlRef={documentTypeRef}
                options={documentType}
              ></DropdownFilter>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-12">
              <div className="mx-2">
                <b>Serve Date</b>
              </div>
              <div class="row mx-1">
                <div class="col-6">
                  <div>From:</div>
                  <DatePicker
                    className="form-control"
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      setEndDate(date);
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
                <div class="col-6">
                  <div>To:</div>
                  <DatePicker
                    className="form-control"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-12">
              <div className="mx-2">
                <b>Next Apperance Date</b>
              </div>
              <div class="row mx-1">
                <div class="col-6">
                  <div>From:</div>
                  <DatePicker
                    className="form-control"
                    selected={nxtApperanceStartDate}
                    onChange={(date) => {
                      setNxtApperanceEndDate(date);
                      setNxtApperanceStartDate(date);
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
                <div class="col-6">
                  <div>To:</div>
                  <DatePicker
                    className="form-control"
                    selected={nxtApperanceEndDate}
                    onChange={(date) => setNxtApperanceEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShowFilters}>
            Close
          </Button>
          <Button
            variant="primary"
            className="buttonColor"
            onClick={() => {
              handleShowFilters();
              applyFilter();
            }}
          >
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default TaskFilter;
