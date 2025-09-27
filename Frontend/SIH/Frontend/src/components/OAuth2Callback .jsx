import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const provider = params.get("provider");

    if (email) {
      console.log("Email from backend redirect:", email);
      localStorage.setItem("authToken", email);
      localStorage.setItem("provider", provider);
      navigate("/"); // redirect after login
    } else {
      navigate("/");
    }
  }, [navigate]);

  return <div>Logging in...</div>;
};

export default OAuth2Callback;
