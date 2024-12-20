let chart;

async function fetchForexData(base, target) {
    // Using Alpha Vantage API (you'll need to sign up for a free API key)
    const API_KEY = '805cf9e5b8e621ec18519bbe';
    const response = await fetch(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${base}&to_symbol=${target}&apikey=${API_KEY}`);
    const data = await response.json();
    return data['Time Series FX (Daily)'];
}

async function updateChart() {
    const baseCurrency = document.getElementById('baseCurrency').value;
    const targetCurrency = document.getElementById('targetCurrency').value;
    
    try {
        const forexData = await fetchForexData(baseCurrency, targetCurrency);
        const dates = Object.keys(forexData).slice(0, 30).reverse();
        const values = dates.map(date => parseFloat(forexData[date]['4. close']));

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('forexChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: `${baseCurrency}/${targetCurrency} Exchange Rate`,
                    data: values,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching forex data:', error);
    }
}

// Initialize chart when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateChart();
});
