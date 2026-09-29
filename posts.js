// Blog posts live as markdown files in posts/, listed by slug in posts/posts.json.
// Each file starts with a front matter block:
//
// ---
// title: Post title
// date: 2026-09-29
// summary: One line shown in the post list.
// tags: [embedded, rust]
// ---

const SLUG_PATTERN = /^[a-z0-9-]+$/;

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

function parseFrontMatter(text) {
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (!match) return { meta: {}, body: text };

    const meta = {};
    for (const line of match[1].split(/\r?\n/)) {
        const idx = line.indexOf(":");
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        let value = line.slice(idx + 1).trim();
        if (value.startsWith("[") && value.endsWith("]")) {
            value = value.slice(1, -1).split(",").map(s => s.trim()).filter(Boolean);
        }
        meta[key] = value;
    }
    return { meta, body: text.slice(match[0].length) };
}

function readingTime(body) {
    const words = body.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 220));
}

function formatDate(date) {
    if (!date) return "";
    // Parse as local time so "2026-09-29" doesn't shift a day in western timezones.
    const d = new Date(`${date}T00:00:00`);
    if (isNaN(d)) return date;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

async function fetchPost(slug) {
    if (!SLUG_PATTERN.test(slug)) throw new Error(`Invalid slug: ${slug}`);
    const res = await fetch(`posts/${slug}.md`);
    if (!res.ok) throw new Error(`Post ${slug}: ${res.status}`);
    const { meta, body } = parseFrontMatter(await res.text());
    return {
        slug,
        title: meta.title || slug,
        date: meta.date || "",
        summary: meta.summary || "",
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        minutes: readingTime(body),
        body,
    };
}

async function fetchAllPosts() {
    const res = await fetch("posts/posts.json");
    if (!res.ok) throw new Error(`posts.json: ${res.status}`);
    const slugs = await res.json();
    const posts = await Promise.all(slugs.map(slug => fetchPost(slug).catch(err => {
        console.error(err);
        return null;
    })));
    return posts
        .filter(Boolean)
        .sort((a, b) => b.date.localeCompare(a.date));
}
