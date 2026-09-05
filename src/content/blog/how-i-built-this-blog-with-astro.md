---
title: "How I Built This Blog with Astro"
description: "Why I chose Astro for a personal blog, how the site is structured, and what I learned while building it."
pubDate: "Sep 05 2026"
author: "Sarath"
tags: ["Astro", "Web Development", "Markdown", "Tailwind CSS", "shadcn"]
heroImage: "../../assets/blog-placeholder-1.jpg"
---

I wanted a personal blog that was simple to publish to, quick to load, and flexible enough to grow with me. I did not want to build a large content management system or maintain a database just to write a post.

The result is `blog.sarath`, a small website where each post lives in the repository as a Markdown file. Astro is the foundation, Tailwind CSS handles the styling, and shadcn components provide the interactive controls where they are useful.

## Why Astro?

Astro fits this project because most of the website is content, not application state.

A blog post does not need a JavaScript runtime in the browser just to display a heading, a paragraph, or a code block. Astro renders the page ahead of time and sends the browser the HTML it needs. That keeps the initial page light while still leaving room for interactive pieces when they are actually valuable.

The main reasons I chose Astro were:

- **Content-first development.** Markdown and MDX are first-class parts of the project.
- **Good performance by default.** Pages are generated as static HTML, and client-side JavaScript is opt-in.
- **A small mental model.** Routes, layouts, components, and content collections are easy to understand.
- **Framework flexibility.** I can use Astro components for the site and React only where an interactive component needs it.
- **Useful integrations.** Sitemap, RSS, Markdown, MDX, and image processing are straightforward to add.

For a personal blog, this is a better fit than shipping a full client-side application to render mostly static writing.

## Writing posts in Markdown

Every post is a file inside `src/content/blog/`. A new article starts with frontmatter:

```md
---
title: "How I Built This Blog with Astro"
description: "A short summary for the archive and page metadata."
pubDate: "Sep 05 2026"
author: "Sarath"
tags: ["Astro", "Markdown"]
heroImage: "../../assets/blog-placeholder-1.jpg"
---
```

The content collection validates this frontmatter with a schema. That means a missing title, invalid date, or incorrectly shaped tag list can be caught during development instead of becoming a broken page later.

Once the file exists, Astro discovers it through the content collection loader. The dynamic route renders the post using the shared `BlogPost` layout, so every article gets the same header, metadata, hero image treatment, typography, and footer.

That workflow is the part I value most. Writing a post is just editing a text file. There is no admin dashboard to maintain and no separate content database to keep in sync.

## How the site is structured

The project is deliberately small:

- `src/content/blog/` contains Markdown and MDX posts.
- `src/content.config.ts` defines and validates the blog collection.
- `src/pages/index.astro` renders the searchable archive.
- `src/pages/blog/[...slug].astro` creates a page for each post.
- `src/layouts/BlogPost.astro` provides the article layout.
- `src/components/` contains shared site pieces and interactive UI.
- `src/styles/global.css` contains the Tailwind and shadcn theme tokens.

The home page loads the collection, sorts posts by date, gathers the available tags, and renders the archive. The individual post route receives the matching collection entry and passes its content into the layout.

This separation keeps content data, route behavior, and visual structure from becoming one large component.

## Search without a backend

The archive has search, topic filtering, and sort controls. These filters do not need a search server because the collection is small and the metadata is already rendered into the page.

The filter state is stored in query parameters:

```text
/?q=astro&topic=markdown&sort=oldest
```

That gives the filters a few useful properties:

- A filtered archive can be bookmarked.
- Search state survives a page refresh.
- A link can be shared with the current filter already applied.
- The browser back and forward buttons remain meaningful.

The interactive controls use shadcn's `Input` and `Select` components. They run as a small React island, while the rest of the page remains Astro-rendered HTML. This is a good example of using React where it helps without turning the whole website into a React application.

## Styling with Tailwind and shadcn

I use Tailwind CSS for the site layout and visual details. The global stylesheet contains the theme variables for backgrounds, foregrounds, borders, muted text, and dark mode. The actual page styling lives inline through Tailwind utility classes.

The shadcn components follow the same token system, which makes the filters feel like part of the site instead of a separate widget. The blog content uses Tailwind Typography so Markdown elements such as lists, blockquotes, code blocks, headings, and links keep their own readable rhythm without affecting the rest of the interface.

The important distinction is scope: the archive and navigation use the site UI styles, while the rendered article uses a dedicated prose style.

## Images, RSS, and sitemap

Astro also takes care of several details that are easy to overlook in a small site.

Images referenced by posts go through Astro's image pipeline, which can generate optimized output for the page. The project also has RSS support for readers who prefer feeds and sitemap generation for search engines.

These features do not require a separate service or a large amount of application code. They are part of the publishing workflow, which is exactly what I want from a blog framework.

## What I would improve next

The current version is intentionally modest. The next improvements I am considering are:

- Adding a real author portrait and better post-specific hero images.
- Adding reading time and related-post links.
- Improving the archive for a much larger number of posts.
- Adding automated checks for frontmatter and broken internal links.
- Publishing the site through a simple static deployment pipeline.

I do not want to add those features just because they are common on blogs. Each one should make writing, reading, or maintaining the site meaningfully better.

## The takeaway

Astro gives me a good balance: static HTML and a focused content workflow for the majority of the site, with small interactive islands when I need them.

For a personal blog, that balance matters. I can open a Markdown file, write, preview, and publish without thinking about application infrastructure. The site stays fast and understandable, while the architecture leaves room for the project to grow.

That is why I am using Astro for this blog.
