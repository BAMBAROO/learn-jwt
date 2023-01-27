import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('')
  const navigate = useNavigate();

  const sendRegist = async(e) => {
    e.preventDefault();
    const data = {name:name, email:email, password:password, confirmPassword:confirmPassword};
    const dataForm = JSON.stringify(data);
    fetch("http://localhost:5000/register",
    {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: dataForm
    })
    .then((res) => {
      if (res.ok === false) {
        return res.json();
      } else {
        return navigate("/");
      }
    })
    .then(res => setMsg(res?.msg))
  };

  return (
    <div>
      <form onSubmit={sendRegist} action="post">
        <div>
          <p>{msg}</p>
          <div>
            <p>username:</p>
            <input type="text" required value={name} onChange={(e) => {
              setName(e.target.value)
            }}/>
          </div>
          <div>
            <p>email:</p>
            <input type="text" required value={email} onChange={(e) => {
              setEmail(e.target.value)
            }}/>
          </div>
          <div>
            <p>password:</p>
            <input type="password" required value={password} onChange={(e) => {
              setPassword(e.target.value)
            }} />
          </div>
          <div>
            <p>confirm password:</p>
            <input type="password" required value={confirmPassword} onChange={(e) => {
              setConfirmPassword(e.target.value)
            }} />
          </div>
          <button type="submit">register</button>
        </div>
      </form>
    </div>
  )
};
export default Register;