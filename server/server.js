import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const port = 3001;
const apiToken = "3137e8fa911b386095702ef8be7a7d91";
const url = "https://sandbox.api.mailtrap.io/api/send/3100440";
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", //Zgoda na przesyłanie z tego adresu
  })
);

// Endpoint - alerty
app.post("/send-email", async (req, res) => {
  const {
    userId,
    toEmail,
    userEmail,
    level,
    systolicValue,
    diastolicValue,
    pulseValue,
    date,
    time,
  } = req.body;
  // szablony wiadoomości
  const emailTemplates = [
    `Alert! Hypotension detected!\nUser: ${userEmail}\nSystolic Pressure: ${systolicValue}\nDiastolic Pressure: ${diastolicValue}\nPulse: ${pulseValue}\nDate: ${date}\nTime: ${time}`,
    `Alert! Prehypertension detected!\nUser: ${userEmail}\nSystolic Pressure: ${systolicValue}\nDiastolic Pressure: ${diastolicValue}\nPulse: ${pulseValue}\nDate: ${date}\nTime: ${time}`,
    `Alert! Stage 1 Hypertension detected!\nUser: ${userEmail}\nSystolic Pressure: ${systolicValue}\nDiastolic Pressure: ${diastolicValue}\nPulse: ${pulseValue}\nDate: ${date}\nTime: ${time}`,
    `Alert! Stage 2 Hypertension detected!\nUser: ${userEmail}\nSystolic Pressure: ${systolicValue}\nDiastolic Pressure: ${diastolicValue}\nPulse: ${pulseValue}\nDate: ${date}\nTime: ${time}`,
    `Alert! Hypertensive Crisis detected!\nUser: ${userEmail}\nSystolic Pressure: ${systolicValue}\nDiastolic Pressure: ${diastolicValue}\nPulse: ${pulseValue}\nDate: ${date}\nTime: ${time}`,
  ];

  const emailContent = emailTemplates[level - 1] || "";

  try {
    const response = await axios.post(
      url,
      {
        from: {
          email: "alerts@bpmonitor.com",
          name: "Alerts",
        },
        to: [{ email: toEmail }], // wymagana jest tablica obiektów
        subject: "Blood Pressure Alert",
        text: emailContent,
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("UID:", userId, ": A new alert sent to user's support email");
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error sending an email:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: error.message });
  }
});

// Endpoint - support
app.post("/send-contact-email", async (req, res) => {
  const { userEmail, userId, message } = req.body;
  const emailContent = `Support request from user: ${userId}\nEmail: ${userEmail}\n\nMessage:\n${message}`;

  try {
    const response = await axios.post(
      url,
      {
        from: {
          email: "support@bpmonitor.com",
          name: "Support",
        },
        to: [{ email: "support@bpmonitor.com" }],
        subject: "New Support Request",
        text: emailContent,
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      "UID:",
      userId,
      ": A new message sent to support service inbox"
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: error.message });
  }
});

// Uruchomienie
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
