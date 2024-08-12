// src/utils/db.js
import { firestore } from '../firebase-config';

export const addWorkoutLog = async (userId, log) => {
  try {
    await firestore.collection('workoutLogs').add({
      userId,
      ...log,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error(error);
  }
};

export const getWorkoutLogs = async (userId) => {
  try {
    const snapshot = await firestore
      .collection('workoutLogs')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error(error);
  }
};
