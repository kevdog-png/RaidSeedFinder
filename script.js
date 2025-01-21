// Function to handle form submission
document.getElementById('filterForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const species = document.getElementById('species').value.toLowerCase();
    const shiny = document.getElementById('shiny').value;
    const teraType = document.getElementById('tera_type').value.toLowerCase();

    // Fetch data from the GitHub JSON file
    fetch('https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet6iv5star.json')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data.seeds)) {
                console.error('Data is not in expected array format:', data);
                return;
            }

            const seeds = data.seeds;
            const filteredSeeds = seeds.filter(seed => {
                return (
                    (species === '' || seed.species.toLowerCase().includes(species)) &&
                    (shiny === '' || seed.shiny === shiny) &&
                    (teraType === '' || seed.tera_type.toLowerCase().includes(teraType))
                );
            });

            displayResults(filteredSeeds);
        })
        .catch(error => console.error('Error fetching seed data:', error));
});

// Function to display the filtered seeds in the UI
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

        // Convert species name to lowercase and replace spaces with hyphens
        const speciesName = seed.species.toLowerCase().replace(/\s+/g, '-');
        
        seedDiv.innerHTML = `
            <img class="pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${speciesName}.png" alt="${seed.species} Shiny">
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
