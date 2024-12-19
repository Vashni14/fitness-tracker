let workouts = [];  // Array to store workouts
let activities = [];  // Array to store distinct workout activities

// Handle tab switching
function openTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-button');

    tabContents.forEach(content => content.classList.remove('active'));
    tabButtons.forEach(button => button.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    document.querySelector(`button[data-tab="${tabName}"]`).classList.add('active');
}

// Handle workout form submission
document.getElementById('workoutForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const activity = document.getElementById('activity').value;
    const calories = parseInt(document.getElementById('calories').value);
    const duration = parseInt(document.getElementById('duration').value);
    const date = document.getElementById('date').value;

    fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity, calories, duration, date })
    })
    .then(response => response.json())
    .then(data => {
        alert('Workout logged successfully!');
        loadWorkouts();  // Reload workouts after logging
    })
    .catch(error => console.error('Error logging workout:', error));
});

// Fetch workouts and activities, and display them
function loadWorkouts() {
    fetch('/api/workouts')
        .then(response => response.json())
        .then(data => {
            workouts = data;
            activities = [...new Set(data.map(workout => workout.activity))]; // Get unique activities
            displayWorkouts(workouts);
            displayBestComparison();
            displayVisualization();
            populateActivityFilter();
        })
        .catch(error => console.error('Error fetching workouts:', error));
}

// Display workouts in the table
function displayWorkouts(workouts) {
    const workoutTable = document.getElementById('workoutTable').getElementsByTagName('tbody')[0];
    workoutTable.innerHTML = '';  // Clear table

    workouts.forEach(workout => {
        const row = workoutTable.insertRow();
        const date = new Date(workout.date).toLocaleDateString();  // Format date

        row.innerHTML = `
            <td>${workout.activity}</td>
            <td>${workout.calories}</td>
            <td>${workout.duration}</td>
            <td>${date}</td>
        `;
    });
}

// Filter workouts based on activity
function filterWorkouts() {
    const filterActivity = document.getElementById('filterActivity').value;
    const filteredWorkouts = filterActivity ? workouts.filter(workout => workout.activity === filterActivity) : workouts;
    displayWorkouts(filteredWorkouts);
}

// Display the best workout comparison (highest calories burned)
function displayBestComparison() {
    const bestWorkout = workouts.reduce((best, current) => current.calories > best.calories ? current : best, { calories: 0 });
    document.getElementById('bestComparison').innerText = bestWorkout.calories;
}

// Display calories burned over time in a line chart
function displayVisualization() {
    const ctx = document.getElementById('caloriesChart').getContext('2d');
    const labels = workouts.map(workout => new Date(workout.date).toLocaleDateString());
    const data = workouts.map(workout => workout.calories);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Calories Burned',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.raw + ' calories';
                        }
                    }
                }
            }
        }
    });
}

// Populate the activity filter dropdown dynamically
function populateActivityFilter() {
    const filterActivitySelect = document.getElementById('filterActivity');
    activities.forEach(activity => {
        const option = document.createElement('option');
        option.value = activity;
        option.textContent = activity;
        filterActivitySelect.appendChild(option);
    });
}

// Load workouts on page load
window.onload = loadWorkouts;
