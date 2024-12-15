import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDarkMode } from "@/context/DarkModeContext";

const styles = {
  datePicker: {
    width: "100%",
  },
};

const DateRangePicker = ({
  start = { label: "", name: "startDate", value: null },
  end = { label: "", name: "endDate", value: null },
  onChange = () => {},
  variant = "",
  size,
}) => {
  const { darkMode } = useDarkMode();
  const isDarkMode = darkMode && true;

  const getSlotProps = () => ({
    textField: {
      size,
      InputProps: {
        style: {
          color: isDarkMode ? "white" : "black", // Warna teks input
        },
      },
      InputLabelProps: {
        style: {
          color: isDarkMode ? "lightgray" : "darkgray", // Warna label
        },
      },
      sx: {
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: isDarkMode ? "gray" : "lightgray", // Warna border default
          },
          "&:hover fieldset": {
            borderColor: isDarkMode ? "lightgray" : "gray", // Warna border saat hover
          },
          "&.Mui-focused fieldset": {
            borderColor: isDarkMode ? "white" : "darkgray", // Warna border saat fokus
          },
          "& .MuiSvgIcon-root": {
            color: isDarkMode ? "white" : "black", // Warna ikon kalender default
          },
        },
      },
    },
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <DatePicker
            label={start.label}
            name={start.name}
            variant={variant}
            value={start.value}
            onChange={(newValue) => onChange(newValue, start.name)}
            sx={styles.datePicker}
            slotProps={getSlotProps()}
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            label={end.label}
            name={end.name}
            variant={variant}
            value={end.value}
            onChange={(newValue) => onChange(newValue, end.name)}
            sx={styles.datePicker}
            slotProps={getSlotProps()}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};
DateRangePicker.propTypes = {
  variant: PropTypes.string,
  start: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.object,
  }),
  end: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.object,
  }),
  onChange: PropTypes.func,
  size: PropTypes.string,
};

export default DateRangePicker;
