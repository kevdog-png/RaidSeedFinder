// Create a loader element
const loader = document.createElement('div');
loader.id = 'loader';
loader.innerHTML = '<div class="loader-inner">Loading...</div>';
document.body.appendChild(loader);

// CSS for the loader
const style = document.createElement('style');
style.innerHTML = `
  #loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .loader-inner {
    background-color: #fff;
    color: #333;
    padding: 20px;
    border-radius: 5px;
  }
`;
document.head.appendChild(style);

// Show the loader before fetching data
loader.style.display = 'flex';

// Fetch data from both GitHub JSON files and display results on page load
window.addEventListener('load', function () {
  const files = [
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea6iv6star4herba.json', starLevel: 6 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea6iv5star.json', starLevel: 5 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea6iv4star.json', starLevel: 4 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea3star.json', starLevel: 3 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea2star.json', starLevel: 2 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea1star.json', starLevel: 1 }
  ];

  // Fetch all JSON files
  Promise.all(files.map(({ file }) => fetch(file).then(response => response.json())))
    .then(dataArray => {
      // Combine all seeds from both files
      const allSeeds = dataArray.flatMap((data, index) => {
        return data.seeds.map(seed => ({
          ...seed,
          starLevel: files[index].starLevel  // Add star level to each seed
        }));
      });

      if (!Array.isArray(allSeeds)) {
        console.error('Data is not in expected array format:', allSeeds);
        return;
      }

      // Display all results when the page loads
      displayResults(allSeeds);

      // Hide the loader after data is loaded and displayed
      loader.style.display = 'none'; 
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

  // Fetch data from both JSON files again for filtered results
  const files = [
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea6iv6star4herba.json', starLevel: 6 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea6iv5star.json', starLevel: 5 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea6iv4star.json', starLevel: 4 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea3star.json', starLevel: 3 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea2star.json', starLevel: 2 },
    { file: 'https://raw.githubusercontent.com/kevdog-png/RaidSeedFinder/main/paldea1star.json', starLevel: 1 }
  ];

  Promise.all(files.map(({ file }) => fetch(file).then(response => response.json())))
    .then(dataArray => {
      const allSeeds = dataArray.flatMap((data, index) => {
        return data.seeds.map(seed => ({
          ...seed,
          starLevel: files[index].starLevel  // Add star level to each seed
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
  resultsContainer.innerHTML = ''; // Clear previous results

  if (seeds.length === 0) {
    resultsContainer.innerHTML = '<li>No matching results found.</li>';
    return;
  }

  seeds.forEach((seed) => {
    const seedDiv = document.createElement('li');
    seedDiv.classList.add('seed');

    // Create stars display
    const starsDisplay = '⭐'.repeat(seed.starLevel); // Use starLevel from seed data

    // Always force 1-2 star raids to use raidStarLevel 3 and endNumber 3
    const raidStarLevel = seed.starLevel <= 2 ? 3 : seed.starLevel; // Force starLevel 3 for 1-2 star raids
    const endNumber = seed.starLevel <= 2 ? 3 : 6; // Force end number 3 for 1-2 star raids
    const raidCommand = `.ra ${seed.seed} ${raidStarLevel} ${endNumber}`; // Construct the raid command

    // Add item drops display as plain text (each item on a new line)
    const itemDrops =
      seed.rewards && seed.rewards.length > 0
        ? `<strong>Item Drops:</strong><br>${seed.rewards
            .map((reward) => `${reward.count} x ${reward.name}`)
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
      <span class="math-inline">\{itemDrops\}
<div class\="command\-container"\>
<button class\="show\-command"\>Show Command</button\>
<div class\="command\-box hidden"\>
<input type\="text" value\="</span>{raidCommand}" readonly>
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
