// Fetch data from all JSON files
const files = [
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea6iv6star4herba.json', starLevel: 6 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea6iv5star.json', starLevel: 5 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea6iv4star.json', starLevel: 4 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea3star.json', starLevel: 3 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea2star.json', starLevel: 2 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea1star.json', starLevel: 1 }
];

const batchSize = 495; // Number of results to load at a time
let allSeeds = []; // Store all fetched seeds
let displayedCount = 0; // Keep track of how many seeds are displayed

// Fetch and prepare data on page load
window.addEventListener('load', function () {
    Promise.all(files.map(({ file }) => fetch(file).then(response => response.json())))
        .then(dataArray => {
            allSeeds = dataArray.flatMap((data, index) => {
                return data.seeds.map(seed => ({
                    ...seed,
                    starLevel: files[index].starLevel // Add star level to each seed
                }));
            });

            if (!Array.isArray(allSeeds)) {
                console.error('Data is not in expected array format:', allSeeds);
                return;
            }

            // Display the initial batch of results
            loadMoreResults();

            // Attach scroll event listener to load more results
            window.addEventListener('scroll', handleScroll);
        })
        .catch(error => console.error('Error fetching seed data:', error));
});

// Function to handle scrolling and loading more results
function handleScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        loadMoreResults();
    }
}

// Function to load the next batch of results
function loadMoreResults() {
    const nextBatch = allSeeds.slice(displayedCount, displayedCount + batchSize);
    displayResults(nextBatch);
    displayedCount += nextBatch.length;

    // If all results are displayed, remove the scroll listener
    if (displayedCount >= allSeeds.length) {
        window.removeEventListener('scroll', handleScroll);
    }
}

// Function to display seeds in the UI
function displayResults(seeds) {
    const resultsContainer = document.getElementById('results');

    if (seeds.length === 0 && displayedCount === 0) {
        resultsContainer.innerHTML = '<li>No matching results found.</li>';
        return;
    }

    seeds.forEach(seed => {
        const seedDiv = document.createElement('li');
        seedDiv.classList.add('seed');

        // Create stars display
        const starsDisplay = '⭐'.repeat(seed.starLevel);

        // Always force 1-2 star raids to use raidStarLevel 3 and endNumber 3
        const raidStarLevel = seed.starLevel <= 2 ? 3 : seed.starLevel;
        const endNumber = seed.starLevel <= 2 ? 3 : 6;
        const raidCommand = `.ra ${seed.seed} ${raidStarLevel} ${endNumber}`;

        // Add item drops display as plain text (each item on a new line)
        const itemDrops =
            seed.rewards && seed.rewards.length > 0
                ? `<strong>Item Drops:</strong><br>${seed.rewards
                      .map(reward => `${reward.count} x ${reward.name}`)
                      .join('<br>')}`
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

        // Add event listeners for command functionality
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
