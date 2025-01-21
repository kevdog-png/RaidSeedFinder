// Function to handle form submission
document.getElementById('filterForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const species = document.getElementById('species').value.toLowerCase();
    const shiny = document.getElementById('shiny').value;
    const teraType = document.getElementById('tera_type').value.toLowerCase();

    // Fetch data from the JSON file
    fetch('scarlet6iv5star.json')
        .then(response => response.json())
        .then(data => {
            const filteredSeeds = data.seeds.filter(seed => {
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

        // Generate sprite URL
        const formattedSpecies = seed.species.toLowerCase().replace(/\s+/g, '');
        const pokemonImageUrl = `https://raw.githubusercontent.com/remokon/gen-9-sprites/refs/heads/main/${formattedSpecies}.png`;

        // Aggregate item rewards
        const itemCounts = seed.rewards.reduce((acc, reward) => {
            const rewardKey = reward.name;
            if (acc[rewardKey]) {
                acc[rewardKey] += reward.count;
            } else {
                acc[rewardKey] = reward.count;
            }
            return acc;
        }, {});

        const itemList = Object.keys(itemCounts).map(item => 
            `<li>${itemCounts[item]} x ${item}</li>`
        ).join('');

        seedDiv.innerHTML = `
            <strong>Species:</strong> ${seed.species} <br>
            <strong>Tera Type:</strong> ${seed.tera_type} <br>
            <strong>Shiny:</strong> ${seed.shiny} <br>
            <strong>Seed:</strong> ${seed.seed} <br>
            <strong>Item Drops:</strong>
            <ul>
                ${itemList}
            </ul>
            <img class="pokemon-image" src="${pokemonImageUrl}" alt="${seed.species} sprite" onerror="this.onerror=null; this.src='default-sprite.png'">
        `;
        resultsContainer.appendChild(seedDiv);
    });
}
