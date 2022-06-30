import React, { useEffect, useState } from "react";
import { ListGroup, Row, Col, Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceTaskList } from "../../../apiManager/services/bpmTaskServices";
import {
  setBPMTaskListActivePage,
  setBPMTaskLoader,
} from "../../../actions/bpmTaskActions";
import Loading from "../../../containers/Loading";
import moment from "moment";
// eslint-disable-next-line no-unused-vars
import {
  getProcessDataFromList,
  getFormattedDateAndTime,
} from "../../../apiManager/services/formatterService";
import TaskFilterComponent from "./search/TaskFilterComponent";
import Pagination from "react-js-pagination";
import { push } from "connected-react-router";
import {
  MAX_RESULTS,
  DOCUMENT_STATUS,
  PARTY_NAME,
  IS_CRIMINAL,
  NEXT_APPEARANCE_DATE,
  RESPONSIBILITY,
  COURT_OR_TRIBUNAL_FILE_NUMBER,
  DATE_SERVED,
} from "../constants/taskConstants";
import { getFirstResultIndex } from "../../../apiManager/services/taskSearchParamsFormatterService";
import TaskVariable from "./TaskVariable";

import { sortingList } from "../constants/taskConstants";
import { setFilterListSortParams } from "../../../actions/bpmTaskActions";

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
            v.name === "servedDate"
          );
        });
        return taskVariableList.length > 0;
      });
      setTaskServeLegalDocs(filteredTasks);
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
      console.log("sortList ", sortList);
      let updatedSortList = [...sortList];
      updatedSortList.push({ ...sort });
      console.log("updatedSortList ", updatedSortList);
      // ******** Why is the updateSortList(updatedSortList); not updating sortList?? ****
      updateSortList(updatedSortList);
      console.log("sortList ", sortList);
    };

    useEffect(() => {
      console.log("useeffect");
      console.log(sortList);
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
      console.log("test");
      console.log(sortOptions);
    };

    const partySort = (sort, command) => {
      console.log(sortList);
      console.log(sortOptions);

      if (sortList.length > 0) {
        console.log("test");
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

      console.log(sortOptions);
      console.log(sortList);

      //addSort(sort);
    };

    const renderTaskTable = () => {
      if ((tasksCount || taskList.length) && selectedFilter) {
        return (
          <>
            <table>
              <thead className="custom-table-header">
                <tr>
                  <th className="custom-th">
                    Party{" "}
                    <i
                      className="fa fa-angle-down fa-lg font-weight-light"
                      dat-title="Descending"
                      onClick={() => partySort("assignee", "desc")}
                    />
                  </th>
                  <th className="custom-th">
                    Status{" "}
                    <i
                      className="fa fa-angle-down fa-lg font-weight-light"
                      dat-title="Descending"
                      onClick={() => sorter()}
                    />
                  </th>
                  <th className="custom-th">
                    Responsibility{" "}
                    <i
                      className="fa fa-angle-down fa-lg font-weight-light"
                      dat-title="Descending"
                      onClick={() => sorter("staffGroup")}
                    />
                  </th>
                  <th className="custom-th">
                    Criminal{" "}
                    <i
                      className="fa fa-angle-down fa-lg font-weight-light"
                      dat-title="Descending"
                      onClick={() => sorter("isCriminal")}
                    />
                  </th>
                  <th className="custom-th">
                    Court/Tribunal File #{" "}
                    <i
                      className="fa fa-angle-down fa-lg font-weight-light"
                      dat-title="Descending"
                      onClick={() => sorter("courtOrTribunalFileNbr")}
                    />
                  </th>
                  <th className="custom-th">
                    Registry{" "}
                    <i
                      className="fa fa-angle-down fa-lg font-weight-light"
                      dat-title="Descending"
                      onClick={() => sorter()}
                    />
                  </th>
                  <th className="custom-th">
                    Date Served{" "}
                    <i
                      className="fa fa-angle-down fa-lg font-weight-light"
                      dat-title="Descending"
                      onClick={() => sorter("servedDate")}
                    />
                  </th>
                  <th className="custom-th">
                    Next Appearance Date{" "}
                    <i
                      className="fa fa-angle-down fa-lg font-weight-light"
                      dat-title="Descending"
                      onClick={() => sorter("nextAppearanceDate")}
                    />
                  </th>
                  <th className="custom-th">
                    Edited by{" "}
                    <i
                      className="fa fa-angle-down fa-lg font-weight-light"
                      dat-title="Descending"
                      onClick={() => sorter("assignee")}
                    />
                  </th>
                  <th>View/Edit Form </th>
                </tr>
              </thead>

              <tbody>
                {taskServeLegalDocs.map((task, index) => (
                  <tr key={task.id}>
                    <td>
                      {/* Party */}
                      {task._embedded.variable[PARTY_NAME].value}
                    </td>
                    <td>
                      {/* Status */}
                      {task._embedded.variable[DOCUMENT_STATUS].value}
                    </td>
                    <td>
                      {/* Responsibility */}
                      {task._embedded.variable[RESPONSIBILITY].value}
                    </td>
                    <td>
                      {/* Criminal */}
                      {task._embedded.variable[IS_CRIMINAL].value}
                    </td>
                    <td>
                      {/* Court/Tribunal File # */}
                      {
                        task._embedded.variable[COURT_OR_TRIBUNAL_FILE_NUMBER]
                          .value
                      }
                    </td>
                    <td>{/* Registry */}</td>
                    <td>
                      {/* Date Served */}
                      {timeFormatter(
                        task._embedded.variable[DATE_SERVED].value
                      )}
                    </td>
                    <td>
                      {/* Next Appearance Date */}
                      {timeFormatter(
                        task._embedded.variable[NEXT_APPEARANCE_DATE].value
                      )}
                    </td>
                    <td>
                      {/* Edited by */}
                      {task.assignee}
                    </td>
                    <td>
                      {/* View / Edit */}
                      <Button
                        className="button-view-edit"
                        onClick={() => {
                          onViewEditChanged(task);
                        }}
                      >
                        View/Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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
