---  
name: davinci-resolve-director  
version: "1.0"  
last_updated: "2026-05"  
authority: Space Age AI Solutions — Director-Level Skill Suite  
trigger_phrases:  
 - davinci  
 - davinci resolve  
 - resolve mcp  
 - color grade  
 - color grading  
 - video edit  
 - timeline  
 - fusion  
 - lut  
 - render export  
 - post production  
 - media pool  
 - resolve studio  
status: MCP_INSTALLABLE  
---  
  
# SKILL: DaVinci Resolve Director  
**Authority:** Canonical reference for all DaVinci Resolve post-production in Space Age AI Solutions workflows.  
  
---  
  
## MCP INSTALLATION  
  
**Best-in-class option — samuelgursky/davinci-resolve-mcp (920 stars, 354 tools):**  
> https://github.com/samuelgursky/davinci-resolve-mcp  
  
```bash  
git clone https://github.com/samuelgursky/davinci-resolve-mcp  
cd davinci-resolve-mcp  
python install.py --clients claude-desktop  
```  
  
**Or manual config:**  
```json  
{  
 "mcpServers": {  
 "davinci-resolve": {  
 "command": "python",  
 "args": ["src/server.py"],  
 "cwd": "/path/to/davinci-resolve-mcp"  
 }  
 }  
}  
```  
  
**Alternative — CutMaster AI (227 tools, 9 skills, 7 domain agents):**  
> https://github.com/CelaviiHQ/cutmaster-ai  
> Includes: /deliver, /preflight, /color-assist, /grade-log slash commands  
> Requires: DaVinci Resolve Studio ($295) — NOT free edition  
  
**Requirements:**  
- DaVinci Resolve Studio 17+ (scripting API is Studio-only)  
- Python 3.10+  
- Resolve must be running before MCP activates  
  
**Verify:** Resolve → Preferences → System → General → Enable external scripting  
  
---  
  
## WHAT THIS SKILL DOES  
  
When Resolve MCP is active, Claude can:  
- Create, open, save Resolve projects  
- Build and modify timelines (add clips, transitions, markers)  
- Import media to media pool, create bins, organize  
- Apply color grades: primary wheels, curves, qualifiers  
- Load LUTs from any camera (DJI, GoPro, Canon, Nikon, Insta360)  
- Control audio: levels, EQ, mix  
- Set up and queue render jobs  
- Create Fusion compositions (VFX, motion graphics)  
- Run arbitrary Python code inside Resolve's scripting API  
- Export EDL, AAF, XML for NLE interchange  
  
---  
  
## SPACE AGE USE CASES  
  
| Project | Resolve Workflow |  
|---|---|  
| **TEK WAT IT TOOK MV** | Assemble Veo 3.1 clips → grade to cinematic look → title screen/intro animation → export |  
| **Chosen Legend MV** | Multi-cam sync → color match Blackmagic URSA look → deliver |  
| **Nike Spec Ad** | 15-scene assembly → brand-consistent grade → render ProRes 4K |  
| **Psalm 23 Audiobook** | Audio mix → timeline → chapter markers → export AAC/WAV |  
| **Encore Landing Page** | Screen record edit → web-optimized render → cinematic color treatment |  
| **Music Visualizer** | Import Higgsfield video loop → color grade → composite audio → export |  
| **Record Exec EPK** | Assemble artist footage → cinematic grade → title cards → deliver |  
  
---  
  
## SIGNATURE LOOKS — SPACE AGE GRADE BIBLE  
  
### Look 1: Hip-Hop/R\&B Cinematic (Chosen Legend / TEK WAT IT TOOK)  
```  
Lift: -0.05 (slightly crushed blacks)  
Gamma: +0.02 warm push  
Gain: +0.03 highlights preservation  
Saturation: 85% (slightly desaturated overall)  
Hue: shift reds +8° (skin warmth)  
LUT base: Rec709 → ARRI ALF2 creative  
Custom curve: gentle S-curve, protect highlights  
Shadow tint: subtle blue-teal (-3 on blue lift)  
```  
  
### Look 2: Commercial/Brand (Nike Spec Ad / Client Work)  
```  
Contrast: high — lift -0.08, gain +0.05  
Saturation: 110% (product pops)  
Color temp: neutral-cool (5600K reference)  
LUT: Kodak 2383 print emulation  
Vignette: subtle, 0.3 opacity  
Sharpening: Edge Sharpen 0.3  
```  
  
### Look 3: OLED/Space Age Brand (Space Age AI Solutions content)  
```  
Blacks: crushed to true black (Lift -0.12)  
Midtones: normal  
Highlights: preserve detail (+0.02 gain)  
Saturation: 100% — let brand colors pop  
Accent: electric blue channel push  
Output: sRGB for web, Rec709 for broadcast  
```  
  
### Look 4: Cinematic Mythology (Pilot's Son Apparel)  
```  
Base: filmic tone mapping  
Color: muted earth tones + gold accent  
Saturation: 80% global, then +20% on target hue  
Skin: qualifier → gentle warm push  
Add: cinematic lens flare in Fusion  
```  
  
---  
  
## PROMPT TEMPLATES  
  
### MV Assembly  
```  
Resolve task: Music video assembly  
- Import folder: [path to video clips]  
- Create timeline: 23.98fps, 1920x1080  
- Sort clips: by scene number prefix  
- Auto-sync to audio: [audio file path]  
- Add markers: at every beat drop (manual flagging or auto detect)  
- Apply base LUT: [specify]  
- Queue render: ProRes 4444, no compression  
```  
  
### Color Grade Session  
```  
Color grade this timeline for [project]:  
- Primary grade: match to reference frame [description]  
- Apply look: [Look 1/2/3/4 from grade bible]  
- Qualifier: select skin tones → push warmth +5  
- Node structure: Correction → Creative → Output  
- Export: stills from key frames for client approval  
```  
  
### Batch Export  
```  
Render queue setup:  
- Preset: [YouTube 4K / Instagram 1080p / ProRes Master]  
- Format: [H.264 / H.265 / ProRes 4444 / DNxHD]  
- Output path: [folder]  
- Include handles: 12 frames  
- Burn-in: none (clean master)  
- Queue and render all  
```  
  
---  
  
## LUT LIBRARY REFERENCE  
  
| Camera | LUT Type | Use Case |  
|---|---|---|  
| Blackmagic URSA Cine 17K | Blackmagic Film → Rec709 | All Blackmagic footage |  
| DJI (D-Log M) | DJI D-Log M → Rec709 | Drone shots |  
| iPhone (Log) | iPhone Log → Rec709 | BTS footage |  
| GoPro (Log) | GoPro Protune → Rec709 | Action shots |  
| Kodak 2383 | Print emulation | Commercial look |  
| ARRI ALF2 | Creative film | Cinematic narrative |  
  
CutMaster AI includes 9-brand LUT library auto-installer.  
  
---  
  
## PIPELINE INTEGRATIONS  
  
```  
BLENDER → render EXR → RESOLVE (composite in Fusion) → grade → deliver  
HIGGSFIELD → video clips → RESOLVE (assembly + grade) → export  
CAPCUT → rough cut → RESOLVE → professional grade → master  
RESOLVE → export ProRes → CAPCUT → social cuts  
SPLICE MCP → audio assets → RESOLVE → mix → export  
```  
  
---  
  
## RESOLVE SCRIPTING CHEAT SHEET  
  
```python  
# Get project manager  
pm = resolve.GetProjectManager()  
project = pm.GetCurrentProject()  
timeline = project.GetCurrentTimeline()  
  
# Add clip to timeline  
mediaPool = project.GetMediaPool()  
folder = mediaPool.GetRootFolder()  
clips = folder.GetClipList()  
  
# Set render settings  
project.SetRenderSettings({  
 "SelectAllFrames": True,  
 "TargetDir": "/output/path",  
 "VideoQuality": 0 # 0 = best  
})  
project.AddRenderJob()  
project.StartRendering()  
```  
  
---  
  
## QUALITY GATES  
  
Before any Resolve delivery:  
- ✅ Audio levels: dialogue -12 to -6 LUFS, music -18 LUFS under dialogue  
- ✅ Export codec matches delivery spec (web=H.264, client=ProRes)  
- ✅ Color space transform confirmed (RCM or manual LUT)  
- ✅ Render handles: 12 frames minimum for VFX work  
- ✅ Proxy media linked to original (no offline clips)  
- ✅ Title cards: correct font (Orbitron for Space Age brand)  
  
---  
  
## NEVER DO  
  
- ❌ Edit source files directly — always duplicate project first  
- ❌ Render without confirming color space output  
- ❌ Skip audio sync check before assembly  
- ❌ Use free DaVinci Resolve for scripted workflows (Studio only)  
- ❌ Deliver H.264 as a master — always ProRes first, then transcode  
