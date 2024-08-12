import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { db } from './firebase'; // Assuming you have configured Firebase

function WorkoutForm({ user }) {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState([{ weight: '' }]);

  const handleAddSet = () => {
    setSets([...sets, { weight: '' }]);
  };

  const handleSetChange = (index, value) => {
    const newSets = [...sets];
    newSets[index].weight = value;
    setSets(newSets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.collection('workouts').add({
      userId: user.uid,
      exercise,
      sets,
      date: new Date()
    });
    setExercise('');
    setSets([{ weight: '' }]);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        label="Exercise"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      {sets.map((set, index) => (
        <TextField
          key={index}
          label={`Set ${index + 1} Weight`}
          value={set.weight}
          onChange={(e) => handleSetChange(index, e.target.value)}
          fullWidth
          margin="normal"
          required
        />
      ))}
      <Button onClick={handleAddSet} variant="contained" color="primary">
        Add Set
      </Button>
      <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2 }}>
        Save Workout
      </Button>
    </Box>
  );
}

export default WorkoutForm;
