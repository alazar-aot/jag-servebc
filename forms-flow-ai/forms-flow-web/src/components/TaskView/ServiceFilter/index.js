import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import "./ServiceFilter.scss";

import {
  // fetchServiceTaskList,
  fetchFilterList,
  fetchProcessDefinitionList,
} from "../../../apiManager/services/bpmTaskServices";

import {
  setSelectedBPMFilter,
  setBPMFilterLoader,
} from "../../../actions/bpmTaskActions";

const ServiceFilter = React.memo(() => {
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState("All tasks"); // by default use the all task tab

  // Call the API to update the store's list of filters from Camunda
  // This populates the filterList array in the store with any filters defined in Camunda
  useEffect(() => {
    dispatch(setBPMFilterLoader(true));
    dispatch(fetchFilterList());
    dispatch(fetchProcessDefinitionList());
  }, [dispatch]);

  // Get list of filters
  const filterList = useSelector((state) => state.bpmTasks.filterList);

  // const temporaryFilterList = [
  //   {
  //     id: "ef4128a8d9a8d-af4ad4-dkf923j",
  //     resourceType: "Task",
  //     name: "All tasks",
  //   },
  //   {
  //     id: "ef41242a8d-a5812ad4-dfa8fa",
  //     resourceType: "Task",
  //     name: "BCPS tasks",
  //   },
  //   {
  //     id: "4dfka8d7a-flg083-4a8f8af612b",
  //     resourceType: "Task",
  //     name: "Joint tasks",
  //   },
  //   {
  //     id: "49cja8da234-4a3f5f8-f8a5f4hja1gv",
  //     resourceType: "Task",
  //     name: "LSB tasks",
  //   },
  //   {
  //     id: "48cja723-45taf86fg-4af76784g",
  //     resourceType: "Task",
  //     name: "TEST EXTRA tasks",
  //   },
  // ];


  // Define function to handle tab selection
  
  // x contains the name of the tab/filter (eg. "Joint tasks")
  const handleTabSelect = (selectedTabName) => {

    // Get the correct filter object matching the selected tab name
    var newFilter = filterList.filter((x) => x.name == selectedTabName);  

    // Update Selected Tab
    setCurrentTab(newFilter.name);

    // Update State Selected Filter
    dispatch(setSelectedBPMFilter(newFilter));
  };


  return (
    <>
      <Tabs
        activeKey={currentTab}
        id="task-tab"
        className="mb-3"
        onSelect={(selectedTab) => {
          handleTabSelect(selectedTab);
        }}
      >
        {filterList.map((x) => {
          // check to see if the currently mapped filter is a filter we want to display at this level
          if(x.name === "All tasks" ||
            x.name === "Joint tasks" ||
            x.name === "BCPS tasks" ||
            x.name === "LSB tasks"
        ){
          // return the filters we want to display
          return ( 
            <Tab key={x.id} eventKey={x.name} title={x.name}></Tab>
          );
        } else {
          // return nothing, we don't need those filters at the top level
          return (
            <></>
          );
        }
        })}
      </Tabs>
    </>
  );
});

export default ServiceFilter;