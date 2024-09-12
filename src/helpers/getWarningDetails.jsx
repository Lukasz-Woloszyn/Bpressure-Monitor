import { toast } from "react-toastify";

export const getWarningDetails = (systolic, diastolic) => {
  if (systolic >= 180 || diastolic >= 120) {
    return {
      rgb: "rgb(139, 0, 0)",
      message:
        "Hypertensive crisis! Seek emergency medical attention immediately. This can cause severe complications, including organ damage.",
    };
  } else if (
    (systolic >= 160 && systolic <= 179) ||
    (diastolic >= 100 && diastolic <= 119)
  ) {
    return {
      rgb: "rgb(255, 0, 0)",
      message:
        "Stage 2 Hypertension. Serious risk factor for cardiovascular diseases. Consult your healthcare provider as soon as possible.",
    };
  } else if (
    (systolic >= 140 && systolic <= 159) ||
    (diastolic >= 90 && diastolic <= 99)
  ) {
    return {
      rgb: "rgb(255, 165, 0)",
      message:
        "Stage 1 Hypertension. Risk for heart disease and stroke is increased. Consider lifestyle changes and consult a healthcare provider.",
    };
  } else if (
    (systolic >= 120 && systolic <= 139) ||
    (diastolic >= 80 && diastolic <= 89)
  ) {
    return {
      rgb: "rgb(255, 255, 0)",
      message:
        "Prehypertension. It’s important to monitor and manage your lifestyle to prevent hypertension.",
    };
  } else if (systolic < 90) {
    return {
      rgb: "rgb(0, 128, 255)",
      message:
        "Blood pressure is too low. May cause dizziness, fainting, and risk of shock. Consider consulting a healthcare provider if you experience symptoms.",
    };
  }
  return null;
};
