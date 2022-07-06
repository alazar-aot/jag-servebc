import React, { useCallback, useEffect, useRef } from "react";
import ServiceFlowTaskList from "./list/ServiceTaskList";
import ServiceFlowTaskDetails from "./details/ServiceTaskDetails";
import { Col, Container, Row } from "react-bootstrap";
import "./ServiceFlow.scss";
import {
  fetchFilterList,
  fetchProcessDefinitionList,
  fetchServiceTaskList,
  getBPMGroups,
  getBPMTaskDetail,
} from "../../apiManager/services/bpmTaskServices";
import { useDispatch, useSelector } from "react-redux";
import { ALL_TASKS } from "./constants/taskConstants";
import {
  reloadTaskFormSubmission,
  setBPMFilterLoader,
  setBPMTaskDetailLoader,
  setFilterListParams,
  setSelectedBPMFilter,
  setSelectedTaskID,
} from "../../actions/bpmTaskActions";
import TaskSortSelectedList from "./list/sort/TaskSortSelectedList";
import SocketIOService from "../../services/SocketIOService";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";
import { Route, Redirect } from "react-router-dom";
import { push } from "connected-react-router";

import TaskFilter from "./TaskFilter";
import { jsPDF } from "jspdf";

export default React.memo(() => {
  const dispatch = useDispatch();
  const filterList = useSelector((state) => state.bpmTasks.filterList);
  const isFilterLoading = useSelector(
    (state) => state.bpmTasks.isFilterLoading
  );
  const selectedFilter = useSelector((state) => state.bpmTasks.selectedFilter);
  const selectedFilterId = useSelector(
    (state) => state.bpmTasks.selectedFilter?.id || null
  );
  const bpmTaskId = useSelector((state) => state.bpmTasks.taskId);
  const reqData = useSelector((state) => state.bpmTasks.listReqParams);
  const sortParams = useSelector(
    (state) => state.bpmTasks.filterListSortParams
  );
  const searchParams = useSelector(
    (state) => state.bpmTasks.filterListSearchParams
  );
  const listReqParams = useSelector((state) => state.bpmTasks.listReqParams);
  const currentUser = useSelector(
    (state) => state.user?.userDetail?.preferred_username || ""
  );
  const firstResult = useSelector((state) => state.bpmTasks.firstResult);
  const taskList = useSelector((state) => state.bpmTasks.tasksList);
  const selectedFilterIdRef = useRef(selectedFilterId);
  const bpmTaskIdRef = useRef(bpmTaskId);
  const reqDataRef = useRef(reqData);
  const firstResultsRef = useRef(firstResult);
  const taskListRef = useRef(taskList);

  // Toggle the showApplication variable on the View/Edit button click
  const [showTaskDetails, setShowTaskDetails] = React.useState(false);
  const wrapperSetShowTaskDetails = useCallback((val) => {
    setShowTaskDetails(val);
  },[setShowTaskDetails]);

  useEffect(() => {
    selectedFilterIdRef.current = selectedFilterId;
    bpmTaskIdRef.current = bpmTaskId;
    reqDataRef.current = reqData;
    firstResultsRef.current = firstResult;
    taskListRef.current = taskList;
  });

  useEffect(() => {
    const reqParamData = {
      ...{ sorting: [...sortParams.sorting] },
      ...searchParams,
    };
    if (!isEqual(reqParamData, listReqParams)) {
      dispatch(setFilterListParams(cloneDeep(reqParamData)));
    }
  }, [searchParams, sortParams, dispatch, listReqParams]);

  useEffect(() => {
    dispatch(setBPMFilterLoader(true));
    dispatch(fetchFilterList());
    dispatch(fetchProcessDefinitionList());
    // dispatch(fetchUserList());
  }, [dispatch]);

  useEffect(() => {
    if (!isFilterLoading && filterList.length && !selectedFilter) {
      let filterSelected;
      if (filterList.length > 1) {
        filterSelected = filterList.find((filter) => filter.name === ALL_TASKS);
        if (!filterSelected) {
          filterSelected = filterList[0];
        }
      } else {
        filterSelected = filterList[0];
      }
      dispatch(setSelectedBPMFilter(filterSelected));
    }
  }, [filterList, isFilterLoading, selectedFilter, dispatch]);

  const checkIfTaskIDExistsInList = (list, id) => {
    return list.some((task) => task.id === id);
  };

  
  const SocketIOCallback = useCallback(
    (refreshedTaskId, forceReload, isUpdateEvent) => {
      if (forceReload) {
        dispatch(
          fetchServiceTaskList(
            selectedFilterIdRef.current,
            firstResultsRef.current,
            reqDataRef.current,
            refreshedTaskId
          )
        ); //Refreshes the Tasks
        if (bpmTaskIdRef.current && refreshedTaskId === bpmTaskIdRef.current) {
          dispatch(setBPMTaskDetailLoader(true));
          dispatch(setSelectedTaskID(null)); // unSelect the Task Selected
          dispatch(push(`/task_new2/`));
        }
      } else {
        if (selectedFilterIdRef.current) {
          if (isUpdateEvent) {
            /* Check if the taskId exists in the loaded Task List */
            if (
              checkIfTaskIDExistsInList(
                taskListRef.current,
                refreshedTaskId
              ) === true
            ) {
              dispatch(
                fetchServiceTaskList(
                  selectedFilterIdRef.current,
                  firstResultsRef.current,
                  reqDataRef.current
                )
              ); //Refreshes the Task
            }
          } else {
            dispatch(
              fetchServiceTaskList(
                selectedFilterIdRef.current,
                firstResultsRef.current,
                reqDataRef.current
              )
            ); //Refreshes the Task
          }
        }
        if (bpmTaskIdRef.current && refreshedTaskId === bpmTaskIdRef.current) {
          //Refreshes task if its selected
          dispatch(
            getBPMTaskDetail(bpmTaskIdRef.current, (err, resTask) => {
              // Should dispatch When task claimed user  is not the logged in User
              if (resTask?.assignee !== currentUser) {
                dispatch(reloadTaskFormSubmission(true));
              }
            })
          );
          dispatch(getBPMGroups(bpmTaskIdRef.current));
        }
      }
    },
    [dispatch, currentUser]
  );

  useEffect(() => {
    if (!SocketIOService.isConnected()) {
      SocketIOService.connect((refreshedTaskId, forceReload, isUpdateEvent) =>
        SocketIOCallback(refreshedTaskId, forceReload, isUpdateEvent)
      );
    } else {
      SocketIOService.disconnect();
      SocketIOService.connect((refreshedTaskId, forceReload, isUpdateEvent) =>
        SocketIOCallback(refreshedTaskId, forceReload, isUpdateEvent)
      );
    }
    return () => {
      if (SocketIOService.isConnected()) SocketIOService.disconnect();
    };
  }, [SocketIOCallback, dispatch]);

  const onClickBackButton = () => {
    dispatch(push(`/task_new2`));
    setShowTaskDetails(false);
  };

  const handlePrintTablePDF = () => {
    // const doc = new jsPDF('p', 'pt', [window.innerHeight, window.innerWidth]);
    // const doc = new jsPDF('p', 'pt', [2000, 1520]);
    // [2000, 1700] works well on ultra-wide, [2000, 1520] works on laptop

    // doc.canvas.height = elementToPrint.clientHeight;
    // doc.canvas.height = elementToPrint.clientWidth;

    // const doc = new jsPDF('p', 'pt', 'a4');

    // var margins = {
    //   top: 10,
    //   bottom: 10,
    //   left: 10,
    //   width: 595
    // };

    // doc.html(
    //   elementToPrint,
    //   margins.left,
    //   margins.top, {
    //     'width': margins.width
    //   },

    //   function(dispose) {
    //     doc.save("Serve Legal Tasks.pdf");
    //   }, margins);




    const elementToPrint = document.getElementById("main");

    const doc = new jsPDF('p', 'pt', [elementToPrint.clientHeight, elementToPrint.clientWidth]);

    doc.html(elementToPrint, {
      callback: function(doc) {
        doc.save("Serve Legal.pdf"); 
      }
    })

  }

  const handlePrintFormPDF = () => {
    const elementToPrint = document.getElementsByClassName("container")[0];

    const doc = new jsPDF('p', 'pt', [elementToPrint.clientHeight, elementToPrint.clientWidth]);

    doc.html(elementToPrint, {
      callback: function(doc) {
        doc.save("Serve Legal.pdf"); 
      }
    })

  }

  const handlePrintFormPDFWithoutNotes = () => {

    // Find and remove the Note section of the form
    const noteElement = document.getElementById("ez2i9rr");
    noteElement.remove();

    // Get and print the remaining elements
    const elementToPrint = document.getElementsByClassName("container")[0];

    const doc = new jsPDF('p', 'pt', [elementToPrint.clientHeight, elementToPrint.clientWidth]);

    doc.html(elementToPrint, {
      callback: function(doc) {
        doc.save("Serve Legal.pdf"); 
      }
    })

  }

  // const handlePrintButton = () => {
  //   document.getElementById("dropdownBtn").classList.toggle("show");
  // }

  return (
    <Container fluid id="main">
      {!showTaskDetails ? (
        <section>
          <TaskFilter />
          {/* <PDFGenerator dataToRender={"test"} /> */}
          <input
            type="button"
            className="btn print-pdf-button"
            value="Print to PDF"
            onClick={handlePrintTablePDF}
            ></input>
          <ServiceFlowTaskList showApplicationSetter={wrapperSetShowTaskDetails}/>
        </section>
      ) : (
        <div className="container-task-view">
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <a
              href="#/"
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={onClickBackButton}
            >
              <span>
                <span>
                  <i className="fa fa-angle-left" style={{ color: "black" }} />
                  &nbsp;
                </span>
                Back to search results
              </span>
            </a>
          </div>
          <div>
            <input
              type="button"
              className="btn print-pdf-button"
              value="Print With Notes"
              onClick={handlePrintFormPDF}
            ></input>
            <input
              type="button"
              className="btn print-pdf-button"
              value="Print Without Notes"
              onClick={handlePrintFormPDFWithoutNotes}
            ></input>
          </div>
          <Container fluid id="main">
            <Route path={"/task_new2/:taskId?"}>
              <ServiceFlowTaskDetails id="main" />
            </Route>
            <Route path={"/task_new2/:taskId/:notAvailable"}>
              {" "}
              <Redirect exact to="/404" />
            </Route>
          </Container>
        </div>
      )}
    </Container>
  );
});
