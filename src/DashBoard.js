import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [user, setUser] = useState(null);
  const [weight, setWeight] = useState('');
  const [weights, setWeights] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchWeights(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchWeights = async (userId) => {
    const weightsCollection = collection(db, 'weights');
    const weightSnapshot = await getDocs(weightsCollection);
    const weightList = weightSnapshot.docs
      .filter(doc => doc.data().uid === userId)
      .map(doc => doc.data());
    setWeights(weightList);
  };

  const handleAddWeight = async () => {
    if (user && weight) {
      await addDoc(collection(db, 'weights'), {
        uid: user.uid,
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(weight),
      });
      setWeight('');
      fetchWeights(user.uid);
    }
  };

  const chartData = {
    labels: weights.map(w => w.date),
    datasets: [
      {
        label: 'Weight',
        data: weights.map(w => w.weight),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Enter weight"
      />
      <button onClick={handleAddWeight}>Add Weight</button>
      <Line data={chartData} />
    </div>
  );
}

export default Dashboard;
