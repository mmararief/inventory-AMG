import React from "react";
import { YAxis as RechartsYAxis } from "recharts";

interface YAxisProps {
    [key: string]: any;
}

const CustomYAxis: React.FC<YAxisProps> = (props) => {
    return <RechartsYAxis {...props} />;
};

export default CustomYAxis;
