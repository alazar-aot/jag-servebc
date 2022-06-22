import React from "react";

import ServiceFilter from "./ServiceFilter";
import TaskFilter from "./TaskFilter";
import TaskTable from "./TaskTable";

const TaskView = React.memo(() => {

    return (
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

            <ServiceFilter/>

            <TaskFilter/>

            <TaskTable/>

        </div>
    );
}
);
export default TaskView;
