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

// Function to get the sprite URL for the Pokémon species
const getPokemonSprite = (species) => {
    const formattedSpecies = species.toLowerCase().replace(/[^a-z0-9]/g, ''); // Remove spaces and special characters
    return `https://raw.githubusercontent.com/remokon/gen-9-sprites/refs/heads/main/${formattedSpecies}.png`;
};

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

        const spriteURL = getPokemonSprite(seed.species);

        // Add item drops display if present
        const itemDrops = seed.items && seed.items.length > 0 
            ? `<strong>Item Drops:</strong> ${seed.items.join(', ')} <br>` 
            : '<strong>Item Drops:</strong> No items <br>';

        seedDiv.innerHTML = `
            <strong>Species:</strong> ${seed.species} <br>
            <strong>Tera Type:</strong> ${seed.tera_type} <br>
            <strong>Shiny:</strong> ${seed.shiny} <br>
            <strong>Seed:</strong> ${seed.seed} <br>
            ${itemDrops}
            <img class="pokemon-image" src="${spriteURL}" alt="${seed.species} sprite" onerror="this.onerror=null; this.src='default-sprite.png'">
        `;
        resultsContainer.appendChild(seedDiv);
    });
}
