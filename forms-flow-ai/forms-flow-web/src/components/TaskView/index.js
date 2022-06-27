import React, { useCallback, useEffect } from "react";

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

// To show application
import ServiceFlowTaskDetails from "../ServiceFlow/details/ServiceTaskDetails";
import { Container } from "react-bootstrap";
import { Route, Redirect } from "react-router-dom";
import { push } from "connected-react-router";
import { Button } from "react-bootstrap";

import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";

export default React.memo(() => {
  const dispatch = useDispatch();

  const sortParams = useSelector(
    (state) => state.bpmTasks.filterListSortParams
  );
  const searchParams = useSelector(
    (state) => state.bpmTasks.filterListSearchParams
  );
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

  const [showApplication, setShowApplication] = React.useState(false);
  const wrapperSetShowApplication = useCallback(
    (val) => {
      setShowApplication(val);
    },
    [setShowApplication]
  );

  /*
  // TODO: How to set showapplications to false when clicking the "Tasks" tab
  useEffect(() => {
    setShowApplication(false);
  }, [dispatch]);
  */

  const onClickBackButton = () => {
    dispatch(push(`/task_new`));
    setShowApplication(false);
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

  return !showApplication ? (
    <div className="container" id="main">
      {/* Task Title */}
      <div className="flex-container">
        <div className="flex-item-left">
          <div style={{ display: "flex" }}>
            <h3 className="task-head" style={{ marginTop: "3px" }}>
              <i className="fa fa-cogs" aria-hidden="true" />
            </h3>
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

      <TaskTable showApplicationSetter={wrapperSetShowApplication} />
    </div>
  ) : (
    <div className="container" id="main">
      <Button onClick={onClickBackButton}>Back</Button>
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
  );
});
