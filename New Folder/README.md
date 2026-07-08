# d8talytics — landing page

A dark, cinematic one-page site: hero with a mouse-reactive neural-network
field (Three.js), a "why synthetic data" grid, a 4-step pipeline section
with a scroll-drawn connector line, and a minimal contact footer. Built with
plain HTML5, Tailwind CSS (via CDN), and vanilla JS + GSAP for motion.

## Files
```
index.html
css/style.css       - glass/glow/tilt effects Tailwind can't express
js/three-scene.js   - the 3D neural network background
js/animations.js    - GSAP scroll reveals, pipeline line draw, card tilt
js/main.js          - nav scroll state, mobile menu, cursor glow
```

## Run it locally
No build step needed — it's static. Just open `index.html` in a browser, or
serve it so relative paths behave normally:
```
python -m http.server 8000
```
then visit `http://localhost:8000`.

## Deploy to GitHub Pages (free)

1. Create a new GitHub repository (public), e.g. `d8talytics-site`.
2. Add these files to the repo root, keeping the `css/` and `js/` folders.
3. Push to the `main` branch.
4. In the repo: **Settings → Pages** → under "Build and deployment", set
   **Source** to "Deploy from a branch", branch = `main`, folder = `/ (root)`.
   Save.
5. GitHub gives you a live URL in a minute or two, usually:
   `https://<your-username>.github.io/d8talytics-site/`

### Optional: custom domain
If you own a domain (e.g. `d8talytics.com`), add a `CNAME` file to the repo
root containing just the domain name, then point your domain's DNS to
GitHub Pages (an `A` record to GitHub's IPs, or a `CNAME` record to
`<your-username>.github.io` for a subdomain). GitHub's Pages settings page
will show you exactly what to add once you type the domain in.

## Customizing

- **Colors** — edit the `tailwind.config` block at the top of `index.html`
  (`blue`, `violet`, `void`, `panel`, `ink`, `muted`).
- **Copy** — all text lives directly in `index.html`, no CMS or data file.
- **Particle count / density** — `NODE_COUNT` and `CONNECT_DISTANCE` near the
  top of `js/three-scene.js`.
- **Email** — the `mailto:` link in the footer of `index.html`.

## Notes
- Tailwind is loaded from the CDN for simplicity (`cdn.tailwindcss.com`).
  That's fine for a site like this; if it grows into a larger app later,
  switch to a compiled Tailwind build for smaller file size and no console
  warning.
- Motion respects `prefers-reduced-motion` — animations and the cursor glow
  are toned down or skipped for users who've asked their OS for less motion.
- Fully responsive: the mobile menu, hero type scale, and card grid all
  adapt down to phone widths.
