const axios = require('axios');

exports.handler = async (event) => {
  const { userEmail, userId, message } = JSON.parse(event.body);
  const apiToken = process.env.API_TOKEN; 
  const url = process.env.API_URL; 

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
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Error sending email:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};