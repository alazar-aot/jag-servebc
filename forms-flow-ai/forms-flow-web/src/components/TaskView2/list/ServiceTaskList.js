import React, { useEffect } from "react";
import { Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceTaskList } from "../../../apiManager/services/bpmTaskServices";
import {
  setBPMTaskListActivePage,
  setBPMTaskLoader
} from "../../../actions/bpmTaskActions";
import Loading from "../../../containers/Loading";
import Pagination from "react-js-pagination";
import { push } from "connected-react-router";
// Import Table Components
import TaskTable from "./TaskTable";
import { MAX_RESULTS, TABLE_HEADERS } from "../constants/taskConstants";
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import {timeFormatter} from "../helper/helper";

const ServiceFlowTaskList = React.memo(
  ({ showApplicationSetter: showTaskDetailsSetter }) => {
    const taskList = useSelector((state) => state.bpmTasks.tasksList);
    const tasksCount = useSelector((state) => state.bpmTasks.tasksCount);

    const dispatch = useDispatch();
    const bpmTaskId = useSelector((state) => state.bpmTasks.taskId);
    const isTaskListLoading = useSelector((state) => state.bpmTasks.isTaskListLoading);
    const reqData = useSelector((state) => state.bpmTasks.listReqParams);
    const selectedFilter = useSelector((state) => state.bpmTasks.selectedFilter);
    const activePage = useSelector((state) => state.bpmTasks.activePage);
    const [tasksPerPage, setTasksPerPage] = React.useState(MAX_RESULTS);

    // Toggle the showApplication variable on the View/Edit button click
    const [showTaskDetails, setShowTaskDetails] = React.useState(false);
    useEffect(() => {
      showTaskDetailsSetter(showTaskDetails);
    }, [showTaskDetailsSetter, showTaskDetails]);

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
      let firstResultIndex = pageNumber * tasksPerPage - tasksPerPage;
      dispatch(
        fetchServiceTaskList(selectedFilter.id, firstResultIndex, reqData, null, tasksPerPage)
      );

    };

    // Show Task details in a new view
    const onViewEditChanged = (row) => {
      getTaskDetails(row.id);
      setShowTaskDetails(true);
    };

    const CustomTotal = () => {

      let from = (activePage * tasksPerPage - tasksPerPage) + 1;
      let to = (activePage * tasksPerPage);
      let size = tasksCount;

      if (to > size){ to = size};

      return (
        <span className="react-bootstrap-table-pagination-total">
          Showing {from}-{to} of {size}
        </span>
      );
    };

    const changeTasksPerPage = (numTasksPerPage) => {
      setTasksPerPage(numTasksPerPage);
      dispatch(setBPMTaskListActivePage(1)); // go back to first page
      dispatch(setBPMTaskLoader(true));
      let firstResultIndex = 1 * tasksPerPage - tasksPerPage;
      dispatch(
        fetchServiceTaskList(selectedFilter.id, firstResultIndex, reqData, null, numTasksPerPage)
      );
    }


    const CustomDropUp = ()=>{
      return <span>
        showing{"   "}
        <DropdownButton 
          drop="up"
          variant="secondary"
          title={tasksPerPage}
          style={{display:'inline'}}
        >
        {
          getpageList().map(option => (
            <Dropdown.Item 
              key={ option.text }
              type="button"
              onClick={ () => changeTasksPerPage(option.value) }
            >
              { option.text }
              </Dropdown.Item>
          ))
        }
        </DropdownButton>
        per page
      </span>
    }

    const getpageList = ()=>{
  
      const list = [ 
            {
            text: '15', value: 15
          },
            {
            text: '30', value: 30
          },
            {
            text: '60', value: 60
          },
            {
            text: '90', value: 90
          } ]
      return list
    }

    const renderTaskTable = () => {
      if ((tasksCount || taskList.length) && selectedFilter) {
        return (
          <>
            <TaskTable 
              tableHeaders={TABLE_HEADERS} 
              taskServeLegalDocs={taskList}
              timeFormatter={timeFormatter}
              onViewEditChanged={onViewEditChanged} 
            />

            <div className="pagination-wrapper">
              <CustomTotal/>
              <Pagination
                activePage={activePage}
                itemsCountPerPage={tasksPerPage}
                totalItemsCount={tasksCount}
                pageRangeDisplayed={3}
                onChange={handlePageChange}
                prevPageText="Previous"
                nextPageText="Next"
              />
              <CustomDropUp/>
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
