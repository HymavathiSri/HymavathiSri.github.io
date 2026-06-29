# Hymavathi Gampasani — Portfolio

Personal portfolio website built with HTML, CSS, and JavaScript.

## 🚀 How to Host on GitHub Pages (Free)

### Step 1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in as **HymavathiSri**
2. Click the **+** icon → **New repository**
3. Name it exactly: `HymavathiSri.github.io`
   - This special name makes GitHub automatically host it as your portfolio
4. Set it to **Public**
5. Click **Create repository**

### Step 2 — Upload Your Files

**Option A — GitHub Website (easiest):**
1. Inside your new repo, click **Add file → Upload files**
2. Drag and drop ALL files from this folder:
   - `index.html`
   - `projects.html`
   - `style.css`
   - `script.js`
   - `assets/` folder (with your photo and resume)
3. Click **Commit changes**

**Option B — Git Command Line:**
```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/HymavathiSri/HymavathiSri.github.io.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Go to your repository → **Settings** tab
2. Scroll to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Choose branch: **main**, folder: **/ (root)**
5. Click **Save**

### Step 4 — Visit Your Portfolio!

After 1-2 minutes, your portfolio will be live at:

**`https://HymavathiSri.github.io`**

---

## 📁 File Structure

```
HymavathiSri.github.io/
├── index.html          # Main portfolio page
├── projects.html       # Full projects page
├── style.css           # All styles
├── script.js           # Interactivity
└── assets/
    ├── profile.png     # Your photo
    └── Hymavathi_Resume.pdf   # Your resume
```

## ✏️ Customization Tips

- **Update contact info**: Edit `index.html` → `#contact` section
- **Add new projects**: Copy a `project-detail` block in `projects.html`
- **Change colors**: Edit CSS variables at the top of `style.css`
- **Update resume**: Replace `assets/Hymavathi_Resume.pdf` with your latest

---

Built with ❤️ — No frameworks, no build tools, just clean HTML/CSS/JS.
