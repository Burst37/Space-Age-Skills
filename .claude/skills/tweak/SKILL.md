---
name: tweak
version: 1.0
description: Inject a live VL-01 controls panel into HTML outputs. Use to add real-time design token controls (colors, fonts, spacing, glass intensity) to any Space Age HTML page.
allowed-tools: Read, Write, Bash
---

# TWEAK v1.0
## Space Age AI Solutions — Live VL-01 Controls Panel

## When to load this skill

- User wants to adjust design tokens in real-time on a generated HTML page
- "Add live controls", "make it tweakable", "I want to adjust the colors"
- Delivering an HTML file with interactive style adjustment panel
- Client review of design where they want to experiment with colors/fonts

---

## WHAT TWEAK INJECTS

A floating side panel with live controls for:

```
COLOR CONTROLS:
  - Primary color picker
  - Surface/background color picker
  - Text color picker
  - Border/glass intensity slider

TYPOGRAPHY CONTROLS:
  - Heading font selector
  - Body font selector
  - Base font size slider
  - Letter spacing slider

SPACING CONTROLS:
  - Section padding slider
  - Card gap slider
  - Border radius slider

GLASS CONTROLS:
  - Backdrop blur intensity
  - Glass opacity
  - Glow intensity
```

---

## IMPLEMENTATION

Inject this script before `</body>`:

```html
<!-- SA-TWEAK Controls Panel -->
<div id="sa-tweak" style="position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:99999;">
  <button id="sa-tweak-toggle" style="
    position:absolute;left:-32px;top:50%;transform:translateY(-50%);
    width:32px;height:64px;
    background:rgba(41,121,255,0.9);
    border:none;border-radius:8px 0 0 8px;
    color:white;cursor:pointer;font-size:18px;
    display:flex;align-items:center;justify-content:center;
  ">⚙️</button>
  
  <div id="sa-tweak-panel" style="
    width:280px;
    background:rgba(8,8,12,0.95);
    border:1px solid rgba(255,255,255,0.12);
    border-radius:12px 0 0 12px;
    padding:16px;
    backdrop-filter:blur(20px);
    font-family:'JetBrains Mono',monospace;
    font-size:12px;
    color:#A0A0B0;
    max-height:80vh;
    overflow-y:auto;
  ">
    <h3 style="color:#fff;font-family:'Orbitron',sans-serif;font-size:11px;margin:0 0 16px;letter-spacing:0.1em;">VL-01 CONTROLS</h3>
    
    <!-- Color Controls -->
    <div class="sa-control-group">
      <label>Primary Color</label>
      <input type="color" id="ctrl-primary" value="#2979FF"
        oninput="document.documentElement.style.setProperty('--color-primary', this.value)">
    </div>
    
    <div class="sa-control-group">
      <label>Surface Base</label>
      <input type="color" id="ctrl-surface" value="#050508"
        oninput="document.documentElement.style.setProperty('--surface-base', this.value)">
    </div>
    
    <!-- Blur Controls -->
    <div class="sa-control-group">
      <label>Glass Blur: <span id="blur-val">20</span>px</label>
      <input type="range" min="0" max="40" value="20"
        oninput="
          document.getElementById('blur-val').textContent=this.value;
          document.querySelectorAll('[class*=glass]').forEach(el=>{
            el.style.backdropFilter='blur('+this.value+'px) saturate(150%)';
          });
        ">
    </div>
    
    <!-- Border Radius -->
    <div class="sa-control-group">
      <label>Card Radius: <span id="radius-val">20</span>px</label>
      <input type="range" min="0" max="40" value="20"
        oninput="
          document.getElementById('radius-val').textContent=this.value;
          document.documentElement.style.setProperty('--card-radius', this.value+'px');
        ">
    </div>
    
    <!-- Export Button -->
    <button onclick="
      const tokens = {
        primary: document.getElementById('ctrl-primary').value,
        surface: document.getElementById('ctrl-surface').value,
      };
      navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
      alert('Tokens copied to clipboard!');
    " style="
      margin-top:16px;width:100%;padding:8px;
      background:rgba(41,121,255,0.2);border:1px solid rgba(41,121,255,0.4);
      color:#2979FF;border-radius:6px;cursor:pointer;
      font-family:'JetBrains Mono',monospace;font-size:11px;
    ">Copy Tokens</button>
  </div>
</div>

<style>
.sa-control-group {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sa-control-group label {
  font-size: 11px;
  color: #A0A0B0;
  flex: 1;
}
.sa-control-group input[type="color"] {
  width: 32px;
  height: 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.sa-control-group input[type="range"] {
  width: 100px;
}
</style>

<script>
document.getElementById('sa-tweak-toggle').addEventListener('click', () => {
  const panel = document.getElementById('sa-tweak-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
});
</script>
```

---

## WHAT TO AVOID

- Don't inject Tweak in production/client deliverables — development/review only
- Remove the Tweak panel before final Vercel deploy
- Don't add more controls than needed — keep it focused on the most-tweaked properties
