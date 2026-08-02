# tazbe-chicken

A clean, dependency-free static site deployed with **GitHub Pages**.

## Live site

Once published, the site will be available at:

```
https://<your-username>.github.io/tazbe-chicken/
```

## Contents

- `index.html` — the single-page landing site (HTML + inline CSS/JS, no build step).
- `README.md` — this file.

## Local preview

Open `index.html` directly in a browser, or serve it locally:

```bash
# Python
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repository named `tazbe-chicken`.
2. Push this folder to the `main` branch:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/tazbe-chicken.git
   git push -u origin main
   ```

3. In the repo **Settings → Pages**, set the source to:
   - Branch: `main`
   - Folder: `/ (root)`
4. Save and wait a minute for the first build. Your site goes live at the URL above.

## License

MIT — free to use and modify.
