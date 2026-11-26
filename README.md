# NRTHIQ repository proof site

A public test site. It is **not a real business**.

It exists so that NRTHIQ can prove, on a real repository and a real public deployment, that a page it commits is the page a visitor is served, and that undoing the change removes the page.

## How it works

- Every page is one Markdown file under `content/`.
- The file's frontmatter names the page's `title`, its `description` and the `path` it is served at.
- The file's one `#` heading is the page's one main heading. The layout adds none.
- The title and the meta description are printed exactly as written.
- A path no file names answers **404**.
- Articles are filed under `/blog/` (`content/blog/<slug>.md`).

The contract is NRTHIQ's `docs/GIT_PAGE_CONTRACT.md`.

## Deployments

The site deploys from `main` through the hosting provider's GitHub integration. Each production deployment is recorded on GitHub as a deployment to the `Production` environment, which is what NRTHIQ reads to decide that a commit is live.

## Indexing

The site sends `noindex`. A made-up business should not appear in a search index. The switch is `indexable` in `lib/site.ts`.

## Running it

```bash
npm install
npm run build
npm run start
```
