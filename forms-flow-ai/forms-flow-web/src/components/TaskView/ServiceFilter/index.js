import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";

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

  const [currentFilter, setCurrentFilter] = useState("All tasks"); // by default use the all task filter

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

  console.log("filterList", filterList);

  //   const temporaryFilterList = [
  //     {
  //       id: "ef4128a8d9a8d-af4ad4-dkf923j",
  //       resourceType: "Task",
  //       name: "All tasks",
  //     },
  //     {
  //       id: "ef41242a8d-a5812ad4-dfa8fa",
  //       resourceType: "Task",
  //       name: "BCPS tasks",
  //     },
  //     {
  //       id: "4dfka8d7a-flg083-4a8f8af612b",
  //       resourceType: "Task",
  //       name: "Joint tasks",
  //     },
  //     {
  //       id: "49cja8da234-4a3f5f8-f8a5f4hja1gv",
  //       resourceType: "Task",
  //       name: "LSB tasks",
  //     },
  //   ];

  // Define function to handle tab selection
  // x contains the name of the tab/filter (eg. "Joint tasks")
  const handleTabSelect = (selectedTabName) => {
    var selectedFilter = filterList.filter((x) => x.name == selectedTabName);
    console.log("selectedFilteree", selectedFilter);
    // Update current filter
    setCurrentFilter(selectedFilter);

    // Update Selected Tab
    setCurrentTab(selectedFilter);

    // Update State Selected Filter
    dispatch(setSelectedBPMFilter(selectedFilter));
  };

  useEffect(() => {
    console.log("Current Filter: ", currentFilter);
  }, [currentFilter]);

  // ---- TAB PERSISTENCE START ----

  // Figure out which tab is currently set as active (only triggers on page reload)
  useEffect(() => {
    const getActiveTab = JSON.parse(localStorage.getItem("activeTab"));
    if (getActiveTab) {
      setCurrentTab(getActiveTab);
    }
  }, []);

  // Set that tab as active on page reload, and update the filter to match
  useEffect(() => {
    localStorage.setItem("activeTab", JSON.stringify(currentTab));
    setCurrentFilter(currentTab);
    console.log("Current Tab: ", currentTab);
  }, [currentTab]);

  // ---- TAB PERSISTENCE END ----

  // const selectedFilter = useSelector(state=> state.bpmTasks.selectedFilter);
  console.log(
    "State Filter: ",
    useSelector((state) => state.bpmTasks.selectedFilter)
  );

  return (
    <>
      <Tabs
        activeKey={currentTab}
        id="task-tab"
        className="mb-3"
        onSelect={(selectedTab) => {
          console.log();
          handleTabSelect(selectedTab);
        }}
      >
        {filterList.map((x) => {
          return (
            <Tab eventKey={x.name} title={x.name}>
              {" "}
            </Tab>
          );
        })}
      </Tabs>
    </>
  );
});

export default ServiceFilter;
