import { useEffect, useState } from "react";

export const useTimer = (cb: () => void, time: number, deps = []) => {
  const [tick, setTick] = useState(+Date.now());
  useEffect(() => {
    const h = setTimeout(() => {
      cb();
      setTick(+Date.now());
    }, time);

    return () => {
      clearTimeout(h);
    };
  }, [tick, time, ...deps]);
};
