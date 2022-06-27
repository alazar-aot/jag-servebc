import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../TaskView.scss";
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
import { getLocalDateTime } from "../../../apiManager/services/formatterService";
import { getoptions } from "./pagination";
import { MAX_RESULTS } from "../../ServiceFlow/constants/taskConstants";

import { push } from "connected-react-router";

const TaskTable = React.memo(({ showApplicationSetter }) => {
  const dispatch = useDispatch();
  const taskList = useSelector((state) => state.bpmTasks.tasksList);
  //const tasksCount = useSelector((state) => state.bpmTasks.tasksCount);
  const countPerPage = MAX_RESULTS;
  const page = useSelector((state) => state.bpmTasks.activePage);
  const selectedFilter = useSelector((state) => state.bpmTasks.selectedFilter);
  const reqData = useSelector((state) => state.bpmTasks.listReqParams);
  const [showApplication, setShowApplication] = React.useState(false);

  useEffect(() => {
    showApplicationSetter(showApplication);
  }, [showApplicationSetter, showApplication]);

  // TODO: Make this an enum? or some sort of data structure?
  const documentStatus = "_embedded.variable[0].value";
  const partyName = "_embedded.variable[1].value";
  const isCriminal = "_embedded.variable[2].value";
  const nextAppearanceDate = "_embedded.variable[3].value";
  const staffGroup = "_embedded.variable[4].value";
  const courtOrTribunalFileNbr = "_embedded.variable[5].value";
  const servedDate = "_embedded.variable[6].value";

  // Only render tasks that are related to the Serve Legal Documents Form
  const [taskServeLegalDocs, setTaskServeLegalDocs] = React.useState([]);
  const [taskServeLegalDocsCount, setTaskServeLegalDocsCount] =
    React.useState(0);
  useEffect(() => {
    // filter task list for Serve Legal Document related tasks
    let filteredTasks = taskList.filter((t) => {
      // filter task variables
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

  // Pagination
  const useNoRenderRef = (currentValue) => {
    const ref = useRef(currentValue);
    ref.current = currentValue;
    return ref;
  };
  const countPerPageRef = useNoRenderRef(countPerPage);
  const currentPage = useNoRenderRef(page);

  useEffect(() => {
    dispatch(setBPMFilterLoader(true));
    dispatch(fetchFilterList());
    dispatch(fetchProcessDefinitionList());
    // dispatch(fetchUserList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchServiceTaskList(currentPage.current, countPerPageRef.current)
    );
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
    //dispatch(setCountPerpage(newState.sizePerPage));
    //dispatch(FilterApplications(newState));
    dispatch(setBPMTaskListActivePage(newState.page));
  };

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
        onClick={() => {
          onViewEditChanged(row);
        }}
      >
        View/Edit
      </Button>
    );
  };

  // Show application
  const bpmTaskId = useSelector((state) => state.bpmTasks.taskId);
  const getTaskDetails = (taskId) => {
    if (taskId !== bpmTaskId) {
      dispatch(push(`/task_new/${taskId}`));
    }
  };

  const onViewEditChanged = (row) => {
    console.log("ViewEditButton clicked!");
    console.log(row.id);
    getTaskDetails(row.id);
    setShowApplication(true);
  };

  function timeFormatter(cell) {
    cell = new Date(cell);
    const localdate = getLocalDateTime(
      cell.toISOString().replace("T", " ").replace("Z", "")
    );
    return <label title={cell}>{localdate}</label>;
  }

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
    />
  );
});

export default TaskTable;
