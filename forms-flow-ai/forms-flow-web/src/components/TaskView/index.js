import React, { useCallback, useEffect } from "react";
import "./TaskView.scss";
import { useDispatch, useSelector } from "react-redux";
import { ALL_TASKS } from "../ServiceFlow/constants/taskConstants";
import {
  setSelectedBPMFilter,
  setBPMTaskLoader,
  setBPMTaskListActivePage,
  setFilterListParams,
} from "../../actions/bpmTaskActions";
import { fetchServiceTaskList } from "../../apiManager/services/bpmTaskServices";

import ServiceFilter from "./ServiceFilter";
import TaskFilter from "./TaskFilter";
import TaskTable from "./TaskTable";

import ServiceFlowTaskDetails from "../ServiceFlow/details/ServiceTaskDetails";
import { Container } from "react-bootstrap";
import { Route, Redirect } from "react-router-dom";
import { push } from "connected-react-router";

import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";

import TaskSortSelectedList from "./TaskSort/TaskSortSelectedList";

export default React.memo(() => {
  const dispatch = useDispatch();
  const sortParams = useSelector((state) => state.bpmTasks.filterListSortParams);
  const searchParams = useSelector((state) => state.bpmTasks.filterListSearchParams);
  const listReqParams = useSelector((state) => state.bpmTasks.listReqParams);
  const selectedFilter = useSelector((state) => state.bpmTasks.selectedFilter);
  const reqData = useSelector((state) => state.bpmTasks.reqData);

  useEffect(() => {
    console.log("filter params changed");
    const reqParamData = {
      ...{ sorting: [...sortParams.sorting] },
      ...searchParams,
    };
    if (!isEqual(reqParamData, listReqParams)) {
      dispatch(setFilterListParams(cloneDeep(reqParamData)));
    }
  }, [searchParams, sortParams, dispatch, listReqParams]);

  useEffect(() => {
    console.log("selectedFilter on table index.js", selectedFilter, reqData);

    if (selectedFilter) {
      dispatch(setBPMTaskLoader(true));
      dispatch(setBPMTaskListActivePage(1));
      dispatch(fetchServiceTaskList(selectedFilter.id, 0, reqData));
    }
  }, [dispatch, selectedFilter, reqData]);


  const [showTaskDetails, setShowTaskDetails] = React.useState(false);
  const wrapperSetShowTaskDetails = useCallback((val) => {
      setShowTaskDetails(val);
  },[setShowTaskDetails]);

  /*
  // TODO: How to set showapplications to false when clicking the "Tasks" tab
  useEffect(() => {
    setShowApplication(false);
  }, [dispatch]);
  */

  const onClickBackButton = () => {
    dispatch(push(`/task_new`));
    setShowTaskDetails(false);
  };

  const filterList = useSelector((state) => state.bpmTasks.filterList);
  const isFilterLoading = useSelector(
    (state) => state.bpmTasks.isFilterLoading
  );

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

  return (
    <>
      {!showTaskDetails ? (
        <div className="container-task-view">

          <div className="flex-container">
            <div className="flex-item-left">
              <div style={{ display: "flex" }}>
                <h3 className="task-head">
                  {" "}
                  <span className="forms-text" style={{ marginLeft: "1px" }}>
                    Tasks
                  </span>
                </h3>
              </div>
            </div>
          </div>

          <ServiceFilter />

          <TaskFilter />

          <TaskTable showApplicationSetter={wrapperSetShowTaskDetails} />
        </div>
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
          <Container fluid id="main">
            <Route path={"/task_new/:taskId?"}>
              <ServiceFlowTaskDetails />
            </Route>
            <Route path={"/task_new/:taskId/:notAvailable"}>
              {" "}
              <Redirect exact to="/404" />
            </Route>
          </Container>
        </div>
      )}
    </>
  );
});
