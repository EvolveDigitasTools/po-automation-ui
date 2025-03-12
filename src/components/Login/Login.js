import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Button, TextField } from "@mui/material";

export default function Login() {
  const [userName, setUserName] = useState('');
  const [pass, setPass] = useState('');
  const { login, userToken } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    if (userToken)
      navigate('/admin')
  }, [userToken])

  async function loginUser(e) {
    e.preventDefault();
    const loginUrl = `${process.env.REACT_APP_SERVER_URL}/auth/login`
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("password", pass);
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      body: formData
    })
    const loginData = await loginResponse.json()
    if (loginData?.success) {
      login(loginData.data.token)
      window.location.reload()
    }
    else
      alert("Either email or password incorrect")
  }

  return (
    <div>
      <h2>Login</h2>
      <form>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={loginUser}>
          Login
        </Button>
      </form>
    </div>
  );
}