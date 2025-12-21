import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/authContext";
import Loading from "../Loading/Loading";

function Signup() {
  const { signup, error, setError, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(form);
  };
  return (
    <AuthStyled>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
        <button disabled={loading}>
          {loading ? <Loading/> : "Signup"}
        </button>
        <p className="switch">
          Already have an account? <a href="/login">Login here</a>
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
  h2{
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
      border-radius: 8px;
      font-size: 1rem;
      border: 1px solid #ccc;
      outline: none;
    }
    button {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      background-color: var(--color-accent);
      color: white;
      cursor: pointer;
	    font-size: 1rem;
      font-weight: bold;
      &:disabled {
        background-color: #ccc;
      }
      &::placeholder {
        font-weight: normal;
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
        }
      }
  }
  .error {
    color: red;
  }
`;

export default Signup;
