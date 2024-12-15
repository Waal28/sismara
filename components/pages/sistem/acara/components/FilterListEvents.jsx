import React from "react";
import DropDownComp from "./DropDownComp";
import DateRangePicker from "@/components/atoms/DateRangePicker";
import { MenuItem } from "@mui/material";
import { colorForStatus, general } from "@/constants";
import { Button3 } from "@/components/atoms/CustomButton";
import CustomTextField from "@/components/atoms/CustomTextField";
import { useEventsState } from "@/context/EventsContext";

const initilState = {
  start: null,
  end: null,
  prodi: "all",
  status: "all",
};
export default function FilterListEvents() {
  const { updateEventsState } = useEventsState();
  const [state, setState] = React.useState(initilState);

  const handleChange = (newValue, fieldName) => {
    setState((prevState) => ({
      ...prevState,
      [fieldName]: newValue,
    }));
  };
  const handleSearch = () => {
    const { prodi, status, start, end } = state;
    const dateRange =
      start || end
        ? {
            start: new Date(start),
            end: new Date(end),
          }
        : null;
    updateEventsState.filters({
      prodi: prodi === "all" ? "" : prodi,
      status: status === "all" ? "" : status,
    });
    updateEventsState.dateRange(dateRange);
    setState(initilState);
  };
  return (
    <DropDownComp>
      <h3 className="text-lg font-medium mb-5 dark:text-white text-black">
        Filter
      </h3>
      <main className="flex flex-col gap-4">
        <CustomTextField
          select
          label="Prodi"
          name="prodi"
          value={state.prodi}
          onChange={(e) => handleChange(e.target.value, e.target.name)}
          size="small"
          fullWidth
        >
          <MenuItem value="all">Semua Prodi</MenuItem>
          {general.prodi.map((option) => (
            <MenuItem key={option.name} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </CustomTextField>
        <CustomTextField
          select
          label="Status"
          name="status"
          value={state.status}
          onChange={(e) => handleChange(e.target.value, e.target.name)}
          size="small"
          fullWidth
          className="capitalize"
        >
          <MenuItem value="all">Semua Status</MenuItem>
          {Object.keys(colorForStatus).map((option) => (
            <MenuItem key={option} value={option} className="capitalize">
              {option}
            </MenuItem>
          ))}
        </CustomTextField>
        <DateRangePicker
          start={{
            label: "Awal",
            name: "start",
            value: state.start,
          }}
          end={{
            label: "Akhir",
            name: "end",
            value: state.end,
          }}
          onChange={handleChange}
          size="small"
        />
      </main>
      <div className="flex justify-end mt-5">
        <Button3 onClick={handleSearch}>Cari</Button3>
      </div>
    </DropDownComp>
  );
}
