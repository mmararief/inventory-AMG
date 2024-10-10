import React from "react";
import { XAxis as RechartsXAxis } from "recharts";

interface XAxisProps {
    dataKey?: string;
    [key: string]: any;
}

const CustomXAxis: React.FC<XAxisProps> = (props) => {
    return <RechartsXAxis {...props} />;
};

export default CustomXAxis;
