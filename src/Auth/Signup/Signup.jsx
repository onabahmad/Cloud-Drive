import React, { useState } from "react";
import { auth } from "../../firebase";
import { database } from "../../firebase";
import "./Signup.css";
import { set, ref } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { CiCalendar } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { MdArrowRightAlt } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4, v4 } from "uuid";
const Signup = () => {
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    console.log(email);

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        set(ref(database, `users/${v4()}`), {
          name,
          email,
        });

        toast.success("Welcome to Cloud Drive");
        navigate("/home");
      })
      .catch((error) => {
        console.error(error.message);
        toast.error(error.message);
      });
  };

  const handleGooglesignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      set(ref(database, `users/${user.uid}`), {
        name: user.displayName,
        email: user.email,
      });

      toast.success("Welcome to Cloud Drive");
      navigate("/home");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const handleAlreadyRegister = () => {
    navigate("/");
  };
  return (
    <div className="login">
      <div className="heading">
        <CiCalendar className="heading-logo" />
        CLoud Drive
      </div>
      <div className="login-heading-container signup">
        <h2 className="login-heading signup-heading">
          Cool! Let's get you registered
        </h2>
      </div>
      <div className="login-container">
        <form onSubmit={(e) => handleRegister(e)} className="login-form">
          <label className="form-label">
            Your name:
            <input type="text" className="form-input" name="name" />
          </label>
          <br />
          <label className="form-label">
            Your email:
            <input type="text" className="form-input" name="email" />
          </label>
          <br />
          <label className="form-label">
            Your password:
            <input type="password" className="form-input" name="password" />
          </label>
          <br />
          <label className="form-label">
            Confirm your password:
            <input
              type="password"
              className="form-input"
              name="confirmPassword"
            />
          </label>
          {passwordMatchError && (
            <p className="error-message">Password does't match.</p>
          )}
          <br />

          <button className="login-button">
            Register
            <MdArrowRightAlt />
          </button>
        </form>
        <div className="horizontal-line">
          <hr />
          or <hr />
        </div>
        <div className="google-signup">
          <button className="google-login-button">
            <div
              onClick={handleGooglesignup}
              className="google-login-button-container"
            >
              <FcGoogle className="google-logo" />
              Register with Google
            </div>
          </button>
        </div>
      </div>

      <div className="register signup_register">
        <p className="already-Registerd" onClick={handleAlreadyRegister}>
          Already registered?
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
