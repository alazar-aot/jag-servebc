import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./TaskTable.scss";
import {
  fetchFilterList,
  fetchProcessDefinitionList,
  fetchServiceTaskList,
} from "../../../apiManager/services/bpmTaskServices";
import {
  setBPMTaskListActivePage,
  setBPMTaskLoader,
  setBPMFilterLoader,
} from "../../../actions/bpmTaskActions";
import Loading from "../../../containers/Loading";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "react-bootstrap";
import { getoptions } from "./pagination";
import { MAX_RESULTS } from "../../ServiceFlow/constants/taskConstants";

import { push } from "connected-react-router";

const TaskTable = React.memo(({ showApplicationSetter: showTaskDetailsSetter }) => {
  const dispatch = useDispatch();
  const taskList = useSelector((state) => state.bpmTasks.tasksList);
  const countPerPage = MAX_RESULTS;
  const page = useSelector((state) => state.bpmTasks.activePage);
  const selectedFilter = useSelector((state) => state.bpmTasks.selectedFilter);
  const reqData = useSelector((state) => state.bpmTasks.listReqParams);
  
  // Toggle the showApplication variable on the View/Edit button click
  const [showTaskDetails, setShowTaskDetails] = React.useState(false);
  useEffect(() => {
    showTaskDetailsSetter(showTaskDetails);
  }, [showTaskDetailsSetter, showTaskDetails]);

  // These task variables are from Camunda and are specific to JAG Serve Legal Documents
  // See http://localhost:8000/camunda/app
  const documentStatus = "_embedded.variable[0].value";
  const partyName = "_embedded.variable[1].value";
  const isCriminal = "_embedded.variable[2].value";
  const nextAppearanceDate = "_embedded.variable[3].value";
  const staffGroup = "_embedded.variable[4].value";
  const courtOrTribunalFileNbr = "_embedded.variable[5].value";
  const servedDate = "_embedded.variable[6].value";

  // Only render tasks that are related to the Serve Legal Documents Form
  // Otherwise, the application crashes if a different form has been submitted
  const [taskServeLegalDocs, setTaskServeLegalDocs] = React.useState([]);
  const [taskServeLegalDocsCount, setTaskServeLegalDocsCount] = React.useState(0);
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
    setTaskServeLegalDocsCount(filteredTasks.length);
  }, [taskList]);

  const [isLoading, setIsLoading] = React.useState(false);
  useEffect(() => {
    setIsLoading(false);
  }, [taskList]);

  const getNoDataIndicationContent = () => {
    return (
      <div className="div-no-tasks">
        <label className="lbl-no-tasks"> No tasks found </label>
        <br />
        <label className="lbl-no-tasks-desc">
          {" "}
          Please change the selected filters to view tasks{" "}
        </label>
        <br />
      </div>
    );
  };

  // Used for Pagination
  const useNoRenderRef = (currentValue) => {
    const ref = useRef(currentValue);
    ref.current = currentValue;
    return ref;
  };
  const countPerPageRef = useNoRenderRef(countPerPage);
  const currentPage = useNoRenderRef(page);
  useEffect(() => {
    dispatch(fetchServiceTaskList(currentPage.current, countPerPageRef.current));
  }, [dispatch, currentPage, countPerPageRef]);

  const handlePageChange = (type, newState) => {
    if (type === "filter") {
      //setfiltermode(true)
    } else if (type === "pagination") {
      if (countPerPage > 5) {
        dispatch(setBPMTaskLoader(true));
      } else {
        setIsLoading(true);
      }
    }
    dispatch(setBPMTaskListActivePage(newState.page));
  };

  useEffect(() => {
    dispatch(setBPMFilterLoader(true));
    dispatch(fetchFilterList());
    dispatch(fetchProcessDefinitionList());
  }, [dispatch]);

  useEffect(() => {
    if (selectedFilter) {
      dispatch(setBPMTaskLoader(true));
      dispatch(setBPMTaskListActivePage(1));
      dispatch(fetchServiceTaskList(selectedFilter.id, 0, reqData));
    }
  }, [dispatch, selectedFilter, reqData]);

  const ViewEditButton = (cell, row, rowIndex, formatExtraData) => {
    return (
      <Button
        className="button-view-edit"
        onClick={() => {
          onViewEditChanged(row);
        }}
      >
        View/Edit
      </Button>
    );
  };

  // Show Task details in a new view
  const bpmTaskId = useSelector((state) => state.bpmTasks.taskId);
  const getTaskDetails = (taskId) => {
    if (taskId !== bpmTaskId) {
      dispatch(push(`/task_new/${taskId}`));
    }
  };

  const onViewEditChanged = (row) => {
    //console.log("ViewEditButton clicked!");
    getTaskDetails(row.id);
    setShowTaskDetails(true);
  };

  function timeFormatter(cell) {

    const date = new Date(cell);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', {month: 'short'});
    const day = ('0' + date.getDate()).slice(-2);
    const localdate = year + "/" + month.toUpperCase() + "/" + day;

    return <label title={cell}>{localdate}</label>;
  }

  const defaultSortedBy = [
    {
      dataField: "id",
      order: "desc",
    }
  ];

  const columns = [
    {
      dataField: partyName,
      text: "Party",
      sort: true,
      style: { minWidth: "200px" },
    },
    {
      dataField: documentStatus,
      text: "Status",
      sort: true,
    },
    {
      dataField: staffGroup,
      text: "Responsibility",
      sort: true,
    },
    {
      dataField: isCriminal,
      text: "Criminal?",
      sort: true,
    },
    {
      dataField: courtOrTribunalFileNbr,
      text: "Court Tribunal File #",
      sort: true,
    },
    {
      dataField: servedDate,
      text: "Date Served",
      sort: true,
      formatter: timeFormatter,
    },
    {
      dataField: nextAppearanceDate,
      text: "Next Appearance Date",
      sort: true,
      formatter: timeFormatter,
    },
    {
      dataField: "assignee",
      text: "Edited by",
    },
    {
      dataField: "",
      text: "",
      formatter: ViewEditButton,
    },
  ];


  if (isLoading) {
    return <Loading />;
  }

  return (
    <BootstrapTable
      keyField="id"
      loading={isLoading}
      data={taskServeLegalDocs}
      columns={columns}
      striped
      hover
      bordered={false}
      pagination={paginationFactory(
        getoptions(taskServeLegalDocsCount, page, countPerPage)
      )}
      noDataIndication={() => !isLoading && getNoDataIndicationContent()}
      onTableChange={handlePageChange}
      defaultSorted={ defaultSortedBy }
    />
  );
});

export default TaskTable;
