"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const trHead = {
  className: "bg-teal-600 border-2 border-teal-600",
};
const tdHead = {
  className: "text-xs sm:text-sm text-black dark:text-white",
};
const trHeadDetail = {
  className:
    "dark:bg-gray-500 bg-gray-400 border-2 dark:border-gray-500 border-gray-400",
};
const trBody = {
  className: "dark:bg-gray-700 border-2 dark:border-gray-700 border-white",
};
const tdBody = {
  className: "dark:text-white text-xs sm:text-sm",
};
const trBodyDetail = {
  className:
    "dark:bg-gray-600 bg-gray-300 border-2 dark:border-gray-600 border-gray-300",
};
function Row({ row, columns, detailColumns }) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }} {...trBody}>
        <TableCell>
          <div
            onClick={() => setOpen(!open)}
            className="dark:text-white text-black p-0 m-0 cursor-pointer"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </div>
        </TableCell>
        {columns.map((col) => (
          <TableCell key={col.field} align={col.align || "left"}>
            <div {...tdBody}>{row[col.field]}</div>
          </TableCell>
        ))}
      </TableRow>
      {detailColumns && (
        <TableRow {...trBody}>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={columns.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }} className="rounded-md">
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow {...trHeadDetail}>
                      {detailColumns.map((col) => (
                        <TableCell key={col.field}>
                          <div {...tdHead}>{col.headerName}</div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.detail.map((detailRow, i) => (
                      <TableRow key={i} {...trBodyDetail}>
                        {detailColumns.map((col) => (
                          <TableCell
                            key={col.field}
                            align={col.align || "left"}
                          >
                            <div {...tdBody}>{detailRow[col.field]}</div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      align: PropTypes.string,
    })
  ).isRequired,
  detailColumns: PropTypes.array,
};

export default function CollapsibleTable({ rows, columns, detailColumns }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow {...trHead}>
            <TableCell />
            {columns.map((col) => (
              <TableCell key={col.field} align={col.align || "left"}>
                <div {...tdHead}>{col.headerName}</div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <Row
                key={row.id || row.name}
                row={row}
                columns={columns}
                detailColumns={detailColumns}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                align="center"
                {...trBody}
              >
                <div {...tdBody}>Tidak ada data</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CollapsibleTable.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      align: PropTypes.string,
    })
  ).isRequired,
  detailColumns: PropTypes.array,
};
