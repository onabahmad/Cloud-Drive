import React, { useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { MdArrowRightAlt } from "react-icons/md";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/Signup");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential.user, "user");
      toast.success("Welcome to Cloud Drive");
      navigate("/home");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
    setLoading(false);
  };
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      console.log(user);
      toast.success("Welcome to Cloud Drive");
      navigate("/home");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="login">
      <div className="heading">
        <CiCalendar className="heading-logo" />
        Cloud Drive
      </div>
      <div className="login-container">
        <div className="login-heading-container">
          <h2 className="login-heading">Login</h2>
        </div>

        <form onSubmit={(e) => handleLogin(e)} className="login-form">
          <label className="form-label">
            Your email:
            <input name="email" type="text" className="form-input" />
          </label>
          <br />
          <label className="form-label">
            Your password:
            <input name="password" type="password" className="form-input" />
          </label>

          <div className="remember-me">
            <input type="checkbox" />
            <p>Remember me</p>
          </div>
          <button className="login-button" disabled={loading}>
            {loading ? "Logging in" : "Login"}
            <MdArrowRightAlt />
          </button>
        </form>
        <div className="horizontal-line">
          <hr />
          or <hr />
        </div>
        <div className="loginGoogle-notregister">
          <button onClick={handleGoogleLogin} className="google-login-button">
            <div className="google-login-button-container">
              <FcGoogle className="google-logo" />
              Login with Google
            </div>
          </button>
          <div className="register">
            <p className="forgetpassword">Forget your password?</p>
            <p className="notregister" onClick={handleRegister}>
              Not registered?
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Login;
