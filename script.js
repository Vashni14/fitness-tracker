let workouts = [];  // Array to store workouts
let activities = [];  // Array to store distinct workout activities
let dates = [];  // Array to store distinct workout dates

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
            dates = [...new Set(data.map(workout => new Date(workout.date).toLocaleDateString()))]; // Get unique dates
            displayWorkouts(workouts);
            displayBestComparison();
            displayVisualization();
            populateFilters();
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

// Filter workouts based on selected filters
function filterWorkouts() {
    const filterActivity = document.getElementById('filterActivity').value;
    const filterDate = document.getElementById('filterDate').value;
    const filterCaloriesMin = parseInt(document.getElementById('filterCaloriesMin').value) || 0;
    const filterCaloriesMax = parseInt(document.getElementById('filterCaloriesMax').value) || Number.MAX_VALUE;
    const filterDurationMin = parseInt(document.getElementById('filterDurationMin').value) || 0;
    const filterDurationMax = parseInt(document.getElementById('filterDurationMax').value) || Number.MAX_VALUE;

    const filteredWorkouts = workouts.filter(workout => {
        const workoutDate = new Date(workout.date).toLocaleDateString();
        return (
            (filterActivity === '' || workout.activity === filterActivity) &&
            (filterDate === '' || workoutDate === filterDate) &&
            workout.calories >= filterCaloriesMin &&
            workout.calories <= filterCaloriesMax &&
            workout.duration >= filterDurationMin &&
            workout.duration <= filterDurationMax
        );
    });

    displayWorkouts(filteredWorkouts);
}

// Filter the best comparison list
function filterComparison() {
    const comparisonCaloriesMin = parseInt(document.getElementById('comparisonCaloriesMin').value) || 0;
    const comparisonDurationMin = parseInt(document.getElementById('comparisonDurationMin').value) || 0;
    const comparisonActivity = document.getElementById('comparisonActivity').value;

    const filteredWorkouts = workouts.filter(workout => {
        return (
            workout.calories >= comparisonCaloriesMin &&
            workout.duration >= comparisonDurationMin &&
            (comparisonActivity === '' || workout.activity === comparisonActivity)
        );
    });

    displayBestComparison(filteredWorkouts);
}

// Display the best comparison based on calories burned
function displayBestComparison(filteredWorkouts = workouts) {
    const bestComparison = document.getElementById('bestComparison');
    bestComparison.innerHTML = '';  // Clear previous list

    const sortedWorkouts = filteredWorkouts.sort((a, b) => b.calories - a.calories);  // Sort by calories burned in descending order
    sortedWorkouts.forEach(workout => {
        const listItem = document.createElement('li');
        listItem.textContent = `${workout.activity} - ${workout.calories} calories`;
        bestComparison.appendChild(listItem);
    });
}

// Display the workout visualization chart
function displayVisualization() {
    const ctx = document.getElementById('caloriesChart').getContext('2d');
    const labels = workouts.map(workout => new Date(workout.date).toLocaleDateString());
    const data = workouts.map(workout => workout.calories);
    const durationData = workouts.map(workout => workout.duration);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Calories Burned',
                data,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }, {
                label: 'Duration (Minutes)',
                data: durationData,
                borderColor: 'rgba(255, 159, 64, 1)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Amount' } }
            }
        }
    });
}

// Populate filters dynamically
function populateFilters() {
    const filterActivity = document.getElementById('filterActivity');
    const filterDate = document.getElementById('filterDate');

    // Populate Activity Filter
    filterActivity.innerHTML = '<option value="">All Activities</option>' + activities.map(activity => `<option value="${activity}">${activity}</option>`).join('');

    // Populate Date Filter
    filterDate.innerHTML = '<option value="">All Dates</option>' + dates.map(date => `<option value="${date}">${date}</option>`).join('');
}

// Initialize the page
window.onload = loadWorkouts;
