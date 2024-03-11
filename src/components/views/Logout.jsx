import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Logout() {
  // TODO import user session store, extract logout function
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem('session_token');
    navigate("/login");
  }, [navigate]);

  return null;
}