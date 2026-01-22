import React, { useState, useRef } from "react";
import { validateStats } from "../../../helpers/validateStats";
import { postResults, saveUserTableEntry } from "../../../API/FirestoreAPI";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebaseConfig";
import { formatDate } from "../../../helpers/formatDate";
import { ToastContainer, toast } from "react-toastify";
import pressureMonitor from '../../../assets/pressure_monitor.png';
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";

export default function ResultsForm() {
  const [user] = useAuthState(auth);
  const [systolicValue, setSystolicValue] = useState("");
  const [diastolicValue, setDiastolicValue] = useState("");
  const [pulseValue, setPulseValue] = useState("");
  const localDate = formatDate(new Date());
  const [date, setDate] = useState(localDate);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 8));
  const [showModal, setShowModal] = useState(false);
  const isSaveButtonDisabled = !systolicValue || !diastolicValue || !pulseValue;

  const handleTimeChange = (e) => {
    let inputTime = e.target.value;
    if (inputTime.length === 5) {
      inputTime = `${inputTime}:00`; // dodanie sekund do HH:MM
    }
    setTime(inputTime);
  };

  const handleSaveStats = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("User is not authenticated");
      return;
    }

    if (!validateStats(systolicValue, diastolicValue, pulseValue)) {
      return;
    }

    const saved = await postResults(
      user.uid,
      systolicValue,
      diastolicValue,
      pulseValue,
      date,
      time
    );
    //console.log(dateCheck.toString());
    if (saved) {
      // reset formularza
      toast.success("Result added!");
      setSystolicValue("");
      setDiastolicValue("");
      setPulseValue("");
    }
  };

  return (
    <div className="results-form-main">
      <div className="results-form">
        <h1 className="form-title">Enter Your Results</h1>
        <form onSubmit={handleSaveStats} className="form-main">
          <div className="form-row">
            <label className="form-label">
              Systolic Pressure:
              <br />
              <input
                type="number"
                className="form-input-first"
                value={systolicValue}
                onChange={(e) => setSystolicValue(e.target.value)}
              />
            </label>
            <label className="form-label">
              Diastolic Pressure:
              <br />
              <input
                type="number"
                className="form-input-first"
                value={diastolicValue}
                onChange={(e) => setDiastolicValue(e.target.value)}
              />
            </label>
            <label className="form-label">
              Pulse:
              <br />
              <input
                type="number"
                className="form-input-first"
                value={pulseValue}
                onChange={(e) => setPulseValue(e.target.value)}
              />
            </label>
          </div>
          <div className="form-row">
            <label className="form-label">
              Date:
              <br />
              <input
                type="date"
                value={date}
                max={localDate}
                min="2000-01-01"
                className="form-input-second"
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="form-label">
              Time:
              <br />
              <input
                type="time"
                className="form-input-second"
                value={time.slice(0, 5)}
                onChange={handleTimeChange}
              />
            </label>
          </div>
          <br />
          <button
            type="submit"
            className="form-button"
            disabled={isSaveButtonDisabled}
          >
            Save Results
          </button>
          <br />
          <br />
          <button
            type="button"
            className="form-button instructions-button"
            onClick={() => setShowModal(true)}
          >
            How to Read Results
          </button>
        </form>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="modal-help-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-help-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close-btn" onClick={() => setShowModal(false)}>
              X
            </span>
            <h2>How to Read Your Blood Pressure</h2>
            <img
              className="instruction-image"
              src={pressureMonitor}
              alt="Instructions"
              style={{ marginBottom: "0px" }}
            />
            <div className="instructions-text">
              <p>
                1. Ensure the cuff is placed correctly on your arm.
                <br />
                2. Sit quietly for 5 minutes before taking the reading.
                <br />
                3. Press the start button and wait for the reading to complete.
                <br />
                4. Record the{" "}
                <span style={{ color: "#fa0e0a" }}>
                  <b>systolic</b>
                </span>
                ,{" "}
                <span style={{ color: "#eb7d34" }}>
                  <b>diastolic</b>
                </span>
                , and{" "}
                <span style={{ color: "#03890f" }}>
                  <b>pulse</b>
                </span>{" "}
                values.
                <br />
                5. Enter the results in the form.
              </p>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
