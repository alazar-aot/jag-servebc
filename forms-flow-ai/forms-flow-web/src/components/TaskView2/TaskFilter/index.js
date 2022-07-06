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
import {
  crimalStatusOptions,
  documentStatusOptions,
  documentType,
  staffGroup,
} from "./Constants";
import Filters from "./Filters";
import { set } from "lodash";

const TaskFilter = React.memo(() => {
  const dispatch = useDispatch();

  const [showTaskFilters, setShowTaskFilters] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [nxtApperanceStartDate, setNxtApperanceStartDate] = useState(null);
  const [nxtApperanceEndDate, setNxtApperanceEndDate] = useState(null);
  const [filterList, setFilterList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  //const [selectedStaffGroups, setSelectedStaffGroups] = useState([]);

  const searchRef = useRef();
  const criminalStatusRef = useRef();
  const documentStatusRef = useRef();
  const serveDateRef = useRef();
  const fileNumberRef = useRef();
  const documentTypeRef = useRef();
  const nextAppearanceDateRef = useRef();
  const editedByRef = useRef();
  const staffGroupRef = useRef();

  const lawyerNameRef = useRef();

  const filterSearchSelections = useSelector(
    (state) => state.bpmTasks.filterSearchSelections
  );

  useEffect(() => {
    dispatch(setIsVariableValueIgnoreCase(true));
  }, []);

  useEffect(() => {
    console.log("filterSearchSelections", filterSearchSelections);
  }, [filterSearchSelections]);

  const handleShowFilters = () => {
    setShowTaskFilters(!showTaskFilters);
  };

  useEffect(() => {
    filterList.map((x) => {
      if (x.name == "staffGroup") {
        staffGroupRef.current.value = x.value;
      }

      if (x.name == "isCriminal") {
        criminalStatusRef.current.value = x.value;
      }

      if (x.name == "documentStatus") {
        documentStatusRef.current.value = x.value;
      }

      if (x.name == "documentType") {
        documentTypeRef.current.value = x.value;
      }
    });
  }, [showTaskFilters]);

  const createSearchObject = (key, label, name, operator, type, value) => {
    const obj = {
      key: key,
      label: label,
      name: name,
      operator: operator,
      type: type,
      value: value,
    };
    return obj;
  };

  const applyFilter = () => {
    let newSearchArray = [];

    if (staffGroupRef.current.value != "") {
      newSearchArray.push(
        createSearchObject(
          "processVariables",
          "Responsibility",
          "staffGroup",
          "=",
          "variables",
          staffGroupRef.current.value
        )
      );
    }

    if (criminalStatusRef.current.value != "") {
      newSearchArray.push(
        createSearchObject(
          "processVariables",
          "Criminal Matter",
          "isCriminal",
          "=",
          "variables",
          criminalStatusRef.current.value
        )
      );
    }

    if (documentStatusRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "Document Status",
        name: "documentStatus",
        operator: "=",
        type: "variables",
        value: documentStatusRef.current.value,
      });
    }

    if (documentTypeRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "Document Type",
        name: "documentType",
        operator: "=",
        type: "variables",
        value: documentTypeRef.current.value,
      });
    }

    // selectedStaffGroups.map((x) => {
    //   newSearchArray.push({
    //     key: "name",
    //     label: "Staff Group",
    //     operator: "like",
    //     type: "string",
    //     value: x,
    //   });
    // });

    if (nxtApperanceStartDate != null) {
      newSearchArray.push({
        key: "followUp",
        label: "Next Apperance Date (From)",
        operator: "after",
        type: "date",
        value: `${nxtApperanceStartDate.getFullYear()}-${
          nxtApperanceStartDate.getMonth() + 1
        }-${nxtApperanceStartDate.getDate()}T00:00:00.000-0000`,
      });

      newSearchArray.push({
        key: "followUp",
        label: "Next Apperance Date (To)",
        operator: "before",
        type: "date",
        value: `${nxtApperanceEndDate.getFullYear()}-${
          nxtApperanceEndDate.getMonth() + 1
        }-${nxtApperanceEndDate.getDate()}T23:59:00.000-0000`,
      });
    }

    if (startDate != null) {
      newSearchArray.push({
        key: "due",
        label: "Serve Date (From):",
        operator: "after",
        type: "date",
        value: `${startDate.getFullYear()}-${
          startDate.getMonth() + 1
        }-${startDate.getDate()}T00:00:00.000-0000`,
      });

      newSearchArray.push({
        key: "due",
        label: "Serve Date (To):",
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
        label: "Party",
        name: "partyName",
        operator: "like",
        type: "variables",
        value: searchRef.current.value,
      });
    }

    if (fileNumberRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "Court/Tribunal File #",
        name: "courtOrTribunalFileNbr",
        operator: "like",
        type: "variables",
        value: fileNumberRef.current.value,
      });
    }

    if (editedByRef.current.value != "") {
      newSearchArray.push({
        key: "assignee",
        label: "Edited By",
        operator: "like",
        type: "string",
        value: editedByRef.current.value,
      });
    }

    if (lawyerNameRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "Lawyer Name",
        name: "lawyerName",
        operator: "like",
        type: "variables",
        value: lawyerNameRef.current.value,
      });
    }

    dispatch(setFilterListSearchParams([...filterList, ...newSearchArray]));

    setSearchList(newSearchArray);

    console.log("Updated Search Array", newSearchArray);
  };

  // const handleStaffGroupClick = (selectedItems) => {

  //   console.log("selectedItems", selectedItems);
  //   setSelectedStaffGroups(selectedItems);

  // };

  const handleDeleteFilter = (index) => {
    console.log(index);
    var filteredArr = [...filterSearchSelections];

    let selectedItem = { ...filteredArr[index] };

    if (selectedItem.key == "followUp") {
      let list = filterList.filter((x) => x.key != "followUp");
      setFilterList(list);
      var newlist = filterSearchSelections.filter((x) => x.key != "followUp");
      setNxtApperanceEndDate(null);
      setNxtApperanceStartDate(null);
      dispatch(setFilterListSearchParams(newlist));
    } else if (selectedItem.key == "due") {
      let list = filterList.filter((x) => x.key != "due");
      setFilterList(list);
      var newlist = filterSearchSelections.filter((x) => x.key != "due");
      setStartDate(null);
      setEndDate(null);
      dispatch(setFilterListSearchParams(newlist));
    } else {
      if (selectedItem.key == "processVariables") {
        let list = filterList.filter((x) => x.name != selectedItem.name);
        setFilterList(list);
      }

      filteredArr.splice(index, 1);

      console.log(filteredArr);

      dispatch(setFilterListSearchParams(filteredArr));
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
    staffGroupRef.current.value = null;

    dispatch(setFilterListSearchParams([]));
  };

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
        <TextSearch
          placeholdertext="Lawyer Name"
          searchRef={lawyerNameRef}
          handleClick={applySearch}
          label="Lawyer Name"
        ></TextSearch>
      </div>
      <div>
        <input
          type="button"
          className="btn button-view-edit"
          value="Add Filter +"
          onClick={handleShowFilters}
        ></input>
        {/* <span className="float-right showFilter" onClick={handleShowFilters}>
          Add Filters <i className="fa fa-solid fa-filter pr-1"></i>
        </span> */}
      </div>
      <div className="filterDiv">
        <Filters handleDeleteFilter={handleDeleteFilter}></Filters>
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
              <div className="row mx-1">
                <div className="col-6">
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
                <div className="col-6">
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
              <div className="row mx-1">
                <div className="col-6">
                  <div>From:</div>
                  <DatePicker
                    className="form-control"
                    selected={nxtApperanceStartDate}
                    onChange={(date) => {
                      setNxtApperanceEndDate(date);
                      setNxtApperanceStartDate(date);
                    }}
                    selectsStart
                    startDate={nxtApperanceStartDate}
                    endDate={nxtApperanceEndDate}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
                <div className="col-6">
                  <div>To:</div>
                  <DatePicker
                    className="form-control"
                    selected={nxtApperanceEndDate}
                    onChange={(date) => setNxtApperanceEndDate(date)}
                    selectsEnd
                    startDate={nxtApperanceStartDate}
                    endDate={nxtApperanceEndDate}
                    minDate={nxtApperanceStartDate}
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
