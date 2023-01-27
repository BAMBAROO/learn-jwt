import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, [])

  const refreshToken = async() => {
    fetch('http://localhost:5000/token', {
      credentials: 'include'
    })
    .then((res) => {
      console.log(res)
      return res.json();
    })
    .then((res) => {
      console.log(res.accessToken);
      if (res?.accessToken) {
        setToken(res.accessToken)
        const decode = jwt_decode(res.accessToken);
        console.log(decode)
        setName(decode.name)
        setEmail(decode.email)
      }
    })
  }

  const getData = async() => {
    await refreshToken();
    fetch('http://localhost:5000/users',{
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      },
      
    }).then((res) => {
      console.log(res)
      return res.json()
    }).then((res) => {
      console.log(res)
      setData(res)
    })
  };

  const Logout = () => {
    fetch('http://localhost:5000/logout',{
      credentials: 'include',
      method: "DELETE"
    });
    navigate('/')
  };

  return(
    <>
    <div>
      <p>nama: {name}</p>
      <p>email: {email}</p>
    </div>
    <div>
      <button onClick={() => {getData()}} >Get all Users</button>
      <button onClick={() => {Logout()}} >LogOut</button>
    </div>
    <div>
      <button onClick={() => {console.log(data)}} >Console Log Data</button>
      <button onClick={() => {refreshToken()}} >RefreshToken</button>
    </div>
    <hr />
    {data?.map((data) => {
      return (
        <>
          <p>name: {data.name}</p>
          <p>email: {data.email}</p>
          <hr />
        </>
      )
    })}
    </>
  );
};
export default Dashboard;