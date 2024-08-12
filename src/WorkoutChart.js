import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { db } from './firebase'; // Assuming you have configured Firebase
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function WorkoutChart({ user }) {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (user) {
      const fetchWeights = async () => {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);

        const snapshot = await db.collection('bodyWeights')
          .where('userId', '==', user.uid)
          .where('date', '>=', lastWeek.toISOString().split('T')[0])
          .orderBy('date')
          .get();

        const weights = snapshot.docs.map(doc => doc.data());
        const labels = weights.map(weight => weight.date);
        const dataPoints = weights.map(weight => weight.weight);

        setData({
          labels,
          datasets: [
            {
              label: 'Body Weight',
              data: dataPoints,
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 2,
              fill: false
            }
          ]
        });
      };

      fetchWeights();
    }
  }, [user]);

  return <Line data={data} />;
}

export default WorkoutChart;
