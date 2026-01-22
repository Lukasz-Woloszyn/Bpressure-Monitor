import { toast } from "react-toastify";

export const validateStats = (systolicValue, diastolicValue, pulseValue) => {
  if (systolicValue > 400) {
    toast.error("Your systolic pressure can't be higher than 400");
    return false;
  }
  if (systolicValue < 30) {
    toast.error("Your systolic pressure can't be lower than 30");
    return false;
  }
  if (diastolicValue > 400) {
    toast.error("Your diastolic pressure can't be higher than 400");
    return false;
  }
  if (diastolicValue < 30) {
    toast.error("Your diastolic pressure can't be lower than 30");
    return false;
  }
  if (pulseValue > 500) {
    toast.error("Your pulse can't be higher than 500");
    return false;
  }
  if (pulseValue < 20) {
    toast.error("Your pulse can't be lower than 20");
    return false;
  }
  return true;
};
