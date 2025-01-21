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

// Function to format item drops as a single line
const formatItemDrops = (items) => {
    const itemCount = {};

    // Count the occurrences of each item
    items.forEach(item => {
        itemCount[item.name] = (itemCount[item.name] || 0) + item.count;
    });

    // Format the item count into a string
    return Object.entries(itemCount)
        .map(([item, count]) => `${count}x ${item}`)
        .join(', ');
};

// Function to get the sprite URL for the Pokémon species
const getPokemonSprite = (species) => {
    const formattedSpecies = species.toLowerCase().replace(" ", "");
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${formattedSpecies}.png`;
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
        seedDiv.innerHTML = `
            <div class="seed-header">
                <strong>Species:</strong> ${seed.species} <br>
                <strong>Tera Type:</strong> ${seed.tera_type} <br>
                <strong>Shiny:</strong> ${seed.shiny} <br>
                <strong>Seed:</strong> ${seed.seed}
            </div>
            <div class="item-drops">
                <strong>Item Drops:</strong> ${formatItemDrops(seed.rewards)}
            </div>
            <div class="pokemon-sprite">
                <img src="${getPokemonSprite(seed.species)}" alt="${seed.species} sprite">
            </div>
        `;
        resultsContainer.appendChild(seedDiv);
    });
}
