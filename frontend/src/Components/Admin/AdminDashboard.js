import { useEffect, useState } from "react";
import api from "../../utils/axios";
import styled from "styled-components";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("admin/stats")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading>Loading admin stats…</Loading>;

  return (
    <AdminDashboardStyled>
      <h2>Admin Dashboard</h2>

      <div className="stats-grid">
        <div className="card">
          <h4>Active Users</h4>
          <span>{stats.users}</span>
        </div>

        <div className="card danger">
          <h4>Disabled Users</h4>
          <span>{stats.deletedUsers}</span>
        </div>

        <div className="card success">
          <h4>Total Incomes</h4>
          <span>{stats.incomes}</span>
        </div>

        <div className="card warning">
          <h4>Total Expenses</h4>
          <span>{stats.expenses}</span>
        </div>
      </div>
    </AdminDashboardStyled>
  );
}


const AdminDashboardStyled = styled.div`
  padding: 2rem;
  width: 100%;

  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: rgba(34, 34, 96, 1);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  .card {
    background: rgba(252, 246, 249, 0.9);
    border: 2px solid #ffffff;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-4px);
    }

    h4 {
      font-size: 1rem;
      font-weight: 600;
      color: rgba(34, 34, 96, 0.7);
    }

    span {
      font-size: 2rem;
      font-weight: 700;
      color: rgba(34, 34, 96, 1);
    }
  }

  .success span {
    color: #2ecc71;
  }

  .danger span {
    color: #e74c3c;
  }

  .warning span {
    color: #f39c12;
  }
`;

const Loading = styled.p`
  padding: 2rem;
  font-weight: 500;
  color: rgba(34, 34, 96, 0.7);
`;

export default AdminDashboard;
