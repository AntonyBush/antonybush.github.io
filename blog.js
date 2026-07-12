// ===================================
// Blog Page JavaScript
// Handles Markdown rendering and Excalidraw image support
// ===================================

// Detect if we're in pages/ or blogs/ folder and set base path accordingly
const isInPagesFolder = window.location.pathname.includes('/pages/');
const isInBlogsFolder = window.location.pathname.includes('/blogs/');
const basePath = (isInPagesFolder || isInBlogsFolder) ? '../' : '';

// Get blog ID from URL path or query parameters
// Supports both:
//   - Path-based: /blogs/beejs-network-guide.html -> "beejs-network-guide"
//   - Query-based: /pages/blog.html?id=beejs-network-guide -> "beejs-network-guide" (backwards compatibility)
function getBlogId() {
    const pathname = window.location.pathname;

    // Try to extract from path first (new format: /blogs/{id}.html)
    if (pathname.includes('/blogs/') && pathname.endsWith('.html')) {
        const match = pathname.match(/\/blogs\/([^/]+)\.html$/);
        if (match && match[1] !== 'blogs') {
            return match[1];
        }
    }

    // Fall back to query parameter (old format: ?id=blog-id)
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Simple markdown to HTML converter
function parseMarkdown(md) {
    let html = md;

    // Images first (before escaping) - ![alt](src)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, `<figure class="content-figure"><img src="${basePath}blogs/$2" alt="$1" class="content-image"><figcaption>$1</figcaption></figure>`);

    // Links (after images) - [text](url) - NOT preceded by !
    html = html.replace(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="content-link" target="_blank" rel="noopener noreferrer">$1</a>');

    // Escape HTML (but preserve our processed tags)
    html = html.replace(/&(?!amp;|lt;|gt;)/g, '&amp;');
    html = html.replace(/<(?!figure|\/figure|img|figcaption|\/figcaption|a |\/a)/g, '&lt;');
    html = html.replace(/(?<!"|'|")>/g, '&gt;');

    // Code blocks (``` ... ```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre class="code-block"><code class="language-${lang}">${code.trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3 class="content-h3">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="content-h2">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="content-h1">$1</h1>');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr class="content-hr">');

    // Blockquotes (including emoji ones like > 💡)
    html = html.replace(/^> (.+)$/gm, '<blockquote class="content-quote">$1</blockquote>');

    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Tables
    html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
        const headers = header.split('|').filter(h => h.trim()).map(h => `<th>${h.trim()}</th>`).join('');
        const rows = body.trim().split('\n').map(row => {
            const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `<table class="content-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    });

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li class="content-list-item">$1</li>');
    html = html.replace(/(<li class="content-list-item">.*<\/li>\n?)+/g, '<ul class="content-list">$&</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="content-ordered-item">$1</li>');
    html = html.replace(/(<li class="content-ordered-item">.*<\/li>\n?)+/g, '<ol class="content-ordered-list">$&</ol>');

    // Paragraphs (lines that aren't already wrapped)
    html = html.split('\n\n').map(block => {
        if (block.match(/^<[^>]+>/)) return block;
        if (block.trim() === '') return '';
        if (!block.match(/^<(h1|h2|h3|ul|ol|pre|table|hr|blockquote)/)) {
            return `<p class="content-paragraph">${block.replace(/\n/g, '<br>')}</p>`;
        }
        return block;
    }).join('\n');

    return html;
}

// Helper to dynamically update meta tags for SEO
function updateMeta(attr, key, value) {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (el) {
        el.setAttribute('content', value);
    } else {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        el.setAttribute('content', value);
        document.head.appendChild(el);
    }
}

// Render blog content
async function renderBlog() {
    const blogId = getBlogId();

    if (!blogId) {
        showError('No blog specified. <a href="index.html#blogs">Return to blogs</a>');
        return;
    }

    try {
        // Fetch blog metadata
        const response = await fetch(`${basePath}blogs/blogs.json`);
        const data = await response.json();
        const blog = data.blogs.find(b => b.id === blogId);

        if (!blog) {
            showError(`Blog not found. <a href="${basePath}index.html#blogs">Return to blogs</a>`);
            return;
        }

        // Update page title
        document.title = `${blog.title} | Antony Bush`;

        // Dynamically update SEO meta tags for JS-rendering crawlers
        const canonicalUrl = `https://antonybush.github.io/blogs/${blog.id}.html`;
        updateMeta('name', 'description', blog.description);
        updateMeta('property', 'og:title', blog.title);
        updateMeta('property', 'og:description', blog.description);
        updateMeta('property', 'og:url', canonicalUrl);
        updateMeta('name', 'twitter:title', blog.title);
        updateMeta('name', 'twitter:description', blog.description);
        const canonicalEl = document.querySelector('link[rel="canonical"]');
        if (canonicalEl) canonicalEl.href = canonicalUrl;

        // Populate header
        document.getElementById('blog-title').textContent = blog.title;
        document.getElementById('blog-subtitle').textContent = blog.description;
        document.getElementById('blog-date').textContent = new Date(blog.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('blog-read-time').textContent = blog.readTime;

        // Render tags
        const tagsContainer = document.getElementById('blog-tags');
        blog.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'blog-tag';
            tagEl.textContent = tag;
            tagsContainer.appendChild(tagEl);
        });

        // Load and render markdown content
        const contentContainer = document.getElementById('blog-content');

        if (blog.contentFile) {
            try {
                const contentResponse = await fetch(`${basePath}blogs/${blog.contentFile}`);
                const markdown = await contentResponse.text();
                contentContainer.innerHTML = parseMarkdown(markdown);
            } catch (error) {
                console.error('Failed to load content file:', error);
                contentContainer.innerHTML = '<p class="content-error">Failed to load blog content.</p>';
            }
        }

        // Add diagram reference section if diagrams exist
        const diagramsContainer = document.getElementById('blog-diagrams');
        if (blog.diagramFiles && blog.diagramFiles.length > 0) {
            const diagramSection = document.createElement('div');
            diagramSection.className = 'diagrams-reference';
            diagramSection.innerHTML = `
                <h3 class="diagrams-title">📊 Visual Diagrams</h3>
                <p class="diagrams-note">This blog has accompanying Excalidraw diagrams. Open in Obsidian for the full interactive experience:</p>
                <ul class="diagrams-list">
                    ${blog.diagramFiles.map(f => `<li><code>${f}</code></li>`).join('')}
                </ul>
            `;
            diagramsContainer.appendChild(diagramSection);
        }

        // Show content, hide loading
        document.getElementById('blog-loading').style.display = 'none';
        document.getElementById('blog-header').style.display = 'block';
        document.getElementById('blog-diagrams').style.display = 'block';
        document.getElementById('blog-content').style.display = 'block';

    } catch (error) {
        console.error('Failed to load blog:', error);
        showError('Failed to load blog. <a href="index.html#blogs">Return to blogs</a>');
    }
}

function showError(message) {
    document.getElementById('blog-loading').innerHTML = `
        <div class="blog-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
            </svg>
            <p>${message}</p>
        </div>
    `;
}

// ===================================
// Shared Component Loading
// ===================================
async function loadSharedComponents() {
    // Load navbar
    try {
        const navResponse = await fetch(`${basePath}sections/navbar.html`);
        if (navResponse.ok) {
            const navHtml = await navResponse.text();
            const navPlaceholder = document.getElementById('nav-placeholder');
            if (navPlaceholder) {
                navPlaceholder.innerHTML = navHtml;
                // Update nav links with basePath if needed
                if (isInPagesFolder) {
                    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
                        const section = link.getAttribute('data-section');
                        link.href = `${basePath}index.html#${section}`;
                    });
                    document.querySelector('.nav-logo').href = `${basePath}index.html`;
                }
                // Add scrolled class since blog page starts scrolled
                const navbar = document.getElementById('navbar');
                if (navbar) navbar.classList.add('scrolled');
                // Mark Blog as active
                const blogLink = document.querySelector('.nav-link[data-section="blogs"]');
                if (blogLink) blogLink.classList.add('active');
            }
        }
    } catch (e) {
        console.warn('Could not load navbar:', e);
    }

    // Load footer
    try {
        const footerResponse = await fetch(`${basePath}sections/footer.html`);
        if (footerResponse.ok) {
            const footerHtml = await footerResponse.text();
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = footerHtml;
            }
        }
    } catch (e) {
        console.warn('Could not load footer:', e);
    }
}

// Initialize mobile navigation toggle
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// ===================================
// Initialize Everything
// ===================================
document.addEventListener('DOMContentLoaded', async () => {
    // Load shared components first
    await loadSharedComponents();

    // Initialize mobile nav
    initMobileNav();

    // Then render the blog
    await renderBlog();
});

