// PieChart.js

import React from 'react';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

function PieChart({ data }) {
  const labels = data.map((hisse) => hisse.hisseAdi);
  const values = data.map((hisse) => (hisse.canliFiyat ? hisse.canliFiyat.price * hisse.hisseMiktari : 0));

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Portföy Dağılımı</h2>
      <Pie data={chartData} />
    </div>
  );
}

export default PieChart;
