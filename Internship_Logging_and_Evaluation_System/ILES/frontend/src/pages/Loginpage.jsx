import React, { useState } from "react";

import { User as U, KeyRound as KR, Mail, LockKeyhole as LK } from 'lucide-react';

function Loginpage() {
  const [showLogin, setShowLogin] = React.useState(true);


  return (
    <>
      {showLogin ? (
        <div className="loginForm">
          <div className="Header">
            <h2>Login</h2>
          </div>
          <form>
            <div>
              <U />
              <input placeholder="Username..."></input>
            </div>
            <div>
              <KR />
              <input placeholder="Password..."></input>
            </div>
          </form>
          <div className="Login">
            <button>Login</button>
          </div>
          <div className="SignUpPrompt">
            <p>
              New here?
              <a href="#" onClick={() => setShowLogin(false)}>
                Sign up
              </a>
            </p>
          </div>
        </div >
      ) : (
        <div className="SignUpForm">
          <div className="Header">
            <h2>Sign Up</h2>
          </div>
          <form>
            <div>
              <U />
              <input placeholder="Username..."></input>
            </div>
            <div>
              <Mail />
              <input placeholder="Email..."></input>
            </div>
            <div>
              <KR />
              <input placeholder="Password..."></input>
            </div>
            <div>
              <LK />
              <input placeholder="Confirm Password..."></input>
            </div>
          </form>
          <div className="SignUp">
            <button>Sign Up</button>
          </div>
          <div className="LoginPrompt">
            <p>
              Already have an account?
              <a href="#" onClick={() => setShowLogin(true)}>
                Login
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Loginpage;