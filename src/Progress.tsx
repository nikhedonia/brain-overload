import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";

export const ProgressBar = ({
  startTime,
  endTime,
}: {
  startTime: number;
  endTime: number;
}) => {
  const [time, setTime] = useState(startTime);

  useEffect(() => {
    const h = setInterval(() => {
      setTime(+Date.now());
    }, 300);

    return () => clearInterval(h);
  }, []);


  const adjustmentFactor = (endTime - startTime) / (endTime - startTime - 300)

  return (
    <LinearProgress
      sx={{ flexGrow: 1 }}
      variant="determinate"
      value={(Math.max(time - startTime, 0) / (endTime - startTime)) * 100 * adjustmentFactor}
    />
  );
};
