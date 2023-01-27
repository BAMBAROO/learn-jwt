import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('')
  const navigate = useNavigate();

  const sendLogin = async(e) => {
    e.preventDefault();
    const data = {email:email, password:password};
    const dataForm = JSON.stringify(data);
    fetch("http://localhost:5000/login",
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: dataForm,
      credentials: 'include'
    })
    .then((res) => {
      console.log(res)
      if (res.ok === true) {
        return navigate('/dashboard')
      } else {
        return res.json()
      }
    })
    .then((res) => {
      setMsg(res?.msg)
    })
  };

  return (
    <div>
      <form onSubmit={sendLogin} action="post">
        <p>{msg}</p>
        <div>
          <p>email:</p>
          <input type="text" value={email} required onChange={(e) => {
            setEmail(e.target.value)
          }}/>
          <p>password:</p>
          <input type="password" value={password} required onChange={(e) => {
            setPassword(e.target.value)
          }} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
};
export default Login;