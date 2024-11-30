document.getElementById('add-expense-btn').addEventListener('click', addExpense);

let totalAmount = 0;
const expenseData = {}; // Store expenses by description
const expenseChart = setupChart();

function addExpense() {
    const date = document.getElementById('expense-date').value;
    const description = document.getElementById('expense-description').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);

    if (!date || !description || isNaN(amount) || amount <= 0) {
        alert('Please enter valid details for all fields.');
        return;
    }

    // Add new row to the table
    const tableBody = document.getElementById('expense-table-body');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${date}</td>
        <td>${description}</td>
        <td>${amount.toFixed(2)}</td>
        <td><button class="delete-btn" onclick="deleteExpense(this, '${description}', ${amount})">Delete</button></td>
    `;

    tableBody.appendChild(newRow);

    // Update total amount
    totalAmount += amount;
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);

    // Update expense data
    if (expenseData[description]) {
        expenseData[description] += amount;
    } else {
        expenseData[description] = amount;
    }
    updateChart(expenseChart, expenseData);

    // Clear input fields
    document.getElementById('expense-date').value = '';
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-amount').value = '';
}

function deleteExpense(button, description, amount) {
    // Remove the row
    button.parentElement.parentElement.remove();

    // Update total amount
    totalAmount -= amount;
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);

    // Update expense data
    if (expenseData[description]) {
        expenseData[description] -= amount;
        if (expenseData[description] <= 0) {
            delete expenseData[description];
        }
    }
    updateChart(expenseChart, expenseData);
}

// Setup the Chart.js pie chart
function setupChart() {
    const ctx = document.getElementById('expense-chart').getContext('2d');
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Update the pie chart
function updateChart(chart, data) {
    chart.data.labels = Object.keys(data);
    chart.data.datasets[0].data = Object.values(data);
    chart.update();
}
