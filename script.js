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
        const raidCommand = `.ra ${seed.seed} 5 6`; // Default: 5-star raid with progress level 6

        // Add item drops display as plain text (each item on a new line)
        const itemDrops = seed.rewards && seed.rewards.length > 0 
            ? `<strong>Item Drops:</strong><br>${seed.rewards.map(reward => `${reward.count} x ${reward.name}`).join('<br>')}` 
            : '<strong>Item Drops:</strong> No items <br>';

        seedDiv.innerHTML = `
            <strong>Species:</strong> ${seed.species} <br>
            <strong>Tera Type:</strong> ${seed.tera_type} <br>
            <strong>Shiny:</strong> ${seed.shiny} <br>
            <strong>Seed:</strong> ${seed.seed} <br>
            ${itemDrops}
            <img class="pokemon-image" src="${spriteURL}" alt="${seed.species} sprite" onerror="this.onerror=null; this.src='default-sprite.png'">
            <div class="command-container">
                <button class="show-command">Show Command</button>
                <div class="command-box hidden">
                    <input type="text" value="${raidCommand}" readonly>
                    <button class="copy-command">Copy</button>
                    <span class="command-message">Copied!</span>
                </div>
            </div>
        `;

        resultsContainer.appendChild(seedDiv);

        // Add event listeners for command functionality
        const showCommandButton = seedDiv.querySelector('.show-command');
        const commandBox = seedDiv.querySelector('.command-box');
        const copyButton = seedDiv.querySelector('.copy-command');
        const commandInput = seedDiv.querySelector('input');
        const commandMessage = seedDiv.querySelector('.command-message');

        showCommandButton.addEventListener('click', () => {
            commandBox.classList.toggle('hidden');
        });

        copyButton.addEventListener('click', () => {
            commandInput.select();
            document.execCommand('copy');

            // Show "Copied!" message
            commandMessage.style.display = 'inline';

            // Hide "Copied!" message after 2 seconds
            setTimeout(() => {
                commandMessage.style.display = 'none';
            }, 2000);
        });
    });
}
