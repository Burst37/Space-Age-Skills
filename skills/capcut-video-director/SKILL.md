---  
name: capcut-video-director  
version: "1.0"  
last_updated: "2026-05"  
authority: Space Age AI Solutions — Director-Level Skill Suite  
trigger_phrases:  
 - capcut  
 - capcut mcp  
 - capcut api  
 - social video  
 - reels  
 - tiktok edit  
 - short form video  
 - capcut draft  
 - auto subtitle  
 - talking head  
 - viral video  
 - ugc video  
status: MCP_INSTALLABLE  
---  
  
# SKILL: CapCut Video Director  
**Authority:** Canonical reference for all CapCut video automation in Space Age AI Solutions workflows.  
  
---  
  
## MCP INSTALLATION  
  
**Option A — VectCutAPI (most powerful, API + MCP dual mode):**  
> https://github.com/sun-guannan/VectCutAPI  
  
```bash  
git clone https://github.com/sun-guannan/VectCutAPI  
cd VectCutAPI  
python -m venv venv-capcut  
source venv-capcut/bin/activate # Windows: venv-capcut\\Scripts\\activate  
pip install -r requirements.txt  
pip install -r requirements-mcp.txt  
# Start MCP server:  
python mcp_server.py  
```  
  
```json  
{  
 "mcpServers": {  
 "capcut-api": {  
 "command": "python3",  
 "args": ["mcp_server.py"],  
 "cwd": "/path/to/VectCutAPI",  
 "env": {  
 "PYTHONPATH": "/path/to/VectCutAPI",  
 "DEBUG": "0"  
 }  
 }  
 }  
}  
```  
  
**Option B — SmartCut (AI talking head editor, silence removal):**  
> https://github.com/mrbuslov/capcut-ai-editor  
  
```json  
{  
 "mcpServers": {  
 "smartcut": {  
 "command": "python",  
 "args": ["-m", "smartcut.server"]  
 }  
 }  
}  
```  
Reads CapCut's own subtitles → auto-removes silences + duplicate takes.  
  
**Option C — LobeHub CapCut MCP (no-install cloud option):**  
> https://lobehub.com/mcp/atx-guy-capcut-mcp-server  
  
**Requirements:** Node.js | FFmpeg installed + in PATH | CapCut desktop installed  
  
---  
  
## WHAT THIS SKILL DOES  
  
When CapCut MCP is active, Claude can:  
- Create new CapCut draft projects (any resolution/aspect ratio)  
- Add video clips with transitions, speed ramps, volume  
- Add audio tracks (music, SFX) with fade in/out  
- Insert text overlays with animations, shadows, keyframes  
- Apply visual effects, filters, stickers  
- Add subtitle files (.SRT)  
- Apply keyframe animations (scale, opacity, position)  
- Save drafts to CapCut for final touch  
- Auto-remove silences from talking head footage (SmartCut)  
  
---  
  
## SPACE AGE STRATEGIC POSITION  
  
CapCut sits between Higgsfield (AI generation) and DaVinci Resolve (professional grade). It is the **rapid social media cut layer** — where AI-generated content gets assembled into platform-native videos at scale.  
  
```  
HIGGSFIELD → generates clips → CAPCUT (fast assembly) → platform delivery  
DAVINCI → master export → CAPCUT → social size variants  
RECORD EXEC → artist content → CAPCUT → Instagram Reels / TikTok  
```  
  
---  
  
## SPACE AGE USE CASES  
  
| Use Case | CapCut Role |  
|---|---|  
| **Record Exec content calendar** | Weekly Reels, TikTok, YouTube Shorts — rapid assembly |  
| **TEK WAT IT TOOK — Veo 3.1 lipsync** | Strip audio → align to MP3 → social cuts |  
| **Encore social posts** | Staff intro videos, testimonials — auto subtitle |  
| **Space Age AI Solutions ads** | 15-30 sec product spots → vertical + horizontal |  
| **Chosen Legend content** | BTS, promo cuts from MV footage |  
| **UGC-style ads** | SmartCut removes silences → authentic feel |  
| **WYSIWYG Eyewear** | Product demo → lifestyle overlay → Shopify/social |  
  
---  
  
## PLATFORM SPEC TABLE  
  
| Platform | Aspect | Resolution | Max Duration | Audio |  
|---|---|---|---|---|  
| TikTok | 9:16 | 1080×1920 | 10 min | AAC |  
| Instagram Reels | 9:16 | 1080×1920 | 90 sec | AAC |  
| Instagram Feed | 1:1 / 4:5 | 1080×1080 | 60 sec | AAC |  
| YouTube Shorts | 9:16 | 1080×1920 | 60 sec | AAC |  
| Facebook Reels | 9:16 | 1080×1920 | 90 sec | AAC |  
| Twitter/X | 16:9 | 1280×720 | 2 min 20 sec | AAC |  
| LinkedIn | 16:9 | 1920×1080 | 10 min | AAC |  
  
---  
  
## PROMPT TEMPLATES  
  
### Talking Head Social Post (Auto-Subtitle + Silence Cut)  
```python  
# SmartCut workflow — run on raw talking head footage  
# 1. Auto-removes silences >1 second between phrases  
# 2. Removes duplicate takes  
# 3. Exports cleaned CapCut draft  
  
# Then manually add:  
# - Lower third: name/title text  
# - Background music: Splice MCP sound  
# - Captions: export from CapCut auto-subtitle  
```  
  
### Short Form Promo (API workflow)  
```python  
# Step 1: Create draft  
draft = create_draft(width=1080, height=1920, fps=30)  
draft_id = draft["draft_id"]  
  
# Step 2: Add AI-generated clip (from Higgsfield)  
add_video(video_url="[higgsfield_output_url]", draft_id=draft_id, start=0, end=8, volume=0.8)  
  
# Step 3: Add brand music (from Splice MCP)  
add_audio(audio_url="[splice_download_url]", draft_id=draft_id, start=0, end=30, volume=0.4, fade_in=1, fade_out=2)  
  
# Step 4: Add title text  
add_text(text="[BRAND STATEMENT]", draft_id=draft_id, start=1, end=4, font_size=64, shadow_enabled=True, background_color="#000000", background_alpha=0.7)  
  
# Step 5: Add CTA  
add_text(text="Link in bio →", draft_id=draft_id, start=6, end=9, font_size=36)  
  
# Step 6: Add keyframe zoom  
add_video_keyframe(draft_id=draft_id, track_name="main", property_types=["scale_x","scale_y"], times=[0,3,6], values=["1.0","1.05","1.0"])  
  
# Step 7: Save  
save_draft(draft_id=draft_id)  
```  
  
### Music Video Social Cut (Veo 3.1 lipsync workflow)  
```  
1. Veo 3.1 generates lipsync clips → download  
2. CapCut draft: 9:16 vertical reframe of 16:9 master  
3. Strip audio from Veo output (CapCut or FFmpeg)  
4. Re-sync to original MP3 (align manually in CapCut)  
5. Color filter: match to DaVinci grade reference frame  
6. Add artist name lower third (Orbitron font if available)  
7. Export: 1080x1920 at 30fps for Reels/TikTok  
```  
  
---  
  
## BATCH PRODUCTION PIPELINE (Record Exec)  
  
For weekly content calendar automation:  
```  
Monday: Pull Splice MCP → 3 beat loops → CapCut audio beds  
Tuesday: Higgsfield UGC Factory → 5 raw clips → CapCut assembly  
Wednesday: SmartCut pass → remove silences → subtitle export  
Thursday: Platform variants (9:16 / 1:1 / 16:9) from master  
Friday: Schedule via later.com / buffer  
```  
  
---  
  
## QUALITY GATES  
  
Before any CapCut export:  
- ✅ Audio: dialogue in frame, no clipping (-3dB headroom)  
- ✅ Captions: accurate, readable size (minimum 36pt equivalent)  
- ✅ Opening 3 seconds: hook is strong (no dead air)  
- ✅ Aspect ratio: confirmed for target platform  
- ✅ Branded: logo/watermark in corner if required  
- ✅ Duration: within platform limit  
  
---  
  
## NEVER DO  
  
- ❌ Deliver CapCut draft without checking audio sync  
- ❌ Use CapCut as a primary color grading tool (use DaVinci)  
- ❌ Skip silence removal on talking head footage  
- ❌ Forget to remove Veo 3.1 audio before re-syncing MP3 (lipsync)  
- ❌ Export 16:9 for vertical-first platforms  
