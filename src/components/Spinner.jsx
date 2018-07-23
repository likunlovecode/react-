import React from "react";
import ReactLoading from "react-loading";
import "./Spinner.scss";

export const Spinner = () => (
  <div>
    <ReactLoading className="reactLoading" type="spinningBubbles" color="#1890ff" height={100} width={100}/>
  </div>
);
