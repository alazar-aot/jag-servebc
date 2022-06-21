import React, {useCallback, useEffect, useRef} from "react";
import ServiceFlowTaskList from "../ServiceFlow/list/ServiceTaskList";
import ServiceFlowTaskDetails from "../ServiceFlow/details/ServiceTaskDetails";
import {
    fetchFilterList,
    fetchProcessDefinitionList,
    fetchServiceTaskList,
    getBPMGroups, getBPMTaskDetail
} from "../../apiManager/services/bpmTaskServices";
import { useDispatch, useSelector } from "react-redux";
import {
    reloadTaskFormSubmission,
    setBPMFilterLoader,
    setBPMTaskDetailLoader,
    setFilterListParams,
    setSelectedTaskID
} from "../../actions/bpmTaskActions";
import SocketIOService from "../../services/SocketIOService";
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import {Route, Redirect} from "react-router-dom";
import {push} from "connected-react-router";

const TaskView = React.memo(() => {
    const dispatch = useDispatch();
    const selectedFilterId = useSelector(state => state.bpmTasks.selectedFilter?.id || null);
    const bpmTaskId = useSelector(state => state.bpmTasks.taskId);
    const reqData = useSelector((state) => state.bpmTasks.listReqParams);
    const sortParams = useSelector((state) => state.bpmTasks.filterListSortParams);
    const searchParams = useSelector((state) => state.bpmTasks.filterListSearchParams);
    const listReqParams = useSelector((state) => state.bpmTasks.listReqParams);
    const currentUser = useSelector((state) => state.user?.userDetail?.preferred_username || '');
    const firstResult = useSelector(state => state.bpmTasks.firstResult);
    const taskList = useSelector((state) => state.bpmTasks.tasksList);
    const selectedFilterIdRef = useRef(selectedFilterId);
    const bpmTaskIdRef = useRef(bpmTaskId);
    const reqDataRef = useRef(reqData);
    const firstResultsRef = useRef(firstResult);
    const taskListRef = useRef(taskList);

    useEffect(() => {
        selectedFilterIdRef.current = selectedFilterId;
        bpmTaskIdRef.current = bpmTaskId;
        reqDataRef.current = reqData;
        firstResultsRef.current = firstResult;
        taskListRef.current = taskList;
    });

    useEffect(() => {
        const reqParamData = { ...{ sorting: [...sortParams.sorting] }, ...searchParams };
        if (!isEqual(reqParamData, listReqParams)) {
            dispatch(setFilterListParams(cloneDeep(reqParamData)))
        }
    }, [searchParams, sortParams, dispatch, listReqParams])

    useEffect(() => {
        dispatch(setBPMFilterLoader(true));
        dispatch(fetchFilterList());
        dispatch(fetchProcessDefinitionList());
        // dispatch(fetchUserList());
    }, [dispatch]);


    const checkIfTaskIDExistsInList = (list, id) => {
        return list.some(task => task.id === id);
    }
    const SocketIOCallback = useCallback((refreshedTaskId, forceReload, isUpdateEvent) => {
        if (forceReload) {
            dispatch(fetchServiceTaskList(selectedFilterIdRef.current, firstResultsRef.current, reqDataRef.current, refreshedTaskId)); //Refreshes the Tasks
            if (bpmTaskIdRef.current && refreshedTaskId === bpmTaskIdRef.current) {
                dispatch(setBPMTaskDetailLoader(true));
                dispatch(setSelectedTaskID(null)); // unSelect the Task Selected
                dispatch(push(`/task/`));
            }
        } else {
            if (selectedFilterIdRef.current) {
                if (isUpdateEvent) {
                    /* Check if the taskId exists in the loaded Task List */
                    if (checkIfTaskIDExistsInList(taskListRef.current, refreshedTaskId) === true) {
                        dispatch(fetchServiceTaskList(selectedFilterIdRef.current, firstResultsRef.current, reqDataRef.current)); //Refreshes the Task
                    }
                } else {
                    dispatch(fetchServiceTaskList(selectedFilterIdRef.current, firstResultsRef.current, reqDataRef.current)); //Refreshes the Task
                }
            }
            if (bpmTaskIdRef.current && refreshedTaskId === bpmTaskIdRef.current) { //Refreshes task if its selected
                dispatch(getBPMTaskDetail(bpmTaskIdRef.current, (err, resTask) => {
                    // Should dispatch When task claimed user  is not the logged in User
                    if (resTask?.assignee !== currentUser) {
                        dispatch(reloadTaskFormSubmission(true));
                    }
                }));
                dispatch(getBPMGroups(bpmTaskIdRef.current));
            }
        }
    }
        , [dispatch, currentUser]);

    useEffect(() => {
        if (!SocketIOService.isConnected()) {
            SocketIOService.connect((refreshedTaskId, forceReload, isUpdateEvent) => SocketIOCallback(refreshedTaskId, forceReload, isUpdateEvent));
        } else {
            SocketIOService.disconnect();
            SocketIOService.connect((refreshedTaskId, forceReload, isUpdateEvent) => SocketIOCallback(refreshedTaskId, forceReload, isUpdateEvent));
        }
        return () => {
            if (SocketIOService.isConnected())
                SocketIOService.disconnect();
        }
    }, [SocketIOCallback, dispatch]);

    return (
        <div className="container" id="main">

            <div className="flex-container">
                <div className="flex-item-left">
                    <h2>Hello world</h2>
                    <ServiceFlowTaskList/>
                    <Route path={"/task/:taskId?"}><ServiceFlowTaskDetails/></Route>
                    <Route path={"/task/:taskId/:notAvailable"}> <Redirect exact to='/404'/></Route>
                </div>
            </div>

        </div>
    );
}
);
export default TaskView;
