import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import styled from "styled-components";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/admin/audit");
      setLogs(res.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <p>Loading audit logs...</p>;

  return (
    <AuditLogsStyled>
      <h2>Audit Logs</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Admin</th>
              <th>Target</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td className="action">{log.action}</td>
                <td>{log.performedBy?.email}</td>
                <td>{log.targetUser?.email || "-"}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuditLogsStyled>
  );
};


const AuditLogsStyled = styled.div`
  background: rgba(252, 246, 249, 0.85);
  border: 3px solid #ffffff;
  backdrop-filter: blur(6px);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.08);

  h2 {
    margin-bottom: 1.5rem;
    color: rgba(34, 34, 96, 1);
  }

  .table-wrapper {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }

  thead {
    background: rgba(34, 34, 96, 1);
  }

  th {
    padding: 1rem;
    text-align: left;
    color: #fff;
    font-weight: 600;
  }

  td {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid rgba(34, 34, 96, 0.1);
    color: rgba(34, 34, 96, 0.8);
  }

  tbody tr:hover {
    background: rgba(34, 34, 96, 0.05);
  }

  .action {
    font-weight: 600;
    color: rgba(34, 34, 96, 1);
  }
`;


export default AuditLogs;
