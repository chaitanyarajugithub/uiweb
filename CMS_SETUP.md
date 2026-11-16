# Website content editor setup

The website uses Sanity Studio for private editing and Sanity's published-content API for the public website. Visitor pages do not need a Sanity write token or administrator credentials.

## One-time setup

1. Create a Sanity project at [sanity.io/manage](https://www.sanity.io/manage) and note its project ID.
2. Replace `YOUR_SANITY_PROJECT_ID` in `sanity-config.js` with that ID. Keep the dataset as `production`.
3. Install dependencies with `npm install`.
4. In the Sanity project API settings, allow your local development origin (`http://localhost:5173`) and the final website origin to make published read-only content available to the site.
5. Run `npm run studio`, sign in to Sanity, and create the initial **Site settings** document. Fill in the business details and publish it.
6. Add and publish services, completed/ongoing projects, and client reviews. Reviews only appear on the site after **Approved to publish** is enabled.
7. Publish the editor with `npm run studio:deploy`. Sanity will provide an editor URL; sign in with the authorized Sanity account to manage the website.
8. Build the public site with `npm run build` and deploy the generated `dist` folder to a static host such as Cloudflare Pages or Netlify.

Published changes appear on the public site after refresh. The existing page content remains as a fallback until published CMS entries are available.

## Content available to edit

- Website headline, hero image, about and approach copy, service area, phone, email, and footer tagline
- Services, including their descriptions and photos
- Completed and ongoing projects, including photos and progress stage
- Client reviews (only those explicitly approved to publish)

The project ID and dataset are public identifiers, not credentials. Do not add a Sanity write token or account password to website files.
