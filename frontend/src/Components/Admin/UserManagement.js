import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import styled from "styled-components";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = async (id) => {
    try {
      setUpdatingId(id);
      setError("");
      await api.patch(`/admin/users/toggle-user/${id}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <UserManagementStyled>
      {error && <div className="error">{error}</div>}
      <h2>User Management</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="role">{u.role}</td>
                <td>
                  <span
                    className={`status ${u.isActive ? "active" : "disabled"}`}
                  >
                    {u.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td>
                  <button
                    className={u.isActive ? "danger" : "success"}
                    disabled={updatingId === u._id}
                    onClick={() => toggleUser(u._id)}
                    title={
                      u.role === "admin" && u.isActive
                        ? "You cannot disable the last admin"
                        : ""
                    }
                  >
                    {updatingId === u._id
                      ? "Updating..."
                      : u.isActive
                      ? "Disable"
                      : "Restore"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </UserManagementStyled>
  );
};

const UserManagementStyled = styled.div`
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
    color: rgba(34, 34, 96, 0.85);
  }

  tbody tr:hover {
    background: rgba(34, 34, 96, 0.05);
  }

  .role {
    text-transform: capitalize;
    font-weight: 600;
  }

  .status {
    padding: 0.3rem 0.7rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .status.active {
    background: rgba(0, 180, 120, 0.15);
    color: rgb(0, 140, 90);
  }

  .status.disabled {
    background: rgba(220, 53, 69, 0.15);
    color: rgb(180, 40, 55);
  }

  button {
    border: none;
    padding: 0.4rem 0.9rem;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  button.danger {
    background: rgba(220, 53, 69, 0.15);
    color: rgb(180, 40, 55);
  }

  button.danger:hover {
    background: rgba(220, 53, 69, 0.25);
  }

  button.success {
    background: rgba(0, 180, 120, 0.15);
    color: rgb(0, 140, 90);
  }

  button.success:hover {
    background: rgba(0, 180, 120, 0.25);
  }
  .error {
    margin-bottom: 1rem;
    padding: 0.8rem 1rem;
    border-radius: 12px;
    background: rgba(220, 53, 69, 0.15);
    color: rgb(180, 40, 55);
    font-weight: 600;
  }
`;

export default UserManagement;
