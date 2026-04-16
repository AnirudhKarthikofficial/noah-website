# ReFramer Export

Self-hosting guide for your exported Framer site.

---

## ⚠️ Important

This export requires an internet connection to load Framer's React bundles from their CDN. The custom code injector waits for React hydration before executing your custom code.

---

## 📁 What's Included

- **HTML files:** Pages with Framer React runtime intact
- **assets/:** Downloaded images, custom CSS, custom JS, and fonts
- **custom-code/:** Extracted custom code reference (JSON format)

---

## 🚀 How to Host

### Option 1: Open Locally

Simply open `index.html` in your browser. Requires internet connection for Framer bundles.

### Option 2: Run a Local Server

```bash
# Using Node.js
npx serve .

# Using Python
python -m http.server 8000
```

Then visit `http://localhost:8000`

### Option 3: Deploy to Production

Upload to any static hosting service that allows external scripts:

- **Netlify**
- **Vercel**
- **GitHub Pages** (already optimized!)
- **Cloudflare Pages**

#### GitHub Pages

If you pushed this directly to GitHub, enable GitHub Pages:

1. Go to your repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / (root)
4. Save

Your site will be live at `https://[username].github.io/[repo-name]/`

---

## ✅ What Works

- Framer React runtime (interactive components)
- CMS content (embedded)
- Code components (require Framer runtime)
- Code overrides (require Framer runtime)
- Custom page code (injected after hydration)
- Form submissions (custom handlers)
- All downloaded assets

---

## 🔧 Technical Details

The export keeps Framer's React bundles as external references because:

1. Custom code components are React components that need the Framer runtime
2. Code overrides are HOCs that wrap Framer components
3. Framer uses SSR + hydration architecture
4. Custom code needs to run AFTER React hydration completes

The custom code injector waits for:

- `window.__FRAMER_HYDRATED__` flag, OR
- `data-framer-hydration-id` attribute + document ready

---

## 📝 Customization

Custom code is injected via the `#framer-custom-code-injector` script at the bottom of each HTML file.

See `custom-code/*.json` for reference of extracted code.

---

## ⚠️ Limitations

- **Requires internet** to load Framer React bundles (~300KB)
- **Not fully offline** (Framer runtime is CDN-hosted)
- **CMS is static** (no live updates)

---

## 🎯 For Fully Offline Export

If you need a fully offline version:

1. You'll need to rewrite custom code components as vanilla JS
2. Remove Framer React dependencies
3. Rebuild interactive elements manually

This is complex and loses Framer's dynamic features.

---

## 🌟 Made with ReFramer

Exported with [ReFramer](https://reframer.site) by [Julian](https://julpav.com)

