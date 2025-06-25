import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardChart({ data, label, color = '#00CFFF' }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: label,
        data: data.values,
        borderColor: color,
        backgroundColor: color + '33',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      }
    ]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      x: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#02496B', font: { weight: 600 } }
      },
      y: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#02496B', font: { weight: 600 } },
        beginAtZero: true
      }
    }
  };
  return (
    <div style={{background:'#fff',borderRadius:18,boxShadow:'0 2px 12px #0001',padding:24,margin:8}}>
      <Line data={chartData} options={options} height={80} />
    </div>
  );
} 