import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from './AuthContext';
import './Login.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginResult, setLoginResult] = useState(null);
  const navigate = useNavigate(); 
  const { login } = useAuth(); 


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData === 1) {
          setLoginResult('Giriş başarılı');
          login();
          navigate('/main');

        } else {
          setLoginResult('Hatalı giriş');
        }
      } else {
        setLoginResult('Bir hata oluştu');
      }
    } catch (error) {
      console.error('Bir hata oluştu:', error);
      setLoginResult('Kullanıcı adı veya şifre Hatalı.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Kullanıcı Adı:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Şifre:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Giriş</button>
      </form>
      <div>{loginResult}</div>
    </div>
  );
}

export default LoginForm;
