async function loadArticle() {
    const container = document.getElementById("article");
    const slug = new URLSearchParams(location.search).get("slug") || "";
    try {
        const post = await fetchPost(slug);
        document.title = `${post.title} | Michael Kimani`;
        container.innerHTML = `
            <header class="article-head">
                <div class="eyebrow">
                    <time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>
                    · ${post.minutes} min read
                </div>
                <h1>${escapeHtml(post.title)}</h1>
                ${post.tags.length ? `<div class="skill-tags">${post.tags.map(t => `<span class="skill-tag">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
            </header>
            <div class="prose">${marked.parse(post.body)}</div>
        `;
        container.querySelectorAll("pre code").forEach(el => hljs.highlightElement(el));
    } catch (err) {
        console.error("Error loading post:", err);
        container.innerHTML = `<div class="projects-empty">Post not found.</div>`;
    }
}

document.getElementById("year").textContent = new Date().getFullYear();
loadArticle();
