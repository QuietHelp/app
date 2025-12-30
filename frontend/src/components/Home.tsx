interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>QuietHelp</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Anonymous peer support. No login required.
      </p>
      <button
        onClick={onStart}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Start
      </button>
    </div>
  );
}

