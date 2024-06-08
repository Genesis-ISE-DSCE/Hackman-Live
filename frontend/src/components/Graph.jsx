import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const Graph = ({data}) => {
    data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return (
        <ResponsiveContainer width="100%" height={600}>
            <LineChart data={data}>
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="commits" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default Graph;