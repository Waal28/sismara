"use client";
import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Loader1 } from "@/components/atoms/CustomLoader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartEvent = ({ className, chartData, loading }) => {

  const data = {
    labels: chartData.map((item) => item.month),
    datasets: [
      {
        label: "Total",
        data: chartData.map((item) => item.total),
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Data Acara Tahun Ini",
      },
    },
  };

  return loading ? (
    <div className="w-full h-full flex justify-center items-center">
      <Loader1 className="w-10 h-10 text-white fill-teal-500" />
    </div>
  ) : (
    <Bar data={data} options={options} className={className} />
  );
};

ChartEvent.propTypes = {
  className: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ChartEvent;
