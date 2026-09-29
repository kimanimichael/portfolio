const USERNAME = "kimanimichael";

const LANG_COLORS = {
    "C": "#555555",
    "C++": "#f34b7d",
    "Rust": "#dea584",
    "Go": "#00ADD8",
    "Python": "#3572A5",
    "JavaScript": "#f1e05a",
    "TypeScript": "#3178c6",
    "HTML": "#e34c26",
    "CSS": "#563d7c",
    "Shell": "#89e051",
    "Dockerfile": "#384d54",
    "Makefile": "#427819",
    "Jupyter Notebook": "#DA5B0B",
};

function renderCard(repo) {
    const langColor = LANG_COLORS[repo.language] || "var(--ink-mute)";
    const stars = repo.stargazers_count;
    const lang = repo.language;
    return `
        <a class="project-card" href="${repo.html_url}" target="_blank" rel="noopener" aria-label="${escapeHtml(repo.name)} on GitHub">
            <h3>
                <span>${escapeHtml(repo.name)}</span>
                <svg class="card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </h3>
            <p class="desc">${escapeHtml(repo.description) || "No description provided."}</p>
            <div class="project-meta">
                ${lang ? `<span><span class="lang-dot" style="background:${langColor}"></span>${escapeHtml(lang)}</span>` : ""}
                ${stars > 0 ? `<span>★ ${stars}</span>` : ""}
            </div>
        </a>
    `;
}

async function loadProjects() {
    const container = document.getElementById("project-list");
    try {
        const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`);
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        const repos = await res.json();

        const featured = repos
            .filter(r => !r.fork && !r.archived && r.name.toLowerCase() !== "portfolio")
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
            .slice(0, 6);

        if (featured.length === 0) {
            container.innerHTML = `<div class="projects-empty">No public projects yet.</div>`;
            return;
        }

        container.innerHTML = featured.map(renderCard).join("");
    } catch (err) {
        console.error("Error loading projects:", err);
        container.innerHTML = `
            <div class="projects-empty">
                Couldn't load projects right now. Visit
                <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener">github.com/${USERNAME}</a>.
            </div>
        `;
    }
}

function renderPostRow(post) {
    return `
        <a class="post-row" href="post.html?slug=${post.slug}">
            <time class="post-date" datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>
            <div class="post-main">
                <h3>${escapeHtml(post.title)}</h3>
                ${post.summary ? `<p class="desc">${escapeHtml(post.summary)}</p>` : ""}
            </div>
            <span class="post-read">${post.minutes} min read</span>
        </a>
    `;
}

async function loadPosts() {
    const container = document.getElementById("post-list");
    try {
        const posts = await fetchAllPosts();
        container.innerHTML = posts.length
            ? posts.map(renderPostRow).join("")
            : `<div class="projects-empty">No posts yet.</div>`;
    } catch (err) {
        console.error("Error loading posts:", err);
        container.innerHTML = `<div class="projects-empty">Couldn't load posts right now.</div>`;
    }
}

document.getElementById("year").textContent = new Date().getFullYear();
loadPosts();
loadProjects();
