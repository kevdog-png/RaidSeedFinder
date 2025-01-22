// Fetch data from multiple GitHub JSON files and display results on page load
window.addEventListener('load', async function () {
    const jsonFiles = [
        'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet6iv5star.json',
        'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet6iv5star2.json',
        'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet6iv5star3.json'
        // Add more files as needed
    ];

    // Array to hold all the seed data from fetched files
    const allSeeds = [];

    // Loop through each file and fetch its content
    for (const file of jsonFiles) {
        try {
            const response = await fetch(file);

            // Check if response is ok
            if (!response.ok) {
                throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
            }

            // Check if the content type is JSON
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(`Invalid content type for ${file}. Expected JSON, but got ${contentType}`);
            }

            // Parse the JSON content
            const data = await response.json();

            // Make sure data contains 'seeds' array
            if (data && data.seeds) {
                allSeeds.push(...data.seeds); // Merge seeds into the allSeeds array
            } else {
                console.warn(`No seeds found in ${file}`);
            }
        } catch (error) {
            console.error(`Error fetching or parsing ${file}:`, error);
        }
    }

    // If no seeds were loaded
    if (allSeeds.length === 0) {
        console.warn('No seeds found in the fetched data.');
    } else {
        displayResults(allSeeds); // Call function to display results
    }
});

// Function to handle form submission
document.getElementById('filterForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    const species = document.getElementById('species').value.toLowerCase();
    const shiny = document.getElementById('shiny').value;
    const teraType = document.getElementById('tera_type').value.toLowerCase();

    // Array to hold filtered seeds
    const filteredSeeds = [];

    // Loop through each file for the filtered data
    const jsonFiles = [
        'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet6iv5star.json',
        'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet6iv5star2.json',
        'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/scarlet6iv5star3.json'
        // Add more files as needed
    ];

    for (const file of jsonFiles) {
        try {
            const response = await fetch(file);

            if (!response.ok) {
                throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
            }

            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(`Invalid content type for ${file}. Expected JSON, but got ${contentType}`);
            }

            const data = await response.json();

            if (data && data.seeds) {
                const filtered = data.seeds.filter((seed) => {
                    return (
                        (species === '' || seed.species.toLowerCase().includes(species)) &&
                        (shiny === '' || seed.shiny === shiny) &&
                        (teraType === '' || seed.tera_type.toLowerCase().includes(teraType))
                    );
                });
                filteredSeeds.push(...filtered);
            }
        } catch (error) {
            console.error(`Error fetching or parsing ${file}:`, error);
        }
    }

    displayResults(filteredSeeds); // Display the filtered results
});

// Function to display the results in the UI
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
        const raidCommand = `.ra ${seed.seed} 5 6`; // Default: 5-star raid with progress level 6

        const itemDrops =
            seed.rewards && seed.rewards.length > 0
                ? `<strong>Item Drops:</strong><br>${seed.rewards
                      .map((reward) => `${reward.count} x ${reward.name}`)
                      .join('<br>')}`
                : '<strong>Item Drops:</strong> No items <br>';

        seedDiv.innerHTML = ` 
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
