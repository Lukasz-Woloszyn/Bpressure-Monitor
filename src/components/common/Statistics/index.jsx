import React, { useState, useEffect } from "react";
import { getResultsWithinRange } from "../../../API/FirestoreAPI";
import { auth } from "../../../firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./index.scss";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Statistics() {
  const [results, setResults] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [stats, setStats] = useState({ avg: {}, max: {}, min: {} });

  const calculateStats = (values) => ({
    avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    max: Math.max(...values),
    min: Math.min(...values),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const fetchedResults = await getResultsWithinRange(
          userId,
          startDate,
          endDate
        );
        setResults(fetchedResults.reverse()); // odwrócenie od najstarszych
      } catch (error) {
        toast.error("Error fetching results.");
        console.error("Error fetching results:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    if (results.length > 0) {
      const systolicValues = results.map((r) => Number(r.systolicValue));
      const diastolicValues = results.map((r) => Number(r.diastolicValue));
      const pulseValues = results.map((r) => Number(r.pulseValue));

      const systolicStats = calculateStats(systolicValues);
      const diastolicStats = calculateStats(diastolicValues);
      const pulseStats = calculateStats(pulseValues);

      setStats({
        avg: {
          systolic: systolicStats.avg,
          diastolic: diastolicStats.avg,
          pulse: pulseStats.avg,
        },
        max: {
          systolic: systolicStats.max,
          diastolic: diastolicStats.max,
          pulse: pulseStats.max,
        },
        min: {
          systolic: systolicStats.min,
          diastolic: diastolicStats.min,
          pulse: pulseStats.min,
        },
      });
    }
  }, [results]);

  const data = {
    labels: results.map((r) => r.date),
    datasets: [
      {
        label: "Systolic Pressure",
        data: results.map((r) => r.systolicValue),
        fill: false,
        borderColor: "rgb(255, 99, 99)",
        tension: 0.1,
      },
      {
        label: "Diastolic Pressure",
        data: results.map((r) => r.diastolicValue),
        fill: false,
        borderColor: "rgb(222, 210, 30)",
        tension: 0.1,
      },
      {
        label: "Pulse",
        data: results.map((r) => r.pulseValue),
        fill: false,
        borderColor: "rgb(62, 232, 62)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="stats-main">
      <h2 className="stats-header">Blood Pressure Stats</h2>
      <div className="stats-filters">
        <label>Start Date: </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd.MM.yyyy"
          className="date-picker"
        />
        <label>End Date: </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="dd.MM.yyyy"
          className="date-picker"
        />
      </div>
      <div className="stats-chart">
        <Line data={data} key={`${startDate}-${endDate}`} />
      </div>
      <div className="stats-table">
        <div className="stats-label"></div>
        <div className="stats-label">Minimum</div>
        <div className="stats-label">Average</div>
        <div className="stats-label">Maximum</div>

        <div className="stats-row-label">Systolic</div>
        <div className="stats-value">{stats.min.systolic}</div>
        <div className="stats-value">{stats.avg.systolic}</div>
        <div className="stats-value">{stats.max.systolic}</div>

        <div className="stats-row-label">Diastolic</div>
        <div className="stats-value">{stats.min.diastolic}</div>
        <div className="stats-value">{stats.avg.diastolic}</div>
        <div className="stats-value">{stats.max.diastolic}</div>

        <div className="stats-row-label">Pulse</div>
        <div className="stats-value">{stats.min.pulse}</div>
        <div className="stats-value">{stats.avg.pulse}</div>
        <div className="stats-value">{stats.max.pulse}</div>
      </div>
    </div>
  );
}
