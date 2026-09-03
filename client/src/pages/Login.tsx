const Login = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ padding: "40px", background: "white", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>
        <form>
          <div style={{ marginBottom: "15px" }}>
            <input type="email" placeholder="Email" style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <input type="password" placeholder="Password" style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
          </div>
          <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#4ade80", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
