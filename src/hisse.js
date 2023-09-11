import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './Hisse.css';
import axios from 'axios';
import { Form, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Swal from 'sweetalert2';
import swal from 'sweetalert';


function Hisse() {
  const { authenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [hisseFiyati, setHisseFiyati] = useState(0);
  const [hisseListesi, setHisseListesi] = useState([]);
  const navigate = useNavigate();
  const [serbestBakiye, setSerbestBakiye] = useState(null);
  const [bakiye, setBakiye] = useState(0);

  const navigateToMainPage = () => {
    navigate('/main');
  };


  const handleBuy = async () => {
    if (searchTerm.trim() === '' || isNaN(quantity) || quantity <= 0) {
      console.error('Geçersiz sembol veya miktar. Lütfen kontrol edin.');
      return;
    }
    const confirmBuy = await swal('Hisse almak istediğinize emin misiniz?', {
      buttons: ['Hayır', 'Evet'],      });
    if (!confirmBuy) {
      console.log('Alış işlemi iptal edildi.');
      return;
    }
  
    try {
      const livePriceResponse = await axios.post('http://localhost:8080/api/live-price', {
        selectedSymbol: searchTerm,
      });
  
      const hisseFiyati = livePriceResponse.data.price;
  
      const buyResponse = await axios.post('http://localhost:8080/api/hisse-al', {
        selectedSymbol: searchTerm,
        quantity,
        livePrice: hisseFiyati,
      });
  
      const responseData = parseInt(buyResponse.data);
  
      if (responseData === 1) {
        swal("Başarılı!", "Hisse alımı gerçekleşti!", "success");
        console.log("Alış işlemi başarılı.");
        const selectedSymbol = searchTerm;
        handleSymbolChange2({ target: { value: selectedSymbol } });
        setQuantity({target: 0});
      } else {
        console.log("Alış işlemi başarısız. Yetersiz bakiye.");
        swal("Başarısız!", "Alış işlemi BAŞARISIZ OLDU YETERSİZ BAKİYE.", "error");
      }
    } catch (error) {
      console.error('Bir hata oluştu: ', error);
    }
  };
  
  const handleSell = async () => {
    if (searchTerm.trim() === '' || isNaN(quantity) || quantity <= 0) {
      console.error('Geçersiz sembol veya miktar. Lütfen kontrol edin.');
      return;
    }
    
    const confirmSell = await swal('Hisse Satmak istediğinize emin misiniz?', {
      buttons: ['Hayır', 'Evet'],      });
    if (!confirmSell) {
      console.log('Satış işlemi iptal edildi.');
      return;
    }
    
    try {
      const livePriceResponse = await axios.post('http://localhost:8080/api/live-price', {
        selectedSymbol: searchTerm,
      });
    
      const hisseFiyati2 = livePriceResponse.data.price;
    
      const sellResponse = await axios.post('http://localhost:8080/api/hisse-sat', {
        selectedSymbol: searchTerm,
        quantity,
        livePrice: hisseFiyati2,
      });

      const responseData = parseInt(sellResponse.data);
    
      if (responseData === 1) {
        swal("Başarılı!", "Hisse satımı gerçekleşti!", "success");

        
        const selectedSymbol = searchTerm;
        handleSymbolChange2({ target: { value: selectedSymbol } });
        setQuantity({target: 0});
    
        setSerbestBakiye();
      } else {
        console.log("Satış işlemi başarısız. Yetersiz hisse miktarı.");
        swal("Başarısız!", "Satış işlemi BAŞARISIZ OLDU yeterli sayıda hisseniz bulunmamaktadır..", "error");

      }
    } catch (error) {
      console.error('Bir hata oluştu: ', error);
    }
  };
  

  const handleSymbolChange = (e) => {
    const selectedSymbol = e.target.value;
    console.log(selectedSymbol);
    axios.post('http://localhost:8080/api/live-price', { selectedSymbol })
      .then((response) => {
        const hisseFiyati = response.data.price;
        setHisseFiyati(hisseFiyati);
        console.log(`Fiyat: ${hisseFiyati}`);
      })
      .catch((error) => {
        console.error('Canlı veri alınırken hata oluştu: ', error);
      });
  };

  const handleSymbolChange2 = (e) => {
    const selectedSymbol = e.target.value;
  
    axios.post('http://localhost:8080/api/hisse', null, {
      params: { selectedSymbol: selectedSymbol },
    })
      .then((response) => {
        console.log('Response received:', response);
        const hisseInfo = response.data;
        console.log('Hisse Bilgileri:', hisseInfo);
        setHisseListesi(hisseInfo);
      })
      .catch((error) => {
        console.error('Hisse bilgileri alınırken hata oluştu: ', error);
      });
  };
  

  if (!authenticated) {
    return <p className="error-message">Bu ekran için yetkiniz yok lütfen giriş yapınız.</p>;
  }

  return (
    <div className="container">
      <div>
        <h2 className="text-center">Hisse Alım Satım Ekranı</h2>
      </div>
      <div>
        <div className="mb-3">
          <label htmlFor="symbol" className="form-label">Hisse Sembolu:</label>
          <input
            type="text"
            id="symbol"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={(e) => {
              handleSymbolChange(e);
              handleSymbolChange2(e);
            }}
            placeholder="Hisse Sembolu Ara"
          />
        </div>
        <ul className="list-group">
          {hisseListesi.map((hisse, index) => (
            <li key={index} className="list-group-item">
              <strong>Hisse Adı:</strong> {hisse.hisseAdi}
            </li>
          ))}
        </ul>
        <p className="text-center">Fiyat: ${hisseFiyati}</p>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Tane (Sahip Olduğunuz: {hisseListesi.length > 0 ? hisseListesi[0].hisseMiktar : 0}):
          </label>
          <input
            type="number"
            id="quantity"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Miktar"
          />
        </div>
        
        <button className="btn btn-success btn-hover mb-3" onClick={handleBuy}>Al</button>
        <button className="btn btn-danger btn-hover-sell mb-3" onClick={handleSell}>Sat</button>
        <button className="btn btn-secondary mb-3" onClick={navigateToMainPage}>Geri</button>
      </div>
      <div>
        <label htmlFor="bakiye" className="form-label">
          Bakiye: ${hisseListesi.length > 0 ? hisseListesi[0].bakiye : 0}
        </label>
      </div>
    </div>
  );
  
}

export default Hisse;
