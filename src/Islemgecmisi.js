import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Islemgecmisi() {
  const { authenticated } = useAuth();
  const [alimSatimVerileri, setAlimSatimVerileri] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatUnixTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    if (authenticated) {
      fetch('http://localhost:8080/alimsatim/veriler')
        .then((response) => response.json())
        .then((data) => {
          const formattedData = data.map((veri) => ({
            ...veri,
            tarih: formatUnixTimestamp(veri.tarih),
          }));
          formattedData.sort((a, b) => b.tarih - a.tarih);
          setAlimSatimVerileri(formattedData);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Veri çekme hatası:', error);
          setLoading(false);
        });
    }
  }, [authenticated]);

  const mergeFiyatlar = (alisFiyati, satisFiyati) => {
    if (alisFiyati === 0) {
      return <span className="text-danger">{satisFiyati}</span>;
    } else if (satisFiyati === 0) {
      return <span className="text-success">{alisFiyati}</span>;
    } else {
      return `${alisFiyati} / ${satisFiyati}`;
    }
  };

  const handleRowClick = (index) => {
    setSelectedRow(index);
  };

  const renderRows = () => {
    return alimSatimVerileri.map((veri, index) => {
      const fiyatBirlesik = mergeFiyatlar(veri.alisFiyati, veri.satisFiyati);

      const isSelected = index === selectedRow;

      return (
        <tr key={index} onClick={() => handleRowClick(index)} className={isSelected ? 'table-primary' : ''}>
          <td>{veri.hisseAdi}</td>
          <td>{veri.hisseSembol}</td>
          <td>{veri.hisseMiktari}</td>
          <td>{fiyatBirlesik}</td>
          <td>{veri.tarih}</td>
        </tr>
      );
    });
  };

  if (!authenticated) {
    return <p>Bu ekran için yetkiniz yok lütfen giriş yapınız.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const navigateToMain = () => {
    navigate('/main');
  };

  return (
    <div>
      <h1>İşlem Geçmişi</h1>
      <button onClick={navigateToMain}>Ana Sayfa'ya Geri Dön</button>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Hisse Adı</th>
            <th>Hisse Sembolü</th>
            <th>Hisse Miktarı</th>
            <th>Fiyat</th>
            <th>Tarih</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
}

export default Islemgecmisi;
