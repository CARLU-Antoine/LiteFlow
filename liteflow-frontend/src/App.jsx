// src/App.jsx
function App() {
  const ping = async () => {
    const res = await window.api.ping();
    alert(res);
  };

  return (
    <button onClick={ping}>
      Tester Electron
    </button>
  );
}

export default App;
