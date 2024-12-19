document.getElementById('workout-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const activity = document.getElementById('activity').value;
    const calories = document.getElementById('calories').value;
    const duration = document.getElementById('duration').value;
    const date = document.getElementById('date').value;

    const workoutData = {
        activity,
        calories,
        duration,
        date
    };

    // Call backend API to log the workout
    fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutData)
    })
    .then(response => response.json())
    .then(data => {
        loadWorkouts();
    })
    .catch(error => console.error('Error:', error));
});

function loadWorkouts() {
    fetch('/api/workouts')
        .then(response => response.json())
        .then(workouts => {
            const workoutList = document.getElementById('workout-list');
            workoutList.innerHTML = ''; // Clear the existing workouts

            if (workouts.length === 0) {
                document.getElementById('empty-state').style.display = 'block';
            } else {
                document.getElementById('empty-state').style.display = 'none';
                workouts.forEach(workout => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${workout.activity}</td>
                        <td>${workout.calories}</td>
                        <td>${workout.duration}</td>
                        <td>${new Date(workout.date).toLocaleDateString()}</td>
                    `;
                    workoutList.appendChild(tr);
                });
            }
        })
        .catch(error => console.error('Error:', error));
}

// Call loadWorkouts on page load
loadWorkouts();
