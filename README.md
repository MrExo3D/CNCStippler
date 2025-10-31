https://dotomatic3000.com

A browser-based tool that converts images into optimized SVG stipple patterns.  
Built for creative makers, CNC artists, and designers who need precise, scalable dot patterns based on image brightness.
---

## ✨ Features

- ⚙️ Adjustable output size (in inches)
- ⚫ Variable dot sizes with min/range controls
- 🎨 Multiple dot shapes — Circle, Square, Triangle, Star
- 🌓 Invert image + live color preview
- 💾 One-click SVG export (1 SVG unit = 1 inch)
- 🧮 Weighted Lloyd (Voronoi) optimization for natural placement
- 🚀 Responsive, compact UI (mobile-friendly)
- 🔄 Aspect ratio lock and color swap tool

---

## 🧩 Files

| File | Purpose |
|------|----------|
| `index.html` | Main webpage structure |
| `stipple_styles.css` | Interface layout and theme |
| `stipple_app.js` | Logic for image analysis, stippling, and SVG generation |

You can rename or reorganize these as needed for your own deployment.

---

## 🧠 How It Works

1. Load a image.
2. The script samples pixel brightness to decide dot size.
3. Dots are distributed via a randomized placement algorithm with optional overlap prevention.
4. A **Lloyd relaxation** (Voronoi-based optimization) step refines positions.
5. Resulting stipple pattern is drawn on a canvas and exported as clean SVG geometry.

---

## 🚀 Run Locally

1. Clone this repo:
   ```bash
   git clone https://github.com/YOURUSERNAME/stipple-generator.git
