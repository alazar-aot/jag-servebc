import { useSelector } from "react-redux";

import React, { useEffect } from "react";

import {timeFormatter} from "../helper/helper";

const Filters = (props) => {
  const filterSearchSelections = useSelector(
    (state) => state.bpmTasks.filterSearchSelections
  );

  useEffect(() => {
    // console.log("filterSearchSelections", filterSearchSelections);
  }, [filterSearchSelections]);

  // Used to temporarily store the from and to dates when selecting a date range filter
  let fromTrimmedDate = "";
  let toTrimmedDate = "";

  const filters = filterSearchSelections.map((x, index) => {

    if (x.key === 'processDefinitionName'){
      return false;
    }
    
    // If the user selected the "Document Status" Filter,
    // Format the display of the "In Progress" label correctly
    if(x.value === 'Inprogress'){
      return (
        <div key={index} className="filters m-1 p-1">
          {x.label} : {'In Progress'}
          <span
            onClick={() => {
              props.handleDeleteFilter(index);
            }}
          >
            <i className="fa fa-solid fa-close p-2"></i>
          </span>
        </div>
      );
    // Rendering the Next Appearance/Served Date:
      // Get the "from" date, and store for rendering once the "to" date has been fetched
      // Get the "to" date, and render the dates in a single div
      // Before rendering, formate the date correctly
    } else if (x.key === 'followUp'){
        if (x.label === 'Next Apperance Date (From)'){
          fromTrimmedDate = x.value.substring(0, x.value.indexOf("T"));
        } else {
          toTrimmedDate = x.value.substring(0, x.value.indexOf("T"));
          return (
            <div key={index} className="filters m-1 p-1">
              {"Next Appearance Date: "}{timeFormatter(fromTrimmedDate)}{" To "}{timeFormatter(toTrimmedDate)}
              <span
                onClick={() => {
                  props.handleDeleteFilter(index);
                }}
              >
                <i className="fa fa-solid fa-close p-2"></i>
              </span>
            </div>
          )
        }
    } else if (x.key === 'due'){
      if (x.label === 'Serve Date (From):'){
        fromTrimmedDate = x.value.substring(0, x.value.indexOf("T"));
      } else {
        toTrimmedDate = x.value.substring(0, x.value.indexOf("T"));
        return (
          <div key={index} className="filters m-1 p-1">
            {"Served Date: "}{timeFormatter(fromTrimmedDate)}{" To "}{timeFormatter(toTrimmedDate)}
            <span
              onClick={() => {
                props.handleDeleteFilter(index);
              }}
            >
              <i className="fa fa-solid fa-close p-2"></i>
            </span>
          </div>
        )
      }
    // If the user selected the "Document Type" filter
    // Format the display of the "noticeOfConstitutionalQuestionAndSupportingDocuments" label correctly
    } else if (x.label === 'Document Type' && x.value === 'noticeOfConstitutionalQuestionAndSupportingDocuments'){
      return (
        <div key={index} className="filters m-1 p-1">
          {x.label} : {"NCQ"}
          <span
            onClick={() => {
              props.handleDeleteFilter(index);
            }}
          >
            <i className="fa fa-solid fa-close p-2"></i>
          </span>
        </div>
      );
    // Display the filter normally
    } else {
      return (
        <div key={index} className="filters m-1 p-1">
          {x.label} : {x.value}
          <span
            onClick={() => {
              props.handleDeleteFilter(index);
            }}
          >
            <i className="fa fa-solid fa-close p-2"></i>
          </span>
        </div>
      );
    }
  });

  return filters;
};

export default Filters;
