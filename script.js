// Function to handle form submission
document.getElementById('filterForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const species = document.getElementById('species').value.toLowerCase();
    const shiny = document.getElementById('shiny').value;
    const teraType = document.getElementById('tera_type').value.toLowerCase();
    const starLevel = document.getElementById('star_level').value;

    // Fetch data from both JSON files again for filtered results
    const files = [
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea6iv6star4herba.json', starLevel: 6 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/kitakami6iv6star4herba.json', starLevel: 6 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea6iv5star.json', starLevel: 5 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/kitakami5star5herba.json', starLevel: 5 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea4star.json', starLevel: 4 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/kitakami4star.json', starLevel: 4 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea3star.json', starLevel: 3 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/kitakami3star.json', starLevel: 3 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/kitakami2star.json', starLevel: 2 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea2star.json', starLevel: 2 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea1star.json', starLevel: 1 },
        { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/kitakami1star.json', starLevel: 1 }
    ];

    Promise.all(files.map(({ file }) => fetch(file).then(response => response.json())))
        .then(dataArray => {
            const allSeeds = dataArray.flatMap((data, index) => {
                return data.seeds.map(seed => ({
                    ...seed,
                    starLevel: files[index].starLevel  // Add star level to each seed
                }));
            });

            if (!Array.isArray(allSeeds)) {
                console.error('Data is not in expected array format:', allSeeds);
                return;
            }

            // Filter results based on form inputs, including star level
            const filteredSeeds = allSeeds.filter((seed) => {
                return (
                    (species === '' || seed.species.toLowerCase().includes(species)) &&
                    (shiny === '' || seed.shiny === shiny) &&
                    (teraType === '' || seed.tera_type.toLowerCase().includes(teraType)) &&
                    (starLevel === '' || seed.starLevel === parseInt(starLevel)) // Convert starLevel to number
                );
            });

            displayResults(filteredSeeds);
        })
        .catch((error) => console.error('Error fetching seed data:', error));
});

// Function to display the filtered seeds in the UI
function displayResults(seeds) {
    const resultsContainer = document.getElementById('results');
    const resultsHeader = document.getElementById('results-header');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (seeds.length === 0) {
        resultsHeader.style.display = 'block'; // Show the header even if no results are found
        resultsContainer.innerHTML = '<li>No matching results found.</li>';
        return;
    }

    resultsHeader.style.display = 'block'; // Show the header when results are found

    seeds.forEach(seed => {
        const seedDiv = document.createElement('li');
        seedDiv.classList.add('seed');

        const spriteURL = getPokemonSprite(seed.species);

        const rewardsMap = new Map();
        seed.rewards.forEach(reward => {
            const key = reward.name;
            if (rewardsMap.has(key)) {
                rewardsMap.set(key, rewardsMap.get(key) + reward.count);
            } else {
                rewardsMap.set(key, reward.count);
            }
        });

        const mergedRewards = Array.from(rewardsMap, ([name, count]) => ({
            name,
            count
        }));

        const endNumber = seed.starLevel <= 2 ? 3 : 6; // Use 3 for 1-2 stars, 6 otherwise

        seedDiv.innerHTML = `
        <span class="star-emoji">${'⭐'.repeat(seed.starLevel)}</span>
        <strong>Species:</strong> ${seed.species} <br>
        <strong>Tera Type:</strong> ${seed.tera_type} <br>
        <strong>Shiny:</strong> ${seed.shiny} <br>
        <strong>Map:</strong> ${seed.map} <br>
        <strong>Seed:</strong> ${seed.seed} <br>
        <strong>Item Drops:</strong><br>
        ${mergedRewards.map(reward => `- ${reward.count}x ${reward.name}`).join('<br>')} <br>
        <img class="pokemon-image" src="${spriteURL}" alt="${seed.species} sprite" onerror="this.onerror=null; this.src='default-sprite.png'">
        <div class="command-box">
            <span class="command-message">Copied!</span>
            <button class="copy-button" data-seed="${seed.seed}" data-star="${seed.starLevel}" data-end="${endNumber}" data-map="${seed.map}">Copy Command</button>
        </div>
    `;

        resultsContainer.appendChild(seedDiv);
    });

    // Add copy command functionality
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const seed = button.getAttribute('data-seed');
            const star = parseInt(button.getAttribute('data-star'), 10);
            const endNumber = button.getAttribute('data-end');
            const map = button.getAttribute('data-map');

            const prefix = map === 'Kitakami' ? '-ra' : '.ra';
            const adjustedStar = star <= 2 ? 3 : star;
            const command = `${prefix} ${seed} ${adjustedStar} ${endNumber}`;

            navigator.clipboard.writeText(command);

            const message = button.previousElementSibling;
            message.style.display = 'block';
            setTimeout(() => {
                message.style.display = 'none';
            }, 1000);
        });
    });
}
