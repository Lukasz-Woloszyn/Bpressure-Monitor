import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { auth } from "../../../firebaseConfig";
import "./index.scss";

export default function Help() {
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userUID, setUserUID] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
      setUserUID(user.uid);
    } else {
      toast.error("User not logged in");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://bpmonitor.netlify.app/.netlify/functions/send-contact-email",
        {
          message,
          userEmail,
          userId: userUID,
        }
      );
      //console.log(userUID);
      setMessage("");
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="help-container">
      <div className="classification-container">
        <div className="classification-item-label">
          <span>Classification</span>
          <span>SBP | DBP (mm Hg)</span>
          <span>Details</span>
        </div>
        <div className="classification-item hypotension">
          <span className="classification">Hypotension</span>
          <span className="ranges">&lt; 90 | &lt; 60</span>
          <span className="details">
            Hypotension can be normal but may lead to symptoms like dizziness,
            fainting, or even shock. It’s essential to monitor any associated
            symptoms, as persistent low blood pressure could indicate an
            underlying health issues.
          </span>
        </div>
        <div className="classification-item normal">
          <span className="classification">Normal</span>
          <span className="ranges">&lt; 120 | &lt; 80</span>
          <span className="details">
            A normal blood pressure reading indicates a healthy balance in your
            cardiovascular system. Maintaining this level through a healthy
            lifestyle is key to reducing the risk of heart disease and other
            related conditions.
          </span>
        </div>
        <div className="classification-item prehypertension">
          <span className="classification">Prehypertension</span>
          <span className="ranges">120-139 | 80-89</span>
          <span className="details">
            Prehypertension is an early warning sign that blood pressure is
            beginning to rise and could lead to hypertension if not addressed.
            While it doesn't require immediate medication, it's a critical time
            for implementing lifestyle changes.
          </span>
        </div>
        <div className="classification-item stage1">
          <span className="classification">Stage 1 Hypertension</span>
          <span className="ranges">140-159 | 90-99</span>
          <span className="details">
            Stage 1 Hypertension is the point where blood pressure is elevated,
            posing a risk for heart disease, stroke, and other health problems.
            It often requires a combination of lifestyle changes and, in some
            cases, medication.
          </span>
        </div>
        <div className="classification-item stage2">
          <span className="classification">Stage 2 Hypertension</span>
          <span className="ranges">160-179 | 100-119</span>
          <span className="details">
            At this stage, blood pressure is significantly elevated, greatly
            increasing the risk of cardiovascular events and damage to organs.
            It requires more intensive treatment, including medications and
            significant lifestyle adjustments.
          </span>
        </div>
        <div className="classification-item crisis">
          <span className="classification">Hypertensive Crisis</span>
          <span className="ranges">≥ 180 | ≥ 120</span>
          <span className="details">
            A hypertensive crisis is a severe increase in blood pressure that
            can lead to stroke, heart attack, or other critical health issues.
            This condition requires immediate medical intervention to prevent
            life-threatening complications.
          </span>
        </div>
      </div>

      <div className="contact-container">
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
