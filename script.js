// Fetch data from both GitHub JSON files and display results on page load
window.addEventListener('load', function () {
    const files = [
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet6iv5star.json', starLevel: 5 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet6iv4star.json', starLevel: 4 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet3star.json', starLevel: 3 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/kitakami6iv4star.json', starLevel: 4 } // Kitakami file
    ];

    // Fetch all JSON files
    Promise.all(files.map(({ file }) => fetch(file).then(response => response.json())))
        .then(dataArray => {
            const allSeeds = dataArray.flatMap((data, index) => {
                const mapName = data.meta?.map_name || ''; // Safely access map_name
                const isKitakami = mapName === 'Kitakami (Teal Mask)'; // Strict comparison
                return data.seeds.map(seed => ({
                    ...seed,
                    starLevel: files[index].starLevel, // Add star level to each seed
                    commandPrefix: isKitakami ? '-ra' : '.ra' // Set command prefix based on map_name
                }));
            });

            if (!Array.isArray(allSeeds)) {
                console.error('Data is not in expected array format:', allSeeds);
                return;
            }

            // Display all results when the page loads
            displayResults(allSeeds);
        })
        .catch((error) => console.error('Error fetching seed data:', error));
});


// Function to handle form submission
document.getElementById('filterForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const species = document.getElementById('species').value.toLowerCase();
    const shiny = document.getElementById('shiny').value;
    const teraType = document.getElementById('tera_type').value.toLowerCase();
    const starLevel = document.getElementById('star_level').value;

    const files = [
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet6iv5star.json', starLevel: 5 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet6iv4star.json', starLevel: 4 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet3star.json', starLevel: 3 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/kitakami6iv4star.json', starLevel: 4 }
    ];

    Promise.all(files.map(({ file }) => fetch(file).then(response => response.json())))
        .then(dataArray => {
            const allSeeds = dataArray.flatMap((data, index) => {
                const isKitakami = data.meta?.map_name?.includes('Kitakami');
                return data.seeds.map(seed => ({
                    ...seed,
                    starLevel: files[index].starLevel,
                    commandPrefix: isKitakami ? '-ra' : '.ra' // Set command prefix based on map_name
                }));
            });

            if (!Array.isArray(allSeeds)) {
                console.error('Data is not in expected array format:', allSeeds);
                return;
            }

            const filteredSeeds = allSeeds.filter((seed) => {
                return (
                    (species === '' || seed.species.toLowerCase().includes(species)) &&
                    (shiny === '' || seed.shiny === shiny) &&
                    (teraType === '' || seed.tera_type.toLowerCase().includes(teraType)) &&
                    (starLevel === '' || seed.starLevel == starLevel)
                );
            });

            displayResults(filteredSeeds);
        })
        .catch((error) => console.error('Error fetching seed data:', error));
});

// Function to display the filtered seeds in the UI
function displayResults(seeds) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (seeds.length === 0) {
        resultsContainer.innerHTML = '<li>No matching results found.</li>';
        return;
    }

    seeds.forEach((seed) => {
        const seedDiv = document.createElement('li');
        seedDiv.classList.add('seed');

        const starsDisplay = '⭐'.repeat(seed.starLevel);
        const raidCommand = `${seed.commandPrefix} ${seed.seed} ${seed.starLevel} 6`;

        const itemDrops = seed.rewards?.length
            ? `<strong>Item Drops:</strong><br>${seed.rewards.map(reward => `${reward.count} x ${reward.name}`).join('<br>')}`
            : '<strong>Item Drops:</strong> No items <br>';

        seedDiv.innerHTML = `
            <div class="stars-container" style="text-align: center; font-size: 1.5rem; margin-bottom: 10px;">
                ${starsDisplay}
            </div>
            <strong>Species:</strong> ${seed.species} <br>
            <strong>Tera Type:</strong> ${seed.tera_type} <br>
            <strong>Shiny:</strong> ${seed.shiny} <br>
            <strong>Seed:</strong> ${seed.seed} <br>
            ${itemDrops}
            <div class="command-container">
                <button class="show-command">Show Command</button>
                <div class="command-box hidden">
                    <input type="text" value="${raidCommand}" readonly>
                    <button class="copy-command">Copy</button>
                </div>
            </div>
        `;

        resultsContainer.appendChild(seedDiv);

        const showCommandButton = seedDiv.querySelector('.show-command');
        const commandBox = seedDiv.querySelector('.command-box');
        const copyButton = seedDiv.querySelector('.copy-command');
        const commandInput = seedDiv.querySelector('input');

        showCommandButton.addEventListener('click', () => {
            commandBox.classList.toggle('hidden');
        });

        copyButton.addEventListener('click', () => {
            commandInput.select();
            document.execCommand('copy');
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        });
    });
}
