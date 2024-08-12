


import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Fetch data from Firestore
const fetchWorkouts = async () => {
  try {
    const workoutsCol = collection(db, 'workouts');
    const workoutSnapshot = await getDocs(workoutsCol);
    const workoutList = workoutSnapshot.docs.map(doc => doc.data());
    console.log(workoutList);
  } catch (error) {
    console.error('Error fetching workouts:', error);
  }
};
