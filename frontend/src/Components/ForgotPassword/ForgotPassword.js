import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { API_URL } from "../../config";
import Loading from "../Loading/Loading"; // your spinner component

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate wait
      await axios.post(`${API_URL}forgot-password`, { email });
      setMessage("Check your email for the reset link!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthStyled>
      <form onSubmit={submit}>
        <h2>Forgot Password</h2>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? <Loading /> : "Send Reset Link"}
        </button>
      </form>
    </AuthStyled>
  );
}

const AuthStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    background: rgba(252, 246, 249, 0.8);
    border-radius: 20px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    width: 350px;
    text-align: center;
    font-weight: bold;
  }

  input {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    outline: none;
    font-size: 1em;
    &::placeholder {
      font-weight: normal;
      padding: 0.5rem 0;
    }
  }

  button {
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    background: var(--color-accent);
    color: white;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1em;
    font-weight: bold;
  }

  .success {
    color: green;
  }
  .error {
    color: red;
  }
`;

export default ForgotPassword;
