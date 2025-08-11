const username = "kimanimichael"; // Change this

async function loadProjects() {
    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
        const repos = await res.json();

        const container = document.getElementById("project-list");
        repos.slice(0, 6).forEach(repo => {
            const card = document.createElement("div");
            card.className = "project-card";
            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || "No description"}</p>
                <a href="${repo.html_url}" target="_blank">View on GitHub</a>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

loadProjects();
