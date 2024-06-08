import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#3c2243",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p className="label">{` ${payload[0].payload.name}`}</p>
        <p className="intro">{`Commits: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const TeamsBarGraph = ({ data }) => {
  data.sort((a, b) => b.commits - a.commits);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data.slice(0, 10)}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey={"name"} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="commits" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TeamsBarGraph;
