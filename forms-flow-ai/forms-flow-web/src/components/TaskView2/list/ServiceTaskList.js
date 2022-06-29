import React, {useEffect } from "react";
import { ListGroup, Row, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceTaskList } from "../../../apiManager/services/bpmTaskServices";
import {
  setBPMTaskListActivePage,
  setBPMTaskLoader
} from "../../../actions/bpmTaskActions";
import Loading from "../../../containers/Loading";
import moment from "moment";
// eslint-disable-next-line no-unused-vars
import { getProcessDataFromList,getFormattedDateAndTime } from "../../../apiManager/services/formatterService";
import TaskFilterComponent from "./search/TaskFilterComponent";
import Pagination from "react-js-pagination";
import {push} from "connected-react-router";
import {
  MAX_RESULTS, 
  DOCUMENT_STATUS, 
  PARTY_NAME, 
  IS_CRIMINAL, 
  NEXT_APPEARANCE_DATE, 
  RESPONSIBILITY, 
  COURT_OR_TRIBUNAL_FILE_NUMBER, 
  DATE_SERVED} from "../constants/taskConstants";
import {getFirstResultIndex} from "../../../apiManager/services/taskSearchParamsFormatterService";
import TaskVariable from "./TaskVariable";
const ServiceFlowTaskList = React.memo(() => {
  const taskList = useSelector((state) => state.bpmTasks.tasksList);
  //const taskVariable = useSelector((state)=>state.bpmTasks.selectedFilter?.properties?.variables ||[])
  const tasksCount = useSelector(state=> state.bpmTasks.tasksCount);

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
  
  const bpmTaskId = useSelector(state => state.bpmTasks.taskId);
  const isTaskListLoading = useSelector(
    (state) => state.bpmTasks.isTaskListLoading
  );
  const reqData = useSelector((state) => state.bpmTasks.listReqParams);
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const processList = useSelector((state) => state.bpmTasks.processList);
  const selectedFilter = useSelector((state) => state.bpmTasks.selectedFilter);
  const activePage = useSelector(state=>state.bpmTasks.activePage);
  const tasksPerPage = MAX_RESULTS;
  const taskVariableObject = useSelector((state)=>state.bpmTasks.selectedFilterAction)

  useEffect(() => {
    if (selectedFilter) {
      dispatch(setBPMTaskLoader(true));
      dispatch(setBPMTaskListActivePage(1));
      dispatch(fetchServiceTaskList(selectedFilter.id, 0, reqData));
    }
  }, [dispatch, selectedFilter, reqData]);

  const getTaskDetails = (taskId) => {
    if(taskId!==bpmTaskId){
      dispatch(push(`/task/${taskId}`));
    }
  };

  const handlePageChange = (pageNumber) => {
    dispatch(setBPMTaskListActivePage(pageNumber));
    dispatch(setBPMTaskLoader(true));
    let firstResultIndex = getFirstResultIndex(pageNumber) ;
    dispatch(fetchServiceTaskList(selectedFilter.id, firstResultIndex, reqData));
  };

  const renderTaskList = () => {
    if ((tasksCount||taskList.length) && selectedFilter) {
      return (
        <>
          {taskList.map((task, index) => (

            <div
              className={`clickable ${
                task?.id === bpmTaskId && "selected"
              }`}
              key={index}
              onClick={() => getTaskDetails(task.id)}
            >
              <Row>
                <div className="col-12">
                  <h5 className="font-weight-bold">{task.name}</h5>
                </div>
              </Row>

              <Row className="task-row-3" style={{marginBottom:"-8px"}}>
                <Col
                  lg={6}
                  xs={6}
                  sm={6}
                  md={6}
                  xl={6}
                  className="pr-0"
                >
                 <span className="tooltiptext" data-title={task.due?getFormattedDateAndTime(task.due):''}> {task.due ? `Due ${moment(task.due).fromNow()}, ` : ""}{" "}</span>
                 <span className="tooltiptext" data-title={task.followUp?getFormattedDateAndTime(task.followUp):''}> {task.followUp
                    ? `Follow-up ${moment(task.followUp).fromNow()}, `
                    : ""} </span>
                 <span className="tooltiptext" data-title={task.created?getFormattedDateAndTime(task.created):''}>  Modified {moment(task.created).fromNow()}</span>
                </Col>
                <div data-title="Task assignee" id="assigned-to" className="col-6  mb-2 pr-3 text-left">
                  {task.assignee ? (<>Edited by <br/>{task.assignee}</>) : ''}
                </div>
              </Row>
              {
                task._embedded?.variable &&  <TaskVariable variables={task._embedded?.variable||[]}/>
              }
                      
            </div>
          ))}
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

  function timeFormatter(cell) {
    
    if (cell == null || cell == "" || cell == undefined) {
      console.log(cell);
      return " ";
    }
    
    const date = new Date(cell);
    const year = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = ("0" + date.getDate()).slice(-2);
    const localdate = year + "/" + month.toUpperCase() + "/" + day;

    return <label title={cell}>{localdate}</label>;
  }

  const renderTaskTable = () => {

    if ((tasksCount||taskList.length) && selectedFilter) {

      console.log(taskList);

      return (
        <>
          <Table>
            <thead>
              <tr>
                <th>Party</th>
                <th>Status</th>
                <th>Responsibility</th>
                <th>Criminal</th>
                <th>Court/Tribunal File #</th>
                <th>Registry</th>
                <th>Date Served</th>
                <th>Next Appearance Date</th>
                <th>Edited by</th>
                <th>View/Edit Form</th>
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
                      {task._embedded.variable[COURT_OR_TRIBUNAL_FILE_NUMBER].value}
                    </td>
                    <td>
                      {/* Registry */}
                      
                    </td>
                    <td>
                      {/* Date Served */}
                      {timeFormatter(task._embedded.variable[DATE_SERVED].value)}
                    </td>
                    <td>
                      {/* Next Appearance Date */}
                      {timeFormatter(task._embedded.variable[NEXT_APPEARANCE_DATE].value)}
                    </td>
                    <td>
                      {/* Edited by */}
                      {task.assignee}
                    </td>
                    <td>
                      {/* View / Edit */}
                      <button type="button" className="button-view-edit btn btn-primary">View/Edit</button>
                    </td>
                
              </tr>
              ))}
            </tbody>
          </Table>

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
    } 
    else {
      return (
        <Row className="not-selected mt-2 ml-1">
          <i className="fa fa-info-circle mr-2 mt-1" />
          No task matching filters found.
        </Row>
      );
    }


  }


  return (
    <>
      <ListGroup as="ul" className="service-task-list">
        {/*<TaskFilterComponent totalTasks={isTaskListLoading?0:tasksCount} />
        <p className="results-count">{ tasksCount } { tasksCount > 0 ? 'results' :'result'}</p>*/}
        {isTaskListLoading ? <Loading /> : renderTaskTable()}
      </ListGroup>
    </>
  );
});

export default ServiceFlowTaskList;
