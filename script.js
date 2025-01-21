document.getElementById('filterForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const species = document.getElementById('species').value.toLowerCase();
    const shiny = document.getElementById('shiny').value;
    const teraType = document.getElementById('tera_type').value.toLowerCase();

    // Fetch data from GitHub
    fetch('https://kevdog-png.github.io/RaidSeedFinder/scarlet6iv5star.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Log the data to check its structure
            
            if (Array.isArray(data)) {
                const filteredResults = data.filter(pokemon => {
                    return (
                        (species === '' || pokemon.species.toLowerCase().includes(species)) &&
                        (shiny === '' || pokemon.shiny === shiny) &&
                        (teraType === '' || pokemon.tera_type.toLowerCase().includes(teraType))
                    );
                });
                displayResults(filteredResults);
            } else {
                console.error('Data is not in expected array format:', data);
            }
        })
        .catch(error => console.error('Error fetching seed data:', error));
});

function displayResults(seeds) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (seeds.length === 0) {
        resultsContainer.innerHTML = '<li>No matching results found.</li>';
        return;
    }

    seeds.forEach(seed => {
        const seedDiv = document.createElement('li');
        seedDiv.classList.add('seed');
        seedDiv.innerHTML = `
            <strong>Species:</strong> ${seed.species} <br>
            <strong>Tera Type:</strong> ${seed.tera_type} <br>
            <strong>Shiny:</strong> ${seed.shiny} <br>
            <strong>Seed:</strong> ${seed.seed} <br> <!-- Added raid seed here -->
            <strong>Item Drops:</strong>
            <ul>
                ${seed.rewards.map(reward => `<li>${reward.count} x ${reward.name}</li>`).join('')}
            </ul>
        `;
        resultsContainer.appendChild(seedDiv);
    });
}
