import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface TimeRangeSelectorProps {
  selectedMinutes: number;
  onSelectMinutes: (minutes: number) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedMinutes,
  onSelectMinutes,
}) => {
  const handleChange = (event: SelectChangeEvent<number>) => {
    onSelectMinutes(Number(event.target.value));
  };

  const timeRanges = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 120, label: "2 hours" },
    { value: 240, label: "4 hours" },
    { value: 480, label: "8 hours" },
  ];

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="time-range-selector-label">Time Range</InputLabel>
      <Select
        labelId="time-range-selector-label"
        id="time-range-selector"
        value={selectedMinutes}
        onChange={handleChange}
        label="Time Range"
      >
        {timeRanges.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TimeRangeSelector;
