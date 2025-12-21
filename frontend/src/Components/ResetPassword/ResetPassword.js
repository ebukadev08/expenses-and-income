import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { API_URL } from "../../config";
import Loading from "../Loading/Loading";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await axios.post(`${API_URL}reset-password/${token}`, { password });
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length >= 8 ? "Strong" : "Weak";

  return (
    <AuthStyled>
      <form onSubmit={submit}>
        <h2>Reset Password</h2>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p>Password strength: {strength}</p>

        <button type="submit" disabled={loading}>
          {loading ? <Loading /> : "Reset Password"}
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
  }

  input {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    outline: none;
    font-size: 1em;
    &::placeholder {
      font-weight: normal;
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
    font-weight: normal;
  }

  .success {
    color: green;
  }
  .error {
    color: red;
  }
`;

export default ResetPassword;
