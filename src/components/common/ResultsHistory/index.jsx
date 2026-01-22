import React, { useState, useEffect } from "react";
import { validateStats } from "../../../helpers/validateStats";
import {
  getResults,
  deleteResult,
  updateResult,
  getResultsWithinRange,
} from "../../../API/FirestoreAPI";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaTrash, FaExclamationCircle } from "react-icons/fa";
import { generateReport } from "../../../helpers/generateReport";
import { getWarningDetails } from "../../../helpers/getWarningDetails";
import { formatDate } from "../../../helpers/formatDate";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";

export default function ResultsHistory() {
  const [user] = useAuthState(auth);
  const [allResults, setAllResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(7);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  const navigate = useNavigate();
  const currentDate = formatDate(new Date());

  useEffect(() => {
    if (user) {
      getResults(user.uid, setAllResults);
    }
  }, [user]);

  //Paginacja
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = allResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (resultId) => {
    if (!user || !resultId) return;

    try {
      const success = await deleteResult(user.uid, resultId);
      if (success) {
        toast.success("Result deleted");
        setAllResults(allResults.filter((result) => result.id !== resultId));
      } else {
        toast.error("Failed to delete result");
      }
    } catch (err) {
      toast.error("Failed to delete result");
    }
  };

  const handleEdit = (result) => {
    setEditingResult(result);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!editingResult) return;
    const { systolicValue, diastolicValue, pulseValue } = editingResult;
    if (!validateStats(systolicValue, diastolicValue, pulseValue)) {
      return;
    }
    try {
      const success = await updateResult(
        user.uid,
        editingResult.id,
        editingResult
      );
      if (success) {
        toast.success("Result updated");
        setEditingResult(null);
        setShowEditModal(false);
        getResults(user.uid, setAllResults);
      } else {
        toast.error("Failed to update result");
      }
    } catch (err) {
      toast.error("Failed to update result");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingResult((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTimeChange = (e) => {
    let inputTime = e.target.value;
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/; //regex formatowania czasu

    if (timePattern.test(inputTime)) {
      if (inputTime.length === 5) {
        inputTime += ":00";
      }
      setEditingResult((prevState) => ({
        ...prevState,
        time: inputTime,
      }));
    } else {
      console.error("Invalid time format. Please use HH:MM:SS.");
    }
  };

  const handleGenerateReport = async () => {
    const timeRange = document.getElementById("time-range").value;
    const fileFormat = document.querySelector(
      'input[name="file-format"]:checked'
    ).value;

    //data początkowa i końcowa
    const endDate = new Date();
    let startDate;

    switch (timeRange) {
      case "all":
        startDate = new Date(0); // najniższa wartość czasu - początek epoki Unixx
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeRange));
    }

    try {
      const results = await getResultsWithinRange(user.uid, startDate, endDate);
      // Generuj raport w odpowiednim formacie
      generateReport(results, fileFormat);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingResult(null);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
  };

  return (
    <div className="results-history-container">
      <ToastContainer />
      {showEditModal && (
        <div className="modal" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeEditModal}>
              X
            </span>
            <h2>Edit Result</h2>
            <form className="edit-form">
              <label>
                Date:
                <input
                  className="edit-date"
                  type="date"
                  name="date"
                  value={editingResult.date}
                  onChange={handleInputChange}
                  min="2000-01-01"
                  max={currentDate}
                />
                <br />
              </label>
              <label>
                Time:
                <input
                  className="edit-time"
                  type="time"
                  name="time"
                  value={editingResult.time}
                  onChange={handleTimeChange}
                />
                <br />
              </label>
              <label>
                Systolic Pressure:
                <input
                  className="edit-systolic"
                  type="number"
                  name="systolicValue"
                  value={editingResult.systolicValue}
                  onChange={handleInputChange}
                />
                <br />
              </label>
              <label>
                Diastolic Pressure:
                <input
                  className="edit-diastolic"
                  type="number"
                  name="diastolicValue"
                  value={editingResult.diastolicValue}
                  onChange={handleInputChange}
                />
                <br />
              </label>
              <label>
                Pulse:
                <input
                  className="edit-pulse"
                  type="number"
                  name="pulseValue"
                  value={editingResult.pulseValue}
                  onChange={handleInputChange}
                />
                <br />
              </label>
              <button type="button" className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setEditingResult(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Wyświetlanie wyników */}
      {currentResults.length > 0 ? (
        currentResults.map((result) => {
          const warning = getWarningDetails(
            result.systolicValue,
            result.diastolicValue
          );
          return (
            <div key={result.id} className="result-item">
              <div className="result-data">
                <span className="result-date">{result.date}</span>
                <span className="result-time">{result.time}</span>
                <span className="result-systolic">
                  Systolic Pressure: {result.systolicValue}
                </span>
                <span className="result-diastolic">
                  Diastolic Pressure: {result.diastolicValue}
                </span>
                <span className="result-pulse">Pulse: {result.pulseValue}</span>
              </div>
              <div className="result-actions">
                {warning && (
                  <>
                    <FaExclamationCircle
                      className="warning-icon"
                      style={{ color: warning.rgb }}
                      onClick={() => navigate("/help")}
                    />
                    <div className="tooltip">{warning.message}</div>
                  </>
                )}
                <FaEdit
                  className="edit-btn"
                  onClick={() => handleEdit(result)}
                />
                <FaTrash
                  className="delete-btn"
                  onClick={() => handleDelete(result.id)}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p>No results found.</p>
      )}

      <div className="buttons-container">
        <button onClick={() => navigate("/home")} className="add-new-btn">
          Add New
        </button>
        <button
          onClick={() => setShowReportModal(true)}
          className="generate-report-btn"
        >
          Generate Report
        </button>
      </div>

      <div className="pagination">
        {[...Array(Math.ceil(allResults.length / resultsPerPage)).keys()].map(
          (number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={currentPage === number + 1 ? "active" : ""}
            >
              {number + 1}
            </button>
          )
        )}
      </div>

      {/* Modal generowania raportu */}
      {showReportModal && !editingResult && (
        <div className="modal" onClick={closeReportModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeReportModal}>
              X
            </span>
            <h2>Generate Report</h2>
            <form>
              <label htmlFor="time-range">
                Select Time Range:
                <br />
              </label>
              <select id="time-range" name="time-range" defaultValue="30">
                <option value="5">Last 5 days</option>
                <option value="10">Last 10 days</option>
                <option value="30">Last 30 days </option>
                <option value="90">Last 90 days</option>
                <option value="180">Last 180 days</option>
                <option value="365">Last year</option>
                <option value="all">All time</option>
              </select>
              <div className="modal-content-options">
                <label>File Format:</label>
                <br />
                <label>
                  <input
                    type="radio"
                    name="file-format"
                    value="pdf"
                    defaultChecked
                  />{" "}
                  pdf
                </label>
                <br />
                <label>
                  <input type="radio" name="file-format" value="xlsx" /> xlsx
                </label>
                <br />
                <label>
                  <input type="radio" name="file-format" value="csv" /> csv
                </label>
                <br />
                <label>
                  <input type="radio" name="file-format" value="txt" /> txt
                </label>
              </div>
              <button
                type="button"
                className="generate-btn"
                onClick={handleGenerateReport}
              >
                Generate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
