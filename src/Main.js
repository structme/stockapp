import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './Main.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Main() {
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const [serbestBakiye, setSerbestBakiye] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:8080/api/bakiye/kullanici-bakiye')
      .then((response) => {
        const serbestBakiyeInt = parseInt(response.data);
        setSerbestBakiye(serbestBakiyeInt);
      })
      .catch((error) => {
        console.error('Serbest bakiye alınırken hata oluştu: ', error);
      });
  }, []);

  if (!authenticated) {
    return <p>Bu ekran için yetkiniz yok lütfen giriş yapınız.</p>;
  }

  const handleHisseSatınAl = () => {
    navigate('/main/hisse');
  };
  const handlePortfoy = () => {
    navigate('/main/portfoy');
  };
  const handleAlimSatimGecmisi = () => {
    navigate('/main/islemgecmisi');
  };

  return (
    <div className="container">
      <h1 className="text-center">HOŞGELDİN</h1>
         <p className="balance-text">Serbest Bakiye: <span className="balance-amount">{serbestBakiye} USD</span></p>

      <form className="button-container">
        <button className="btn btn-primary btn-lg btn-block mb-3" onClick={handleHisseSatınAl}>
          Hisse Satın Al
        </button>
        <button className="btn btn-primary btn-lg btn-block mb-3" onClick={handlePortfoy}>
          Portföyüm
        </button>
        <button className="btn btn-primary btn-lg btn-block mb-3" onClick={handleAlimSatimGecmisi}>
          Alım Satım Geçmişi
        </button>
      </form>
    </div>
  );
  
}

export default Main;
