// CONFIGURATION
// Replace 'google' with Ishaan's actual GitHub username
const GITHUB_USERNAME = 'ishaan-ku';

// DOM Elements
const repoGrid = document.getElementById('repo-grid');
const yearSpan = document.getElementById('year');
const githubProfileLink = document.getElementById('github-profile-link');

// Set current year in footer
yearSpan.textContent = new Date().getFullYear();

// Set GitHub Profile Link
githubProfileLink.href = `https://github.com/${GITHUB_USERNAME}`;

// Fetch Repositories
async function fetchRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);

        if (!response.ok) {
            throw new Error('User not found or API limit exceeded');
        }

        const repos = await response.json();

        // Filter out forks if desired, or keep them. 
        // For a personal portfolio, often people want to show their own work (non-forks)
        // or specifically high-profile forks. Let's show non-forks, or sort by stars.

        // Sort by stargazers_count desc
        const sortedRepos = repos
            .filter(repo => !repo.fork) // Optional: remove forks
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6); // Top 6 repos

        displayRepos(sortedRepos);

    } catch (error) {
        console.error('Error fetching repos:', error);
        repoGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">Could not load projects. Please try again later.</p>`;
    }
}

function displayRepos(repos) {
    repoGrid.innerHTML = ''; // Clear loading spinner

    if (repos.length === 0) {
        repoGrid.innerHTML = `<p class="error-msg">No public repositories found for ${GITHUB_USERNAME}.</p>`;
        return;
    }

    repos.forEach(repo => {
        const card = document.createElement('a');
        card.href = repo.html_url;
        card.target = "_blank";
        card.className = 'repo-card';
        card.setAttribute('aria-label', `View ${repo.name} on GitHub`);

        const description = repo.description ? repo.description : 'No description available.';
        const language = repo.language || 'Code';

        // Color mapping for common languages (simplified)
        const langColors = {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'TypeScript': '#2b7489',
            'Java': '#b07219',
            'Vue': '#41b883',
            'Go': '#00ADD8'
        };
        const langColor = langColors[language] || '#ccc';

        card.innerHTML = `
            <div class="repo-header">
                <i class="far fa-folder repo-icon"></i>
            </div>
            <h3 class="repo-name">${repo.name}</h3>
            <p class="repo-description">${truncateText(description, 100)}</p>
            <div class="repo-stats">
                <div class="repo-stat">
                    <span class="language-dot" style="background-color: ${langColor}"></span>
                    <span>${language}</span>
                </div>
                <div class="repo-stat">
                    <i class="far fa-star"></i>
                    <span>${repo.stargazers_count}</span>
                </div>
                 <div class="repo-stat">
                    <i class="fas fa-code-branch"></i>
                    <span>${repo.forks_count}</span>
                </div>
            </div>
        `;

        repoGrid.appendChild(card);
    });
}

function truncateText(text, limit) {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
}

// Init
fetchRepositories();
