"use client";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEventsState } from "@/context/EventsContext";
import { formatTime } from "@/server/config/format";

const style = {
  minWidth: 300,
};
const size = "small";
const columns = [
  { id: "time", label: "Time" },
  { id: "session", label: "Session" },
  { id: "speaker", label: "Speaker" },
];
const trHead = {
  className: "bg-teal-600",
};
const tdHead = {
  className: "text-center text-xs sm:text-base text-black dark:text-white",
};
const trBody = {
  className: "dark:bg-custom-tertiary",
};
const tdBody = {
  className: "dark:text-white text-xs sm:text-base",
};
export default function RunDownnEvent() {
  const { currEvent } = useEventsState();
  const rows =
    currEvent &&
    currEvent.rundown.map((row) => ({
      ...row,
      time: `${formatTime(row.time.start)} - ${formatTime(row.time.end)}`,
    }));

  return (
    <TableContainer component={Paper}>
      <Table sx={style} size={size}>
        <TableHead>
          <TableRow {...trHead}>
            {columns.map((column) => (
              <TableCell key={column.id} align={column.align}>
                <div {...tdHead}>{column.label}</div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow {...trBody} key={index}>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  <div {...tdBody}>{row[column.id]}</div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
