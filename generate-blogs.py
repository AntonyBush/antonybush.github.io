#!/usr/bin/env python3
"""
Blog Page Generator

Generates individual HTML pages for each blog post from blogs.json
This creates unique URLs for each blog, avoiding query parameter issues
when sharing on platforms like Daily.dev.

Usage: python3 generate-blogs.py
"""

import json
import os
from datetime import date

# Configuration
CONFIG = {
    'base_url': 'https://antonybush.github.io',
    'blogs_json_path': './blogs/blogs.json',
    'template_path': './templates/blog-template.html',
    'output_dir': './blogs',
    'sitemap_path': './sitemap.xml'
}


def read_blogs_json():
    """Read and parse blogs.json"""
    try:
        with open(CONFIG['blogs_json_path'], 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f'Error reading blogs.json: {e}')
        exit(1)


def read_template():
    """Read the HTML template"""
    try:
        with open(CONFIG['template_path'], 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f'Error reading template: {e}')
        exit(1)


def generate_schema_json(blog, canonical_url):
    """Generate Schema.org structured data for a blog"""
    schema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": blog['title'],
        "description": blog['description'],
        "author": {
            "@type": "Person",
            "name": "Antony Bush",
            "url": CONFIG['base_url']
        },
        "datePublished": blog['date'],
        "dateModified": blog['date'],
        "publisher": {
            "@type": "Person",
            "name": "Antony Bush"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonical_url
        },
        "keywords": blog['tags']
    }
    return json.dumps(schema, indent=8)


def generate_og_tags(tags):
    """Generate OpenGraph article:tag meta tags"""
    return '\n'.join([
        f'    <meta property="article:tag" content="{tag}">'
        for tag in tags
    ])


def generate_keywords(blog):
    """Generate keywords from tags"""
    base_keywords = ['antony bush', 'blog', 'software engineering']
    return ', '.join(blog['tags'] + base_keywords)


def generate_blog_page(blog, template):
    """Generate an HTML page for a single blog"""
    canonical_url = f"{CONFIG['base_url']}/blogs/{blog['id']}.html"
    
    html = template
    
    # Replace all placeholders
    replacements = {
        '{{TITLE}}': blog['title'],
        '{{DESCRIPTION}}': blog['description'],
        '{{KEYWORDS}}': generate_keywords(blog),
        '{{CANONICAL_URL}}': canonical_url,
        '{{PUBLISHED_DATE}}': blog['date'],
        '{{OG_TAGS}}': generate_og_tags(blog['tags']),
        '{{SCHEMA_JSON}}': generate_schema_json(blog, canonical_url)
    }
    
    for placeholder, value in replacements.items():
        html = html.replace(placeholder, value)
    
    return html


def write_blog_page(blog, html):
    """Write the generated HTML to file"""
    output_path = os.path.join(CONFIG['output_dir'], f"{blog['id']}.html")
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"✓ Generated: {output_path}")
        return output_path
    except Exception as e:
        print(f"✗ Error writing {output_path}: {e}")
        return None


def update_sitemap(blogs):
    """Update sitemap.xml with blog URLs"""
    today = date.today().isoformat()
    
    # Generate blog URL entries
    blog_entries = '\n'.join([
        f'''    <url>
        <loc>{CONFIG['base_url']}/blogs/{blog['id']}.html</loc>
        <lastmod>{blog['date']}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>'''
        for blog in blogs
    ])

    sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>{CONFIG['base_url']}/</loc>
        <lastmod>{today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
{blog_entries}
</urlset>'''

    try:
        with open(CONFIG['sitemap_path'], 'w', encoding='utf-8') as f:
            f.write(sitemap)
        print(f"✓ Updated: {CONFIG['sitemap_path']}")
    except Exception as e:
        print(f"✗ Error updating sitemap: {e}")


def main():
    print('🚀 Blog Page Generator\n')
    
    # Read inputs
    data = read_blogs_json()
    blogs = data['blogs']
    template = read_template()
    
    print(f'Found {len(blogs)} blog(s) to generate\n')
    
    # Generate pages
    generated = []
    for blog in blogs:
        html = generate_blog_page(blog, template)
        output_path = write_blog_page(blog, html)
        if output_path:
            generated.append(blog)
    
    print('')
    
    # Update sitemap
    if generated:
        update_sitemap(generated)
    
    print(f"\n✅ Done! Generated {len(generated)} blog page(s)")
    print('\nNew blog URLs:')
    for blog in generated:
        print(f"   {CONFIG['base_url']}/blogs/{blog['id']}.html")


if __name__ == '__main__':
    main()
