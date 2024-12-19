document.getElementById('workoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const activity = document.getElementById('activity').value;
    const calories = document.getElementById('calories').value;
    const duration = document.getElementById('duration').value;

    const response = await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity, calories, duration }),
    });

    if (response.ok) {
        loadWorkouts();
        document.getElementById('workoutForm').reset();
    }
});

async function loadWorkouts() {
    const response = await fetch('/api/workouts');
    const data = await response.json();
    const workoutTable = document.getElementById('workoutTable');
    workoutTable.innerHTML = data.map((workout) => `
        <tr>
            <td>${workout.activity}</td>
            <td>${workout.calories}</td>
            <td>${workout.duration}</td>
        </tr>
    `).join('');
}

loadWorkouts();
