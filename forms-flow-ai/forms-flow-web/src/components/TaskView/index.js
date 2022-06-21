import React from "react";


const TaskView = React.memo(() => {

    return (
      <div className="container" id="main">

        <div className="flex-container">
          <div className="flex-item-left">
            <h2>Hello world</h2>
          </div>
        </div>

      </div>
    );
  }
);
export default TaskView;
