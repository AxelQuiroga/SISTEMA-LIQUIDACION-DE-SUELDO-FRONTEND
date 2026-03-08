import { useState } from "react";
import { login } from "../../services/authService";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const data = await login(email, password);

      localStorage.setItem("token", data.token);

      console.log("LOGIN OK", data);

    } catch (err) {

      setError(
        err.response?.data?.message || "Error al iniciar sesión"
      );

    }
  };

  return (
    <div>

      <h2>Login</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Ingresar
        </button>

      </form>

    </div>
  );
}

export default Login;
