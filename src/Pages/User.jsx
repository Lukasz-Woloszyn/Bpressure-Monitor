import React, { useEffect, useState } from "react";
import UserComponent from "../components/UserComponent";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";

export default function User() {
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      if (!res?.accessToken) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    });
  }, []);
  return loading ? <Loader /> : <UserComponent />;
}
