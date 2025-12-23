# Blogs Directory

This directory contains all blog posts for the portfolio.

## Adding a New Blog Post

### 1. Create Your Content

Create a markdown file in this directory:
```
blogs/
  └── your-blog-title.md
```

Write your post using standard markdown. Supported features:
- Headers (`#`, `##`, `###`)
- Bold (`**text**`) and italic (`*text*`)
- Code blocks (triple backticks)
- Inline code (backticks)
- Tables
- Ordered and unordered lists
- Blockquotes (`> text`)
- Images (`![caption](path/to/image.svg)`)

### 2. Add Images (Optional)

For Excalidraw diagrams or other images:
1. Export from Obsidian as SVG/PNG
2. Place in a subfolder, e.g., `blogs/your-blog/images/`
3. Reference in markdown: `![Diagram](your-blog/images/diagram.svg)`

### 3. Register in blogs.json

Add an entry to `blogs.json`:

```json
{
  "blogs": [
    {
      "id": "unique-slug",
      "title": "Your Blog Title",
      "subtitle": "Optional subtitle",
      "description": "Brief description shown on the blog card (1-2 sentences)",
      "tags": ["tag1", "tag2", "tag3"],
      "date": "2024-12-23",
      "readTime": "5 min",
      "contentFile": "your-blog-title.md",
      "featured": false
    }
  ]
}
```

### 4. Test It

Open `http://localhost:8080/#blogs` to see your blog card, then click to view the full post.

## File Structure

```
blogs/
├── README.md              # This file
├── blogs.json             # Blog registry (add new posts here)
├── your-post.md           # Blog content files
└── your-post/             # Optional: folder for blog assets
    └── images/
        └── diagram.svg
```

## Tips

- Use `featured: true` to highlight important posts
- Keep descriptions under 200 characters
- Tags help readers find related content
- Image captions become figcaptions automatically
