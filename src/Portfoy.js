import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import PieChart from './PieChart';
import './portfoy.css';
import axios from 'axios';

function Portfoy() {
  const { authenticated } = useAuth();
  const [portfoyData, setPortfoyData] = useState(null);
  const navigate = useNavigate();
  const [canliFiyatlarCekildi, setCanliFiyatlarCekildi] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/portfoy/get-portfoy');
        if (!response.ok) {
          throw new Error('API hatası');
        }
        const data = await response.json();
        setPortfoyData(data);
      } catch (error) {
        console.error('API hatası:', error);
      }
    };

    fetchData();
  }, [authenticated, navigate]);

  useEffect(() => {
    if (portfoyData && portfoyData.hisseBilgileri && !canliFiyatlarCekildi) {
      const selectedSymbols = portfoyData.hisseBilgileri.map((hisse) => hisse.hisseSembol);
  
      const fetchLivePricesSequentially = async () => {
        const updatedHisseBilgileri = [...portfoyData.hisseBilgileri];
        let totalLivePrices = 0;
  
        for (const selectedSymbol of selectedSymbols) {
          try {
            const livePriceResponse = await axios.post('http://localhost:8080/api/live-price', { selectedSymbol });
  
            console.log(`Canlı Fiyat (${selectedSymbol}):`, livePriceResponse.data);
  
            const stockIndex = updatedHisseBilgileri.findIndex((hisse) => hisse.hisseSembol === selectedSymbol);
  
            if (stockIndex !== -1) {
              updatedHisseBilgileri[stockIndex] = {
                ...updatedHisseBilgileri[stockIndex],
                canliFiyat: livePriceResponse.data,
              };
              totalLivePrices += livePriceResponse.data.price * updatedHisseBilgileri[stockIndex].hisseMiktari;
            }
          } catch (error) {
            console.error(`Fiyat Çekme Hatası (${selectedSymbol}):`, error);
          }
  
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
  
        const newUserBalance = portfoyData.kullaniciBakiye + totalLivePrices;
  
        setPortfoyData({ ...portfoyData, kullaniciBakiye: newUserBalance, hisseBilgileri: updatedHisseBilgileri });
      };
  
      fetchLivePricesSequentially();
  
      setCanliFiyatlarCekildi(true);
    }
  }, [portfoyData, canliFiyatlarCekildi]);
  
  

  const handleBackClick = () => {
    navigate('/main'); 
  };

  if (!authenticated) {
    return <p className="alert alert-danger">Bu sayfaya erişim yetkiniz yok. Lütfen giriş yapın.</p>;
  }

  if (!portfoyData) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Portföy</h1>
      <button onClick={handleBackClick} className="btn btn-primary">Geri</button>
      <div className="row">
        <div className="col-md-6">
          <p>Kullanıcı Bakiye: {portfoyData.kullaniciBakiye}</p>
          <ul className="list-group">
            {portfoyData.hisseBilgileri.map((hisse, index) => (
              <li key={index} className="list-group-item">
                Hisse Adı: {hisse.hisseAdi}, Hisse Sembolü: {hisse.hisseSembol}, Hisse Miktarı: {hisse.hisseMiktari}
                {hisse.canliFiyat && (
                  <span>, Hisse Değeri: {hisse.canliFiyat.price * hisse.hisseMiktari} $</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <PieChart data={portfoyData.hisseBilgileri} />
        </div>
      </div>
    </div>
  );
}

export default Portfoy;
