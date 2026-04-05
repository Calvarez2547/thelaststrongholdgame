# The Last Stronghold Game Website

This project is a clean, beginner-friendly single-page website for your school capstone game, **The Last Stronghold**. It uses plain HTML, plain CSS, vanilla JavaScript, a Cloudflare Pages Function for the download form backend, and Supabase for storing download requests.

## Project structure

`index.html`  
Main single-page website with the sticky navigation, hero section, story section, documentation section, footer, and download form modal.

`styles.css`  
All layout, colors, spacing, responsive design, and visual styling for the website.

`script.js`  
Handles the mobile menu, smooth single-page behavior, media/documentation card rendering, trailer sound toggle, form validation, and the API call to `/api/download`.

`functions/api/download.js`  
Cloudflare Pages Function backend endpoint. It validates the form data, checks that the user is 18+, writes the record to Supabase, and returns the game ZIP download URL.

`supabase/schema.sql`  
SQL script to create the `downloads` table and indexes in Supabase.

`assets/images/`  
Placeholder image files for the hero banner, screenshots, promotional art, gallery items, and poster.

`assets/videos/`  
Place your real trailer video and gameplay video files here later.

`assets/docs/`  
Place your SDS, SRS, proposal PDF, and other capstone documents here later.

`assets/downloads/`  
Place your final Windows beta ZIP file here if you want Cloudflare Pages to serve it directly.

## Files you will edit later

Update these when your real assets are ready:

`index.html`  
Change the trailer video source if you rename the placeholder file.

`script.js`  
Replace the placeholder media and documentation file paths in the `mediaItems` and `documentationItems` arrays.

`assets/images/`  
Replace the placeholder SVG image files with your real banner, screenshots, promo art, and poster.

`assets/videos/`  
Add your real trailer and gameplay MP4 files.

`assets/docs/`  
Add your real SDS, SRS, proposal, and other PDF files.

`assets/downloads/`  
Add your final game ZIP if your `GAME_DOWNLOAD_URL` points to a file hosted in this project.

## How the download flow works

1. The user clicks **Download Free Beta**.
2. The modal form asks for full name, email, date of birth, and age confirmation.
3. The frontend validates the fields before sending anything.
4. The request goes to `POST /api/download`.
5. The backend validates the data again.
6. If the user is 18+ and valid, the backend inserts the record into the Supabase `downloads` table.
7. The backend returns a JSON response with the final ZIP URL.
8. The browser starts the download.

## Supabase setup

1. Create a new Supabase project on the free plan.
2. Open the **SQL Editor** in Supabase.
3. Open `supabase/schema.sql` in this project.
4. Copy the SQL into the Supabase editor and run it.
5. Confirm the `downloads` table was created in the `public` schema.

### Required table columns

The SQL file creates:

- `id`
- `name`
- `email`
- `dob`
- `created_at`

### Important database note

Do not connect the frontend directly to Supabase for inserts. This project is set up so only the Cloudflare Pages Function writes to the database using the server-side service role key.

## Cloudflare environment variables

In your Cloudflare Pages project, add these environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GAME_DOWNLOAD_URL`

### Example values

`SUPABASE_URL`  
Your Supabase project URL, such as `https://your-project-id.supabase.co`

`SUPABASE_SERVICE_ROLE_KEY`  
Your Supabase service role key from **Project Settings > API**

`GAME_DOWNLOAD_URL`  
The public URL for your final game ZIP, for example:

`https://thelaststrongholdgame.pages.dev/assets/downloads/the-last-stronghold-beta.zip`

## How to run locally

You have two simple options:

### Option 1: Frontend only preview

Open `index.html` in a browser, or use the VS Code **Live Server** extension if you want a cleaner local preview.

This is enough to test the layout and design, but the download API will not work by itself in a plain file preview.

### Option 2: Full Cloudflare Pages local development

1. Install Wrangler if needed: `npm install -g wrangler`
2. In this project folder, run: `wrangler pages dev .`
3. Add the same environment variables locally:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GAME_DOWNLOAD_URL`

This option is best because it runs the static site and the `/api/download` Pages Function together.

## How to deploy to Cloudflare Pages

1. Push this project to GitHub.
2. In Cloudflare, create a new **Pages** project.
3. Connect the GitHub repository.
4. Use the project name: `thelaststrongholdgame`
5. For a plain static site, the build command can be left blank.
6. Set the output directory to: `.`
7. Add these environment variables in Cloudflare Pages:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GAME_DOWNLOAD_URL`
8. Deploy the site.

## Quick beginner checklist

1. Replace the placeholder images in `assets/images/`.
2. Add your real trailer to `assets/videos/trailer-placeholder.mp4`, or change the path in `index.html`.
3. Add your PDFs to `assets/docs/` and update the file paths in `script.js`.
4. Add your ZIP file to `assets/downloads/` if you want Cloudflare to host it.
5. Set `GAME_DOWNLOAD_URL` to the final public ZIP URL.
6. Create the Supabase table with `supabase/schema.sql`.
7. Add all three environment variables in Cloudflare Pages before deploying.

If the project name is `thelaststrongholdgame`, the default free Cloudflare Pages URL should be:

`https://thelaststrongholdgame.pages.dev`

## Suggested final asset names

These names match the placeholders already used in the project:

- `assets/images/hero-banner-placeholder.svg`
- `assets/videos/trailer-placeholder.mp4`
- `assets/videos/gameplay-placeholder.mp4`
- `assets/images/gameplay-01-placeholder.svg`
- `assets/images/gameplay-02-placeholder.svg`
- `assets/images/promo-art-placeholder.svg`
- `assets/images/gallery-01-placeholder.svg`
- `assets/images/gallery-02-placeholder.svg`
- `assets/images/poster-placeholder.svg`
- `assets/docs/REPLACE-WITH-YOUR-SDS.pdf`
- `assets/docs/REPLACE-WITH-YOUR-SRS.pdf`
- `assets/docs/REPLACE-WITH-YOUR-PROPOSAL.pdf`
- `assets/docs/REPLACE-WITH-YOUR-OTHER-DOCUMENT.pdf`
- `assets/downloads/the-last-stronghold-beta.zip`

You can keep these names or rename them, but if you rename them, also update the paths in `index.html`, `script.js`, and `GAME_DOWNLOAD_URL`.
