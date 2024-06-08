import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Graph from "../components/Graph";
const host = import.meta.env.VITE_HOST || "";
const CommitStats = () => {
  const params = useParams();
  const name = params.name;
  const [graphData, setGraphData] = React.useState([]);
  React.useEffect(() => {
    fetch(`${host}/repos/${name}/commits/graph?interval=hour`)
      .then((res) => res.json())
      .then((data) => {
        setGraphData(data);
      });
  }, []);
  return (
    <div>
      <h1 className="my-6 text-5xl font-bold text-center">{name}</h1>
      <h1
        className="my-6  mx-4 text-indigo-300 text-2xl font-bold text-left"
        title="Number of Commits made per hour"
      >
        Commit Frequency
      </h1>
      <div className="flex justify-center w-6/12">
        <Graph data={graphData} />
      </div>
    </div>
  );
};

export default CommitStats;
