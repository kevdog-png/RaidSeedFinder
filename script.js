// Fetch data from multiple local JSON files and display results on page load
window.addEventListener('load', function () {
    const jsonFiles = [
        'scarlet6iv5star.json',
        'scarlet6iv4star.json',
        'scarlet6iv5star3.json'
    ]; // Add more files as needed

    // Fetch data from all the JSON files concurrently
    const fetchPromises = jsonFiles.map(file => fetch(file).then(response => response.json()));

    Promise.all(fetchPromises)
        .then(results => {
            const allSeeds = results.flatMap(data => {
                if (!Array.isArray(data.seeds)) {
                    console.error('Data is not in expected array format:', data);
                    return [];
                }
                return data.seeds; // Flatten all seed data into one array
            });

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

    // List of local JSON files to fetch
    const jsonFiles = [
        'scarlet6iv5star.json',
        'scarlet6iv4star.json',
        'scarlet6iv5star3.json'
    ]; // Add more files as needed

    // Fetch data from all the JSON files concurrently
    const fetchPromises = jsonFiles.map(file => fetch(file).then(response => response.json()));

    Promise.all(fetchPromises)
        .then(results => {
            const allSeeds = results.flatMap(data => {
                if (!Array.isArray(data.seeds)) {
                    console.error('Data is not in expected array format:', data);
                    return [];
                }
                return data.seeds; // Flatten all seed data into one array
            });

            // Filter seeds based on form inputs
            const filteredSeeds = allSeeds.filter((seed) => {
                return (
                    (species === '' || seed.species.toLowerCase().includes(species)) &&
                    (shiny === '' || seed.shiny === shiny) &&
                    (teraType === '' || seed.tera_type.toLowerCase().includes(teraType))
                );
            });

            // Display filtered results
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
        const raidCommand = `.ra ${seed.seed} 5 6`; // Default: 5-star raid with progress level 6

        // Add item drops display as plain text (each item on a new line)
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
            const originalText = copyButton.textContent; // Save the original text
            copyButton.textContent = 'Copied!'; // Change the text to "Copied!"
            setTimeout(() => {
                copyButton.textContent = originalText; // Revert to the original text after a delay
            }, 2000); // Delay of 2 seconds
        });
    });
}
