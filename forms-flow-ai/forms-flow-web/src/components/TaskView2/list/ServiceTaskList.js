import React, { useEffect, useState } from "react";
import { ListGroup, Row, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceTaskList } from "../../../apiManager/services/bpmTaskServices";
import {
  setBPMTaskListActivePage,
  setBPMTaskLoader,
} from "../../../actions/bpmTaskActions";
import Loading from "../../../containers/Loading";
// import moment from "moment";
// eslint-disable-next-line no-unused-vars
// import {
//   getProcessDataFromList,
//   getFormattedDateAndTime,
// } from "../../../apiManager/services/formatterService";
// import TaskFilterComponent from "./search/TaskFilterComponent";
import Pagination from "react-js-pagination";
import { push } from "connected-react-router";
import { MAX_RESULTS } from "../constants/taskConstants";
import { getFirstResultIndex } from "../../../apiManager/services/taskSearchParamsFormatterService";
import { sortingList } from "../constants/taskConstants";
import { setFilterListSortParams } from "../../../actions/bpmTaskActions";

// Import Table Components
import TaskTable from "./TaskTable";




const ServiceFlowTaskList = React.memo(
  ({ showApplicationSetter: showTaskDetailsSetter }) => {
    const taskList = useSelector((state) => state.bpmTasks.tasksList);
    //const taskVariable = useSelector((state)=>state.bpmTasks.selectedFilter?.properties?.variables ||[])
    const tasksCount = useSelector((state) => state.bpmTasks.tasksCount);

    // Toggle the showApplication variable on the View/Edit button click
    const [showTaskDetails, setShowTaskDetails] = React.useState(false);
    useEffect(() => {
      showTaskDetailsSetter(showTaskDetails);
    }, [showTaskDetailsSetter, showTaskDetails]);

    // Only render tasks that are related to the Serve Legal Documents Form
    // Otherwise, the application crashes if a different form has been submitted
    const [taskServeLegalDocs, setTaskServeLegalDocs] = React.useState([]);
    useEffect(() => {
      // filter task list for Serve Legal Document related tasks
      let filteredTasks = taskList.filter((t) => {
        // filter through all task variables
        let taskVariableList = t._embedded.variable.filter((v) => {
          return (
            v.name === "documentStatus" ||
            v.name === "partyName" ||
            v.name === "isCriminal" ||
            v.name === "nextAppearanceDate" ||
            v.name === "staffGroup" ||
            v.name === "courtOrTribunalFileNbr" ||
            v.name === "servedDate" ||
            v.name === "lawyerName" ||
            v.name === "registry"
          );
        });
        return taskVariableList.length > 0;
      });
      setTaskServeLegalDocs(filteredTasks);
      // console.log('Task List: ', taskList);
    }, [taskList]);

    const bpmTaskId = useSelector((state) => state.bpmTasks.taskId);
    const isTaskListLoading = useSelector(
      (state) => state.bpmTasks.isTaskListLoading
    );
    const reqData = useSelector((state) => state.bpmTasks.listReqParams);
    const dispatch = useDispatch();
    // eslint-disable-next-line no-unused-vars
    const processList = useSelector((state) => state.bpmTasks.processList);
    const selectedFilter = useSelector(
      (state) => state.bpmTasks.selectedFilter
    );
    const activePage = useSelector((state) => state.bpmTasks.activePage);
    const tasksPerPage = MAX_RESULTS;
    const taskVariableObject = useSelector(
      (state) => state.bpmTasks.selectedFilterAction
    );

    useEffect(() => {
      if (selectedFilter) {
        dispatch(setBPMTaskLoader(true));
        dispatch(setBPMTaskListActivePage(1));
        dispatch(fetchServiceTaskList(selectedFilter.id, 0, reqData));
      }
    }, [dispatch, selectedFilter, reqData]);

    const getTaskDetails = (taskId) => {
      if (taskId !== bpmTaskId) {
        dispatch(push(`/task_new2/${taskId}`));
      }
    };

    const handlePageChange = (pageNumber) => {
      dispatch(setBPMTaskListActivePage(pageNumber));
      dispatch(setBPMTaskLoader(true));
      let firstResultIndex = getFirstResultIndex(pageNumber);
      dispatch(
        fetchServiceTaskList(selectedFilter.id, firstResultIndex, reqData)
      );
    };

    function timeFormatter(cell) {
      if (cell == null || cell == "" || cell == undefined) {
        return " ";
      }

      const date = new Date(cell);
      const year = date.getFullYear();
      const month = date.toLocaleString("en-US", { month: "short" });
      const day = ("0" + date.getDate()).slice(-2);
      const localdate = year + "/" + month.toUpperCase() + "/" + day;

      return <label title={cell}>{localdate}</label>;
    }

    // Show Task details in a new view
    const onViewEditChanged = (row) => {
      getTaskDetails(row.id);
      setShowTaskDetails(true);
    };

    const getSortOptions = (options) => {
      const optionsArray = [];
      sortingList.forEach((sortOption) => {
        if (!options.some((option) => option.sortBy === sortOption.sortBy)) {
          optionsArray.push({ ...sortOption });
        }
      });
      return optionsArray;
    };

    const sortingData = useSelector(
      (state) => state.bpmTasks.filterListSortParams.sorting
    );
    const [sortList, updateSortList] = useState(sortingData);
    const [sortOptions, setSortOptions] = useState([]);

    const addSort = (sort) => {
      let updatedSortList = [...sortList];
      updatedSortList.push({ ...sort });
      // ******** Why is the updateSortList(updatedSortList); not updating sortList?? ****
      updateSortList(updatedSortList);
    };

    useEffect(() => {
      setSortOptions(getSortOptions(sortList));
      dispatch(setFilterListSortParams(sortList));
    }, [sortList, dispatch]);

    const updateSortOrder = (index, sortOrder) => {
      let updatedSortList = [...sortList];
      updatedSortList[index].sortOrder = sortOrder;
      updateSortList(updatedSortList);
    };

    const updateSort = (sort, index) => {
      let updatedSortList = [...sortList];
      updatedSortList[index].label = sort.label;
      updatedSortList[index].sortBy = sort.sortBy;
      updateSortList(updatedSortList);
    };

    const deleteSort = (index) => {
      let updatedSortList = [...sortList];
      updatedSortList.splice(index, 1);
      updateSortList(updatedSortList);
    };

    const sorter = () => {
      console.log(sortOptions);
    };

    const partySort = (sort, command) => {
      console.log(sortList);
      console.log(sortOptions);

      if (sortList.length > 0) {
        deleteSort(0);
      }

      sortOptions.map((sortType, index) => {
        if (sortType.sortBy === sort) {
          addSort(sortType);
        }
      });

      sortList.map((sort, index) => {
        if (sortList.length > 1 && command === "delete") {
          deleteSort(index);
        } else if (command === "update") {
          updateSort(sort, index);
        } else if (command === "desc") {
          updateSortOrder(index, "desc");
        } else if (command === "asc") {
          addSort(sort);
          updateSortOrder(index, "asc");
        }
      });

      //addSort(sort);
    };

    // Define list of table headers that need to be displayed
    // Order matters, should map to order of table columns left -> right
    const tableHeaders = [
      'Party',
      'Status',
      'Responsibility', 
      'Criminal Matter', 
      'Court/Tribunal File #', 
      'Date Served', 
      'Next Appearance Date', 
      'Registry', 
      'Document Type', 
      'Lawyer',
      'Edited by',
      'View/Edit Form'
    ];

    const renderTaskTable = () => {
      if ((tasksCount || taskList.length) && selectedFilter) {
        return (
          <>
            <TaskTable 
              tableHeaders={tableHeaders} 
              taskServeLegalDocs={taskServeLegalDocs}
              timeFormatter={timeFormatter}
              sorter={sorter}
              onViewEditChanged={onViewEditChanged} 
            />

            <div className="pagination-wrapper">
              <Pagination
                activePage={activePage}
                itemsCountPerPage={tasksPerPage}
                totalItemsCount={tasksCount}
                pageRangeDisplayed={3}
                onChange={handlePageChange}
                prevPageText="<"
                nextPageText=">"
              />
            </div>
          </>
        );
      } else {
        return (
          <Row className="not-selected mt-2 ml-1">
            <i className="fa fa-info-circle mr-2 mt-1" />
            No task matching filters found.
          </Row>
        );
      }
    };

    return <>{isTaskListLoading ? <Loading /> : renderTaskTable()}</>;
  }
);

export default ServiceFlowTaskList;
