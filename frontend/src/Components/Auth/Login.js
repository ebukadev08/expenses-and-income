import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/authContext";
import { Link } from "react-router-dom";

function Login() {
  const { login, error, loading } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <AuthStyled>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button disabled={loading}>Login</button>
        <p className="switch">
          Don’t have an account? <a href="/signup">Sign up here</a>
        </p>
        <p className="switch">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
      </form>
    </AuthStyled>
  );
}

const AuthStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  h2 {
    margin-bottom: 1rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 90%;
    max-width: 400px;
    min-height: 350px;
    padding: 2.5rem 2rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    input {
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      font-size: 1em;
      border-radius: 8px;
      border: 1px solid #ccc;
      outline: none;
      &::placeholder {
        font-weight: normal;
      }
    }
    button {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 1em;
      font-weight: bold;
      background: var(--color-accent);
      color: white;
      cursor: pointer;
      &:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    }
    .switch {
      margin-top: 1rem;
      text-align: center;
      font-size: 1em;
      a {
        color: var(--color-accent, #007bff);
        text-decoration: none;
        font-weight: bold;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .error {
    color: red;
  }
`;

export default Login;
