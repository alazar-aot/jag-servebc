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

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "react-bootstrap";
import { getLocalDateTime } from "../../../apiManager/services/formatterService";
import { getoptions } from "./pagination";
import { MAX_RESULTS } from "../../ServiceFlow/constants/taskConstants";

const TaskTable = React.memo(() => {
  const dispatch = useDispatch();
  const taskList = useSelector((state) => state.bpmTasks.tasksList);
  const tasksCount = useSelector((state) => state.bpmTasks.tasksCount);
  const countPerPage = MAX_RESULTS;
  const page = useSelector((state) => state.bpmTasks.activePage);
  const selectedFilter = useSelector((state) => state.bpmTasks.selectedFilter);
  const reqData = useSelector((state) => state.bpmTasks.listReqParams);

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
        //setIsLoading(true)
      }
    }
    //dispatch(setCountPerpage(newState.sizePerPage));
    //dispatch(FilterApplications(newState));
    dispatch(setBPMTaskListActivePage(newState.page));
  };

  // TODO: Make this an enum? or some sort of data structure?
  const documentStatus = "_embedded.variable[0].value";
  const partyName = "_embedded.variable[1].value";
  const isCriminal = "_embedded.variable[2].value";
  const nextAppearanceDate = "_embedded.variable[3].value";
  const staffGroup = "_embedded.variable[4].value";
  const courtOrTribunalFileNbr = "_embedded.variable[5].value";
  const servedDate = "_embedded.variable[6].value";

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

  // TODO: implement
  const onViewEditChanged = () => {
    console.log("ViewEditButton clicked!");
  };

  function timeFormatter(cell) {
    const localdate = getLocalDateTime(cell);
    return <label title={cell}>{localdate}</label>;
  }

  // TODO: Move to Table component
  const columns = [
    {
      dataField: partyName,
      text: "Party",
      sort: true,
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
    },
    {
      dataField: "assignee",
      text: "Edited by",
    },
    {
      formatter: ViewEditButton,
    },
  ];

  return (
    <>
      <BootstrapTable
        keyField="id"
        data={taskList}
        columns={columns}
        striped
        hover
        bordered={false}
        pagination={paginationFactory(
          getoptions(tasksCount, page, countPerPage)
        )}
        onTableChange={handlePageChange}
      />
    </>
  );
});

export default TaskTable;
