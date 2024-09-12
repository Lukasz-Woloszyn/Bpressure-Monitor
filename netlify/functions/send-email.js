const axios = require('axios');

exports.handler = async (event) => {
  const { userId, toEmail, userEmail, level, systolicValue, diastolicValue, pulseValue, date, time } = JSON.parse(event.body);
  const apiToken = process.env.API_TOKEN;
  const url = process.env.API_URL;

  const emailTemplates = [
    `Alert! Hypotension detected!\nUser: ${userEmail}\nSystolic Pressure: ${systolicValue}\nDiastolic Pressure: ${diastolicValue}\nPulse: ${pulseValue}\nDate: ${date}\nTime: ${time}`,
    `Alert! Prehypertension detected!\nUser: ${userEmail}\nSystolic Pressure: ${systolicValue}\nDiastolic Pressure: ${diastolicValue}\nPulse: ${pulseValue}\nDate: ${date}\nTime: ${time}`,
    `Alert! Stage 1 Hypertension detected!\nUser: ${userEmail}\nSystolic Pressure: ${systolicValue}\nDiastolic Pressure: ${diastolicValue}\nPulse: ${pulseValue}\nDate: ${date}\nTime: ${time}`,
    `Alert! Stage 2 Hypertension detected!\nUser: ${userEmail}\nSystolic Pressure: ${systolicValue}\nDiastolic Pressure: ${diastolicValue}\nPulse: ${pulseValue}\nDate: ${date}\nTime: ${time}`,
    `Alert! Hypertensive Crisis detected!\nUser: ${userEmail}\nSystolic Pressure: ${systolicValue}\nDiastolic Pressure: ${diastolicValue}\nPulse: ${pulseValue}\nDate: ${date}\nTime: ${time}`
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
        to: [{ email: toEmail }],
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
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Error sending an email:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
