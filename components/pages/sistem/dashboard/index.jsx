"use client";
import React from "react";
import Calender from "./components/Calender";
import Cards from "./components/Cards";
import ChartEvent from "./components/ChartEvent";
import { general, monthInIndonesia } from "@/constants";
import SelectFakultas from "./components/SelectFakultas";
import { getDashboardChart } from "@/api/src/dashboard";

const initialCardValue = {
  upcoming: 0,
  open: 0,
  closed: 0,
  ongoing: 0,
};
const date = new Date();

export default function DashboardAdmin() {
  const [month, setMonth] = React.useState(date.getMonth());
  const [prodi, setProdi] = React.useState("all");
  const [loading, setLoading] = React.useState(true);
  const [chartData, setChartData] = React.useState([]);
  const [cardValue, setCardValue] = React.useState(initialCardValue);
  async function getChartData() {
    setLoading(true);
    try {
      const res = await getDashboardChart(prodi);
      setChartData(res.data);
      const newCardValue = res.data.find((item) => item.month === monthInIndonesia[month])?.totalPerStatus;
      setCardValue(newCardValue || initialCardValue);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  }
  function getTotalEventPerStatusInMonth() {
    const newCardValue = chartData.find((item) => item.month === monthInIndonesia[month])?.totalPerStatus;
    setCardValue(newCardValue || initialCardValue);
  }
  React.useEffect(() => {
    getTotalEventPerStatusInMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  React.useEffect(() => {
    getChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodi]);
  return (
    <React.Fragment>
      <h1 className="text-2xl sm:text-3xl font-bold mb-10">Dashboard</h1>
      <section>
        <div className="mb-5">
          <SelectFakultas prodi={prodi} setProdi={setProdi} />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-6 sm:gap-10 mb-12">
          <section className="w-full h-[25.4rem] col-span-4 mb-10 sm:mb-0">
            <ChartEvent
              prodi={prodi}
              chartData={chartData}
              loading={loading}
              className="border-2 border-gray-500 p-2 rounded-xl"
            />
          </section>
          <section className="w-full h-full sm:col-span-2">
            <Cards cardValue={cardValue} loading={loading} month={month} setMonth={setMonth} />
          </section>
        </div>
      </section>
      <section className="">
        <h3 className="text-xl text-center mb-5">
          Kalender Acara {general.fakultas.name}
        </h3>
        <Calender className="w-full h-[25rem] rounded-xl" />
      </section>
    </React.Fragment>
  );
}
