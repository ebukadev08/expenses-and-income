import { Outlet, NavLink } from "react-router-dom";
import styled from "styled-components";

function AdminLayout() {
  return (
    <AdminLayoutStyled>
      <aside className="sidebar">
        <h2>Admin</h2>

        <nav>
          <NavLink to="" end>Dashboard</NavLink>
          <NavLink to="users">Users</NavLink>
          <NavLink to="audit">Audit Logs</NavLink>
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </AdminLayoutStyled>
  );
}

const AdminLayoutStyled = styled.div`
  display: flex;
  height: 100%;
  width: 100%;

  .sidebar {
    width: 260px;
    padding: 2rem 1.5rem;
    background: rgba(252, 246, 249, 0.85);
    border-right: 3px solid #ffffff;
    backdrop-filter: blur(6px);
    border-radius: 24px 0 0 24px;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    h2 {
      font-size: 1.8rem;
      color: rgba(34, 34, 96, 1);
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    a {
      text-decoration: none;
      padding: 0.9rem 1rem;
      border-radius: 12px;
      font-weight: 500;
      color: rgba(34, 34, 96, 0.6);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(34, 34, 96, 0.08);
        color: rgba(34, 34, 96, 1);
      }
    }

    a.active {
      background: rgba(34, 34, 96, 1);
      color: #fff;
    }
  }

  .content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }
`;


export default AdminLayout;
