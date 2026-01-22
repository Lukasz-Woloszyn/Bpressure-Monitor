import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const sendEmailNotification = async (
  userId,
  toEmail,
  userEmail,
  level,
  systolicValue,
  diastolicValue,
  pulseValue,
  date,
  time
) => {
  const url = "https://bpmonitor.netlify.app/.netlify/functions/send-email"; // endpoint serwera

  const emailData = {
    userId,
    toEmail,
    userEmail,
    level,
    systolicValue,
    diastolicValue,
    pulseValue,
    date,
    time,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(
        `Błąd podczas wysyłania wiadomości: ${response.statusText}`
      );
    }

    const data = await response.json();
    toast.warning(
      "Abnormal blood pressure levels detected! Notification email has been sent to your support email."
    );
    console.log("Email sent successfully:", toEmail);
  } catch (error) {
    console.error("An error occurred sending an email:", error);
  }
};
