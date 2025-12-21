import styled from "styled-components";

function Loading() {
  return (
    <Overlay>
      <div className="loader">
        <div className="spinner"></div>
        <p>Please wait...</p>
      </div>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  .loader {
    background: #fff;
    padding: 2rem 3rem;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #eee;
    border-top: 4px solid #222260;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  p {
    font-weight: 500;
    color: #222260;
  }
`;

export default Loading;
