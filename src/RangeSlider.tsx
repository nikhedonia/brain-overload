import * as React from 'react';
import {SliderProps} from '@mui/material';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value: number) {
  return `${value}`;
}

export default function RangeSlider(props: SliderProps) {
  const [value, setValue] = React.useState([3, 10]);

  const handleChange = (_: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <Slider
        getAriaLabel={() => 'Temperature range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        {...props}
    />
  );
}