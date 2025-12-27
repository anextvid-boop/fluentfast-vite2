import { useState } from 'react';

type Page = 'HOME' | 'PARTNER';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('HOME');

  return (
    <div
      style={{
        height: '100vh',
        background: '#6865F0',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      {currentPage === 'HOME' && (
        <>
          <h1 style={{ fontSize: 48, marginBottom: 40 }}>
            FluentFast 🚀
          </h1>
          <button
            onClick={() => setCurrentPage('PARTNER')}
            style={{
              fontSize: 24,
              padding: '16px 32px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Go Next
          </button>
        </>
      )}

      {currentPage === 'PARTNER' && (
        <>
          <h1 style={{ fontSize: 48, marginBottom: 40 }}>
            Partner Page
          </h1>
          <button
            onClick={() => setCurrentPage('HOME')}
            style={{
              fontSize: 24,
              padding: '16px 32px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Back
          </button>
        </>
      )}
    </div>
  );
};

export default App;
