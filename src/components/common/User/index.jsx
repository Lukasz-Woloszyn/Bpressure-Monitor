import React, { useState, useEffect } from "react";
import {
  deleteResultHistory,
  saveUserData,
  getUserSupportEmail,
  getUserSettings,
} from "../../../API/FirestoreAPI";
import {
  sendPasswordResetEmail,
  deleteUser,
  signOut,
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../Modal";
import "./index.scss";

export default function User() {
  const [user, setUser] = useState(null);
  const [supportEmail, setSupportEmail] = useState("someone@example.com");
  const [allowEmailNotifications, setAllowEmailNotifications] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    hypotension: false,
    prehypertension: false,
    stage1Hypertension: false,
    stage2Hypertension: false,
    hypertensiveCrisis: false,
  });
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const email = await getUserSupportEmail(user.uid);
        setSupportEmail(email);
        const userSettings = await getUserSettings(user.uid);
        if (userSettings) {
          setAllowEmailNotifications(
            userSettings.allowEmailNotifications || false
          );
          setNotificationSettings({
            hypotension: userSettings.hypotension || false,
            prehypertension: userSettings.prehypertension || false,
            stage1Hypertension: userSettings.stage1Hypertension || false,
            stage2Hypertension: userSettings.stage2Hypertension || false,
            hypertensiveCrisis: userSettings.hypertensiveCrisis || false,
          });
        }
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const success = await saveUserData(user.uid, {
        supportEmail,
        allowEmailNotifications,
        ...notificationSettings,
      });
      if (success) {
        toast.success("Settings saved!");
      } else {
        toast.error("Failed to save settings.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings.");
    }
  };

  const handleNotificationSettingChange = (name) => (event) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: event.target.checked,
    });
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("Failed to send password reset email.");
    }
  };

  const handleDeleteHistory = async () => {
    try {
      await deleteResultHistory(user.uid);
      toast.success("History deleted!");
      setShowHistoryModal(false);
    } catch (error) {
      console.error("Error deleting history:", error);
      toast.error("Failed to delete history.");
    }
  };

  const handleDeleteAccount = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteUser(user);
      toast.success("Account deleted!");
      setShowDeleteModal(false);
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        try {
          // użytkownik zostaje wylogowany aby ponownie potwierdzić swoją tożsamość
          await signOut(auth);
          toast.info("Please log in again to delete your account.");
          navigate("/login");
        } catch (signOutError) {
          console.error("Error during sign out:", signOutError);
          toast.error("Failed to log out. Please try again.");
        }
      } else {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="user-form">
      <div className="user-page">
        <h2>User Settings</h2>
        <form onSubmit={handleSaveChanges}>
          <div>
            <label className="notification">Change notification email:</label>
            <br />
            <input
              type="email"
              placeholder="someone@example.com"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              required
            />
          </div>
          <div className="notification-settings">
            <h3>Allow email notifications:</h3>
            <label className="switch">
              <input
                type="checkbox"
                checked={allowEmailNotifications}
                onChange={(e) => setAllowEmailNotifications(e.target.checked)}
              />
              <span className="slider"></span>
              <span className="label">Allow Notifications</span>
            </label>
            <h3>Notification settings:</h3>
            <label className="switch">
              <input
                type="checkbox"
                checked={notificationSettings.hypotension}
                onChange={handleNotificationSettingChange("hypotension")}
              />
              <span className="slider"></span>
              <span className="label">Hypotension</span>
            </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={notificationSettings.prehypertension}
                onChange={handleNotificationSettingChange("prehypertension")}
              />
              <span className="slider"></span>
              <span className="label">Prehypertension</span>
            </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={notificationSettings.stage1Hypertension}
                onChange={handleNotificationSettingChange("stage1Hypertension")}
              />
              <span className="slider"></span>
              <span className="label">Stage 1 Hypertension</span>
            </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={notificationSettings.stage2Hypertension}
                onChange={handleNotificationSettingChange("stage2Hypertension")}
              />
              <span className="slider"></span>
              <span className="label">Stage 2 Hypertension</span>
            </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={notificationSettings.hypertensiveCrisis}
                onChange={handleNotificationSettingChange("hypertensiveCrisis")}
              />
              <span className="slider"></span>
              <span className="label">Hypertensive Crisis</span>
            </label>
          </div>
          <div className="save-changes">
            <button type="submit" className="options-button">
              Save Changes
            </button>
          </div>
        </form>
        <div className="button-group">
          <button
            className="options-button"
            onClick={() => setShowHistoryModal(true)}
          >
            Remove history
          </button>
          <button
            className="options-button"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete account
          </button>
          <button
            onClick={handlePasswordReset}
            className="options-button"
            disabled={user?.providerData.some(
              (provider) => provider.providerId === "google.com"
            )}
          >
            Change password
          </button>
        </div>

        {/* Modal usuwanie historii */}
        {showHistoryModal && (
          <Modal
            title="Do you want to remove your history?"
            onConfirm={handleDeleteHistory}
            onCancel={() => setShowHistoryModal(false)}
          />
        )}

        {/* Modal usuwanie konta */}
        {showDeleteModal && (
          <Modal
            title="Do you want to delete your account?"
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}

        <ToastContainer />
      </div>
    </div>
  );
}
