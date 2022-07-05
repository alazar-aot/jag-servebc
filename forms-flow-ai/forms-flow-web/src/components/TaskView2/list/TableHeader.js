import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { sortingList } from "../constants/taskConstants";
import { setFilterListSortParams } from "../../../actions/bpmTaskActions";
import { TASK_FILTER_LIST_DEFAULT_PARAM } from "../../../constants/taskConstants";

const TableHeader = React.memo(
  ({header}) => {

    const sortingData = useSelector((state) => state.bpmTasks.filterListSortParams.sorting);
    const [sortList, updateSortList] = useState(sortingData);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(setFilterListSortParams(sortList));
    }, [sortList, dispatch]);

    const resetIcons = () => {
      sortingList.forEach((sortOption) => {
        // if the sortOption is the default sort, set to asc (default sort should never be blank)
        if (sortOption.sortBy === TASK_FILTER_LIST_DEFAULT_PARAM.sortBy){
          sortOption.sortOrder = 'asc';
        }
        // else, set all other sort orders to blank
        else{
          sortOption.sortOrder = ' ';
        }
      });
    }

    const toggleSortOrder = (sort) => {

      // temp variable to store current sort order before resetting all sort orders
      let sortNew = sort.sortOrder;

      // reset all sort orders to be blank
      resetIcons();

      // toggle sort order
      if (sortNew == ' '){
        sort.sortOrder = 'desc';
        updateSortList([sort, TASK_FILTER_LIST_DEFAULT_PARAM]);
      }
      else if (sortNew == 'desc'){
        sort.sortOrder = 'asc';
        updateSortList([sort, TASK_FILTER_LIST_DEFAULT_PARAM]);
      }
      else {
        sort.sortOrder = ' ';
        updateSortList([TASK_FILTER_LIST_DEFAULT_PARAM]);
      }
    }

    const ColumnHeader = (props) => {

      // Get the current column that is to be sorted
      let sort = sortingList.filter((sortOption) => 
          sortOption.sortBy === props.header.key ||
          (sortOption.parameters != null &&
          sortOption.parameters.variable === props.header.key)
      )
      sort = sort[0];

      let iconDirection = ' ';

      // null check
      if (sort == null) {
        return <th className="custom-th">
          {header.label}
          <i className={iconDirection}/>
        </th>
      }

      if (sort.sortOrder == ' '){
        iconDirection = " ";
      }
      else if (sort.sortOrder == 'desc'){
        iconDirection = "fa fa-angle-down fa-lg font-weight-light";
      }
      else {
        iconDirection = "fa fa-angle-up fa-lg font-weight-light";
      }

      return <th className="custom-th" onClick={()=>{ toggleSortOrder(sort) }}>
          {sort.label}
          <i className={iconDirection}/>
      </th>
      
    }

    return (
      <ColumnHeader header={header}/>
    );
  }
);

export default TableHeader;