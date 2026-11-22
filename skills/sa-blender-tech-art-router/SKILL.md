---
name: sa-blender-tech-art-router
description: Router over 94 Blender technical-art skills (director, modeling, hard-surface, sculpt, retopo, UV, materials, lighting, rendering, rigging, animation, sims, geometry nodes, Unity/Unreal/Godot export, 40+ style and genre packs) executed through Blender MCP. Use when the user asks for a game-ready Blender asset, a style (lowpoly, PSX horror, anime, HD-2D), match a reference image in Blender, or export to an engine.
---

# SA Blender Tech-Art Router
94 skills acting as a senior tech-art team; execution via Blender MCP (sa-blender-mcp-operator).

## Route
1. Always start with **blender-director** (Appendix B): plan, polycount budget, pipeline, style.
2. Reference image attached → `references/reference-image-match.md` + analysis template, match camera first.
3. Load only the 2–3 sub-skills the step needs (Appendix A index): discipline (blender-modeler, hard-surface, sculpting, retopology, uv-workflow, materials, texture-workflow, lighting, rendering, rigging, animation, cloth-sim, physics-sim, geometry-nodes, lod-pipeline), style (`*-style`, `*-mood`, `*-worlds`), genre (`genre-*`), export (unity-export, unreal-export, godot-export, export-pipeline).
4. Validate with qa-review + `references/validation-checklist.md`; naming per `references/naming-conventions.md`.
- Prefer MCP execution over UI instructions; non-destructive workflows; save versions.

## Space Age rules (override anything in the appendices)
- Lean: do the job, no filler. Read the matching appendix section before acting; don't load everything.
- Ask Chuma before any paid API, credit spend, plan upgrade or new subscription. Use his existing subscriptions first. Never pay or deposit anything.
- Ask before publishing, posting, emailing or submitting a form anywhere.
- Borrow structure from third-party work, never its text, images, branding or code (clean-room via replica-skill-sa).

## Appendix A — Sub-skill index

| Sub-skill | When | Source |
|---|---|---|
| analog-found-footage-horror | Analog, VHS, CRT, and found-footage horror aesthetics for Blender shots including camera imperfections and documentary framing. | `.claude/skills/analog-found-footage-horror/SKILL.md` |
| animation | Game-ready animation in Blender including walk/run/idle cycles, combat, mechanical animation, camera animation, constraints, Graph Editor, and NLA workflows via MCP. | `.claude/skills/animation/SKILL.md` |
| anime-style | Anime and cel-shaded art direction for Blender with hard color breaks, toon shaders, clean silhouettes, and anime proportion language. | `.claude/skills/anime-style/SKILL.md` |
| apocalypse-worlds | Apocalyptic and dystopian world art direction for Blender including post-apocalyptic, zombie, alien invasion, post-human, dystopian, and utopian contrast sets. | `.claude/skills/apocalypse-worlds/SKILL.md` |
| archviz | Architectural visualization in Blender for interiors/exteriors with real-world scale, camera composition, PBR materials, and still/animation delivery via MCP. | `.claude/skills/archviz/SKILL.md` |
| asset-optimization | Validates and optimizes Blender assets for polycount, topology, UV efficiency, material count, naming, collections, and game-ready performance. Use before export on all production assets via MCP. | `.claude/skills/asset-optimization/SKILL.md` |
| biome-worlds | Biome and setting art direction for Blender covering underwater, desert, arctic, jungle, underground, and floating-island environments. | `.claude/skills/biome-worlds/SKILL.md` |
| blender-director | Use when starting any Blender asset task, planning a production pipeline, coordinating multiple disciplines, or matching a reference photo/concept art. Invoke for game-ready assets, hard surface, environment, characte... | `.claude/skills/blender-director/SKILL.md` |
| blender-modeler | Core Blender modeling specialist for Edit Mode, modifiers, collections, precision modeling, and scene organization. Use for general 3D modeling, blockouts, cleanup, non-destructive workflows, and scene structure in Bl... | `.claude/skills/blender-modeler/SKILL.md` |
| body-horror-style | Body horror art direction for Blender focusing on flesh wrongness, mutation, fusion, and visceral material storytelling. | `.claude/skills/body-horror-style/SKILL.md` |
| brutalist-mood | Brutalist and concrete-monument mood direction for Blender architecture and scenes with raw concrete, monumental scale, and austere composition. | `.claude/skills/brutalist-mood/SKILL.md` |
| camera-cinematography | Cinematic camera work in Blender including framing, lenses, composition, camera animation, and shot language beyond basic rendering setup via MCP. | `.claude/skills/camera-cinematography/SKILL.md` |
| cartoon-style | Cartoon art direction for Blender with squash-stretch readable shapes, bold colors, and graphic silhouettes for games and animation. | `.claude/skills/cartoon-style/SKILL.md` |
| character-archetypes | Character archetype art direction for Blender covering fantasy races, horror creatures, roles (knight, assassin, detective), and body types (mecha, android, chibi, etc.). | `.claude/skills/character-archetypes/SKILL.md` |
| character-artist | AAA character modeling for human anatomy, stylization, facial topology, clothing, hair, and animation-ready meshes. Use for game characters, facial expressions, and production character assets in Blender via MCP. | `.claude/skills/character-artist/SKILL.md` |
| chibi-style | Chibi and SD proportion art direction for Blender characters with oversized heads, simplified anatomy, and cute silhouette rules. | `.claude/skills/chibi-style/SKILL.md` |
| cloth-sim | Garment blockout, cloth simulation, pin groups, and bake to shape keys or caches for characters and props in Blender via MCP. | `.claude/skills/cloth-sim/SKILL.md` |
| collision-proxy | Collision proxy authoring for games including UCX/UHX naming, convex hulls, capsules, and simple collider meshes in Blender via MCP. | `.claude/skills/collision-proxy/SKILL.md` |
| comic-book-style | Comic book and graphic-novel art direction for Blender with ink-line emphasis, halftone cues, and high-contrast framing. | `.claude/skills/comic-book-style/SKILL.md` |
| compositing | Blender compositor workflows for beauty stacks, render passes, color grade, glare, and delivery outputs via MCP. | `.claude/skills/compositing/SKILL.md` |
| cosmic-eldritch-horror | Cosmic, eldritch, and Lovecraftian horror art direction for Blender with non-Euclidean cues, impossible scale, and incomprehensible forms. | `.claude/skills/cosmic-eldritch-horror/SKILL.md` |
| cozy-wholesome-mood | Cozy, cute, wholesome, relaxing, and peaceful mood direction for Blender assets and scenes. | `.claude/skills/cozy-wholesome-mood/SKILL.md` |
| creature-artist | AAA creature modeling for fantasy, aliens, monsters, and organic creature design with believable anatomy and movement. Use for creature blockouts, muscle flow, bone structure, and animation-ready creature assets in Bl... | `.claude/skills/creature-artist/SKILL.md` |
| dark-gritty-mood | Dark, grim, gritty, rusty, abandoned, decayed, industrial, lonely, and melancholic mood direction for Blender. | `.claude/skills/dark-gritty-mood/SKILL.md` |
| dream-surreal-mood | Dreamlike, surreal, mysterious, mystical, hopeful, and chaotic mood direction for Blender scenes. | `.claude/skills/dream-surreal-mood/SKILL.md` |
| dream-weirdcore-style | Dreamcore, weirdcore, and traumacore-inspired art direction for Blender with nostalgic wrongness, liminal nostalgia, and surreal childhood spaces. | `.claude/skills/dream-weirdcore-style/SKILL.md` |
| environment-artist | AAA environment art for modular kits, buildings, terrain, vegetation, architecture, and scene composition. Use for game-optimized environments, storytelling through space, and modular asset pipelines in Blender via MCP. | `.claude/skills/environment-artist/SKILL.md` |
| export-pipeline | Production export from Blender to FBX, GLTF, OBJ, USD, and Alembic with scale, pivot, rotation, normals, materials, animation, and collision verification via MCP. | `.claude/skills/export-pipeline/SKILL.md` |
| fantasy-worlds | Fantasy world-building art direction for Blender covering medieval, high fantasy, dark fantasy, and urban fantasy asset language. | `.claude/skills/fantasy-worlds/SKILL.md` |
| folk-horror-style | Folk horror art direction for Blender with rural ritual uncanny, pastoral daylight dread, and community-wrongness storytelling. | `.claude/skills/folk-horror-style/SKILL.md` |
| frutiger-aero-style | Frutiger Aero art direction for Blender with glossy skeuomorphism, aqua UI cues, nature-tech optimism, and mid-2000s futurism. | `.claude/skills/frutiger-aero-style/SKILL.md` |
| genre-action-combat | Art direction for action, hack-and-slash, beat 'em up, and fighting-game readable combat spaces and prop language in Blender. | `.claude/skills/genre-action-combat/SKILL.md` |
| genre-card-party-idle | Art direction for card games, deck builders, party games, idle/incremental, educational, and rhythm game presentational spaces in Blender. | `.claude/skills/genre-card-party-idle/SKILL.md` |
| genre-metroidvania-roguelike | Art direction for metroidvania, roguelike, and roguelite games in Blender with biome gates, room modules, and run-readable props. | `.claude/skills/genre-metroidvania-roguelike/SKILL.md` |
| genre-narrative-vn | Art direction for visual novel, interactive movie, walking simulator, and story-driven presentation spaces in Blender. | `.claude/skills/genre-narrative-vn/SKILL.md` |
| genre-open-world-sandbox | Art direction for open world and sandbox games in Blender with biome landmarks, traversable scale, and discovery props. | `.claude/skills/genre-open-world-sandbox/SKILL.md` |
| genre-puzzle-platformer | Art direction for puzzle and platformer games in Blender with readable interactables, jump volumes, and clear hazard language. | `.claude/skills/genre-puzzle-platformer/SKILL.md` |
| genre-racing-sports | Art direction for racing and sports games in Blender with track landmarks, stadium kits, and high-speed readability. | `.claude/skills/genre-racing-sports/SKILL.md` |
| genre-rpg | Art direction for RPG, JRPG, CRPG, ARPG, and MMORPG worlds in Blender including loot rarity reads and region identity. | `.claude/skills/genre-rpg/SKILL.md` |
| genre-shooter | Art direction for FPS, TPS, shooter, battle royale, and extraction-shooter maps and props in Blender with sightline and cover language. | `.claude/skills/genre-shooter/SKILL.md` |
| genre-soulslike | Art direction for soulslike games in Blender with monumental melancholy spaces, fog gates, bonfire landmarks, and lethal readability. | `.claude/skills/genre-soulslike/SKILL.md` |
| genre-stealth | Art direction for stealth-game spaces in Blender with shadow volumes, patrol-friendly layouts, and concealment materials. | `.claude/skills/genre-stealth/SKILL.md` |
| genre-strategy-sim | Art direction for strategy, RTS, turn-based strategy, tower defense, MOBA, city builder, colony sim, and simulation games in Blender. | `.claude/skills/genre-strategy-sim/SKILL.md` |
| genre-survival | Art direction for survival and survival-horror gameplay spaces in Blender emphasizing resource props, crafting readability, and tension routes. | `.claude/skills/genre-survival/SKILL.md` |
| geometry-nodes | Blender Geometry Nodes for procedural modeling, scatter systems, vegetation, buildings, pipes, cables, and reusable node groups. Use for procedural asset generation and instancing pipelines via MCP. | `.claude/skills/geometry-nodes/SKILL.md` |
| godot-export | Godot-specific Blender export favoring GLTF/GLB with correct scale, materials, animation clips, and collision shapes via MCP. | `.claude/skills/godot-export/SKILL.md` |
| hair-groom | Hair and fur grooming in Blender using curves, particle hair, geometry nodes, and game hair-card workflows. Use for characters, creatures, and real-time hair cards via MCP. | `.claude/skills/hair-groom/SKILL.md` |
| hand-painted-style | Hand-painted texture art direction for Blender with brushwork albedo, soft value transitions, and stylized PBR restraint. | `.claude/skills/hand-painted-style/SKILL.md` |
| hard-surface | AAA hard surface modeling for sci-fi, industrial, military, vehicles, weapons, robotics, and mechanical props. Use for boolean/bevel workflows, panel lines, greebles, chamfers, and manufacturing-accurate surfaces in B... | `.claude/skills/hard-surface/SKILL.md` |
| hd-2d-style | HD-2D art direction combining pixel characters/sprites with 3D environments, depth of field, and theatrical lighting. | `.claude/skills/hd-2d-style/SKILL.md` |
| historical-worlds | Historical and period world art direction for Blender including Western, pirate, samurai/ninja, Viking, ancient Egypt/Greece/Rome, Victorian, modern, and military eras. | `.claude/skills/historical-worlds/SKILL.md` |
| horror-style | Psychological horror art direction for Blender assets inspired by Silent Hill, Resident Evil, Chilla's Art, Fear to Fathom, and Iron Lung. Use for sparse industrial environments, analog aesthetics, and tension-driven ... | `.claude/skills/horror-style/SKILL.md` |
| indie-horror-aesthetics | Indie horror aesthetic pack for Blender covering Silent Hill, Fear to Fathom, Puppet Combo, corporate horror, cabin/forest/hospital horror, and related looks. | `.claude/skills/indie-horror-aesthetics/SKILL.md` |
| isometric-style | Isometric and strategy-game art direction for Blender including diorama framing, true-iso camera setup, readable silhouettes, and tile asset rules. | `.claude/skills/isometric-style/SKILL.md` |
| lighting | Cinematic and game lighting in Blender including three-point lighting, HDRI, horror lighting, volumetrics, rim lighting, and mood-driven illumination. Use for look development and scene atmosphere via MCP. | `.claude/skills/lighting/SKILL.md` |
| liminal-space-style | Liminal space and Backrooms art direction for Blender with empty transitional architecture, wrong familiarity, and endless repetition. | `.claude/skills/liminal-space-style/SKILL.md` |
| lod-pipeline | Dedicated LOD generation, naming, screen-size targets, and validation for game meshes in Blender via MCP. | `.claude/skills/lod-pipeline/SKILL.md` |
| lookdev | Look development loop for Blender assets combining materials, lighting, camera, and screenshot comparison until shading reads correctly via MCP. | `.claude/skills/lookdev/SKILL.md` |
| lowpoly-style | Low-poly art direction for Blender inspired by PS1/PS2, Lethal Company, Mouthwashing, and Fear to Fathom. Use for readable silhouettes, minimal polygons, simple materials, and strong atmosphere. | `.claude/skills/lowpoly-style/SKILL.md` |
| manga-style | Manga-inspired art direction for Blender emphasizing monochrome value design, speed lines, screentone feel, and manga panel staging. | `.claude/skills/manga-style/SKILL.md` |
| mascot-puppet-horror | Mascot and puppet horror art direction for Blender with cheerful brand characters made wrong, felt/foam materials, and uncanny performance. | `.claude/skills/mascot-puppet-horror/SKILL.md` |
| materials | Blender PBR and stylized material creation for metal, wood, concrete, fabric, glass, dirt, rust, and procedural shaders. Use for look development, material reuse, and production shading in Blender via MCP. | `.claude/skills/materials/SKILL.md` |
| minimalist-style | Minimalist and abstract-leaning art direction for Blender with reduced forms, limited palettes, and negative space. | `.claude/skills/minimalist-style/SKILL.md` |
| neon-retrofuturism | Neon, vaporwave, synthwave, and retrofuturistic mood/art direction for Blender with grid horizons, chrome, and dusk palettes. | `.claude/skills/neon-retrofuturism/SKILL.md` |
| noir-style | Noir art direction for Blender with high-contrast lighting, wet streets, silhouettes, and monochrome or limited-color grading. | `.claude/skills/noir-style/SKILL.md` |
| painterly-style | Painterly art direction spanning watercolor and oil-painting looks for Blender using soft edges, pigment texture, and illustrative lighting. | `.claude/skills/painterly-style/SKILL.md` |
| physics-sim | Rigid body, soft body, and destruction setups in Blender including constraints, cell fracture debris, and baked caches via MCP. | `.claude/skills/physics-sim/SKILL.md` |
| pixel-art-style | Pixel-art and texel-constrained art direction for Blender assets destined for pixel rendering, low-res textures, or HD-2D-adjacent pixel reads. | `.claude/skills/pixel-art-style/SKILL.md` |
| procedural-modeling | Procedural asset creation for rocks, buildings, vegetation, roads, terrain, pipes, cables, and sci-fi panels using Geometry Nodes and modifier-based workflows in Blender via MCP. | `.claude/skills/procedural-modeling/SKILL.md` |
| prop-artist | Everyday and hero prop modeling for furniture, tools, household objects, kitbash parts, and readable game props. Use when hard-surface is too sci-fi/mechanical and the asset is a grounded prop. | `.claude/skills/prop-artist/SKILL.md` |
| psx-horror-style | PS1/PSX-era horror art direction combining low-poly affine textures, limited color depth, fog, and psychological horror staging for Blender assets. | `.claude/skills/psx-horror-style/SKILL.md` |
| qa-review | Production QA gate for Blender assets using viewport screenshots, validation checklists, naming audits, and ship/no-ship verdicts via MCP. | `.claude/skills/qa-review/SKILL.md` |
| realistic-style | Photorealistic AAA art direction for Blender including photogrammetry cleanup, real-world scale, high-poly workflows, PBR accuracy, and scan optimization. Use for cinematic and AAA game realism. | `.claude/skills/realistic-style/SKILL.md` |
| rendering | Blender rendering with Cycles and Eevee including sampling, denoising, camera setup, render passes, color management, and render optimization. Use for final output and look validation via MCP. | `.claude/skills/rendering/SKILL.md` |
| retopology | Production retopology for animation-ready, low-poly, quad-dominant meshes with proper edge loops and efficient polygon flow. Use after sculpting or high-poly modeling before rigging and UV work in Blender via MCP. | `.claude/skills/retopology/SKILL.md` |
| retro-16bit-style | Retro 16-bit art direction for Blender-assisted SNES/Genesis-era color richness, dither cues, and sprite-like clarity. | `.claude/skills/retro-16bit-style/SKILL.md` |
| retro-8bit-style | Retro 8-bit art direction for Blender-assisted pixel/low-res aesthetics inspired by NES-era constraints. | `.claude/skills/retro-8bit-style/SKILL.md` |
| rigging | Production rigging in Blender with armatures, IK/FK, constraints, weight painting, mechanical rigs, facial rigs, and drivers. Use before animation on deforming assets via MCP. | `.claude/skills/rigging/SKILL.md` |
| scene-assembly | Large scene layout in Blender with collections, linking, overrides, streaming-friendly organization, and set assembly via MCP. | `.claude/skills/scene-assembly/SKILL.md` |
| sci-fi-punk-worlds | Sci-fi and punk world art direction for Blender including hard sci-fi, space, cyberpunk, steampunk, dieselpunk, atompunk, solarpunk, biopunk, and clockpunk. | `.claude/skills/sci-fi-punk-worlds/SKILL.md` |
| sculpting | Blender sculpting for organic and hard surface detail using Dyntopo, multiresolution, brushes, alpha workflow, wrinkles, and damage. Use when high-frequency surface detail is needed before retopology in Blender via MCP. | `.claude/skills/sculpting/SKILL.md` |
| set-dressing | Set dressing and environmental storytelling placement for interiors and exteriors using prop density, narrative clusters, and readability rules via MCP. | `.claude/skills/set-dressing/SKILL.md` |
| stop-motion-craft-style | Stop-motion and craft aesthetics for Blender including claymation, paper craft, and handmade physical-material cues. | `.claude/skills/stop-motion-craft-style/SKILL.md` |
| stylized-style | Stylized art direction for Blender with shape language, exaggeration, color harmony, NPR rendering, and hand-painted asset workflows. Use for non-photorealistic game and animation projects. | `.claude/skills/stylized-style/SKILL.md` |
| texture-workflow | Production texture workflow for atlases, baking AO/curvature/normal/roughness maps, decals, and texture memory optimization. Use for game-ready texture pipelines in Blender via MCP. | `.claude/skills/texture-workflow/SKILL.md` |
| unity-export | Unity-specific Blender export for scale, axis, materials, humanoid/generic rigs, LODs, and collision import via MCP. | `.claude/skills/unity-export/SKILL.md` |
| unreal-export | Unreal Engine-specific Blender export for FBX scale, LODs, UCX collision, sockets, materials, and skeletal mesh workflows via MCP. | `.claude/skills/unreal-export/SKILL.md` |
| uv-workflow | Production UV unwrapping for seam placement, UV packing, texel density, UDIM, lightmap UVs, and modular UV layouts. Use when preparing meshes for texturing and engine export in Blender via MCP. | `.claude/skills/uv-workflow/SKILL.md` |
| vector-style | Vector-clean art direction for Blender with flat fills, sharp silhouettes, and UI-like graphic clarity. | `.claude/skills/vector-style/SKILL.md` |
| vegetation-artist | Vegetation and foliage authoring for Blender including trees, plants, grass cards, canopy LODs, and game-friendly leaf atlases via MCP. | `.claude/skills/vegetation-artist/SKILL.md` |
| vehicle-artist | Dedicated vehicle modeling for cars, trucks, aircraft, ships, boats, mechs, and transit assets with proportion, panel flow, and game LOD awareness in Blender via MCP. | `.claude/skills/vehicle-artist/SKILL.md` |
| vfx-fx | Cinematic and game VFX in Blender including smoke, fire, particles, trails, and Geometry Nodes FX setups via MCP. | `.claude/skills/vfx-fx/SKILL.md` |
| visual-console-eras | Visual era art direction for Blender covering PS1–PS5 stylistic cues, retro arcade, DOS, CRT, VHS, and film-grain presentation. | `.claude/skills/visual-console-eras/SKILL.md` |
| voxel-style | Voxel and Minecraft-adjacent art direction for Blender with block grid modeling, limited palettes, and chunk-friendly assets. | `.claude/skills/voxel-style/SKILL.md` |

## Appendix B — Director + shared references

### `.claude/skills/blender-director/SKILL.md`
_Use when starting any Blender asset task, planning a production pipeline, coordinating multiple disciplines, or matching a reference photo/concept art. Invoke for game-ready assets, hard surface, environment, character, creature, export, or any multi-skill Blender workflow._

#### Blender Director

Senior Technical Director orchestrating AAA Blender production.

##### Role Definition

A 15-year veteran Technical Art Director who has shipped AAA games on PC, console, and mobile. Specializes in pipeline architecture, cross-discipline coordination, production planning, and driving all Blender operations through MCP rather than manual UI. Acts as the single orchestrator before any specialist skill activates.

##### When to Use

- Any new Blender asset request (props, environments, characters, creatures)
- Multi-discipline tasks spanning modeling, UVs, materials, rigging, export
- Ambiguous requests needing workflow analysis
- Production planning, polycount targets, export format decisions
- Coordinating style direction (horror, lowpoly, stylized, realistic)
- **Reference image / photo match** — user attaches image and wants similar result

##### Core Philosophy

Every asset follows the universal pipeline in `../references/asset-pipeline.md`. Never skip planning. Prefer MCP execution over UI instructions. Avoid destructive workflows. Deliver game-ready, validated assets.

**When a reference image is attached:** follow `../references/reference-image-match.md` end-to-end. Write Reference Analysis first (`../references/reference-analysis-template.md`). Match camera before micro-detail. Run screenshot comparison loop. Validate with `../references/visual-match-checklist.md`.

##### Director Workflow

```
1. ANALYZE    → Parse request, identify asset type, target platform, art direction
2. PLAN       → Select skills, define polycount/texture budgets, export format
3. BRIEF      → Output structured production brief before any Blender operations
4. DELEGATE   → Activate specialist skills in pipeline order
5. EXECUTE    → Drive work via Blender MCP (see ../references/mcp-integration.md)
6. VALIDATE   → Run checklist (../references/validation-checklist.md)
7. DELIVER    → Export + validation report
```

##### Analysis Framework

Before any work, determine:

| Question | Options | Impact |
|----------|---------|--------|
| Asset purpose | Hero / Standard / Background | Polycount, texture res |
| Target | Game / Cinematic / Portfolio | Optimization level |
| Platform | Mobile / Console / PC | Budget constraints |
| Style | Horror / Lowpoly / Stylized / Realistic | Style skill activation |
| Animation | Static / Rigged / Animated | Retopo, rigging, animation skills |
| Export | FBX / GLTF / USD / Alembic | Export-pipeline config |

##### Skill Routing

| Request Signal | Primary Skill | Supporting Skills |
|----------------|---------------|-------------------|
| Sci-fi, weapons, machinery, industrial HS | hard-surface | blender-modeler, materials, asset-optimization |
| Everyday / hero props, kitbash, furniture | prop-artist | materials, uv-workflow, set-dressing, asset-optimization |
| Cars, ships, aircraft, mechs, transit | vehicle-artist | hard-surface, lod-pipeline, collision-proxy, materials |
| Buildings, terrain, modular kits | environment-artist | geometry-nodes, procedural-modeling, uv-workflow, scene-assembly |
| Trees, plants, grass, foliage | vegetation-artist | geometry-nodes, environment-artist, lod-pipeline |
| Human characters, clothing base mesh | character-artist | retopology, rigging, uv-workflow, hair-groom, cloth-sim |
| Hair, fur, hair cards, groom | hair-groom | character-artist, materials, texture-workflow |
| Cloth sim, garments, capes, bake | cloth-sim | character-artist, physics-sim, animation |
| Monsters, aliens, fantasy creatures | creature-artist | sculpting, retopology, rigging |
| Organic detail, wrinkles, damage | sculpting | retopology, texture-workflow |
| Clean animation mesh | retopology | character-artist, creature-artist |
| UV seams, texel density, UDIM | uv-workflow | texture-workflow, materials |
| PBR, procedural shaders | materials | texture-workflow, lookdev |
| Baking, normal maps, atlases | texture-workflow | uv-workflow, materials |
| Lookdev / shading review loop | lookdev | materials, lighting, camera-cinematography, qa-review |
| Scatter, procedural systems | geometry-nodes | procedural-modeling, environment-artist |
| Mood, cinematic lighting | lighting | rendering, lookdev, horror-style |
| Camera, lenses, framing, camera moves | camera-cinematography | rendering, lighting, animation, compositing |
| Final renders, passes | rendering | lighting, materials, compositing |
| Compositor, grade, beauty stack | compositing | rendering, lookdev, vfx-fx |
| Smoke, fire, particles, cinematic FX | vfx-fx | geometry-nodes, physics-sim, materials, compositing |
| Rigid/soft body, destruction | physics-sim | vfx-fx, collision-proxy, animation |
| Walk cycles, mechanical motion | animation | rigging |
| Bones, IK, weight paint | rigging | animation, character-artist |
| Rocks, roads, cables, buildings (procedural) | procedural-modeling | geometry-nodes |
| Large scene layout, linking, overrides | scene-assembly | environment-artist, set-dressing, lighting |
| Prop placement, narrative clutter | set-dressing | prop-artist, scene-assembly, environment-artist |
| Archviz interiors/exteriors | archviz | materials, lighting, camera-cinematography, rendering |
| Polycount, cleanup | asset-optimization | lod-pipeline, export-pipeline, qa-review |
| LOD generation / validation | lod-pipeline | asset-optimization, unity-export, unreal-export |
| UCX / convex / collider proxies | collision-proxy | lod-pipeline, unreal-export, unity-export, physics-sim |
| Generic FBX/GLTF/USD export | export-pipeline | asset-optimization, qa-review |
| Unity-specific export | unity-export | export-pipeline, lod-pipeline, collision-proxy |
| Unreal-specific export | unreal-export | export-pipeline, lod-pipeline, collision-proxy |
| Godot-specific export | godot-export | export-pipeline, lod-pipeline, collision-proxy |
| QA gate, screenshot review, ship check | qa-review | asset-optimization, lookdev, blender-director |
| Psychological horror aesthetic | horror-style | lighting, environment-artist, set-dressing |
| Cosmic / Lovecraftian / eldritch | cosmic-eldritch-horror | horror-style, creature-artist, vfx-fx |
| Body horror / mutation | body-horror-style | horror-style, creature-artist, sculpting |
| Analog / VHS / found footage | analog-found-footage-horror | compositing, camera-cinematography, horror-style |
| Liminal / Backrooms / empty mall | liminal-space-style | environment-artist, horror-style, lighting |
| Folk horror / rural ritual | folk-horror-style | horror-style, vegetation-artist, set-dressing |
| Mascot / puppet horror | mascot-puppet-horror | horror-style, stop-motion-craft-style, character-artist |
| Dreamcore / weirdcore | dream-weirdcore-style | liminal-space-style, compositing |
| Indie horror refs (SH / FtF / Puppet Combo) | indie-horror-aesthetics | horror-style, psx-horror-style, lighting |
| PSX/PS1 horror crunch | psx-horror-style | horror-style, lowpoly-style, lighting, compositing |
| PS1/PS2, Lethal Company style | lowpoly-style | environment-artist, materials, visual-console-eras |
| Anime / cel / hard color breaks | anime-style | stylized-style, materials, rendering, character-artist |
| Manga value / screentone language | manga-style | anime-style, comic-book-style, compositing |
| Cartoon graphic shapes | cartoon-style | stylized-style, character-artist |
| Comic book / ink / halftone | comic-book-style | stylized-style, compositing |
| Pixel / texel-locked | pixel-art-style | retro-8bit-style, retro-16bit-style, hd-2d-style |
| HD-2D hybrid | hd-2d-style | pixel-art-style, environment-artist, lighting |
| Hand-painted textures | hand-painted-style | stylized-style, texture-workflow |
| Watercolor / oil painterly | painterly-style | hand-painted-style, compositing |
| Claymation / paper craft / stop-mo | stop-motion-craft-style | materials, character-artist |
| Chibi / SD proportions | chibi-style | anime-style, cartoon-style, character-artist |
| Noir / neo-noir | noir-style | lighting, camera-cinematography, compositing |
| Minimalist / abstract reduce | minimalist-style | stylized-style, lookdev |
| Vector-flat graphic | vector-style | minimalist-style, cartoon-style |
| Voxel / Minecraft-adjacent | voxel-style | lowpoly-style, environment-artist, geometry-nodes |
| Isometric / strategy / diorama | isometric-style | camera-cinematography, environment-artist, genre-strategy-sim |
| Frutiger Aero glossy 2000s | frutiger-aero-style | materials, lookdev, neon-retrofuturism |
| Neon / vaporwave / synthwave | neon-retrofuturism | sci-fi-punk-worlds, lighting, compositing |
| Cozy / cute / wholesome | cozy-wholesome-mood | stylized-style, lighting, set-dressing |
| Dark / gritty / decayed / industrial | dark-gritty-mood | horror-style, materials, environment-artist |
| Dreamlike / surreal / mystical | dream-surreal-mood | dream-weirdcore-style, lighting, vfx-fx |
| Brutalist concrete mood | brutalist-mood | archviz, environment-artist, materials |
| Fantasy / medieval / dark fantasy | fantasy-worlds | environment-artist, prop-artist, creature-artist |
| Sci-fi / cyberpunk / steampunk / punks | sci-fi-punk-worlds | hard-surface, environment-artist, vehicle-artist |
| Historical / western / samurai / WW | historical-worlds | environment-artist, prop-artist, character-artist |
| Post-apoc / dystopia / zombie | apocalypse-worlds | environment-artist, prop-artist, vehicle-artist |
| Underwater / desert / arctic / jungle | biome-worlds | environment-artist, vegetation-artist, lighting |
| Character race/role archetypes | character-archetypes | character-artist, creature-artist |
| PS1–PS5 / CRT / VHS / DOS eras | visual-console-eras | lowpoly-style, compositing, realistic-style |
| Action / brawler / fighting arenas | genre-action-combat | environment-artist, vfx-fx |
| FPS / TPS / BR / extraction | genre-shooter | environment-artist, hard-surface, collision-proxy |
| RPG / JRPG / CRPG / ARPG / MMO | genre-rpg | fantasy-worlds, environment-artist, character-artist |
| Survival / survival-horror gameplay | genre-survival | environment-artist, prop-artist, horror-style |
| Stealth spaces | genre-stealth | environment-artist, lighting |
| Puzzle / platformer | genre-puzzle-platformer | environment-artist, prop-artist |
| Metroidvania / roguelike / roguelite | genre-metroidvania-roguelike | environment-artist, scene-assembly |
| Soulslike monumental dread | genre-soulslike | dark-gritty-mood, fantasy-worlds, lighting |
| Strategy / sim / city / colony / MOBA | genre-strategy-sim | isometric-style, environment-artist |
| Racing / sports | genre-racing-sports | vehicle-artist, environment-artist |
| VN / walking sim / interactive movie | genre-narrative-vn | camera-cinematography, lighting, set-dressing |
| Card / party / idle / rhythm / edu | genre-card-party-idle | prop-artist, camera-cinematography |
| Open world / sandbox | genre-open-world-sandbox | biome-worlds, environment-artist, lod-pipeline |
| Exaggerated, NPR, hand-painted broad | stylized-style | materials, rendering, anime-style |
| Photoreal, scan cleanup, AAA PBR | realistic-style | texture-workflow, rendering, lookdev |
| **Reference photo / concept art attached** | **reference-image-match** | blender-director → discipline skill → style → materials → lighting → rendering |

##### Reference Image Workflow (Mandatory)

When user provides a photo or render to match:

```
1. REFERENCE ANALYSIS  → reference-analysis-template.md (written, before MCP)
2. BASELINE SCREENSHOT → get_viewport_screenshot
3. CAMERA MATCH        → CAM_* + EMPTY_CamTarget_* before detailing
4. GEOMETRY TIERS      → silhouette → panel breaks → greebles
5. MATERIALS           → palette from reference; per-object emissive lights only
6. LIGHTING + WORLD    → key direction, rim, space/env mood
7. GRADING             → AgX exposure/look; EEVEE for animation preview
8. COMPARE LOOP        → screenshot → gap list → fix (×3 max)
9. VALIDATE            → visual-match-checklist.md
```

See `../references/reference-image-match.md` for full protocol and failure fixes.

##### Production Brief Template

Output this before executing:

```markdown
## Production Brief: [Asset Name]

**Type:** [prop/environment/character/creature]
**Target:** [game engine / cinematic / portfolio]
**Style:** [horror/lowpoly/stylized/realistic]
**Poly Budget:** [triangles] (ref: polycount-budgets.md)
**Texture Budget:** [resolution]
**Export:** [format + settings]
**Pivot:** [floor/grip/hinge/center]
**Animation:** [none/rigged/animated]

### Active Skills
1. [skill] — [role in pipeline]
2. [skill] — [role in pipeline]

### Pipeline Phases
- [ ] Reference & Planning
- [ ] Blockout & Silhouette
- [ ] Modeling
- [ ] Cleanup & Topology
- [ ] UVs
- [ ] Materials/Textures
- [ ] Optimization
- [ ] Rig/Animate (if needed)
- [ ] Export & Validation

### MCP Execution Plan
[Ordered list of MCP operations]
```

##### Multi-Skill Workflows

###### Hero Prop (Hard Surface)
```
blender-director → hard-surface → materials → uv-workflow → asset-optimization → export-pipeline
```

###### Everyday / Hero Prop
```
blender-director → prop-artist → uv-workflow → materials → lookdev → asset-optimization → export-pipeline
```

###### Vehicle (Game)
```
blender-director → vehicle-artist → lod-pipeline → collision-proxy → materials → unreal-export|unity-export
```

###### Environment Modular Kit
```
blender-director → environment-artist → geometry-nodes → uv-workflow → asset-optimization → export-pipeline
```

###### Game Character
```
blender-director → character-artist → sculpting → retopology → hair-groom → cloth-sim
  → uv-workflow → materials → rigging → animation → export-pipeline
```

###### Horror Scene
```
blender-director → horror-style → environment-artist → set-dressing → lighting → asset-optimization → export-pipeline
```

###### PSX Horror Scene
```
blender-director → psx-horror-style → environment-artist → lowpoly-style → lighting → compositing
```

###### Procedural Scatter System
```
blender-director → geometry-nodes → procedural-modeling → asset-optimization
```

###### Cinematic Shot
```
blender-director → [discipline] → lookdev → camera-cinematography → lighting → rendering → compositing → qa-review
```

###### Engine Delivery
```
blender-director → asset-optimization → lod-pipeline → collision-proxy → unity-export|unreal-export|godot-export → qa-review
```

##### MCP Integration

1. Check Blender MCP availability before Phase 1 execution
2. Create collection hierarchy via MCP immediately
3. Query scene state after each pipeline phase
4. Never describe UI steps when MCP can execute
5. See `../references/mcp-integration.md`

##### Constraints

###### MUST DO
- Output production brief before modeling
- **If reference image attached:** complete Reference Analysis and camera match before geometry detail
- **Screenshot compare** after materials, lighting, and each refinement pass
- Activate appropriate style skill for art direction
- Set polycount/texture budgets explicitly
- Organize collections with `COL_` prefix from start
- Validate before declaring complete
- Coordinate skills; don't try to do everything in one pass

###### MUST NOT DO
- Skip planning phase
- Skip reference analysis when user attached an image
- Keyframe emission on shared hull/structural materials
- Add micro-greebles before silhouette and panel-break tiers
- Declare "done" without visual-match checklist when reference was provided
- Start modeling without scale reference
- Mix styles without explicit direction
- Export without validation
- Explain Blender UI when MCP is available
- Apply destructive operations without backup

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Universal Pipeline | `../references/asset-pipeline.md` | Every task |
| MCP Integration | `../references/mcp-integration.md` | Before execution |
| Naming | `../references/naming-conventions.md` | Scene setup |
| Validation | `../references/validation-checklist.md` | Before delivery |
| Polycount Budgets | `../references/polycount-budgets.md` | Planning phase |
| Skill Routing | `references/skill-routing.md` | Complex multi-skill tasks |
| MCP Tools | `../references/mcp-tools.md` | Before MCP execution |
| Reference Image Match | `../references/reference-image-match.md` | Photo/concept attached |
| Reference Analysis | `../references/reference-analysis-template.md` | Before first MCP call |
| Visual Match Validation | `../references/visual-match-checklist.md` | Before delivery |

##### Decision Trees

###### Reference Image Provided?
```
User attached photo / concept / "match this"?
├── YES → reference-image-match.md (full workflow)
│         → Analyze → Camera → Geometry tiers → Materials → Lighting → Compare loop
└── NO  → Standard pipeline below
```

###### New Asset Request
```
Is style specified?
├── Horror → horror-style (+ psx-horror-style if PS1 crunch)
├── Lowpoly → lowpoly-style + relevant modeling skill
├── Anime/cel → anime-style + relevant modeling skill
├── Voxel → voxel-style + relevant modeling skill
├── Isometric → isometric-style + camera-cinematography
├── Stylized → stylized-style + relevant modeling skill
├── Realistic → realistic-style + relevant modeling skill
├── Archviz → archviz + lookdev
└── Unspecified → Ask or infer from context

What is the asset?
├── Vehicle / mech → vehicle-artist
├── Everyday / hero prop → prop-artist
├── Sci-fi / weapon / industrial HS → hard-surface
├── Human → character-artist (+ hair-groom / cloth-sim as needed)
├── Creature → creature-artist
├── Vegetation → vegetation-artist
├── Environment / level → environment-artist + scene-assembly
└── FX / sim → vfx-fx / physics-sim / cloth-sim

Engine delivery?
├── Unity → unity-export
├── Unreal → unreal-export
├── Godot → godot-export
└── Generic → export-pipeline

Does it need animation?
├── Yes → Add retopology, rigging, animation
└── No → Static pipeline
```

##### Knowledge Reference

AAA, Blender, MCP, game-ready, technical art, pipeline, production brief, hard surface, prop artist, vehicle artist, environment art, character art, creature art, vegetation, set dressing, hair groom, cloth sim, VFX, physics, camera cinematography, compositing, lookdev, archviz, sculpting, retopology, UV unwrapping, PBR materials, texture baking, geometry nodes, procedural modeling, lighting, Cycles, Eevee, AgX, animation, rigging, LOD, collision proxy, scene assembly, QA review, export, FBX, GLTF, USD, Unity, Unreal, Godot, horror, PSX horror, lowpoly, anime, voxel, isometric, stylized, realistic, reference image match, photo match, silhouette, panel breaks, greebles, blender-mcp, COL_, SM_, MAT_, LGT_, CAM_, ARM_, AN_, UCX_

### `.claude/skills/references/asset-pipeline.md`
#### Universal Asset Pipeline

Every Blender asset follows this sequence. **Never skip planning.**

```
Reference Collection
        ↓
     Planning
        ↓
  Scale Planning
        ↓
  Primary Shapes
        ↓
 Secondary Shapes
        ↓
 Silhouette Review
        ↓
 Topology Strategy
        ↓
     Modeling
        ↓
      Cleanup
        ↓
    UV Planning
        ↓
  UV Unwrapping
        ↓
    Materials
        ↓
  Optimization
        ↓
 Rigging (if required)
        ↓
Animation (if required)
        ↓
Collision Planning (if game asset)
        ↓
      Export
        ↓
   Validation
```

##### Phase Details

###### Reference Collection
- Gather orthographic views, real-world dimensions, style references
- **If user attached a photo/concept:** run `reference-image-match.md` — write Reference Analysis (`reference-analysis-template.md`) before modeling
- Extract color palette (5–8 hex), camera angle, key light direction, hero features
- Identify modular pieces, hero vs background detail levels
- Note manufacturing/construction logic for hard surface

###### Planning
- Define asset purpose: hero prop, modular kit piece, background filler
- Target platform: mobile, console, PC, cinematic-only
- Document polycount, texture resolution, LOD requirements
- Choose style skill: horror, lowpoly, stylized, realistic

###### Scale Planning
- Establish scene scale (1 Blender unit = 1 meter default)
- Place human-scale reference (1.8m capsule or mannequin)
- Lock pivot/origin strategy before modeling

###### Primary Shapes
- Block out largest readable forms first
- Focus on silhouette, not detail
- Use primitives, mirror, array, non-destructive modifiers

###### Secondary Shapes
- Add functional subdivisions: panels, edges, structural breaks
- Maintain shape hierarchy: primary > secondary > tertiary

###### Silhouette Review
- Rotate camera at 45° increments
- **Match hero camera to reference** if image was provided (`CAM_*` + target empty)
- Check readability at gameplay/camera distance
- Fix silhouette before adding micro-detail
- **Tier 2 panel breaks** (ribs, belts, recesses) before tier 3 greebles

###### Topology Strategy
- Plan edge flow for deformation (characters) or bevels (hard surface)
- Decide triangulation tolerance for target engine
- Plan UV islands before committing topology

###### Modeling
- Execute discipline-specific workflow (hard surface, organic, modular)
- Prefer modifier stack over destructive edits
- Keep naming and collections organized from start

###### Cleanup
- Merge by distance (threshold appropriate to scale)
- Remove doubles, loose geometry, interior faces
- Apply transforms before export prep
- Verify normals (weighted normals for hard surface)

###### UV Planning
- Mark seams at hidden/construction edges
- Plan texel density relative to screen size
- Separate material IDs if needed for engine

###### UV Unwrapping
- Unwrap with consistent texel density
- Pack efficiently; minimize wasted space
- Create lightmap UVs for baked lighting if required

###### Materials
- PBR or stylized per art direction
- **Match palette from reference analysis** when applicable
- Reuse master materials; instance variations
- **Emissive lights: per-object materials only** — never animate shared hull mats
- Limit unique material count for game assets

###### Look Dev & Reference Compare
- Lighting pass before declaring materials done
- `get_viewport_screenshot` at hero camera vs reference
- Run `visual-match-checklist.md` when reference was provided

###### Optimization
- Run asset-optimization validation
- Create LODs if required
- Collapse unnecessary subdivisions

###### Rigging / Animation
- Only when asset requires deformation or motion
- Mechanical assets: constraints over weight painting
- Characters: animation-ready topology prerequisite

###### Collision Planning
- Simple proxy meshes: box, capsule, convex hull
- Separate `COL_` collection; never export render mesh as collision

###### Export
- Apply export-pipeline skill for target format
- Verify scale, axis, pivot, normals, animation

###### Validation
- Run full checklist in `validation-checklist.md`
- **If reference image was used:** run `visual-match-checklist.md`
- Capture viewport renders from multiple angles
- Confirm game-ready status before delivery

##### Pipeline by Asset Type

| Asset Type | Critical Phases | Typical Skills |
|------------|-----------------|----------------|
| Hard surface prop | Scale → Silhouette → Bevel → UV → PBR | hard-surface, materials, export-pipeline |
| Environment modular | Modular planning → Instances → Texel density | environment-artist, geometry-nodes, uv-workflow |
| Character | Anatomy → Topology → Retopo → Rig | character-artist, retopology, rigging |
| Creature | Anatomy → Sculpt → Retopo → Rig | creature-artist, sculpting, retopology |
| Procedural kit | Node design → Variation → Optimization | geometry-nodes, procedural-modeling |
| Cinematic set | Composition → Lighting → Rendering | lighting, rendering, realistic-style |
| **Reference image match** | Analysis → Camera → Tiers → Materials → Lighting → Compare | reference-image-match, blender-director, rendering |

### `.claude/skills/references/mcp-integration.md`
#### Blender MCP Integration Rules

When Blender MCP is available, **execute operations through MCP** instead of describing manual UI steps.

**Setup:** See repo `docs/BLENDER_MCP_SETUP.md`. Project config: `.cursor/mcp.json` (Cursor) or `.mcp.json` (Claude Code).

**Tool catalog:** See `mcp-tools.md` for BlenderMCP capabilities and bpy fallbacks.

##### Priority Order

1. Check MCP tool descriptors before any Blender operation
2. Read tool schemas for required parameters
3. Execute via MCP tools
4. Validate results via MCP scene queries
5. Only fall back to UI instructions if MCP lacks the capability

##### MCP-First Operations

| Task | MCP Approach |
|------|--------------|
| Create objects | Use MCP object creation tools |
| Modify geometry | Use MCP mesh/edit tools |
| Apply modifiers | Use MCP modifier tools |
| UV operations | Use MCP UV tools if supported |
| Materials | Create/assign materials via MCP |
| Collections | Organize scene hierarchy via MCP |
| Export | Use MCP export tools |
| Validation | Query scene stats via MCP |

##### Execution Protocol

```
1. List available MCP tools for Blender server
2. Read schema for each tool before calling
3. If reference image attached → reference-analysis-template.md BEFORE step 4
4. Plan operation sequence (non-destructive first)
5. Execute step-by-step with validation between steps
6. get_viewport_screenshot after camera, materials, lighting phases
7. Report object names, counts, and metrics after each phase
```

##### Reference Image MCP Loop

When matching a photo:

| Step | MCP Tool |
|------|----------|
| Baseline | `get_viewport_screenshot` |
| Audit scene | `execute_blender_code` (bounds, materials, collections) |
| Camera / geometry / materials / lights | `execute_blender_code` |
| Compare pass | `get_viewport_screenshot` or render still via bpy |
| Save | `execute_blender_code` → `bpy.ops.wm.save_mainfile` |

See `reference-image-match.md` for full workflow and anti-patterns.

##### Scene Organization via MCP

When creating assets, immediately establish:

```
Scene Root
├── COL_Reference
├── COL_Blockout
├── COL_HighPoly
├── COL_LowPoly
├── COL_Collision
├── COL_Lights
└── COL_Export
```

Naming prefixes: see `naming-conventions.md`

##### Non-Destructive Defaults

- Create duplicates before destructive operations
- Keep backup collections hidden, not deleted
- Apply modifiers only at export phase unless required for downstream work
- Document modifier stack in planning output

##### Validation Queries

After major phases, query via MCP:

- Object count and names
- Polygon/triangle counts per object
- Material count
- Collection membership
- Origin/pivot locations
- Transform application status

##### Error Handling

If MCP call fails:
1. Read error message completely
2. Check if Blender is running and MCP connected
3. Verify object/mesh names match scene state
4. Retry with corrected parameters
5. Never silently skip failed operations

##### Anti-Patterns

- ❌ "Press Tab to enter Edit Mode, then..."
- ❌ Long UI walkthroughs when MCP can execute
- ❌ Assuming scene state without querying
- ❌ Destructive apply without backup
- ❌ Export without validation pass

##### Fallback Mode

When Blender MCP is unavailable:
- Provide concise planning and specifications
- Output Python `bpy` scripts the user can run
- Include validation checklist for manual verification
- Note which steps require MCP for full automation

### `.claude/skills/references/mcp-tools.md`
#### BlenderMCP Tool Catalog

Reference for agents when Blender MCP (`blender-mcp` by ahujasid) is connected.

**Always read tool schemas from MCP before calling** — tool names may vary by version.

##### Core Capabilities

| Category | Typical Operations |
|----------|-------------------|
| Scene inspection | List objects, get scene info, viewport screenshot |
| Object creation | Primitives, meshes, curves, empties |
| Object modification | Transform, rename, delete, duplicate |
| Materials | Create, assign, set PBR parameters |
| Code execution | Run `bpy` Python in Blender context |
| Assets | Poly Haven HDRIs/textures/models (if enabled) |
| Generation | Hyper3D / Hunyuan3D (if API keys configured) |

##### Agent Protocol

```
1. Verify MCP connection (scene query)
2. Create collection hierarchy (COL_ prefix)
3. Execute operations incrementally
4. Query state after each phase
5. Screenshot viewport for validation
6. Run validation checklist before export
```

##### Scene Inspection (Run First)

Before any edit, query current state:

- Object names and types
- Polygon counts
- Active collection
- Material assignments
- Selection state

Prevents assumptions about empty vs populated scenes.

##### Object Operations via MCP

Prefer MCP tools over `execute_blender_code` when dedicated tools exist.

Use `execute_blender_code` for:
- Modifier stack operations
- UV editing
- Batch rename/cleanup
- Export operations not covered by dedicated tools

**Always save `.blend` before code execution.**

##### Common bpy Patterns (Fallback)

###### Create Collection

```python
import bpy
col = bpy.data.collections.new("COL_Props")
bpy.context.scene.collection.children.link(col)
```

###### Rename Object

```python
obj.name = "SM_Crate_01"
obj.data.name = "SM_Crate_01"
```

###### Apply Transforms

```python
bpy.ops.object.select_all(action='DESELECT')
obj.select_set(True)
bpy.context.view_layer.objects.active = obj
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
```

###### Merge by Distance

```python
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=0.0001)
bpy.ops.object.mode_set(mode='OBJECT')
```

##### Poly Haven Integration

When enabled in Blender addon:
- Search and import HDRIs for lighting
- Download PBR textures
- Import free 3D models

Use for rapid look-dev; verify license (CC0) for shipping assets.

##### Viewport Screenshots

Request viewport captures to validate:
- Silhouette at gameplay angle
- Material appearance
- Lighting mood
- Scale vs reference object

##### Export via Code (When No Export Tool)

```python
import bpy
bpy.ops.export_scene.fbx(
    filepath="C:/export/SM_Asset.fbx",
    use_selection=True,
    apply_scale_options='FBX_SCALE_ALL',
    axis_forward='-Z',
    axis_up='Y',
    object_types={'MESH', 'ARMATURE'},
    bake_anim=False
)
```

Adjust axis settings per target engine — see `export-pipeline` skill.

##### Error Recovery

| Error | Action |
|-------|--------|
| Connection lost | Reconnect addon in Blender |
| Timeout | Break operation into smaller steps |
| Object not found | Re-query scene; verify name |
| Code execution error | Read traceback; fix; retry |

##### Version Note

BlenderMCP evolves frequently. Tool names and parameters may differ from this reference. **MCP tool descriptors are authoritative.**

Source: [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)

### `.claude/skills/references/naming-conventions.md`
#### Naming Conventions

Consistent naming enables pipeline automation, engine import, and team collaboration.

##### Prefix Standards

| Type | Prefix | Example |
|------|--------|---------|
| Collections | `COL_` | `COL_Environment`, `COL_Props_Hero` |
| Meshes | `SM_` | `SM_Console_Panel_A` |
| Materials | `MAT_` | `MAT_Metal_Brushed_Steel` |
| Textures | `T_` | `T_Console_N`, `T_Console_BC` |
| Animations | `AN_` | `AN_Door_Open` |
| Armatures | `ARM_` | `ARM_Robot_Loader` |
| Geometry Node Groups | `GN_` | `GN_Scatter_Rocks` |
| Render Cameras | `CAM_` | `CAM_Hero_Shot_01` |
| Lights | `LGT_` | `LGT_Key_Main` |

##### Mesh Naming Pattern

```
SM_[Category]_[Descriptor]_[Variant]

Examples:
SM_Weapon_Rifle_A
SM_Prop_Crate_Wood_01
SM_Env_Wall_Module_2m
SM_Char_Hero_Body
```

##### Material Naming Pattern

```
MAT_[SurfaceType]_[Descriptor]

Examples:
MAT_Metal_Painted_Red
MAT_Fabric_Canvas_Dirty
MAT_Glass_Frosted
MAT_Emissive_Screen_Green
```

##### Texture Naming Pattern

```
T_[Asset]_[MapType]

Map suffixes:
_BC  Base Color / Albedo
_N   Normal
_ORM Occlusion/Roughness/Metallic packed
_R   Roughness
_M   Metallic
_AO  Ambient Occlusion
_E   Emission
_H   Height
```

##### Collection Hierarchy

```
COL_ProjectName
├── COL_Reference
├── COL_Blockout
├── COL_Geo
│   ├── COL_Geo_Hero
│   ├── COL_Geo_Background
│   └── COL_Geo_LOD
├── COL_Collision
├── COL_Lights
├── COL_Cameras
└── COL_Export
```

##### LOD Naming

```
SM_AssetName_LOD0   (highest detail)
SM_AssetName_LOD1
SM_AssetName_LOD2
SM_AssetName_LOD3   (lowest / impostor)
```

##### Collision Naming

```
SM_AssetName_COL     (simple proxy)
SM_AssetName_COL_UBX (Unreal box convention)
SM_AssetName_COL_UCX (Unreal convex)
```

##### Rules

- Use PascalCase after prefix with underscores as separators
- No spaces; use underscores
- Sequential numbers: `_01`, `_02` not `_1`, `_2`
- Descriptive, not generic (`SM_Thing` is invalid)
- Match mesh name to material instance where 1:1
- Keep names under 64 characters for engine compatibility

### `.claude/skills/references/polycount-budgets.md`
#### Polycount Budgets

Reference targets for game-ready assets. Adjust per project spec; these are AAA-informed defaults.

##### Props

| Tier | Triangles | Use Case |
|------|-----------|----------|
| Hero | 15,000–50,000 | Player-held, close-up interactive |
| Standard | 5,000–15,000 | Scene props, mid-distance |
| Background | 500–5,000 | Distant filler, clutter |
| Small | 100–500 | Coins, bolts, small debris |

##### Characters

| Tier | Triangles | Use Case |
|------|-----------|----------|
| Hero | 50,000–100,000 | Player character, cutscenes |
| Standard NPC | 20,000–40,000 | Background characters |
| Crowd | 5,000–10,000 | Distant crowds, impostors |
| Mobile hero | 15,000–30,000 | Mobile/ Switch targets |

##### Environment

| Asset | Triangles | Notes |
|-------|-----------|-------|
| Modular wall (2m) | 200–800 | Repeats frequently |
| Modular floor tile | 100–400 | Instanced |
| Hero building section | 5,000–20,000 | Landmark structures |
| Rock (hero) | 1,000–5,000 | Scatter dependent |
| Tree (realistic) | 5,000–15,000 | Use cards/impostors at distance |
| Tree (stylized/lowpoly) | 200–2,000 | Style dependent |

##### Vehicles

| Type | Triangles |
|------|-----------|
| Hero vehicle | 80,000–200,000 |
| Drivable (gameplay) | 30,000–80,000 |
| Background vehicle | 5,000–15,000 |

##### Weapons

| Type | Triangles |
|------|-----------|
| First-person hero | 10,000–30,000 |
| Third-person | 5,000–15,000 |
| Background | 500–2,000 |

##### Style Modifiers

| Style | Budget Adjustment |
|-------|-------------------|
| Lowpoly (PS1/PS2) | 50–90% reduction |
| Horror (sparse detail) | 30–50% reduction |
| Stylized | Similar to standard; detail in texture |
| Realistic AAA | Upper range; LODs mandatory |

##### LOD Guidelines

| LOD | Triangle % | Distance Multiplier |
|-----|------------|---------------------|
| LOD0 | 100% | 0–10m |
| LOD1 | 50% | 10–25m |
| LOD2 | 25% | 25–50m |
| LOD3 | 10% | 50m+ |

##### Texture Budgets

| Asset Tier | Resolution |
|------------|------------|
| Hero | 2048–4096 |
| Standard | 1024–2048 |
| Background | 512–1024 |
| Tiling surfaces | 1024–2048 (tiling) |
| Trim sheets | 2048–4096 shared |

##### Validation

When polycount exceeds budget:
1. Remove unseen backfaces/interior geometry
2. Bake detail to normal maps
3. Reduce bevel segments on distant edges
4. Replace geometry with normal map detail
5. Create LOD chain before final approval

### `.claude/skills/references/reference-analysis-template.md`
#### Reference Analysis Template

Copy and fill this **before any Blender MCP operations** when a reference image is provided.

```markdown
## Reference Analysis: [Asset Name]

**Reference:** [attached image / URL / description]
**Existing file:** [path or "new scene"]
**Target:** [game hero / cinematic / portfolio]
**Match goal:** [similar / close match / specific features only]

---

### 1. Subject Identification
- **Type:** [spaceship / prop / character / environment]
- **Style:** [realistic AAA / horror / stylized / lowpoly]
- **Forward axis:** [+Y / +X / other]
- **Scale estimate:** [L × W × H in meters]

### 2. Silhouette & Proportions
- **Primary masses:** [list 3–5 major forms]
- **Proportion notes:** [nose %, mid %, engine % of total length]
- **Shape language:** [blocky modular / curved / tapered / asymmetric]

### 3. Camera (match first)
- **Angle:** [3/4 starboard / side / low hero / top-down]
- **Lens feel:** [~24mm wide / ~35mm / ~50mm portrait]
- **Subject fill:** [% of frame width/height]
- **Planned setup:** `CAM_*` at [position estimate], target at [point]

### 4. Lighting
- **Key light:** [direction, color temp, hardness]
- **Fill:** [level — crushed shadows vs visible detail]
- **Rim/back:** [yes/no, direction]
- **Environment:** [black space / planet / studio / interior]
- **Planned lights:** [LGT_Key_Sun, LGT_Rim_*, etc.]

### 5. Color Palette (hex)
| Role | Hex | Notes |
|------|-----|-------|
| Hull light | # | |
| Hull dark | # | |
| Recess | # | |
| Trim / metal | # | |
| Glass | # | |
| Emissive warm | # | |
| Emissive cool | # | |
| Ambient / sky | # | |

### 6. Materials
- **Surface types:** [brushed metal / painted / rubber / glass]
- **Roughness range:** [matte 0.5+ / satin / gloss]
- **Weathering:** [none / light edge wear / heavy grime]
- **Unique shaders:** [emissive sensors, decals, glow windows]

### 7. Hero Features (must include)
- [ ] [feature 1 — e.g. QUADRILLION decal forward starboard]
- [ ] [feature 2 — e.g. red forward sensor]
- [ ] [feature 3]

### 8. Gap vs Current Scene (if upgrading existing .blend)
| Area | Reference | Current | Priority |
|------|-----------|---------|----------|
| | | | P0/P1/P2 |

### 9. Active Skills
1. blender-director
2. [discipline skill]
3. [style skill]
4. materials → lighting → rendering

### 10. MCP Phase Plan
1. Audit scene + baseline screenshot
2. Camera match
3. Geometry tier 1→2→3
4. Materials from palette
5. Lighting + world
6. Grading + render test
7. Screenshot compare → fix gaps (×3 max)
8. Save + validation
```

##### Usage Rules

- **Do not skip** — even if the user says "just fix it quickly"
- **Palette hex values** are required — do not use generic grey without sampling reference
- **Gap table** is required when editing an existing file
- Keep analysis concise; execution matters more than long prose

### `.claude/skills/references/reference-image-match.md`
#### Reference Image Match Workflow

**Mandatory when the user attaches a photo, concept art, or render and asks to match, recreate, or build "like this."**

Goal: produce a Blender result that is **visually similar** to the reference — silhouette, proportions, materials, lighting, camera, and mood. "Exact" pixel match is not realistic; **iterative visual convergence** is.

##### Golden Rules

1. **Analyze the reference BEFORE any Blender operations** — output a Reference Analysis (see template below).
2. **Never skip the screenshot comparison loop** — render/viewport capture after every major phase.
3. **Execute via Blender MCP** — do not narrate UI steps when MCP is connected.
4. **Upgrade in place** when a `.blend` already exists — do not rebuild from scratch unless asked.
5. **Separate emissive lights from hull materials** — never keyframe shared structural materials (causes blown-out white hull).
6. **Match camera early** — wrong framing makes every other pass look wrong.
7. **Depth before micro-detail** — panel breaks, recesses, ribs, and silhouette tiers before tiny greebles.

##### Workflow Overview

```
REFERENCE ANALYSIS (written brief)
        ↓
CAMERA + FRAMING MATCH
        ↓
SILHOUETTE + PROPORTION BLOCKOUT
        ↓
PRIMARY SHAPES + SECONDARY PANEL BREAKS
        ↓
TERTIARY GREEBLES + FEATURES
        ↓
MATERIALS + COLOR PALETTE
        ↓
LIGHTING + ENVIRONMENT
        ↓
RENDER SETTINGS + COLOR GRADING
        ↓
SCREENSHOT COMPARE → FIX GAP LIST → REPEAT (max 3 passes)
        ↓
VALIDATION (visual-match-checklist.md)
```

##### Phase 0 — Reference Analysis (Required)

Before MCP execution, document:

| Category | Extract from image |
|----------|-------------------|
| **Subject** | Asset type, hero vs background, forward axis |
| **Silhouette** | Overall shape language (blocky, curved, tapered), major masses |
| **Proportions** | Length/width/height ratios, nose/tail/engine balance |
| **Camera** | Angle (3/4, side, low, high), lens feel (wide/normal/tele), subject fill % |
| **Lighting** | Key direction, fill level, rim/back light, ambient color |
| **Materials** | Metal vs paint vs glass; roughness (matte/satin/gloss); weathering level |
| **Color palette** | 5–8 hex values: hull light, hull dark, recess, trim, emissive, sky/ambient |
| **Unique features** | Decals, windows, antennas, planet/env, volumetrics |
| **Mood** | Industrial, horror, cinematic, retro, clean sci-fi |

Output format: use `reference-analysis-template.md`.

##### Phase 1 — Camera Match

Match the reference framing before detailing geometry.

```
CAM_[Asset]_Hero  +  EMPTY_CamTarget_[Subject]
```

| Reference signal | Camera setup |
|------------------|--------------|
| Full vehicle in frame | Wide lens (24–32mm), TRACK_TO ship center/midship |
| Nose/bridge close-up | 40–50mm, target forward section (+Y forward ships) |
| Low orbit cinematic | Elevated 3/4, key light from upper-left |
| Side profile | Orthographic feel: camera perpendicular to longest axis |

**MCP validation:** `get_viewport_screenshot` at Numpad 0 camera view. Compare subject size and angle to reference.

##### Phase 2 — Geometry Match (Least → Most Detail)

Build in three tiers so the asset stops looking "boxy" early:

###### Tier 1 — Silhouette (blockout)
- Primary masses only; correct proportions vs reference
- Forward axis and scale locked (1 unit = 1 meter)
- Screenshot: silhouette overlay check at reference camera angle

###### Tier 2 — Panel breaks (depth)
- Horizontal ribs, vertical stiffeners, belt lines, keel strips
- Recessed bays, inset panels, stepped noses
- Raised spine segments, module offsets
- **Use cylinders, torus, chamfered boxes** — break 90° corners

###### Tier 3 — Greebles + hero features
- Pipes, vents, antennas, windows, lights, decals
- Reference-specific features (logo, sensor, dish, planet placeholder)

**Anti-pattern:** 200 identical tiny cubes at origin. **Pattern:** Named, positioned, parented parts on hull surfaces.

##### Phase 3 — Materials Match

Extract palette from reference analysis. Limit unique materials (8–12 hero assets).

| Reference look | Shader approach |
|--------------|-----------------|
| Matte weathered metal | Principled: metallic 0.85–1.0, roughness 0.45–0.65, noise variation |
| Dark recesses | Separate `MAT_*_Recess`, very low base color, roughness 0.7+ |
| Panel contrast | Light/dark hull pair, ΔL ≥ 15% between adjacent panels |
| Glass / windows | Transmission + low emission; static strength (no shared blink) |
| Emissive lights | **Per-object** `MAT_LightInst_*` materials only |
| Decals | Emission or transparent BSDF; white/industrial lettering |

See `realistic-style/references/pbr-values.md` and `materials/references/surface-recipes.md`.

**Never:** animate `Emission Strength` on `MAT_Hull_*` or other multi-user structural materials.

##### Phase 4 — Lighting Match

| Reference lighting | Setup |
|-------------------|--------|
| Strong sun, hard shadows | `LGT_Key_Sun` SUN, energy 3–8, angle 2–5° |
| Space / orbit | Dark world (strength 0.08–0.15), no flat gray background |
| Rim separation | `LGT_Rim_*` area/spot from behind-above |
| Fill in shadows | Low `LGT_Fill_*` or slight world ambient — avoid pure black crush |
| Planet / nebula | World shader or `SM_Env_*` placeholder sphere |

Activate **lighting** skill. Match key direction first; tune energy second.

##### Phase 5 — Rendering + Grading Match

| Task | Preview (playback) | Final quality |
|------|-------------------|---------------|
| Engine | EEVEE — sharp animation preview | Cycles or EEVEE per target |
| Motion blur | Off during preview | On only if reference shows blur |
| DOF | Off unless reference is shallow | Match focus subject |
| Color management | AgX | Match reference contrast |
| Exposure | 0.2–0.45 typical space scenes | Adjust until hull readable |
| Look | AgX Base Contrast default | High Contrast if reference is punchy |

**Playback blur fix:** EEVEE + `taa_samples` 1–8 + motion blur off + no Cycles viewport during animation scrub.

Activate **rendering** skill for pass output and final stills.

##### Phase 6 — Screenshot Comparison Loop

After each phase, capture and compare:

```
1. get_viewport_screenshot (or render still at hero camera)
2. List GAPS vs reference (max 5 prioritized items)
3. Fix gaps via MCP
4. Re-screenshot
5. Repeat until PASS or 3 iterations
```

###### Gap categories (prioritize top-down)

1. Camera / framing wrong
2. Silhouette / proportions wrong
3. Too flat / boxy (missing tier-2 breaks)
4. Materials too uniform / wrong value range
5. Lighting direction or exposure wrong
6. Missing hero features (decals, windows, env)
7. Micro-detail density mismatch

##### Skill Routing (Reference Tasks)

```
blender-director
  → reference-image-match (this doc)
  → [discipline: hard-surface | environment-artist | character-artist]
  → [style: realistic-style | horror-style | stylized-style | lowpoly-style]
  → materials → lighting → rendering
  → visual-match-checklist → validation-checklist
```

##### MCP Execution Checklist

- [ ] `get_scene_info` or audit script — bounds, collections, materials
- [ ] `get_viewport_screenshot` — baseline before changes
- [ ] Reference analysis written
- [ ] Camera + target empty positioned
- [ ] Geometry tiers 1→2→3
- [ ] Materials from extracted palette
- [ ] Lights + world
- [ ] Grading (AgX exposure/look)
- [ ] Comparison screenshot vs reference
- [ ] Gap list + fixes
- [ ] `save_mainfile`
- [ ] Validation report

##### Common Failures (Fix Immediately)

| Symptom | Cause | Fix |
|---------|-------|-----|
| Entire ship white when animating | Emission keyed on shared hull material | Per-light materials; clear structural mat animation |
| Black camera view | Camera inside mesh or no lights | Reposition CAM; boost key + world |
| Boxy, toy-like | Tier-2 panel breaks skipped | Ribs, belts, recesses, chamfers before greebles |
| Reference angle wrong | Camera not matched first | TRACK_TO target; match lens and position |
| Blurry on spacebar | Cycles viewport + low samples | EEVEE preview; motion blur off |
| Flat grey clay | No lighting / no material contrast | Sun + rim; light/dark panel pair |
| Details float at origin | Parent/position not set | Parent to root; place on hull surface |

##### Good User Prompts

- "Match this photo — industrial freighter, matte grey hull, strong upper-left sun, full ship in frame"
- "Upgrade existing ship in `spacecraft.blend` to match attached reference; do not rebuild"
- "Reference attached. Analyze first, then camera match, then materials and lighting"
- "Iterate until viewport matches reference — screenshot compare after each pass"

##### Delivery

Include in completion message:

- Reference analysis summary (palette + camera + lighting)
- Before/after screenshot description
- Remaining gaps (if any) with honest assessment
- File path saved
- Active skills used

### `.claude/skills/references/validation-checklist.md`
#### Asset Validation Checklist

Run before marking any asset complete. Query scene via Blender MCP when available.

##### Scale & Transform

- [ ] Correct real-world scale (1 unit = 1 meter unless project specifies otherwise)
- [ ] Origin at logical pivot (floor contact, grip point, hinge axis)
- [ ] All transforms applied (scale 1,1,1 / rotation 0,0,0 where required)
- [ ] Object faces correct forward axis for target engine (typically -Y or +X)

##### Topology

- [ ] Clean topology; no n-gons on deforming areas
- [ ] Quad-dominant mesh
- [ ] No duplicate vertices (merge threshold verified)
- [ ] No loose vertices/edges/faces
- [ ] No internal faces or non-manifold geometry
- [ ] Correct normals (no inverted faces)
- [ ] Hard edges use weighted normals or sharp edges as appropriate

##### UVs

- [ ] Efficient UV layout; minimal wasted space
- [ ] Consistent texel density across visible surfaces
- [ ] Seams placed at hidden/construction edges
- [ ] No overlapping UVs (unless intentional mirroring)
- [ ] Lightmap UV channel if engine requires baked lighting

##### Materials & Textures

- [ ] Minimal material count (target: 1-3 for props, per project spec)
- [ ] PBR values physically plausible or intentionally stylized
- [ ] Texture resolution matches budget (512/1024/2048/4096)
- [ ] No unused material slots
- [ ] Material names follow `MAT_` convention

##### Organization

- [ ] Collections organized per `naming-conventions.md`
- [ ] Meaningful object names with `SM_` prefix
- [ ] Modifier stack documented or collapsed per export requirements
- [ ] Reference/blockout geometry in separate collections
- [ ] Collision meshes in `COL_Collision`

##### Performance

- [ ] Polycount within budget (see `polycount-budgets.md`)
- [ ] Triangle count verified
- [ ] LODs created if required
- [ ] Instances used for repeated geometry
- [ ] Geometry nodes baked if runtime performance requires

##### Export Readiness

- [ ] Export format confirmed (FBX/GLTF/USD/etc.)
- [ ] Animation/armature export tested if applicable
- [ ] Materials export or texture paths documented
- [ ] Pivot and scale verified in target engine
- [ ] Naming compatible with import pipeline

##### Game Ready

- [ ] Readable silhouette at gameplay distance
- [ ] Collision proxy created and simplified
- [ ] No unnecessary high-poly detail on hidden surfaces
- [ ] Asset modular/reusable if part of kit
- [ ] Style consistent with project art direction

##### Visual Match (Reference Image Tasks)

When user provided a reference photo/concept, also run `visual-match-checklist.md`.

- [ ] Reference analysis documented before execution
- [ ] Hero camera angle matches reference (Match or Close)
- [ ] Silhouette and proportions Match or Close
- [ ] Panel depth / not boxy (tier-2 breaks present)
- [ ] Palette matches reference value range
- [ ] Key light direction matches reference
- [ ] Grading/exposure: hull readable, not blown white
- [ ] Screenshot comparison performed (≥1 iteration)
- [ ] No shared structural material emission animation
- [ ] Animation playback sharp (EEVEE preview if animating)

##### Validation Output Template

```markdown
## Validation Report: [Asset Name]

**Status:** PASS / FAIL
**Polycount:** [tris] (budget: [target])
**Materials:** [count]
**UV Efficiency:** [%]
**Scale:** [dimensions]

### Issues Found
- [issue + fix applied]

### Screenshots
- Front / Side / Top / 3/4 views verified
```

### `.claude/skills/references/visual-match-checklist.md`
#### Visual Match Checklist

Run after geometry, materials, lighting, and grading when a **reference image** was provided. Use with `get_viewport_screenshot` or hero camera render.

**Pass threshold:** ≥ 8/10 categories rated "Match" or "Close". Document remaining gaps honestly.

##### Comparison Method

1. Place reference image beside viewport screenshot (same camera angle).
2. Rate each category: **Match** / **Close** / **Miss**
3. For each **Miss**, add one actionable fix to the gap list.
4. Re-run after fixes (max 3 iterations).

---

##### Camera & Composition

- [ ] Subject faces same general direction as reference
- [ ] Same viewing angle (3/4, side, low, high) — not reversed or top-down mismatch
- [ ] Subject occupies similar % of frame
- [ ] Horizon / vanishing consistent with reference
- [ ] Numpad 0 hero camera usable for review

##### Silhouette & Proportions

- [ ] Overall length/width/height ratio reads similarly
- [ ] Major masses in correct positions (nose, mid, tail, engines)
- [ ] No missing large forms visible in reference
- [ ] No extra masses that contradict reference
- [ ] Readable at gameplay/mid distance (not only close-up)

##### Depth & Surface Breakup

- [ ] Not a single flat box — panel lines, ribs, or steps visible
- [ ] Recessed vs raised areas create value contrast
- [ ] Chamfers/cylinders break 90° corners where reference shows them
- [ ] Greeble density in same ballpark (not empty or overcrowded)
- [ ] Windows, ports, vents placed on hull surfaces (not floating)

##### Materials & Color

- [ ] Hull value range matches (dark enough, not blown white)
- [ ] Light/dark panel contrast present
- [ ] Metal reads as metal (roughness/specular appropriate)
- [ ] Glass/windows distinct from hull
- [ ] Emissive lights correct color (red nav, green starboard, etc.)
- [ ] Decals/logos present if in reference
- [ ] No shared-material animation blowing out hull

##### Lighting

- [ ] Key light from same general direction as reference
- [ ] Shadow side not pure black unless reference is
- [ ] Rim/separation on subject edge if reference shows it
- [ ] Emissive elements visible but not overpowering
- [ ] Environment mood matches (space black vs studio vs planet glow)

##### Rendering & Grading

- [ ] AgX (or project) color management active
- [ ] Exposure: hull detail visible, highlights not clipped
- [ ] Contrast level similar to reference
- [ ] Animation playback sharp (EEVEE preview settings)
- [ ] Final still acceptable at 1280×720+ hero camera

##### Feature Checklist (customize per asset)

- [ ] _[Hero feature 1 from reference analysis]_
- [ ] _[Hero feature 2]_
- [ ] _[Hero feature 3]_

---

##### Visual Match Report Template

```markdown
## Visual Match Report: [Asset Name]

**Reference:** [description]
**File:** [path]
**Iteration:** [1/2/3]
**Overall:** PASS / PARTIAL / FAIL

| Category | Rating | Notes |
|----------|--------|-------|
| Camera | Match/Close/Miss | |
| Silhouette | | |
| Depth | | |
| Materials | | |
| Lighting | | |
| Grading | | |

### Top Gaps (fix next)
1. 
2. 
3. 

### Screenshots
- Hero camera render captured: yes/no
- Compared to reference: yes/no
```

##### Auto-Fail Conditions

Fail immediately and fix before delivery if any are true:

- Camera shows wrong side of subject (e.g. rear instead of hero 3/4)
- Hull turns fully white during animation playback
- Reference requested full ship but camera shows only a small section
- Structural materials have emission keyframes
- Export mesh visible in viewport blocking review

## Appendix C — Core discipline skills

### `.claude/skills/blender-modeler/SKILL.md`
_Core Blender modeling specialist for Edit Mode, modifiers, collections, precision modeling, and scene organization. Use for general 3D modeling, blockouts, cleanup, non-destructive workflows, and scene structure in Blender via MCP._

#### Blender Modeler

Foundation modeling skill for all Blender geometry work. Non-destructive by default. MCP-first execution.

##### When to Use

- Blockouts and primary/secondary shape passes
- General mesh editing not covered by discipline specialists
- Scene organization, collections, instances
- Modifier stack management
- Cleanup: merge, normals, loose geometry
- Precision modeling with snapping and numeric input

##### Core Workflow

```
1. Scene Setup     → Collections, scale reference, naming
2. Blockout        → Primitives, mirror, array
3. Shape Refinement → Edit mode or modifier-based edits
4. Modifier Stack  → Non-destructive detail
5. Cleanup         → Merge, normals, manifold check
6. Handoff         → UV/materials or discipline specialist
```

##### Scene Organization

Establish via MCP immediately:

```
COL_Project
├── COL_Reference      # Scale refs, ortho images
├── COL_Blockout       # Temporary blockout meshes
├── COL_Geo            # Final geometry
├── COL_Collision      # Proxy meshes
└── COL_Instances      # Empties/collections for instancing
```

Naming: `../references/naming-conventions.md`

##### Modifier Stack Philosophy

Preferred order (bottom to top):

```
1. Mirror          # Symmetry
2. Array           # Repetition
3. Solidify        # Thickness
4. Boolean         # Cuts (prefer live booleans until export)
5. Bevel           # Edge detail
6. Weighted Normal # Hard surface shading
7. Subdivision     # Only when topology supports it
```

**Rules:**
- Keep booleans live until export prep
- Apply mirror only when topology is finalized
- Never stack multiple subsurf without supporting loops
- Document modifier purpose in object custom properties if complex

##### Edit Mode Essentials

| Operation | Use When |
|-----------|----------|
| Extrude (E) | Adding depth from faces |
| Inset (I) | Panel lines, frames |
| Loop Cut (Ctrl+R) | Adding resolution |
| Knife (K) | Custom cuts |
| Merge by Distance | Cleanup duplicates |
| Recalculate Normals | Fix shading issues |

Via MCP: execute equivalent operations; don't narrate UI.

##### Precision Modeling

- Enable snapping to grid/vertex/edge as appropriate
- Use numeric input for exact dimensions
- Set cursor to world origin for modular alignment
- Apply scale before boolean operations
- Use orthographic views for architectural accuracy

##### Instancing Strategy

| Method | Use Case |
|--------|----------|
| Linked Duplicate (Alt+D) | Identical props with variation potential |
| Collection Instance | Modular kit pieces |
| Geometry Nodes | Procedural scatter (see geometry-nodes) |
| Array Modifier | Linear repetition |

Prefer instances over duplicate geometry for repeated elements.

##### Custom Normals

- Enable Auto Smooth with appropriate angle (30°–60° hard surface)
- Weighted Normal modifier for hard surface without extra geo
- Mark sharp edges explicitly for bevel control
- Clear custom split normals before retopology handoff

##### Cleanup Checklist

- [ ] Merge by distance (threshold: 0.0001m default)
- [ ] Remove loose geometry
- [ ] Delete interior faces
- [ ] Recalculate outside normals
- [ ] Apply scale if modifiers depend on it
- [ ] Verify manifold (no holes unless intentional)
- [ ] Check triangle count vs budget

##### MCP Integration

```
1. Create mesh objects via MCP
2. Apply modifiers via MCP
3. Query polycount after each major edit
4. Organize into collections via MCP
5. Duplicate to backup collection before destructive ops
```

See `../references/mcp-integration.md`

##### Constraints

###### MUST DO
- Non-destructive workflow until export phase
- Name objects `SM_` prefix immediately
- Keep blockout separate from final geo
- Apply transforms before boolean/export
- Validate topology before handoff

###### MUST NOT DO
- Delete blockout before silhouette approved
- Apply all modifiers prematurely
- Leave default names (Cube.001)
- Model without scale reference
- Skip cleanup pass

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Modifier deep dive | `references/modifier-stack.md` | Complex modifier chains |
| Scene organization | `references/scene-organization.md` | Large scenes |
| Pipeline | `../references/asset-pipeline.md` | Phase context |

##### Handoff Points

| To Skill | When |
|----------|------|
| hard-surface | Mechanical/sci-fi detail pass |
| environment-artist | Modular environment pieces |
| character-artist | Organic human forms |
| uv-workflow | Topology locked, ready for UVs |
| asset-optimization | Pre-export performance pass |

### `.claude/skills/hard-surface/SKILL.md`
_AAA hard surface modeling for sci-fi, industrial, military, vehicles, weapons, robotics, and mechanical props. Use for boolean/bevel workflows, panel lines, greebles, chamfers, and manufacturing-accurate surfaces in Blender via MCP._

#### Hard Surface Artist

Production hard surface modeling with manufacturing logic. Readable surfaces. Clean modifier stacks. MCP-first.

##### When to Use

- Sci-fi consoles, spaceships, industrial equipment
- Weapons, vehicles, robotics, military props
- Mechanical assemblies with panels, vents, bolts
- Any asset requiring crisp edges, booleans, chamfers

##### Design Principles

1. **Primary forms first** — Silhouette reads at distance
2. **Manufacturing logic** — Panel breaks follow construction seams
3. **Surface hierarchy** — Primary > Secondary > Tertiary > Micro (greebles)
4. **Functional readability** — Every form suggests purpose
5. **Edge consistency** — Uniform bevel widths per detail tier

##### Workflow

```
Reference → Scale Blockout → Primary Volumes → Panel Breaks
    → Boolean Cuts → Bevel Pass → Weighted Normals
    → Greebles (instanced) → UV Planning → Materials
```

##### Boolean Workflow

```
1. Block primary forms (no booleans yet)
2. Create cutter objects on separate collection COL_Booleans
3. Apply scale on all operands
4. Boolean Difference/Union — keep LIVE
5. Fix intersection artifacts with manual cleanup if needed
6. Bevel AFTER boolean in modifier stack
7. Apply booleans only at export prep
```

**Boolean rules:**
- Cutter objects named `SM_Cutter_[Feature]`
- Prefer exact solver for mechanical work
- Avoid booleans on curved surfaces without adequate topology
- Duplicate mesh before first boolean as backup

##### Bevel Workflow

| Detail Tier | Bevel Width | Segments |
|-------------|-------------|----------|
| Primary edges | 0.005–0.02m | 2–3 |
| Panel lines | 0.001–0.003m | 1–2 |
| Micro detail | 0.0005–0.001m | 1 |

- Use bevel weight or edge marks for selective beveling
- Weighted Normal modifier after bevel (keep sharp: 30°)
- Never bevel entire mesh uniformly on complex assets

##### Panel Lines

Techniques (prefer non-destructive):
1. Inset faces + slight extrude inward
2. Knife cuts on flat panels
3. Boolean with thin cutter boxes
4. Normal map detail for distant panels

Place panel lines at:
- Structural boundaries
- Access hatches, maintenance points
- Material transitions
- Manufacturing seam locations

##### Greebles

- Instance small detail meshes; never model unique unless hero
- Collection: `COL_Greebles`
- Keep greebles on separate mesh for easy toggle
- Budget: greebles should not dominate polycount
- Use array + random transform for scatter greebles

##### Hard Edge Management

```
Sharp edges → Mark Sharp or Bevel Weight = 1.0
Soft transitions → Bevel Weight = 0.0–0.5
Auto Smooth angle: 30°–45° for hard surface
Weighted Normal modifier: Keep Sharp enabled
```

##### Manufacturing Reference

| Real-World Feature | Modeling Approach |
|--------------------|-------------------|
| Sheet metal bend | Bevel + slight inset |
| Weld seam | Thin raised strip or normal map |
| Bolt pattern | Instanced cylinder, hex inset |
| Vent grille | Boolean cut + array |
| Cable routing | Curve + bevel object or geo nodes |
| Rubber gasket | Separate mesh, slight inset channel |

##### Vehicle / Spaceship Specifics

> Prefer **vehicle-artist** for cars, ships, aircraft, and mechs. Use this skill when the vehicle is primarily hard-surface sci-fi detailing under a broader HS brief.

- Establish centerline symmetry early (Mirror modifier)
- Flow lines follow aerodynamic/structural logic
- Landing gear, thrusters as separate objects
- LOD: bake panel detail to normal at distance

##### Weapon Specifics

- Grip pivot at hand contact center
- Sight line alignment verified
- Separate moving parts (slide, magazine) as objects
- First-person: optimize silhouette for viewmodel

##### MCP Integration

Execute via MCP:
1. Create blockout primitives
2. Apply mirror/array modifiers
3. Execute boolean operations
4. Apply bevel and weighted normal
5. Instance greeble collections
6. Query polycount per phase

##### Constraints

###### MUST DO
- Maintain manufacturing plausibility
- Keep modifier stack non-destructive until export
- Use instancing for repeated mechanical detail
- Verify silhouette at 45° increments
- Apply scale before booleans

###### MUST NOT DO
- Boolean on unsubdivided curved surfaces without support
- Uniform bevel on entire complex mesh
- Model every bolt uniquely
- Skip weighted normals on hard surface
- Exceed polycount budget with micro-detail

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Boolean deep dive | `references/boolean-workflow.md` | Complex cuts |
| Greeble library | `references/greeble-patterns.md` | Detail pass |
| Pipeline | `../references/asset-pipeline.md` | Phase context |

##### Style Integration

| Style | Adjustment |
|-------|------------|
| realistic-style | Full bevel + PBR materials |
| lowpoly-style | Skip micro-bevels; large flat panels |
| horror-style | Industrial wear; asymmetric damage |
| stylized-style | Exaggerated panel breaks; bold bevels |

### `.claude/skills/procedural-modeling/SKILL.md`
_Procedural asset creation for rocks, buildings, vegetation, roads, terrain, pipes, cables, and sci-fi panels using Geometry Nodes and modifier-based workflows in Blender via MCP._

#### Procedural Modeling

Parametric assets with art-directable variation. Geometry Nodes priority. Bake for game export.

##### When to Use

- Rocks, cliffs, terrain features
- Modular building generation
- Road and path systems
- Pipe/cable networks
- Sci-fi panel arrays
- Vegetation placement systems

##### Workflow

```
Define Parameters → Build Procedural System → Validate Variations
    → Realize/Bake → Optimize → Export
```

##### System Categories

| System | Primary Tool | Output |
|--------|--------------|--------|
| Rocks | Geo Nodes + noise | Static mesh |
| Buildings | Geo Nodes stack | Modular pieces |
| Roads | Curve + Geo Nodes | Mesh strip |
| Pipes | Curve to mesh | Network |
| Vegetation | Scatter GN | Instanced/baked |
| Sci-fi panels | Array + random | Trim sheet geo |

##### Rock Generation

```
Base shape (ico sphere) → Displace (multi-scale noise)
    → Decimate → Subdivide (selective) → Weighted Normal
    → Variation: seed input controls all noise
```

Expose: `seed`, `scale`, `roughness`, `density`

##### Building Generation

```
Footprint curve → Extrude floors → Window boolean pattern
    → Balcony probability → Roof type switch → Material ID
```

Output separate meshes per floor module for game kits.

##### Road Systems

```
Centerline curve → Resample → Cross-section profile
    → Bridge blend at intersections → UV follow curve
```

##### Pipe/Cable Networks

```
Node graph points → Connect minimum spanning → Curve segments
    → Profile sweep → Collision offset → Clamp size range
```

##### Sci-Fi Panels

```
Grid subdivide → Random inset/extrude → Bevel
    → Panel index → Material variation
    → Bake to trim sheet layout
```

##### Variation Testing

Test at parameter extremes:
- Minimum scale/density
- Maximum scale/density
- Seed 0, 42, 9999 (reproducibility check)

##### Game Export Decision

| Approach | When |
|----------|------|
| Keep procedural in Blender only | Iteration phase |
| Realize single variant | Standard game prop |
| Bake multiple seeds as LOD variants | Background variety |
| Export node group to engine | Only if engine supports |

##### MCP Integration

1. Build procedural systems via MCP
2. Set seed/density parameters via MCP
3. Realize geometry via MCP
4. Query output polycount per variation
5. Export realized meshes

##### Constraints

###### MUST DO
- Expose seed for reproducibility
- Test min/max parameter bounds
- Realize before game engine export
- Optimize after realize (asset-optimization)
- Document parameter ranges in production brief

###### MUST NOT DO
- Export unrealsized geometry nodes to game without validation
- Infinite variation without performance testing
- Procedural where manual hero quality required
- Skip UV planning on procedural output
- Hardcode random without seed control

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Geo nodes patterns | `../geometry-nodes/SKILL.md` | Node setup |
| Environment integration | `../environment-artist/SKILL.md` | Scene placement |

### `.claude/skills/sculpting/SKILL.md`
_Blender sculpting for organic and hard surface detail using Dyntopo, multiresolution, brushes, alpha workflow, wrinkles, and damage. Use when high-frequency surface detail is needed before retopology in Blender via MCP._

#### Sculpting

High-frequency surface detail pass. Know when to sculpt vs model vs bake.

##### When to Sculpt

| Sculpt | Don't Sculpt |
|--------|--------------|
| Organic wrinkles, pores | Hard surface panel lines |
| Creature skin detail | Modular kit pieces |
| Damage, wear, dents | Anything needing clean UVs directly |
| Character likeness refinement | Lowpoly style assets |
| Hero asset micro-detail | Background props |

##### Workflow

```
Base Mesh → Multires or Dyntopo → Primary Forms → Secondary Detail
    → Tertiary/Micro → Bake Maps → Retopology (if game asset)
```

##### Dyntopo vs Multiresolution

| Method | Use When | Avoid When |
|--------|----------|------------|
| Multires | Controlled detail levels; bake workflow | Need to preserve base topology exactly |
| Dyntopo | Freeform exploration; damage pass | Need predictable polycount |
| Voxel Remesh | Reset topology mid-sculpt | Fine detail already established |

**Default:** Multires for production; Dyntopo for exploration passes only.

##### Brush Selection

| Brush | Purpose |
|-------|---------|
| Draw | General buildup |
| Clay Strips | Muscle/form definition |
| Crease | Wrinkles, folds, hard lines |
| Grab | Large form adjustments |
| Inflate/Deflate | Volume control |
| Scrape | Planar flattening (hard surface sculpt) |
| Dam Standard | Sharp damage, scratches |
| Layer | Non-destructive detail (if available) |

##### Detail Pass Order

1. **Primary** — Major form corrections (Grab, Clay)
2. **Secondary** — Muscle, folds (Clay Strips, Crease)
3. **Tertiary** — Skin texture, scales (Draw, Alpha)
4. **Micro** — Pores, fine scratches (Alpha, Dam Standard)

##### Alpha Workflow

- Use tileable alphas for skin, leather, rock
- Stamp at consistent scale for texel coherence
- Combine alphas with different brush strengths
- Bake alpha detail to normal map for game assets

##### Hard Surface Sculpting

- Scrape brush for planar surfaces
- Crease for panel line softening
- Dam Standard for impact damage
- Trim brushes for precise cuts (if addon available)
- Always retopologize or rebake after hard surface sculpt

##### Damage & Wear

| Damage Type | Technique |
|-------------|-----------|
| Scratches | Dam Standard, light strokes |
| Dents | Inflate negative + smooth |
| Chipped edges | Scrape + Crease |
| Rust bubbles | Small Draw buildup |
| Fabric wear | Crease along stress points |

##### Performance

- Hide unrelated objects during sculpt
- Use matcap for fast feedback
- Subdivide only active area (face, hands)
- Bake and reduce multires for viewport performance

##### MCP Integration

1. Duplicate base mesh to sculpt collection via MCP
2. Add multires modifier via MCP
3. Query polycount at each subdivision level
4. Export high-poly for bake handoff
5. Keep sculpt mesh separate from game mesh

##### Handoff to Retopology

Before retopo handoff provide:
- Final sculpt at highest multires level
- Decimated version for retopo reference
- List of deformation zones requiring clean loops
- Baked maps if bake-before-retopo workflow

##### Constraints

###### MUST DO
- Start from clean base mesh with good topology
- Work largest to smallest detail
- Duplicate before sculpt destructive changes
- Bake detail for game assets
- Match detail level to camera distance

###### MUST NOT DO
- Sculpt lowpoly-style assets
- Skip retopology for animated game characters
- Subdivide entire mesh to level 6+ uniformly
- Leave dyntopo mesh as final game asset
- Sculpt without reference

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Brush settings | `references/brush-guide.md` | Detail pass |
| Bake workflow | `../texture-workflow/SKILL.md` | Game asset handoff |

### `.claude/skills/retopology/SKILL.md`
_Production retopology for animation-ready, low-poly, quad-dominant meshes with proper edge loops and efficient polygon flow. Use after sculpting or high-poly modeling before rigging and UV work in Blender via MCP._

#### Retopology

Clean, purposeful topology for deformation, UVs, and performance. Quad-dominant. Animation-ready.

##### When to Use

- After sculpting high-poly characters/creatures
- Before rigging any deforming mesh
- Poly reduction while preserving silhouette
- Fixing topology from boolean or scan cleanup

##### Workflow

```
High-Poly Reference → Guide Setup → Block Retopo → Loop Refinement
    → Pole Placement → Triangle Cleanup → Validation → UV Handoff
```

##### Retopology Methods

| Method | Best For | Speed |
|--------|----------|-------|
| Manual (Poly Build tool) | Hero characters | Slow, best quality |
| Shrinkwrap retopo | Creatures, organic | Medium |
| Quad Remesh (voxel) | Quick blockout retopo | Fast, needs cleanup |
| Instant Meshes (external) | Background assets | Fast |
| Symmetry retopo | Bilateral characters | Medium |

**Production default:** Manual with shrinkwrap for hero; Quad Remesh + cleanup for background.

##### Edge Loop Rules

- Loops follow muscle/deformation direction
- One loop per major form change
- Maintain even edge length in deformation zones
- Redirect loops at poles (minimum 3 edges meeting)
- Hide poles at back of head, armpits, groin

##### Pole Management

| Location | Acceptable | Avoid |
|----------|------------|-------|
| Top of head | 3–5 pole | — |
| Inner eye corner | Redirect pole | Pole directly at corner |
| Shoulder | 3-edge pole hidden | Star pattern on deltoid |
| Back of knee | Pole in crease | Pole on front of knee |

##### Triangle Policy

- Triangles OK on non-deforming static mesh
- Convert tris to quads on face, joints, fingers
- No n-gons on deforming surfaces
- Tris at hidden areas (scalp under hair, mouth interior)

##### Polycount Targets

See `../references/polycount-budgets.md`. Retopo is where budget is enforced.

##### Shrinkwrap Retopo Setup

```
1. Duplicate high-poly to reference collection (hidden in render)
2. Create retopo mesh with Poly Build / manual extrude
3. Shrinkwrap modifier → Target: high-poly
4. Snap to face with project individual elements
5. Validate shrinkwrap distance (no intersection)
```

##### Validation Checklist

- [ ] Quad-dominant on all deformation areas
- [ ] Edge loops support planned rig joints
- [ ] No non-manifold geometry
- [ ] Silhouette matches high-poly reference
- [ ] Polycount within budget
- [ ] Poles placed at acceptable locations
- [ ] Mesh manifold and watertight (if required)

##### MCP Integration

1. Create retopo mesh object via MCP
2. Apply shrinkwrap modifier via MCP
3. Query face/edge count during retopo
4. Compare silhouette via MCP render/query
5. Transfer to `COL_Geo_LowPoly` collection

##### Constraints

###### MUST DO
- Retopo before rigging deforming meshes
- Preserve silhouette vs high-poly reference
- Plan loops for facial expressions (characters)
- Enforce polycount budget
- Validate manifold before UV pass

###### MUST NOT DO
- Auto-retopo without manual cleanup (hero assets)
- Leave n-gons on deformation surfaces
- Skip validation against reference
- Retopo without knowing rig requirements
- Uniform density (more density at face/hands)

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Facial retopo | `references/facial-retopo.md` | Character faces |
| Game vs cinematic | `references/game-cinematic-topo.md` | Budget decisions |

### `.claude/skills/uv-workflow/SKILL.md`
_Production UV unwrapping for seam placement, UV packing, texel density, UDIM, lightmap UVs, and modular UV layouts. Use when preparing meshes for texturing and engine export in Blender via MCP._

#### UV Workflow

Efficient UV layouts with consistent texel density. Seams at hidden edges. Engine-ready.

##### When to Use

- After topology locked, before texturing
- Modular kit UV atlas planning
- Lightmap UV channel setup
- UDIM workflows for hero assets

##### Workflow

```
UV Planning → Seam Marking → Unwrap → Texel Density Check
    → Pack → Mirror/Overlap Decision → Lightmap UV (if needed) → Validation
```

##### Seam Placement Rules

Place seams at:
- Back of head, spine centerline
- Inner arms, inner legs
- Bottom of chin, underside of objects
- Panel edges on hard surface (construction seams)
- Hidden areas under clothing/overlaps

Never place seams on:
- Face (front)
- Primary gameplay-visible surfaces
- Deforming joint centers (relocate to nearby hidden area)

##### Texel Density

**Formula:** `Texel Density = Texture Resolution / UV Island Size in UV space`

Target consistency across visible surfaces:

| Asset Tier | Target TD (px/m) |
|------------|------------------|
| Hero | 512–1024 px/m |
| Standard | 256–512 px/m |
| Background | 128–256 px/m |

Use same density for modular kit pieces sharing atlas.

##### Unwrap Methods

| Method | Use When |
|--------|----------|
| Smart UV Project | Quick blockout UVs only |
| Follow Active Quads | Strip UVs (roads, limbs) |
| Cube Project | Boxy hard surface |
| Lightmap Pack | Lightmap channel |
| Manual seam + Unwrap | Production default |

##### UV Packing

- Margin: 0.002–0.01 UV units (engine dependent)
- Rotate islands for maximum packing efficiency
- Group islands by material ID
- Keep related islands near each other in UV space
- Use UVPackmaster or native pack for production

##### Mirrored UVs

- Mirror UVs for symmetrical characters (save texture space)
- Offset mirrored islands slightly if engine requires unique bakes
- Mark mirrored halves in object naming: `_L` / `_R` meshes if separate

##### UDIM Workflow

For hero assets exceeding single 4K texture:
- Tile 1001: head
- Tile 1002: torso
- Tile 1003: limbs
- Document tile assignment in production brief

##### Lightmap UVs

Second UV channel requirements:
- No overlapping islands
- Consistent texel density less critical
- Larger margin (0.02+) for light bleed prevention
- Pack separately from texture UVs

##### Modular UV Atlas

```
1. Plan shared atlas resolution (2048/4096)
2. Assign UV islands per module to atlas regions
3. Trim sheet regions for repeating detail
4. Vertex color variation for module differentiation
5. Document atlas layout for texture artist
```

##### MCP Integration

1. Mark seams via MCP if supported
2. Execute unwrap via MCP
3. Query UV island count and pack efficiency
4. Assign UV channels via MCP
5. Validate no overlapping UVs (except intentional mirror)

##### Validation Checklist

- [ ] No unintended overlapping UVs
- [ ] Consistent texel density on visible surfaces
- [ ] Seams hidden at gameplay angles
- [ ] UV islands within 0–1 (or UDIM tiles assigned)
- [ ] Lightmap channel separate if required
- [ ] Pack efficiency > 75%

##### Constraints

###### MUST DO
- Plan UVs before final modeling (topology informed by UV needs)
- Maintain texel density consistency
- Hide seams at logical construction edges
- Create lightmap UVs for baked lighting pipelines
- Document atlas layout for modular kits

###### MUST NOT DO
- Smart UV Project as final production UVs
- Overlapping UVs on unique surface detail (unless mirrored)
- Inconsistent texel density on same asset tier
- Seams across faces or primary visible surfaces
- Skip packing margins

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Texel density calc | `references/texel-density.md` | Hero assets |
| Trim sheets | `references/trim-sheets.md` | Modular kits |

### `.claude/skills/materials/SKILL.md`
_Blender PBR and stylized material creation for metal, wood, concrete, fabric, glass, dirt, rust, and procedural shaders. Use for look development, material reuse, and production shading in Blender via MCP._

#### Materials

Production shading with material reuse. PBR-accurate or intentionally stylized. Minimal unique materials.

##### When to Use

- Look development after UVs
- Procedural material creation
- Master material library setup
- Material variation from shared masters
- Engine export material preparation

##### Workflow

```
Master Materials → Instance Variations → Object Assignment
    → Vertex Color/Mask Setup → Validation → Export Prep
```

##### Master Material Library

Create reusable masters in `MAT_` prefix:

| Master | Base Setup |
|--------|------------|
| MAT_Metal_Base | Principled: Metallic 1, adjustable Roughness |
| MAT_Plastic_Base | Principled: Metallic 0, Specular 0.5 |
| MAT_Fabric_Base | Principled + Sheen |
| MAT_Glass_Base | Principled: Transmission 1, IOR 1.45 |
| MAT_Emissive_Base | Principled: Emission strength variable |
| MAT_Organic_Base | Subsurface scattering enabled |

Instance variations: duplicate master, adjust parameters only.

##### PBR Value Ranges

| Material | Metallic | Roughness | Notes |
|----------|----------|-----------|-------|
| Polished metal | 1.0 | 0.1–0.3 | |
| Brushed metal | 1.0 | 0.4–0.6 | Anisotropic if available |
| Painted metal | 0.0 | 0.3–0.5 | Base color = paint |
| Plastic | 0.0 | 0.3–0.6 | |
| Rubber | 0.0 | 0.7–0.9 | |
| Concrete | 0.0 | 0.8–0.95 | |
| Wood (raw) | 0.0 | 0.5–0.7 | |
| Glass | 0.0 | 0.0 | Transmission 1 |
| Skin | 0.0 | 0.4–0.6 | Subsurface 0.1–0.3 |
| Fabric | 0.0 | 0.7–0.9 | Sheen |

##### Procedural Material Patterns

**Wear mask:** Noise → ColorRamp → Lerp between clean/worn
**Edge wear:** Bevel node → Pointiness or Ambient Occlusion
**Dirt accumulation:** AO inverted → multiply with dirt color
**Rust:** Noise mask on metal → orange/brown color override

##### Material Count Budget

| Asset Type | Max Materials |
|------------|---------------|
| Hero prop | 3–5 |
| Standard prop | 1–2 |
| Modular piece | 1 (atlas) |
| Character | 3–8 (body, cloth, eyes, hair) |
| Environment module | 1–2 |

##### Vertex Color Usage

- RGB: variation masks (wear, moss, color variation)
- R: wear amount, G: dirt, B: wetness
- Document channel usage in material notes

##### Stylized Materials

See stylized-style skill. Key differences:
- Flatten roughness range
- Hand-painted base color priority
- Rim light via Fresnel mix
- NPR toon shaders if project requires

##### MCP Integration

1. Create material slots via MCP
2. Assign materials to objects via MCP
3. Set principled BSDF parameters via MCP
4. Query material count per scene
5. Verify material names follow convention

##### Constraints

###### MUST DO
- Reuse master materials; instance variations
- Name materials `MAT_[Surface]_[Descriptor]`
- Match PBR values to style skill direction
- Limit material count per asset budget
- Test materials in target lighting setup

###### MUST NOT DO
- Unique material per object (unless hero)
- PBR values outside physically plausible range (realistic style)
- Skip vertex color masks for variation
- Leave default material names
- Finalize materials before UVs complete

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Surface recipes | `references/surface-recipes.md` | Specific materials |
| Procedural nodes | `references/procedural-patterns.md` | Wear, dirt, variation |

### `.claude/skills/texture-workflow/SKILL.md`
_Production texture workflow for atlases, baking AO/curvature/normal/roughness maps, decals, and texture memory optimization. Use for game-ready texture pipelines in Blender via MCP._

#### Texture Workflow

Bake high-poly detail to efficient texture sets. Optimize memory. Engine-ready outputs.

##### When to Use

- Baking sculpt detail to normal maps
- Creating texture atlases for modular kits
- PBR texture set generation
- Decal placement and blending
- Texture memory optimization

##### Workflow

```
High/Low Poly Setup → Cage Setup → Bake Maps → Composite
    → Atlas Pack → Engine Format Export → Validation
```

##### Standard PBR Texture Set

| Map | Format | Notes |
|-----|--------|-------|
| Base Color | sRGB PNG | No embedded AO |
| Normal | Linear PNG | OpenGL convention unless engine specifies |
| Roughness | Linear PNG | Single channel |
| Metallic | Linear PNG | Single channel |
| AO | Linear PNG | Multiply in shader, not base color |
| Height | Linear PNG | Optional parallax |
| Emission | sRGB PNG | Mask-based |
| ORM Packed | Linear PNG | R=AO, G=Roughness, B=Metallic (Unreal) |

Naming: `T_[Asset]_[Map]` per `../references/naming-conventions.md`

##### Bake Setup

```
1. Low-poly mesh with UVs (active)
2. High-poly mesh (sculpt or detail) — selected
3. Cage extrusion: 0.01–0.05m (adjust per asset scale)
4. Ray distance: match cage
5. Bake margin: 16px minimum
6. Anti-aliasing: enabled
```

##### Maps to Bake

| Map | Source | Priority |
|-----|--------|----------|
| Normal | High→Low | Required |
| AO | High or low (cavity) | Required |
| Curvature | High sculpt | Wear masks |
| Position | High | Optional (blending) |
| Thickness | Subsurface meshes | Characters |

##### Texture Atlas Strategy

Modular kits share one atlas:
```
1. All modules UV'd to shared 0–1 or UDIM space
2. Bake each module to atlas regions
3. Trim sheet areas for repeating detail
4. Single material references atlas
5. Document region map for artists
```

##### Decals

- Decal mesh projected on surface
- Separate UV channel or atlas region
- Blend via alpha mask
- Limit decal overdraw in engine

##### Memory Optimization

| Technique | Savings |
|-----------|---------|
| ORM packing | 3 textures → 1 |
| Shared atlas | N materials → 1 texture |
| Lower res on hidden surfaces | 50%+ memory |
| BC compression in engine | 4:1 or 6:1 |
| Trim sheets | Reuse detail across assets |

##### Resolution Guidelines

See `../references/polycount-budgets.md` texture section.

##### MCP Integration

1. Setup bake objects via MCP
2. Configure bake settings via MCP if supported
3. Export baked images via MCP
4. Assign baked textures to materials via MCP
5. Query texture count and resolution

##### Validation Checklist

- [ ] Normal map correct orientation (test in engine)
- [ ] No UV seams visible in bake
- [ ] AO not baked into base color
- [ ] Consistent texel density in final textures
- [ ] Texture resolution within budget
- [ ] Files named per convention
- [ ] sRGB vs Linear correctly assigned

##### Constraints

###### MUST DO
- Bake high-poly detail before discarding sculpt
- Use cage for clean normal bakes
- Pack ORM for engine efficiency
- Test normal map orientation in target engine
- Document atlas regions for modular kits

###### MUST NOT DO
- Bake without cage on complex shapes
- Embed AO in base color (PBR standard)
- Exceed texture budget without LOD justification
- Use inconsistent normal map conventions
- Skip margin in bake settings

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Bake troubleshooting | `references/bake-troubleshooting.md` | Bake artifacts |
| ORM packing | `references/orm-packing.md` | Unreal/Unity export |

### `.claude/skills/lookdev/SKILL.md`
_Look development loop for Blender assets combining materials, lighting, camera, and screenshot comparison until shading reads correctly via MCP._

#### Lookdev

Material + light + camera loop. Screenshot compare. Stop when it reads.

##### When to Use

- Finalizing asset shading before export/portfolio
- Turntable / grey shader checks
- Matching material references
- Bridging `materials` and `lighting` intentionally

##### Workflow

```
Clay/grey pass → Base materials → Neutral light rig
  → Beauty light → Screenshot → Gap list → Iterate (≤3–5)
  → Optional grade → QA
```

##### Standard Rigs

| Rig | Use |
|-----|-----|
| Neutral 3-point | Evaluate materials fairly |
| HDRI studio | Product / character |
| In-situ scene lights | Final context |

Keep a reusable `COL_Lookdev_Lights` + `CAM_Lookdev_*`.

##### Checklist

- [ ] Values read in grayscale
- [ ] Specular roughness believable
- [ ] Edges catch light (bevels/normals)
- [ ] Emissive under control
- [ ] No pure black / pure white traps unless stylized
- [ ] Matches reference palette if provided

##### Iteration Rule

Each pass: change one major variable (material OR light OR camera), then screenshot.

##### Constraints

###### MUST DO
- Grey pass before fancy textures when forms unsure
- Capture screenshots each iteration
- Hand off to `qa-review` before ship

###### MUST NOT DO
- Fix modeling problems only with roughness maps
- Infinite tweak loops without gap list

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Lookdev Rig | `references/lookdev-rig.md` | When needed |
| Lookdev Checklist | `references/lookdev-checklist.md` | When needed |

### `.claude/skills/lighting/SKILL.md`
_Cinematic and game lighting in Blender including three-point lighting, HDRI, horror lighting, volumetrics, rim lighting, and mood-driven illumination. Use for look development and scene atmosphere via MCP._

#### Lighting Artist

Mood-driven illumination. Guide player attention. Support art direction.

##### When to Use

- Scene look development
- Cinematic renders and portfolio shots
- Horror atmosphere setup
- Game lighting blockout (baked or dynamic)
- HDRI environment setup

##### Workflow

```
Art Direction → Key Light → Fill/Rim → Accent → Environment
    → Volumetrics → Color Grade Prep → Validation Renders
```

##### Three-Point Lighting

| Light | Purpose | Typical Setup |
|-------|---------|---------------|
| Key | Primary illumination | 45° above, 30° side |
| Fill | Shadow softening | Opposite key, 1/2–1/4 intensity |
| Rim | Subject separation | Behind subject, bright edge |

Naming: `LGT_Key_Main`, `LGT_Fill_Soft`, `LGT_Rim_Back`

##### Light Types

| Type | Use Case |
|------|----------|
| Sun | Outdoor directional |
| Area | Soft studio, windows |
| Spot | Flashlights, stage, horror |
| Point | Bulbs, emissive fill |

##### Color Temperature

| Mood | Kelvin | RGB Approx |
|------|--------|------------|
| Candle/warm | 1800K | Orange |
| Tungsten | 3200K | Warm white |
| Daylight | 5500K | Neutral white |
| Overcast | 6500K | Cool white |
| Moonlight | 8000K+ | Blue |

Horror: mix warm interior tungsten with cold exterior moonlight.

##### HDRI Workflow

```
1. Select HDRI matching mood (overcast for horror, clear for hero)
2. Rotate to place brightest area as key
3. Adjust strength (0.5–2.0 typical)
4. Supplement with area lights for subject separation
5. Hide HDRI in background if using solid color/fog
```

##### Horror Lighting

See horror-style skill. Key techniques:
- High contrast; deep shadows
- Single source motivation (one visible lamp)
- Flicker via noise modifier on strength
- Volumetric fog for light shafts
- Avoid flat even illumination

##### Volumetrics

```
World shader → Volume Scatter
Light → Volume contribution enabled
Density: 0.01–0.1 (subtle to heavy fog)
Anisotropy: 0.3–0.8 for visible light shafts
```

##### Game vs Cinematic

| Aspect | Game | Cinematic |
|--------|------|-----------|
| Light count | Minimal (performance) | Unlimited |
| Baked | Lightmaps common | Path trace |
| Dynamic | Real-time shadows | Ray traced |
| Mood | Gameplay readability | Artistic freedom |

##### MCP Integration

1. Create lights with naming convention via MCP
2. Set color, intensity, angle via MCP
3. Configure world HDRI via MCP
4. Query light count and types
5. Organize in `COL_Lights` collection

##### Constraints

###### MUST DO
- Motivate every light source (visible fixture or logical source)
- Name lights `LGT_[Role]_[Descriptor]`
- Test readability of gameplay-critical areas
- Match lighting to style skill (horror, realistic, etc.)
- Separate lighting collections from geometry

###### MUST NOT DO
- Flat ambient without direction
- Over-light horror scenes
- Ignore color temperature consistency
- Place lights without purpose
- Skip volumetric consideration for mood scenes

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Horror setups | `references/horror-lighting-setups.md` | Horror scenes |
| Cinematic rigs | `references/cinematic-light-rigs.md` | Portfolio renders |

### `.claude/skills/rendering/SKILL.md`
_Blender rendering with Cycles and Eevee including sampling, denoising, camera setup, render passes, color management, and render optimization. Use for final output and look validation via MCP._

#### Rendering

Appropriate engine selection. Optimized settings. Production render passes.

##### When to Use

- Final portfolio/cinematic renders
- Look development validation
- Render pass output for compositing
- Game asset preview renders (Turntable)
- Style validation (realistic vs stylized)

##### Engine Selection

| Engine | Use When |
|--------|----------|
| Cycles | Final quality, realistic, portfolio |
| Eevee | Real-time preview, stylized, game look dev |
| Eevee Next | Improved real-time quality (Blender 4+) |

##### Workflow

```
Camera Setup → Render Settings → Sample Tests → Full Render
    → Pass Output → Color Management → Delivery
```

##### Camera Setup

Naming: `CAM_[Shot]_[Number]`
- Focal length: 35mm (environment), 85mm (hero detail), 24mm (wide horror)
- Depth of field: subject distance focused
- Composition: rule of thirds; leading lines
- Turntable: empty parent rotating 360° for asset preview

##### Cycles Settings

| Setting | Preview | Production |
|---------|---------|------------|
| Samples | 64–128 | 512–2048 |
| Denoise | OpenImageDenoise | OpenImageDenoise |
| Max bounces | 8 | 12 |
| Caustics | Off (default) | On if glass/water hero |

##### Eevee Settings

| Setting | Value |
|---------|-------|
| Screen Space Reflections | On for metals |
| Ambient Occlusion | On |
| Bloom | Stylized/ emissive scenes |
| Shadow resolution | 2048+ |
| Contact Shadows | Ground contact |

##### Render Passes

| Pass | Use |
|------|-----|
| Combined | Final composite |
| Diffuse Direct/Indirect | Relighting |
| Glossy | Reflection control |
| Normal | Compositing effects |
| AO | Contact shadow enhancement |
| Z (Depth) | DOF, fog in comp |
| Cryptomatte | Object masking |
| Emission | Screen glow effects |

##### Color Management

```
View Transform: AgX (Blender 4+) or Filmic
Look: Medium Contrast (default) or High Contrast (dramatic)
Exposure: Adjust in compositor, not by blowing lights
```

##### Render Optimization

- Use render region for test crops
- Adaptive sampling (Cycles)
- Disable unseen objects in render layers
- GPU rendering default when available
- Persistent data for animation sequences

##### Asset Turntable Template

```
1. CAM_Turntable at 3/4 height, 45° angle
2. Empty at asset origin → rotate animation 0–360° (120 frames)
3. 3-point lighting rig
4. Render 1280×1280 or project-specified resolution
5. Output PNG sequence or MP4
```

##### Reference Image Validation

When matching a photo/concept (`../references/reference-image-match.md`):

| Setting | Reference match |
|---------|-----------------|
| Hero camera | Match reference angle before grading |
| AgX Look | Base Contrast default; High Contrast if reference is punchy |
| Exposure | 0.15–0.45 typical; hull must read, not clip white |
| Preview playback | EEVEE, motion blur off, `taa_samples` 1–8 |
| Final still | Render at hero `CAM_*` — compare to reference |
| Compare tool | `get_viewport_screenshot` or bpy render still |

Run `../references/visual-match-checklist.md` before delivery.

##### MCP Integration

1. Configure render engine settings via MCP
2. Setup camera via MCP
3. Trigger test render via MCP if supported
4. Query render settings validation
5. Set output paths via MCP

##### Constraints

###### MUST DO
- Match render engine to project style
- **Screenshot or render compare** when reference image was provided
- Use denoising for Cycles production renders
- Setup color management before final render
- Render validation turntable for hero assets
- Organize cameras in `COL_Cameras`

###### MUST NOT DO
- Production render without sample test
- Ignore color management (sRGB vs Linear)
- Render at excessive resolution without purpose
- Skip render passes when compositing planned
- Use Cycles for real-time game preview needs

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Pass compositing | `references/render-passes.md` | Multi-pass output |
| NPR/stylized render | `references/npr-rendering.md` | Stylized-style projects |
| Reference image match | `../references/reference-image-match.md` | Photo/concept attached |
| Visual match validation | `../references/visual-match-checklist.md` | Before delivery |

### `.claude/skills/camera-cinematography/SKILL.md`
_Cinematic camera work in Blender including framing, lenses, composition, camera animation, and shot language beyond basic rendering setup via MCP._

#### Camera Cinematography

Intentional framing. Lens language. Motivated camera moves. Shot-ready cameras.

##### When to Use

- Cinematic stills and turntables with purpose
- Animated camera moves (dolly, crane, orbit, handheld)
- Matching reference camera / lens feel
- Shot layout for lookdev and portfolio

##### Workflow

```
Shot intent → Camera + target empty → Lens/FOV → Composition
  → Focus/DoF → Move (if animated) → Viewport check → Render/comp
```

##### Naming

- `CAM_[Shot]_[Angle]`
- `EMPTY_CamTarget_[Shot]`
- Collection: `COL_Cameras`

##### Lens Guide

| Feel | Focal (FF equiv) | Notes |
|------|------------------|-------|
| Wide establishing | 18–28mm | Distortion; watch edges |
| Story / product | 35–50mm | Natural |
| Portrait / hero | 85–135mm | Compression |
| Tele drama | 150mm+ | Flat space |

Sensor fit and resolution affect FOV — set camera sensor intentionally.

##### Composition Checklist

- [ ] Subject readable in silhouette
- [ ] Headroom / lead room intentional
- [ ] Horizon level (unless motivated)
- [ ] Foreground / mid / background depth
- [ ] Avoid tangent mergers on edges

##### Camera Animation

| Move | Use |
|------|-----|
| Orbit | Product / character showcase |
| Dolly in | Reveal / tension |
| Crane | Scale / establishing |
| Handheld noise | Documentary / horror unease |
| Locked off | Archviz / product purity |

Animate camera + target empties; prefer slow ease-in/out.

##### DoF

- Focus on primary subject empty
- F-stop for style: shallow for hero, deeper for environments
- Preview in Eevee; final in Cycles if needed

##### Constraints

###### MUST DO
- Name cameras and targets
- Match aspect ratio to delivery
- Check framing at start, mid, end of moves

###### MUST NOT DO
- Default 50mm for every shot without intent
- Animate FOV wildly unless motivated
- Crop critical silhouette out of frame

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Lens And Composition | `references/lens-and-composition.md` | When needed |
| Camera Move Library | `references/camera-move-library.md` | When needed |
| Dof Guide | `references/dof-guide.md` | When needed |

### `.claude/skills/rigging/SKILL.md`
_Production rigging in Blender with armatures, IK/FK, constraints, weight painting, mechanical rigs, facial rigs, and drivers. Use before animation on deforming assets via MCP._

#### Rigging

Functional rigs supporting intended motion. Clean deformation. Engine-compatible bone hierarchies.

##### When to Use

- Character/creature deformation rigs
- Mechanical constraint rigs
- Facial expression rigs
- Prop rigs (doors, vehicles, weapons)
- Before any animation work

##### Workflow

```
Skeleton Design → Bone Placement → Hierarchy → Constraints/IK
    → Weight Painting → Deformation Test → Export Prep
```

##### Armature Naming

Prefix: `ARM_[AssetName]`
Bones: `[side]_[region]_[name]` — e.g., `L_arm_upper`, `spine_01`, `jaw`

##### Bone Hierarchy

```
ARM_Character
├── root
├── spine_01 → spine_02 → spine_03
│   ├── L_clavicle → L_arm_upper → L_arm_lower → L_hand
│   └── R_clavicle → R_arm_upper → R_arm_lower → R_hand
├── L_leg_upper → L_leg_lower → L_foot → L_toe
└── R_leg_upper → R_leg_lower → R_foot → R_toe
```

##### IK vs FK

| Use IK | Use FK |
|--------|--------|
| Legs (ground contact) | Spine (flexible arc) |
| Arms (hand placement) | Shoulder overlap |
| Feet planting | Finger detail |
| Mechanical reach | Whip/tail motion |

Standard: IK legs, FK spine; switchable arms for game characters.

##### Constraints

| Constraint | Use |
|------------|-----|
| IK | Limb positioning |
| Copy Rotation | Mechanical sync |
| Limit Rotation | Joint ranges |
| Stretch To | Tentacles, pistons |
| Child Of | Weapon attach/detach |
| Shrinkwrap | Ground contact (use carefully) |

##### Weight Painting

```
1. Automatic weights as starting point only
2. Clean weights: normalize per vertex (max 4 influences)
3. Smooth problematic areas (shoulders, hips)
4. Test extreme poses: T-pose, arms up, crouch, jaw open
5. Gradient weights at joints — no hard 1.0/0.0 at bend center
```

##### Mechanical Rigs

- Empty objects as control handles
- Constraints instead of weight painting
- Hinge limits match real joint ranges
- Parent hierarchy mirrors mechanical assembly

##### Facial Rigs

| Approach | Use Case |
|----------|----------|
| Bone-based | Game characters |
| Shape keys | Cinematics, dialog |
| Hybrid | Hero game characters |

Minimum game facial: jaw open, blink L/R, brow up/down.

##### Drivers

- Gear rotation sync
- Auto eyelid blink
- Weapon reload mechanism
- Procedural antenna/wire motion

##### MCP Integration

1. Create armature via MCP
2. Parent mesh with automatic weights via MCP
3. Query bone count and hierarchy
4. Validate weight groups via MCP if supported
5. Export armature with mesh via export-pipeline

##### Deformation Test Poses

- T-pose / A-pose (bind pose)
- Arms fully raised
- Deep crouch
- Neck rotation extremes
- Jaw wide open (characters)

##### Constraints

###### MUST DO
- Rig after retopology complete
- Name bones consistently
- Limit bone influences to 4 per vertex (game engines)
- Test deformation at extremes before animation
- Document control scheme for animators

###### MUST NOT DO
- Auto weights without cleanup (hero assets)
- Scale bones in bind pose
- Rig before topology validated
- Skip IK pole targets on limbs
- Mix multiple root bones without documentation

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Humanoid rig | `references/humanoid-rig.md` | Characters |
| Mechanical rig | `references/mechanical-rig.md` | Props, vehicles |

### `.claude/skills/animation/SKILL.md`
_Game-ready animation in Blender including walk/run/idle cycles, combat, mechanical animation, camera animation, constraints, Graph Editor, and NLA workflows via MCP._

#### Animation

Game-ready motion with clean keyframes. Readable silhouettes in motion. Engine-compatible export.

##### When to Use

- Character locomotion (walk, run, idle)
- Combat animations
- Mechanical/prop animation
- Camera animation
- Object animation with constraints

##### Workflow

```
Reference → Blocking → Breakdown → Splining → Polish
    → Cycle Validation → NLA Strip → Export
```

##### Locomotion Cycles

| Cycle | Key Poses | Frames (30fps) |
|-------|-----------|----------------|
| Walk | Contact, Down, Pass, Up × 2 | 24–32 |
| Run | Contact, Drive, Flight, Recovery | 16–24 |
| Idle | Breathe, weight shift, blink | 60–120 loop |

Naming: `AN_[Char]_[Action]_[Variant]`

##### Animation Principles (Applied)

1. **Timing** — Weight through spacing
2. **Arcs** — Natural limb paths
3. **Overlap** — Secondary motion offset
4. **Anticipation** — Wind-up before action
5. **Exaggeration** — Style-dependent (see style skills)

##### Mechanical Animation

- Use constraints over bone deformation
- Hinge: Limit Rotation constraint
- Pistons: Stretch-to or Copy Location
- Gears: Driver for synchronized rotation
- Doors: Empty pivot + rotation keyframes

##### Graph Editor Workflow

```
1. Block stepped keys (Constant interpolation)
2. Splining: Bezier with auto handles
3. Ease: Weighted handles for acceleration
4. Cycle: Copy first/last frame; verify loop seam
5. Clean: Remove redundant keys
```

##### NLA for Game Export

```
1. Action created and named per convention
2. Push down to NLA strip
3. Strip set to Repeat for cycles
4. Single strip active for export
5. Scale: 1.0; no NLA time remapping unless intentional
```

##### Camera Animation

- Smooth Bezier interpolation always
- Avoid sudden direction changes
- Match focal length to subject scale
- Camera shake: noise modifier on location (subtle)

##### MCP Integration

1. Insert keyframes via MCP if supported
2. Query action names and frame ranges
3. Validate bone/object animation data exists pre-export
4. Set frame range via MCP
5. Export animation with rig via export-pipeline

##### Game-Ready Requirements

- [ ] Root motion decision documented (in-place vs root motion)
- [ ] Loop seam invisible (walk/idle/run)
- [ ] No bone scale keyframes (engine issues)
- [ ] Animation length matches engine state machine
- [ ] Facial animation on separate action layer if needed
- [ ] Frame rate: 30fps default (confirm project spec)

##### Constraints

###### MUST DO
- Reference video for locomotion
- Block in stepped mode before splining
- Name actions `AN_` prefix
- Test cycle loop before export
- Match animation style to art direction

###### MUST NOT DO
- Linear interpolation on organic motion
- Scale keyframes on rig bones
- Over-animate idle (subtle is better)
- Export without action assigned to NLA
- Skip root motion documentation

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Walk cycle breakdown | `references/walk-cycle.md` | Locomotion |
| Combat timing | `references/combat-animation.md` | Action games |

### `.claude/skills/geometry-nodes/SKILL.md`
_Blender Geometry Nodes for procedural modeling, scatter systems, vegetation, buildings, pipes, cables, and reusable node groups. Use for procedural asset generation and instancing pipelines via MCP._

#### Geometry Nodes

Reusable procedural systems. Parametric assets. Performance-aware instancing.

##### When to Use

- Scatter systems (rocks, vegetation, debris)
- Parametric buildings, roads, pipes, cables
- Procedural variation without unique modeling
- Kit assembly with randomization
- Non-destructive iteration on large scenes

##### Workflow

```
Define Parameters → Build Node Tree → Create Node Group (GN_)
    → Test Variations → Bake/Instance Decision → Export Integration
```

##### Node Group Standards

- Prefix: `GN_[System]_[Descriptor]`
- Expose only necessary inputs (seed, density, scale range)
- Document input ranges in group name or custom properties
- Version node groups: `GN_Scatter_Rocks_v02`

##### Core Patterns

###### Scatter System
```
Mesh Surface → Distribute Points on Faces → Instance on Points
    → Randomize Rotation (Z) → Randomize Scale → Realize (optional)
```

###### Building Generator
```
Floor Count (input) → Repeat Mesh → Stack Instances
    → Window Cut Pattern → Material Variation → Output
```

###### Cable/Pipe Routing
```
Curve Input → Curve to Mesh (profile) → Subdivide → Set Material
    → Multiple curves from single path node
```

###### Rock Formation
```
Ico Sphere → Displace (noise) → Decimate → Instance Scatter
```

##### Randomization

| Parameter | Typical Range |
|-----------|---------------|
| Scale | 0.8–1.2 (uniform or per-axis) |
| Rotation Z | 0–360° |
| Density | 0.1–2.0 per m² |
| Seed | Integer for reproducibility |

Always expose seed as group input for art direction iteration.

##### Performance Rules

| Scenario | Approach |
|----------|----------|
| Game export | Realize instances → decimate → export mesh |
| Background scatter | Keep instanced; limit count |
| Hero procedural | Bake to static mesh for engine |
| Viewport preview | Limit instance count attribute |

##### Reusable Systems Library

| Group | Purpose |
|-------|---------|
| GN_Scatter_Objects | Generic surface scatter |
| GN_Array_Modular | Linear modular repetition |
| GN_Curve_Pipe | Pipe/cable along curve |
| GN_Wall_Variant | Parametric wall sections |
| GN_Vegetation_Cluster | Tree/bush clustering |

##### MCP Integration

1. Create geometry nodes modifier via MCP
2. Configure group inputs via MCP
3. Query instance count and final polycount
4. Realize geometry for export via MCP
5. Organize GN objects in dedicated collection

##### Integration with Export

Before export:
1. Apply geometry nodes modifier OR
2. Realize instances and merge OR
3. Export as instances if engine supports (Unreal HISM)

Document which approach per target engine.

##### Constraints

###### MUST DO
- Create reusable node groups, not one-off trees
- Expose seed and density as inputs
- Test at min/max parameter extremes
- Realize/bake before game export unless engine supports instances
- Name groups with `GN_` prefix

###### MUST NOT DO
- Million-instance scatter without LOD/culling plan
- Nested realize operations (performance killer)
- Hardcode values that should be inputs
- Export procedural without polycount validation
- Skip variation testing at boundary values

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Scatter recipes | `references/scatter-systems.md` | Environment scatter |
| Building generators | `references/building-generators.md` | Architectural procedural |

### `.claude/skills/export-pipeline/SKILL.md`
_Production export from Blender to FBX, GLTF, OBJ, USD, and Alembic with scale, pivot, rotation, normals, materials, animation, and collision verification via MCP._

#### Export Pipeline

Verified, engine-ready exports. Correct scale, axis, pivots, and data.

##### When to Use

- Final asset delivery
- Engine import preparation
- Animation/rig export
- Batch export of modular kits

##### Pre-Export Gate

**Required:** asset-optimization validation PASS before export.

##### Workflow

```
Validation PASS → Export Settings → Test Export → Engine Verify
    → Fix Issues → Final Export → Documentation
```

##### Format Selection

| Format | Best For |
|--------|----------|
| FBX | Unreal, Unity (legacy), animation |
| GLTF/GLB | Web, Godot, modern Unity |
| OBJ | Static mesh interchange (no rig) |
| USD | Pipelines, VFX, multi-asset |
| Alembic | VFX caches, sculpt animation |

##### FBX Settings (Game Default)

```
Scale: 1.0
Apply Scalings: FBX All
Forward: -Z Forward
Up: Y Up
Apply Unit: ON
Mesh: ON
Armature: ON (if rigged)
Bake Animation: ON (if animated)
Path Mode: Copy (embed textures)
```

##### GLTF Settings

```
Format: GLB (single file) or GLTF Separate
Include: Selected Objects
Transform: +Y Up
Compression: Draco (if supported by engine)
```

##### Export Verification Matrix

| Check | Method |
|-------|--------|
| Scale | Measure known dimension in engine |
| Pivot | Verify floor contact / grip point |
| Forward axis | Compare to engine convention |
| Normals | Check shading in engine |
| Materials | Verify slot count and textures |
| Animation | Play action in engine |
| Collision | Import COL_ mesh separately |

##### Engine-Specific Notes

###### Unreal Engine
- Scale 1.0 = 1cm in UE (confirm project; may need 0.01 export scale)
- Import normals and tangents
- Separate collision mesh import
- LOD naming for auto-LOD: `SM_Asset_LOD0`

###### Unity
- Scale 1.0 typically correct
- GLTF preferred for modern pipelines
- Humanoid rig mapping for characters

###### Godot
- GLTF/GLB preferred
- +Y up default

##### Collision Export

```
1. Export render mesh separately from collision
2. Collision: simple convex or box
3. Name: SM_Asset_COL
4. No materials on collision mesh
5. Apply transforms before export
```

##### Animation Export

- Single action per export file (or document action list)
- Sample rate: 30fps default
- Bake constraints before export
- Include armature + skinned mesh in same file
- No unapplied scale on rig

##### Batch Export (Modular Kits)

```
1. Select COL_Export collection
2. Export each module OR combined atlas per project spec
3. Maintain consistent origin per module type
4. Document grid snap points in README
```

##### MCP Integration

1. Select export collection via MCP
2. Configure export settings via MCP
3. Execute export via MCP
4. Verify output file exists
5. Log export settings in delivery documentation

##### Delivery Documentation Template

```markdown
## Export Package: [Asset Name]

**Format:** FBX / GLTF
**Scale:** 1 Blender unit = 1 meter
**Forward:** -Y / +X (document actual)
**Files:**
- SM_Asset.fbx
- T_Asset_BC.png, T_Asset_N.png, ...

**Import Notes:**
- [Engine-specific steps]

**Validation:** PASS — [date]
```

##### Constraints

###### MUST DO
- Pass asset-optimization before export
- Apply transforms on export objects
- Test import in target engine
- Document scale and axis conventions
- Export collision separately for games

###### MUST NOT DO
- Export with unapplied scale
- Export without validation
- Mix collision and render in same export without documentation
- Assume default FBX settings work for all engines
- Export all modifiers without testing engine result

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Engine import | `references/engine-import.md` | First import test |
| Validation | `../references/validation-checklist.md` | Pre-export gate |

### `.claude/skills/unity-export/SKILL.md`
_Unity-specific Blender export for scale, axis, materials, humanoid/generic rigs, LODs, and collision import via MCP._

#### Unity Export

Unity-ready transforms, materials, LODs, and collision. Prefer GLB/GLTF for modern; FBX for legacy/animation.

##### When to Use

- Shipping assets to Unity
- Humanoid character export
- Prefab-oriented mesh splits and LODs

##### Pre-Flight

1. `asset-optimization` PASS
2. `lod-pipeline` if LODs required
3. `collision-proxy` if physics required
4. Apply transforms; correct pivots

##### Recommended Formats

| Case | Format |
|------|--------|
| Static mesh modern | GLB |
| Animated / humanoid | FBX |
| Simple props | GLB or FBX |

##### Transform Defaults

```
Unit: Meters (Unity 1 unit = 1m)
Forward: -Z (Blender) → verify in Unity
Scale Factor: 1.0 (fix if model tiny/huge)
```

##### Materials

- Prefer single material slots matching Unity workflow
- Metallic-Roughness for GLTF
- Embed or provide textures beside FBX
- Name materials `MAT_` consistently

##### Characters

- T-pose or A-pose per project
- Root bone at origin; hips correctly placed
- Humanoid: clear bone naming; test Avatar mapping
- Export animations as separate clips when needed

##### LODs & Collision

- LOD Group naming: `SM_Name_LOD0..N` or Unity LOD Group meshes
- Collision: convex meshes or Unity primitive colliders from proxies
- See `collision-proxy` for UCX-style naming if using FBX conventions

##### Verify in Unity

- [ ] Scale vs reference cube
- [ ] Pivot / prefab placement
- [ ] Normals / tangents
- [ ] Materials assigned
- [ ] LOD transitions
- [ ] Animator clips (if any)

##### Constraints

###### MUST DO
- Validate before export
- Document scale factor used
- Test import once before declaring done

###### MUST NOT DO
- Assume FBX settings without project convention
- Leave unused high-poly LODs in prefab

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Unity Checklist | `references/unity-checklist.md` | When needed |
| Unity Materials | `references/unity-materials.md` | When needed |

### `.claude/skills/unreal-export/SKILL.md`
_Unreal Engine-specific Blender export for FBX scale, LODs, UCX collision, sockets, materials, and skeletal mesh workflows via MCP._

#### Unreal Export

UE-ready FBX. Correct centimeter scale awareness. UCX collision. LOD and socket naming.

##### When to Use

- Static mesh or skeletal mesh to Unreal
- UCX/UCLX collision export
- LOD chain import
- Socket / pivot setup for gameplay

##### Pre-Flight

1. `asset-optimization` PASS
2. `lod-pipeline` for LOD0–N
3. `collision-proxy` for UCX meshes
4. Apply scale; pivots at intended UE origin

##### Scale Note

Unreal is centimeter-based. Common approaches:
- Model in meters in Blender, export FBX with unit conversion / 0.01 awareness per project pipeline
- Or work to project-documented scale and verify with a 100cm reference

**Always measure a known edge after import.**

##### FBX Defaults (Static)

```
Selected Objects
Apply Scalings: FBX All
Forward: -Z Forward
Up: Y Up
Mesh: ON
Smoothing: Face
```

##### Naming for UE

| Type | Pattern |
|------|---------|
| Static mesh | `SM_Name` |
| Skeletal | `SK_Name` |
| Skeleton | `SKEL_Name` |
| LOD | `SM_Name_LOD0` … |
| Collision | `UCX_SM_Name_01` |
| Socket empty | `SOCKET_Name` |

##### Collision

- Prefer convex UCX pieces over complex mesh colliders
- Multiple UCX meshes supported
- See `collision-proxy`

##### Skeletal

- UE mannequin-oriented proportions when required
- Root bone; no leftover Blender deform leftovers
- Export morph targets if needed (shape keys)

##### Verify in Unreal

- [ ] Scale (door ~200cm, character ~180cm)
- [ ] Collision wireframe
- [ ] LODs auto-detected
- [ ] Materials / texture sampling
- [ ] Sockets transform

##### Constraints

###### MUST DO
- Confirm scale with known-dimension test
- Prefix collision with `UCX_`
- Validate LODs and materials after import

###### MUST NOT DO
- Export without collision plan for physics actors
- Mix unit systems undocumented

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Unreal Checklist | `references/unreal-checklist.md` | When needed |
| Ucx Naming | `references/ucx-naming.md` | When needed |

### `.claude/skills/godot-export/SKILL.md`
_Godot-specific Blender export favoring GLTF/GLB with correct scale, materials, animation clips, and collision shapes via MCP._

#### Godot Export

GLTF/GLB first. Clean nodes. Godot-friendly materials and animation.

##### When to Use

- Shipping meshes/animations to Godot 4.x
- GLB single-file props and characters
- Simple collision companions

##### Pre-Flight

1. `asset-optimization` PASS
2. Apply transforms; Y-up friendly hierarchy
3. Materials metallic-roughness compatible

##### Format

| Case | Format |
|------|--------|
| Default | GLB |
| Editable sidecar textures | GLTF separate |

##### Settings

```
Format: GLB
+Y Up
Apply Modifiers: ON (when final)
Animation: include when needed
```

##### Hierarchy

- Root empty or object named for scene root
- Avoid deep useless empties
- Keep collision meshes clearly named `COL_` / `UCX_` style

##### Materials

- Principled BSDF → GLTF PBR
- Pack images or keep relative paths consistent
- Emission only where intended

##### Animation

- NLA or actions exported as clips
- Name actions `AN_[Clip]`
- Root motion documented if used

##### Verify in Godot

- [ ] Scale
- [ ] Import materials
- [ ] Animation libraries
- [ ] Collision shapes

##### Constraints

###### MUST DO
- Prefer GLB unless project says otherwise
- Test import once
- Keep naming consistent with `naming-conventions.md`

###### MUST NOT DO
- Rely on Blender-only shader nodes that do not export

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Godot Checklist | `references/godot-checklist.md` | When needed |

### `.claude/skills/asset-optimization/SKILL.md`
_Validates and optimizes Blender assets for polycount, topology, UV efficiency, material count, naming, collections, and game-ready performance. Use before export on all production assets via MCP._

#### Asset Optimization

Enforce budgets. Clean geometry. Game-ready validation gate before export.

##### When to Use

- Before every export
- After modeling complete
- LOD generation
- Scene-wide performance audit
- Pre-delivery validation

##### Workflow

```
Audit → Identify Issues → Fix → Re-Audit → LOD Generation → Validation Report
```

##### Audit Checklist

Run via MCP scene queries where possible:

###### Geometry
- [ ] Triangle count vs budget (`../references/polycount-budgets.md`)
- [ ] Duplicate vertices merged
- [ ] Loose geometry removed
- [ ] Non-manifold fixed
- [ ] Interior faces deleted
- [ ] Applied transforms (scale 1,1,1)

###### UVs
- [ ] Pack efficiency > 75%
- [ ] Texel density consistent
- [ ] No unintended overlaps

###### Materials
- [ ] Count within budget
- [ ] No unused slots
- [ ] Names follow `MAT_` convention

###### Organization
- [ ] All objects named `SM_` prefix
- [ ] Collections organized per convention
- [ ] Collision meshes in `COL_Collision`

##### Optimization Techniques

| Issue | Fix |
|-------|-----|
| Over budget | Remove unseen geo, decimate, bake detail |
| High triangle count on flat surfaces | Reduce subdiv/bevel segments |
| Many draw calls | Merge materials; atlas textures |
| Repeated geometry | Convert to instances |
| Heavy modifiers | Apply and merge strategically |

##### LOD Generation

```
LOD0: Full detail (hero)
LOD1: 50% tris — remove micro-bevels, small greebles
LOD2: 25% tris — decimate modifier; preserve silhouette
LOD3: 10% tris — impostor/card or simple proxy
```

Naming: `SM_Asset_LOD0`, `SM_Asset_LOD1`, etc.

Use Decimate modifier:
- Planar mode for hard surface
- Collapse mode for organic
- Always verify silhouette after decimate

##### Modifier Cleanup

Before export:
1. Apply stack OR export with modifiers per engine support
2. Remove unused modifiers
3. Collapse mirror/array if instances not needed
4. Document which modifiers remain live

##### Scene Audit Report Template

```markdown
## Optimization Report: [Asset/Scene]

**Total Triangles:** [count] (budget: [target])
**Draw Calls (materials):** [count]
**Objects:** [count]
**Issues Fixed:** [list]

### Per-Object Breakdown
| Object | Tris | Materials | Status |
|--------|------|-----------|--------|
| SM_... | ... | ... | PASS/FAIL |
```

##### MCP Integration

1. Query polycount per object via MCP
2. Query material count via MCP
3. Run cleanup operations via MCP
4. Generate LOD duplicates via MCP
5. Validate naming conventions via MCP scene tree

##### Constraints

###### MUST DO
- Run full validation before export
- Document polycount in production brief
- Create LODs for hero assets in games
- Fix all non-manifold before export
- Output validation report

###### MUST NOT DO
- Export without budget check
- Decimate deforming meshes without testing
- Remove collision proxies
- Skip naming convention validation
- Optimize hero face/hands below animation needs

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Full validation | `../references/validation-checklist.md` | Final gate |
| Polycount budgets | `../references/polycount-budgets.md` | Budget setting |
| LOD strategies | `references/lod-strategies.md` | LOD creation |

### `.claude/skills/lod-pipeline/SKILL.md`
_Dedicated LOD generation, naming, screen-size targets, and validation for game meshes in Blender via MCP._

#### LOD Pipeline

Intentional LOD chains. Preserve silhouette. Validate reductions.

##### When to Use

- Game assets needing LOD0–N
- Batch LOD for modular kits
- Before Unity/Unreal/Godot export

##### Workflow

```
Approve LOD0 → Generate LOD1..N → Fix silhouette breaks
  → Naming → Screen-size table → Export verify
```

##### Typical Budgets (guide)

| LOD | Tris vs LOD0 | Keep |
|-----|--------------|------|
| LOD0 | 100% | Full detail |
| LOD1 | 40–60% | Major forms |
| LOD2 | 15–30% | Silhouette |
| LOD3 | 5–10% | Blob / impostor candidate |

Tune per asset importance and camera.

##### Generation Methods

1. **Decimate (planar/collapse)** — fast props
2. **Manual retopo low** — hero characters/vehicles
3. **Delete interiors / small parts** — vehicles, buildings
4. **Bake normals from LOD0 → low** — when detail must move to texture

##### Naming

```
SM_Asset_LOD0
SM_Asset_LOD1
SM_Asset_LOD2
```

Collection: `COL_LODs_[Asset]`

##### Validation Checklist

- [ ] Silhouette matches at intended distance
- [ ] No major holes / inverted normals
- [ ] UVs still valid (or rebaked)
- [ ] Materials slots consistent across LODs
- [ ] Vertex colors/UVs needed by shader preserved
- [ ] LOD transitions planned (screen size %)

##### Screen Size Starters

| LOD | Screen size (UE-like guide) |
|-----|-----------------------------|
| LOD0 | 1.0 – 0.5 |
| LOD1 | 0.5 – 0.25 |
| LOD2 | 0.25 – 0.1 |
| LOD3 | 0.1 – 0.0 |

##### Constraints

###### MUST DO
- Protect silhouette before poly reduction
- Keep LOD0 as source of truth
- Document budgets in production brief

###### MUST NOT DO
- Blind decimate until unrecognizable
- Different material slot counts across LODs without reason

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Lod Budgets | `references/lod-budgets.md` | When needed |
| Lod Validation | `references/lod-validation.md` | When needed |

### `.claude/skills/qa-review/SKILL.md`
_Production QA gate for Blender assets using viewport screenshots, validation checklists, naming audits, and ship/no-ship verdicts via MCP._

#### QA Review

Screenshot-backed review. Checklist gate. Explicit ship / no-ship.

##### When to Use

- Before export or handoff
- After major modeling/lookdev milestones
- Reference-match final compare
- Periodic scene health checks

##### Workflow

```
Gather brief budgets → Screenshot key angles → Run checklists
  → List defects (severity) → Fix or reject → Re-verify → Verdict
```

##### Required Screenshots

1. 3/4 hero angle
2. Ortho or profile if proportion-critical
3. Wireframe or poly overview (optional but useful)
4. Material/light beauty
5. Vs reference (if reference task)

Use `get_viewport_screenshot` via MCP when connected.

##### Checklists (load as needed)

- `../references/validation-checklist.md`
- `../references/visual-match-checklist.md` (reference tasks)
- `../references/naming-conventions.md`
- `../references/polycount-budgets.md`

##### Defect Severity

| Level | Meaning |
|-------|---------|
| Blocker | Wrong scale, broken normals, fails budget badly |
| Major | Silhouette/readability issues, bad pivots |
| Minor | Naming, minor shading, small gaps |
| Note | Optional polish |

##### Verdict Template

```markdown
## QA Verdict: [Asset]

**Result:** SHIP / SHIP WITH NOTES / NO-SHIP
**Budgets:** [tris/textures] vs target
**Screenshots:** [listed]
**Blockers:** ...
**Majors:** ...
**Minors:** ...
**Next actions:** ...
```

##### Constraints

###### MUST DO
- Give explicit verdict
- Attach or capture screenshots for visual claims
- Re-check after fixes before flipping to SHIP

###### MUST NOT DO
- Rubber-stamp without screenshots on visual tasks
- Ignore budget overruns without approval

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Qa Verdict Template | `references/qa-verdict-template.md` | When needed |
| Screenshot Angles | `references/screenshot-angles.md` | When needed |

### `.claude/skills/scene-assembly/SKILL.md`
_Large scene layout in Blender with collections, linking, overrides, streaming-friendly organization, and set assembly via MCP._

#### Scene Assembly

Layouts that scale. Clear collections. Linking/overrides for big sets.

##### When to Use

- Levels, dioramas, cinematic sets
- Assembling modular kits into spaces
- Library linking / collection instances
- Outliner structure for team scenes

##### Workflow

```
Block layout (greybox) → Modular assemble → Set dressing
  → Lighting volumes → Cameras → QA pass → Optimize visibility
```

##### Collection Structure

```
COL_Layout
COL_Modular_Geo
COL_SetDressing
COL_Lights
COL_Cameras
COL_FX
COL_Collision
COL_Trash / COL_Ref
```

##### Linking Strategy

| Approach | When |
|----------|------|
| Collection instance | Repeated modular pieces |
| Library link + override | Shared hero assets across scenes |
| Append | One-off ownership transfer |

Prefer non-destructive linking for repeated kits.

##### Layout Rules

1. Greybox scale and navigation first
2. Snap to grid for modular kits
3. Hide heavy collections while dressing
4. Keep world origin meaningful (level zero)

##### Performance Hygiene

- Instance repeated meshes
- Cull unseen interiors
- Separate streaming volumes if game-oriented
- Avoid unique high materials on every duplicate

##### Handoff

- Dressing → `set-dressing`
- Mood → `lighting` + style skill
- Gate → `qa-review`

##### Constraints

###### MUST DO
- Establish collection hierarchy early
- Greybox before final dressing
- Name cameras and light groups

###### MUST NOT DO
- Dump everything in Scene Collection
- Apply library overrides casually without need
- Duplicate hero meshes instead of instancing

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Collection Template | `references/collection-template.md` | When needed |
| Linking Overrides | `references/linking-overrides.md` | When needed |

## Appendix D — Other skills (as budget allows)

### `.claude/skills/analog-found-footage-horror/SKILL.md`
_Analog, VHS, CRT, and found-footage horror aesthetics for Blender shots including camera imperfections and documentary framing._

#### Analog / Found Footage Horror

Documentary camera. Tape damage. Dead channels. Corporate/educational uncanny.

##### Tenets
1. Handheld / locked security cam language
2. Timestamp / tracking UI optional (comp)
3. VHS blur, chroma bad, tracking lines
4. Mundane spaces made wrong
5. Less monster, more implication

### `.claude/skills/anime-style/SKILL.md`
_Anime and cel-shaded art direction for Blender with hard color breaks, toon shaders, clean silhouettes, and anime proportion language._

#### Anime Style

Hard color breaks. Clean silhouettes. Cel shading. Anime proportion language.

##### When to Use

- Anime / cel-shaded characters and props
- Toon shader lookdev
- Hard shadow graphic looks (not soft PBR)

##### Core Tenets

1. **Flat tonal regions** — 2–4 value steps max per material
2. **Hard shadow terminators** — Specular as graphic shapes
3. **Line / silhouette clarity** — Optional freestyle or inverted hull
4. **Proportion language** — Eyes, hair masses, simplified anatomy
5. **Palette discipline** — Limited hues; accent sparingly

##### Shading Approach

| Method | Use |
|--------|-----|
| Shader Toon / ColorRamp on diffuse | Fast Eevee/Cycles toon |
| Emission + ramp | Graphic unlit regions |
| Freestyle / grease pencil lines | Contours |
| Solidify inverted hull | Thick outlines |

##### Modeling Notes

- Simplify secondary forms; hair as masses
- Creases where color breaks need support
- Avoid noisy micro detail fighting flat shading

##### Lighting

- Single clear key for graphic shadows
- Rim optional for separation
- Avoid heavy soft GI wash unless intentional

##### Vs stylized-style

- `stylized-style` = broad NPR / hand-painted
- `anime-style` = cel breaks, anime proportions, toon stack

##### Constraints

###### MUST DO
- Limit value steps
- Keep silhouette iconic
- Test with toon lighting early

###### MUST NOT DO
- Full PBR roughness noise as primary look
- Over-subsurface that melts cel breaks

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Cel Shader Setup | `references/cel-shader-setup.md` | When needed |
| Anime Proportion | `references/anime-proportion.md` | When needed |

### `.claude/skills/apocalypse-worlds/SKILL.md`
_Apocalyptic and dystopian world art direction for Blender including post-apocalyptic, zombie, alien invasion, post-human, dystopian, and utopian contrast sets._

#### Apocalypse / Dystopia Worlds

Collapse language: scavenged materials, faded brands, improvised repairs.

##### Lanes
Post-apoc wasteland · Zombie cities · Alien invasion damage · Dystopian control · Utopian veneer · Post-human ruins

### `.claude/skills/archviz/SKILL.md`
_Architectural visualization in Blender for interiors/exteriors with real-world scale, camera composition, PBR materials, and still/animation delivery via MCP._

#### Archviz

Real-world scale architecture. Clean cameras. Believable materials. Delivery stills.

##### When to Use

- Interior/exterior architectural presentations
- Real-estate style stills and simple walkthroughs
- Material/lighting lookdev for spaces

##### Workflow

```
CAD/scale check → Greybox → Final modeling → Materials
  → Cameras → Lighting (HDRI + practicals) → Render → Comp
```

##### Scale & Modeling

- Millimeter–meter accuracy where specs exist
- Straight verticals; controlled bevels on visible edges
- Separate glass, frames, furniture collections

##### Cameras

- Verticals corrected (shift) for exteriors when needed
- 24–35mm interiors common; avoid extreme wide unless intentional
- Use `camera-cinematography`

##### Lighting

- HDRI for exteriors / window light
- Practical lamps as mesh lights
- Soft GI; avoid game-style single harsh key unless styled

##### Delivery

- High-res stills; optional depth/mist for comp
- `compositing` for exposure polish
- Keep layered EXR for revisions

##### Constraints

###### MUST DO
- Verify real-world scale early
- Lock cameras before heavy grade
- Keep glass/IOR plausible

###### MUST NOT DO
- Game lowpoly shortcuts on hero archviz plates
- Over-saturate materials

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Archviz Camera | `references/archviz-camera.md` | When needed |
| Archviz Lighting | `references/archviz-lighting.md` | When needed |

### `.claude/skills/biome-worlds/SKILL.md`
_Biome and setting art direction for Blender covering underwater, desert, arctic, jungle, underground, and floating-island environments._

#### Biome Worlds

Climate drives palette, fog, vegetation density, and material wear.

### `.claude/skills/body-horror-style/SKILL.md`
_Body horror art direction for Blender focusing on flesh wrongness, mutation, fusion, and visceral material storytelling._

#### Body Horror

Flesh as wrong material. Fusion. Mutation. Uncomfortable sympathy.

##### Tenets
1. Anatomy almost-right then broken
2. Material transitions: skin→meat→metal→plastic
3. Moist specular sparingly (not gore porn by default)
4. Human recognition remains (uncanny)
5. Coordinate with creature-artist / sculpting

### `.claude/skills/brutalist-mood/SKILL.md`
_Brutalist and concrete-monument mood direction for Blender architecture and scenes with raw concrete, monumental scale, and austere composition._

#### Brutalist Mood

Monumental concrete. Austere. Human small. Few materials.

### `.claude/skills/cartoon-style/SKILL.md`
_Cartoon art direction for Blender with squash-stretch readable shapes, bold colors, and graphic silhouettes for games and animation._

#### Cartoon Style

Bold shapes. Graphic color. Readability over realism.

##### When to Use
- Cartoon games / animated props and characters
- Exaggerated silhouettes and expressions
- When anime cel language is too specific

##### Tenets
1. Silhouette first
2. Exaggerated proportions
3. Limited palette, bold accents
4. Soft or graphic shading (project choice)
5. Detail in shapes, not micro-PBR

##### Handoff
`character-artist` / `prop-artist` → `materials` → `lookdev`

##### Reference Guide
| Topic | Reference |
|-------|-----------|
| Shape language | `references/cartoon-shape-language.md` |

### `.claude/skills/character-archetypes/SKILL.md`
_Character archetype art direction for Blender covering fantasy races, horror creatures, roles (knight, assassin, detective), and body types (mecha, android, chibi, etc.)._

#### Character Archetypes

Use this skill to lock silhouette, materials, and proportion language for a role/race before modeling.

##### Load refs for family
Fantasy ancestries · Horror undead/monsters · Sci-fi bodytypes · Role kits (knight, ninja, detective, etc.)

### `.claude/skills/character-artist/SKILL.md`
_AAA character modeling for human anatomy, stylization, facial topology, clothing, hair, and animation-ready meshes. Use for game characters, facial expressions, and production character assets in Blender via MCP._

#### Character Artist

Production character modeling with animation-ready topology. Anatomy-accurate or intentionally stylized.

##### When to Use

- Human/humanoid character creation
- Facial topology for expressions
- Clothing and accessory modeling
- Hair card systems or stylized hair
- Character proportion and stylization

##### Workflow

```
Reference → Proportion Blockout → Body Forms → Limb Connection
    → Facial Features → Edge Loop Planning → Detail Pass
    → Clothing (separate mesh) → UV Handoff → Rig Handoff
```

##### Proportion Standards

| Type | Head Units | Notes |
|------|------------|-------|
| Realistic adult | 7.5–8 heads | Hero characters |
| Stylized | 4–6 heads | Exaggerated features |
| Heroic | 8–9 heads | Action games |

Always block proportions before detail.

##### Edge Loop Strategy

Critical loop locations:
- Eyes: concentric loops for blink/expression
- Mouth: 3-loop minimum for lip deformation
- Jaw: loop following jaw line for open/close
- Shoulders: deltoid loop for arm raise
- Elbows/knees: 3-loop pinching pattern
- Hips: loop for leg spread

See `references/facial-topology.md` for face-specific loops.

##### Facial Structure

- Eye socket: recessed; brow ridge defined
- Nose: bridge width matches inner eye distance (realistic)
- Mouth: lower lip fuller than upper (realistic)
- Ear: aligns eye brow to nose base
- Skull underlying forms visible in stylization

##### Clothing Workflow

1. Model body first (or use mannequin)
2. Duplicate body faces for clothing base
3. Solidify/extrude for cloth thickness
4. Separate mesh: `SM_Char_[Name]_Body`, `SM_Char_[Name]_Cloth_[Piece]`
5. Cloth does NOT share UVs with body
6. Weight paint transfers from body (via rigging skill)

##### Hair Approaches

| Method | Use Case | Skill |
|--------|----------|-------|
| Hair cards | Game-realistic | uv-workflow + texture-workflow |
| Strand curves | Cinematic | particle/curve systems |
| Stylized mesh | Lowpoly/stylized | blender-modeler |
| Sculpted | Hero bake | sculpting → retopology |

##### Animation-Ready Requirements

- Quad-dominant topology on deformation zones
- No poles on primary deformation areas (relocate to hidden zones)
- Even edge length in face/neck/joints
- Separate objects for swap-able parts (head, hands, gear)

##### MCP Integration

1. Create base mannequin/blockout via MCP
2. Build body with mirror modifier via MCP
3. Query topology (face count, edge flow) at checkpoints
4. Separate clothing meshes via MCP
5. Organize character collection hierarchy

##### Constraints

###### MUST DO
- Establish proportions before facial detail
- Plan edge loops for planned deformations
- Separate clothing/accessories as unique meshes
- Match style skill direction (stylized vs realistic)
- Validate topology before rigging handoff

###### MUST NOT DO
- Triangles on primary deformation surfaces
- Poles at corner of mouth or inner eye
- Single mesh for body + hard surface armor (separate)
- Skip reference for facial likeness work
- Over-poly face before LOD planning

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Facial topology | `references/facial-topology.md` | Face modeling |
| Body proportions | `references/body-proportions.md` | Blockout |
| Pipeline | `../references/asset-pipeline.md` | Phase context |

##### Style Integration

| Style | Adjustment |
|-------|------------|
| realistic-style | Full anatomy; 8-head proportion |
| stylized-style | Exaggerated features; 4–5 heads |
| lowpoly-style | Minimal loops; painted detail |
| horror-style | Uncanny proportions; asymmetry |

### `.claude/skills/chibi-style/SKILL.md`
_Chibi and SD proportion art direction for Blender characters with oversized heads, simplified anatomy, and cute silhouette rules._

#### Chibi Style

Big head. Short body. Maximum appeal silhouette.

##### Ratios
Head often 1/2 to 1/3 of total height. Simplify fingers. Large eyes optional by genre.

### `.claude/skills/cloth-sim/SKILL.md`
_Garment blockout, cloth simulation, pin groups, and bake to shape keys or caches for characters and props in Blender via MCP._

#### Cloth Sim

Garment blockout → sim → art-direct → bake. Stable pins. Engine-friendly caches/shape keys.

##### When to Use

- Dresses, capes, coats, flags, banners
- Character clothing that needs drape
- Baking sim to shape keys or Alembic/USD caches
- Pre-roll settling before animation export

##### Workflow

```
Garment mesh (quad-friendly) → Vertex groups (pin/collide)
  → Cloth modifier settings → Collision objects
  → Pre-roll settle → Sim pass → Art-direct fixes
  → Bake shape keys / cache → Cleanup → Export
```

##### Mesh Prep

- Quads preferred; even density on deforming areas
- Avoid long skinny triangles on folds
- Apply scale before sim
- Separate garment from body collider

##### Vertex Groups

| Group | Purpose |
|-------|---------|
| `PIN_Cloth` | Anchors (waist, shoulders, collar) |
| `COL_Ignore` | Optional non-colliding regions |
| `STIFF_High` | Belts, seams that should resist stretch |

##### Settings Starters

| Look | Quality | Speed | Bending |
|------|---------|-------|---------|
| Soft dress | 8–12 | 1.0 | Low |
| Stiff coat | 5–8 | 1.0 | Higher |
| Flag/cape | 8–10 | 1.0–1.5 | Low–mid |

Tune mass and air viscosity for scale. Always run a settle pre-roll.

##### Bake Targets

| Target | Use |
|--------|-----|
| Shape keys | Game poses / few frames |
| Alembic/USD | Cinematic caches |
| Armature weights | If converting to deform-only |

##### Constraints

###### MUST DO
- Apply scale; define pin groups before long sims
- Collide against simplified body capsule/mesh
- Art-direct after sim (sculpt/corrective keys)

###### MUST NOT DO
- Sim hero cloth on ultra-dense sculpt meshes
- Skip pre-roll (starts mid-air / exploding)
- Export raw unstable caches

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Cloth Settings Presets | `references/cloth-settings-presets.md` | When needed |
| Pin And Collide | `references/pin-and-collide.md` | When needed |
| Bake Targets | `references/bake-targets.md` | When needed |

### `.claude/skills/collision-proxy/SKILL.md`
_Collision proxy authoring for games including UCX/UHX naming, convex hulls, capsules, and simple collider meshes in Blender via MCP._

#### Collision Proxy

Simple, stable colliders. Prefer primitives and convex pieces over render mesh.

##### When to Use

- Game physics / blocking volumes
- Unreal UCX export
- Unity mesh or primitive colliders
- Hitboxes for interactables

##### Workflow

```
Identify collision needs → Build proxies → Name correctly
  → Test overlaps → Export with render mesh
```

##### Collider Types

| Type | Use |
|------|-----|
| Box | Crates, walls, simple props |
| Capsule | Characters, poles |
| Sphere | Balls, soft approximates |
| Convex hull | Organic / irregular single body |
| Multiple convex (UCX) | Vehicles, complex props |

##### Unreal Naming

```
UCX_SM_Asset_01
UCX_SM_Asset_02
```

- Must match associated mesh naming rules for auto-association
- Convex only for UCX

##### Unity Notes

- Prefer engine primitives when possible
- Mesh colliders: convex toggle for dynamic rigidbodies
- Keep proxy collection exportable

##### Authoring Rules

1. Slightly smaller than visual mesh to reduce snagging (project-dependent)
2. No holes; watertight convex pieces
3. Apply scale
4. Origin aligned with render mesh
5. Collection: `COL_Collision_[Asset]`

##### Validation

- [ ] Player cannot fall through intended blockers
- [ ] No huge invisible walls beyond mesh
- [ ] Wheel/character capsules oriented correctly
- [ ] Named for target engine

##### Constraints

###### MUST DO
- Prefer few simple shapes over one complex mesh
- Match engine naming conventions
- Keep proxies in dedicated collection

###### MUST NOT DO
- Use render LOD0 as physics mesh by default
- Non-convex UCX for Unreal auto-convex workflows

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Collider Recipes | `references/collider-recipes.md` | When needed |
| Engine Naming | `references/engine-naming.md` | When needed |

### `.claude/skills/comic-book-style/SKILL.md`
_Comic book and graphic-novel art direction for Blender with ink-line emphasis, halftone cues, and high-contrast framing._

#### Comic Book Style

Ink-ready contrast. Panel-friendly staging. Halftone optional.

##### Tenets
1. High contrast lighting for ink read
2. Strong contour / crease support
3. Limited screentone / hatch language in textures or comp
4. Hero poses and camera angles
5. Speeds lines / impacts as FX meshes when needed

##### Reference Guide
| Topic | Reference |
|-------|-----------|
| Ink & tone | `references/ink-tone.md` |

### `.claude/skills/compositing/SKILL.md`
_Blender compositor workflows for beauty stacks, render passes, color grade, glare, and delivery outputs via MCP._

#### Compositing

Pass-aware beauty stack. Subtle grade. Delivery-ready outputs.

##### When to Use

- Final beauty composites from Cycles/Eevee
- Grade, glare, vignette, chromatic subtlety
- Pass recombination (diffuse, glossy, volume, cryptomatte)
- Shot delivery plates

##### Workflow

```
Enable passes → Render multilayer EXR (or needed passes)
  → Compositor graph → Grade → FX (glare/fog glow)
  → Output viewer + File Output → Validate exposure
```

##### Recommended Passes

| Pass | Use |
|------|-----|
| Beauty / Combined | Base |
| DiffCol / DiffDir / DiffInd | Relight flexibility |
| GlossDir / GlossCol | Spec control |
| Volume | Smoke/fire isolation |
| Cryptomatte Object/Material | Isolations |
| Mist | Depth grade / fog |

##### Beauty Stack (Default)

```
Combined
  → Exposure / Color Balance (AgX-aware)
  → Glare (fog glow / streaks sparingly)
  → Lens distortion (subtle)
  → Vignette (subtle)
  → Output
```

##### Grade Rules

1. Fix exposure before creative grade
2. Prefer lift/gamma/gain or color balance over crushed curves
3. Keep skin/product hues plausible
4. Match reference stills with side-by-side

##### Outputs

- `OUT_Beauty_[Shot]`
- Optional: `OUT_Alpha`, `OUT_CryptoID`
- Prefer EXR for archival; PNG/JPEG for review

##### Constraints

###### MUST DO
- Grade on view transform–aware pipeline (AgX)
- Keep creative FX reversible in node graph
- Document exposure/look settings

###### MUST NOT DO
- Crush blacks to hide lighting problems
- Over-glare every bright pixel
- Flatten multilayer to JPEG as only archive

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Pass Stack | `references/pass-stack.md` | When needed |
| Grade Presets | `references/grade-presets.md` | When needed |
| Delivery Outputs | `references/delivery-outputs.md` | When needed |

### `.claude/skills/cosmic-eldritch-horror/SKILL.md`
_Cosmic, eldritch, and Lovecraftian horror art direction for Blender with non-Euclidean cues, impossible scale, and incomprehensible forms._

#### Cosmic / Eldritch Horror

Incomprehensible scale. Wrong geometry. Void pressure.

##### Tenets
1. Scale mismatch (tiny human vs vast form)
2. Suggestive detail — never fully explain the monster
3. Non-Euclidean architecture cues
4. Color: abyssal blues, sickly golds, void blacks
5. Sound-design-friendly spaces (long falls, vast chambers)

### `.claude/skills/cozy-wholesome-mood/SKILL.md`
_Cozy, cute, wholesome, relaxing, and peaceful mood direction for Blender assets and scenes._

#### Cozy / Wholesome Mood

Warm light. Soft shapes. Safe clutter. Low threat.

##### Tenets
1. Warm keys / soft fill
2. Rounded prop language
3. Clutter = comfort, not hazard
4. Gentle palettes
5. Cameras at friendly eye height

### `.claude/skills/creature-artist/SKILL.md`
_AAA creature modeling for fantasy, aliens, monsters, and organic creature design with believable anatomy and movement. Use for creature blockouts, muscle flow, bone structure, and animation-ready creature assets in Blender via MCP._

#### Creature Artist

Believable creature design grounded in anatomy. Movement-informed topology. Fantasy with physical plausibility.

##### When to Use

- Fantasy creatures, monsters, aliens
- Quadrupeds, flying creatures, aquatic forms
- Hybrid designs (part animal, part mechanical)
- Boss creatures, enemies, companions

##### Design Principles

1. **Anatomy grounding** — Even fantasy references real biology
2. **Silhouette first** — Unique readable shape
3. **Movement logic** — Skeleton supports intended motion
4. **Muscle flow** — Surface forms follow underlying structure
5. **Storytelling** — Design communicates behavior (predator/prey/scavenger)

##### Workflow

```
Reference → Skeleton Blockout → Muscle Masses → Surface Forms
    → Detail (sculpt or model) → Retopology → Rig → Animation Test
```

##### Creature Types

| Type | Skeleton Base | Key Forms |
|------|---------------|-----------|
| Quadruped | Dog/horse reference | Shoulder hump, haunches |
| Biped | Human/primate | Upright spine, heel plant |
| Flying | Bat/bird | Wing membrane, keel chest |
| Aquatic | Fish/shark | Lateral line, fin placement |
| Serpentine | Snake | Ribcage segmentation |
| Insectoid | Arthropod | Segmented body, jointed legs |

##### Muscle Flow

- Origin → Insertion direction visible in surface
- Flexed areas: compressed forms, overlapping skin
- Extended areas: stretched, thinner surface
- Fat deposits: soft transitions (belly, cheeks)
- Scars/armor: break muscle flow intentionally

##### Bone Structure Planning

Before surface modeling:
1. Place joint locations (spine segments, limbs)
2. Verify range of motion at each joint
3. Ensure limb attachment supports gait cycle
4. Head/neck connection supports attack/look poses

##### Surface Detail Tiers

| Tier | Detail | Method |
|------|--------|--------|
| Primary | Overall mass | Blockout/sphere modeling |
| Secondary | Muscle groups | Sculpt or extrusion |
| Tertiary | Skin folds, veins | Sculpt |
| Micro | Scales, pores, scars | Sculpt + bake to normal |

##### Hybrid Creatures

Mechanical + organic:
- Separate meshes: `SM_Creature_Bio`, `SM_Creature_Mech`
- Hard surface joints at organic/mechanical transition
- Rig: mechanical parts use constraints; organic uses weights

##### MCP Integration

1. Create skeleton blockout (armature or mesh guides) via MCP
2. Build primary masses with mirror/sphere modeling
3. Hand off to sculpting for detail pass
4. Query proportions against reference scale figure
5. Organize bio/mechanical collections separately

##### Constraints

###### MUST DO
- Reference real anatomy even for fantasy
- Test silhouette from gameplay camera angle
- Plan rig joints during blockout
- Separate hero detail from background creatures
- Retopologize before rigging

###### MUST NOT DO
- Design without movement consideration
- Uniform detail density (hero face/feet get more)
- Skip retopology on sculpted creatures
- Ignore polycount tier (background vs boss)
- Attach limbs without joint clearance

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Quadruped anatomy | `references/quadruped-anatomy.md` | Four-legged creatures |
| Flying creatures | `references/flying-creatures.md` | Wings, flight |
| Pipeline | `../references/asset-pipeline.md` | Phase context |

##### Style Integration

| Style | Approach |
|-------|----------|
| realistic-style | Grounded anatomy; PBR skin |
| stylized-style | Exaggerated features; bold shapes |
| lowpoly-style | Minimal surface; texture detail |
| horror-style | Uncanny proportions; exposed anatomy |

### `.claude/skills/dark-gritty-mood/SKILL.md`
_Dark, grim, gritty, rusty, abandoned, decayed, industrial, lonely, and melancholic mood direction for Blender._

#### Dark / Gritty Mood

Wear as story. Low key lighting. Melancholy palettes. Industrial weight.

### `.claude/skills/dream-surreal-mood/SKILL.md`
_Dreamlike, surreal, mysterious, mystical, hopeful, and chaotic mood direction for Blender scenes._

#### Dream / Surreal Mood

Logic bent. Scale play. Soft physics. Symbolic props.

### `.claude/skills/dream-weirdcore-style/SKILL.md`
_Dreamcore, weirdcore, and traumacore-inspired art direction for Blender with nostalgic wrongness, liminal nostalgia, and surreal childhood spaces._

#### Dream / Weirdcore Style

Nostalgic spaces. Soft dread. Surreal edits. Childhood UI/objects out of place.

##### Tenets
1. Soft fog / bloom
2. Childhood objects oversized or abandoned
3. Text overlays / cryptic captions optional (comp)
4. Unclear geography
5. Emotion > logic

### `.claude/skills/environment-artist/SKILL.md`
_AAA environment art for modular kits, buildings, terrain, vegetation, architecture, and scene composition. Use for game-optimized environments, storytelling through space, and modular asset pipelines in Blender via MCP._

#### Environment Artist

Modular, scalable environment production for games. Storytelling through space. Performance-conscious.

##### When to Use

- Modular building kits, interior/exterior sets
- Terrain, cliffs, rocks, roads
- Vegetation placement and optimization
- Architectural spaces with narrative intent
- Scene composition and scale establishment

##### Core Principles

1. **Modularity** — Pieces snap to grid; reusable across scenes
2. **Storytelling** — Environment communicates history and mood
3. **Scale** — Human reference always present
4. **Performance** — Instancing, LODs, texture atlases
5. **Composition** — Guide player eye with shapes and value

##### Modular Kit Workflow

```
Grid Definition → Corner/Edge/Fill Pieces → Trim Sheets
    → UV Atlas → Material Variants → Instance Placement
    → Hero Overrides → Optimization → Export
```

##### Grid Standards

| Kit Type | Grid Unit | Snap |
|----------|-----------|------|
| Interior walls | 2m or 4m | 0.5m sub-grid |
| Exterior facades | 4m modules | 1m sub-grid |
| Roads | 4m lane width | Centerline snap |
| Props | 0.5m | Free placement |

Name modules: `SM_Env_[Type]_[Role]_[Size]`
Example: `SM_Env_Wall_Corner_2m`

##### Kit Piece Categories

| Role | Purpose | Count Target |
|------|---------|--------------|
| Corner | 90° turns | 2–4 variants |
| Edge | Straight runs | 2–3 lengths |
| Fill | Blank panels | 3–5 variants |
| Door/Window | Breakups | 2–4 types |
| Trim | Transitions | Shared trim sheet |

##### Terrain & Natural Forms

- Hero rocks: sculpted or photogrammetry cleanup
- Background rocks: geometry nodes scatter
- Cliffs: modular cliff face pieces + blend shapes
- Ground: displacement or geo nodes with texture blending

##### Vegetation

| Type | Approach | Poly Budget |
|------|----------|-------------|
| Hero tree | Hand model + cards | 5k–15k tris |
| Mid tree | Simplified + impostor LOD | 2k–5k tris |
| Bush | Cards + cluster | 500–2k tris |
| Grass | Cards or geo nodes scatter | 2–50 tris per blade |

Use geometry nodes for scatter; see geometry-nodes skill.

##### Architecture

**Interior:**
- Ceiling height: 2.4m–3.5m standard
- Door: 2.1m × 0.9m
- Window sill: 0.9m from floor
- Corridors: minimum 1.5m playable width

**Exterior:**
- Floor count readable in silhouette
- Roof forms distinguish building type
- Weathering tells climate story

##### Composition Guidelines

- **Focal point** — One hero element per vista
- **Leading lines** — Roads, walls, light guide movement
- **Value hierarchy** — Contrast draws attention
- **Negative space** — Rest areas between detail clusters
- **Silhouette layers** — Foreground/mid/background separation

##### Storytelling Details

| Detail | Narrative Signal |
|--------|------------------|
| Peeling paint | Neglect, age |
| Barricades | Conflict, danger |
| Personal items | Former inhabitants |
| Damage patterns | Event history |
| Lighting state | Occupied vs abandoned |

##### Game Optimization

- Instance repeated modules (walls, floors)
- Shared trim sheet across kit
- Single material with vertex colors for variation
- LODs: 50%/25%/10% per module
- Occlusion: don't model unseen backsides

##### MCP Integration

1. Create modular pieces with exact dimensions via MCP
2. Set up collection instances for kit preview
3. Scatter vegetation via geometry nodes (MCP)
4. Query total scene polycount
5. Organize export collections by kit type

##### Constraints

###### MUST DO
- Design for grid snapping from blockout
- Create minimum viable kit before hero pieces
- Use instancing for all repeated geometry
- Maintain consistent texel density across kit
- Include scale reference human figure

###### MUST NOT DO
- Unique geometry for every wall segment
- Ignore backface culling opportunities
- Over-detail background-only areas
- Mix grid sizes within same kit
- Skip LOD planning

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Modular kit design | `references/modular-kits.md` | Kit creation |
| Composition | `references/composition.md` | Scene layout |
| Pipeline | `../references/asset-pipeline.md` | Phase context |

##### Style Integration

| Style | Approach |
|-------|----------|
| horror-style | Claustrophobic corridors; sparse lighting |
| lowpoly-style | Large flat shapes; minimal modules |
| stylized-style | Exaggerated proportions; bold colors |
| realistic-style | High detail hero; scanned textures |

### `.claude/skills/fantasy-worlds/SKILL.md`
_Fantasy world-building art direction for Blender covering medieval, high fantasy, dark fantasy, and urban fantasy asset language._

#### Fantasy Worlds

Pick fantasy subgenre and keep material language consistent.

##### Subgenres
Medieval low-magic · High fantasy · Dark fantasy · Urban fantasy

##### Tenets
1. Material honesty (wood/stone/leather/magic emissive rules)
2. Silhouette heraldry readable
3. Magic FX gated by `vfx-fx`
4. Architecture matches tech level

### `.claude/skills/folk-horror-style/SKILL.md`
_Folk horror art direction for Blender with rural ritual uncanny, pastoral daylight dread, and community-wrongness storytelling._

#### Folk Horror

Daylight dread. Pastoral beauty wrong. Ritual objects. Closed communities.

##### Tenets
1. Beautiful nature + wrong customs
2. Handmade ritual props
3. Village scale, fields, woods
4. Warm daylight can be scarier than night
5. Symbols repeating

### `.claude/skills/frutiger-aero-style/SKILL.md`
_Frutiger Aero art direction for Blender with glossy skeuomorphism, aqua UI cues, nature-tech optimism, and mid-2000s futurism._

#### Frutiger Aero

Glossy bubbles. Fresh greens/blues. Nature + tech optimism. Soft skeuomorphic forms.

### `.claude/skills/genre-action-combat/SKILL.md`
_Art direction for action, hack-and-slash, beat 'em up, and fighting-game readable combat spaces and prop language in Blender._

#### Genre: Action / Combat

Readable arenas. Attack silhouettes. Breakables clear. Camera-friendly volumes.

### `.claude/skills/genre-card-party-idle/SKILL.md`
_Art direction for card games, deck builders, party games, idle/incremental, educational, and rhythm game presentational spaces in Blender._

#### Genre: Card / Party / Idle / Rhythm / Edu

Table clarity. Readable icons in 3D. Stages for UI. Low distraction backgrounds.

### `.claude/skills/genre-metroidvania-roguelike/SKILL.md`
_Art direction for metroidvania, roguelike, and roguelite games in Blender with biome gates, room modules, and run-readable props._

#### Genre: Metroidvania / Roguelike

Modular rooms. Ability gates. Biome mastery. Run-to-run readable modifiers.

### `.claude/skills/genre-narrative-vn/SKILL.md`
_Art direction for visual novel, interactive movie, walking simulator, and story-driven presentation spaces in Blender._

#### Genre: Narrative / VN / Walking Sim

Emotion cameras. Backgrounds plate-ready. Sparse interaction highlights.

### `.claude/skills/genre-open-world-sandbox/SKILL.md`
_Art direction for open world and sandbox games in Blender with biome landmarks, traversable scale, and discovery props._

#### Genre: Open World / Sandbox

Landmarking. Biome borders. Traversal toys. Discovery crumbs without clutter walls.

### `.claude/skills/genre-puzzle-platformer/SKILL.md`
_Art direction for puzzle and platformer games in Blender with readable interactables, jump volumes, and clear hazard language._

#### Genre: Puzzle / Platformer

Interactables pop. Hazards unique color/shape. Jump distances honest in mesh.

### `.claude/skills/genre-racing-sports/SKILL.md`
_Art direction for racing and sports games in Blender with track landmarks, stadium kits, and high-speed readability._

#### Genre: Racing / Sports

Landmarks for speed. Track edge clarity. Stadium modular kits. Team color systems.

### `.claude/skills/genre-rpg/SKILL.md`
_Art direction for RPG, JRPG, CRPG, ARPG, and MMORPG worlds in Blender including loot rarity reads and region identity._

#### Genre: RPG Family

Region identity. Quest hubs. Loot rarity visual language. Class-readable gear.

### `.claude/skills/genre-shooter/SKILL.md`
_Art direction for FPS, TPS, shooter, battle royale, and extraction-shooter maps and props in Blender with sightline and cover language._

#### Genre: Shooter

Sightlines. Cover. Landmarking. Loot readability. Scale for camera height (FPS vs TPS).

### `.claude/skills/genre-soulslike/SKILL.md`
_Art direction for soulslike games in Blender with monumental melancholy spaces, fog gates, bonfire landmarks, and lethal readability._

#### Genre: Soulslike

Monumental ruins. Melancholy grandeur. Fog gates. Landmark shortcuts. Enemy silhouettes lethal-clear.

### `.claude/skills/genre-stealth/SKILL.md`
_Art direction for stealth-game spaces in Blender with shadow volumes, patrol-friendly layouts, and concealment materials._

#### Genre: Stealth

Shadows are gameplay. Noise materials. Vertical infiltration routes.

### `.claude/skills/genre-strategy-sim/SKILL.md`
_Art direction for strategy, RTS, turn-based strategy, tower defense, MOBA, city builder, colony sim, and simulation games in Blender._

#### Genre: Strategy / Sim

Iconic buildings. Tile clarity. Unit read at camera distance. Sim props tell systems.

### `.claude/skills/genre-survival/SKILL.md`
_Art direction for survival and survival-horror gameplay spaces in Blender emphasizing resource props, crafting readability, and tension routes._

#### Genre: Survival

Resources must read at speed. Safe vs unsafe zones. Crafting benches iconic.

### `.claude/skills/hair-groom/SKILL.md`
_Hair and fur grooming in Blender using curves, particle hair, geometry nodes, and game hair-card workflows. Use for characters, creatures, and real-time hair cards via MCP._

#### Hair Groom

Believable hair flow. Scalp coverage. Cards for games. Curves/particles for cinematic.

##### When to Use

- Character scalp hair, beards, brows
- Creature fur / mane / whiskers
- Game hair-card generation and placement
- Cinematic curve/particle grooms

##### Path Decision

```
Target = Game / real-time  → Hair cards (+ optional proxy curves)
Target = Cinematic        → Curves or particle hair + materials
Target = Both             → High groom → bake cards / textures
```

##### Workflow (Game Cards)

```
Scalp mesh → Guide curves → Card strips along flow
  → Atlas UVs → Alpha/normal hair texture → LOD cards → Export
```

##### Workflow (Cinematic)

```
Scalp → Particle/curve groom → Clump/frizz/noise
  → Hair shader (melanin/roughness) → Render test → Cache if needed
```

##### Groom Principles

1. **Flow first** — Primary direction before flyaways
2. **Density hierarchy** — Dense roots, controlled tips
3. **Clumps** — Hair reads as groups, not spaghetti
4. **Silhouette** — Outer shape more important than strand count
5. **Scalp bleed** — Avoid bald patches at hairline

##### Card Guidelines

| LOD | Cards (guide) | Notes |
|-----|---------------|-------|
| Hero close-up | 80–200 | Layered shells |
| Standard | 30–80 | Main masses |
| Distant | 8–20 | Cap + few strips |

- Name: `SM_HairCard_[Region]`
- Atlas: `T_Hair_[Name]_RGBA` (alpha in A)
- Prefer opacity clip or hashed for Eevee preview

##### Naming

- Guides: `CRV_HairGuide_[Region]`
- Cards: `SM_HairCard_[Region]`
- Collection: `COL_Hair_[Character]`

##### Constraints

###### MUST DO
- Establish hairline and parting early
- Match card UVs to atlas layout
- Test silhouette from game camera angles

###### MUST NOT DO
- Uniform card width everywhere
- Skip root density near scalp
- Over-detail flyaways before primary masses

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Hair Card Atlas | `references/hair-card-atlas.md` | When needed |
| Groom Flow Regions | `references/groom-flow-regions.md` | When needed |
| Cinematic Vs Game | `references/cinematic-vs-game.md` | When needed |

### `.claude/skills/hand-painted-style/SKILL.md`
_Hand-painted texture art direction for Blender with brushwork albedo, soft value transitions, and stylized PBR restraint._

#### Hand Painted Style

Brushwork in albedo. Geometry supports paint, not microdetail.

##### Tenets
1. Paint values in albedo
2. Low roughness variation unless wet/metal accents
3. Soft bevels for paint catch
4. Atlas-friendly for kits
5. Avoid photoreal photo-bashed noise

### `.claude/skills/hd-2d-style/SKILL.md`
_HD-2D art direction combining pixel characters/sprites with 3D environments, depth of field, and theatrical lighting._

#### HD-2D Style

Pixel actors. 3D stage. Tilted theatrical camera. Creamy DoF.

##### Tenets
1. Characters: pixel/billboard or texel-locked
2. Environments: soft 3D with painted textures
3. Strong DoF / god rays
4. Ortho-leaning perspective
5. Warm theatrical keys

### `.claude/skills/historical-worlds/SKILL.md`
_Historical and period world art direction for Blender including Western, pirate, samurai/ninja, Viking, ancient Egypt/Greece/Rome, Victorian, modern, and military eras._

#### Historical Worlds

Period-accurate silhouettes and materials. Document era before kitbashing.

##### Groups
Western · Pirate · Samurai/Ninja · Viking · Ancient (Egypt/Greece/Rome) · Victorian · Modern · Military/WW/Cold War

### `.claude/skills/horror-style/SKILL.md`
_Psychological horror art direction for Blender assets inspired by Silent Hill, Resident Evil, Chilla's Art, Fear to Fathom, and Iron Lung. Use for sparse industrial environments, analog aesthetics, and tension-driven lighting._

#### Horror Style Specialist

Psychological tension over jump scares. Environmental storytelling. Sparse detail. Industrial decay.

##### When to Use

- Horror game environments and props
- Psychological tension scenes
- Analog/liminal aesthetic assets
- Industrial decay settings
- Limited visibility compositions

##### Design Philosophy

Inspired by: Fear to Fathom, Chilla's Art, Puppet Combo, Silent Hill, Resident Evil, Iron Lung

**Core tenets:**
1. **Less is more** — Absence creates tension
2. **Familiar made wrong** — Recognizable spaces with subtle wrongness
3. **Light as enemy** — Darkness hides; light reveals uncomfortably
4. **Industrial analog** — CRT screens, fluorescent hum, concrete, rust
5. **Environmental narrative** — Story told through objects, not exposition

##### Visual Language

| Element | Horror Treatment |
|---------|------------------|
| Architecture | Brutalist, institutional, repetitive |
| Materials | Stained concrete, peeling paint, rust, yellowed plastic |
| Lighting | Single source, flickering, cold fluorescent |
| Detail density | Sparse foreground, empty midground, obscured background |
| Color | Desaturated, sickly greens, cold blues, blood accent sparingly |
| Scale | Slightly wrong proportions (low ceilings, narrow corridors) |

##### Modeling Guidelines

- **Corridors:** Narrow (1.2–1.5m) for claustrophobia
- **Ceilings:** Low (2.2–2.4m institutional)
- **Doors:** Slightly oversized or undersized — uncanny
- **Detail:** Concentrate on hero interactive objects; walls mostly bare
- **Damage:** Water stains > bullet holes; neglect > destruction
- **Technology:** 80s–90s analog — CRT monitors, tape recorders, rotary phones

##### Sparse Detail Rule

```
Foreground: 1–2 narrative objects (key, note, blood stain)
Midground: Architectural structure only
Background: Fog/darkness obscures incomplete geometry
```

Do not over-model backgrounds visible only in darkness.

##### Lighting (Horror)

Coordinate with lighting skill:
- High contrast ratio (8:1 minimum key:fill)
- Visible light source meshes (bare bulb, fluorescent tube)
- Volumetric fog mandatory for depth
- Color temperature clash: warm interior vs cold exterior
- Flicker animation on 1–2 lights only

##### Audio-Visual Sync Points

Design geometry supporting:
- Long empty hallways (footstep echo)
- Door slow-open clearance
- Corner blind spots
- Mirror/reflection placements

##### Material Palette

| Material | Parameters |
|----------|------------|
| Stained concrete | Roughness 0.9, desaturated gray-green |
| Peeling paint | Vertex color mask, exposed concrete under |
| Rust metal | Roughness 0.85, dark orange-brown |
| Yellowed plastic | Subsurface slight, warm yellow |
| CRT screen | Emission: green/phosphor, low intensity |
| Blood (sparingly) | Dark dried red, roughness 0.7 |

##### Reference Mood Board Targets

- Empty school hallways after hours
- Abandoned medical facilities
- Submarine interiors (Iron Lung)
- Fog-shrouded streets with single streetlight
- Apartment with one room lit by TV glow

##### Polycount Approach

Horror benefits from lowpoly-style efficiency:
- Simple geometry + strong lighting = effective horror
- See lowpoly-style for budget alignment
- Budget saved on geo → spend on lighting/volumetrics

##### MCP Integration

1. Build sparse environment layouts via MCP
2. Place single-source lighting via MCP
3. Assign desaturated materials via MCP
4. Validate sightlines and blind corners via camera MCP
5. Keep background collections low-poly/hidden in fog

##### Constraints

###### MUST DO
- Prioritize atmosphere over detail
- Design readable paths with unsettling alternatives
- Use environmental storytelling objects sparingly
- Coordinate with lighting skill always
- Test scene from player eye height (1.6m)

###### MUST NOT DO
- Over-detail every surface
- Bright even lighting
- Jump-scare gore everywhere
- Modern smartphone/tech unless anachronism intentional
- Dense vegetation (breaks institutional mood unless forest horror)

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Environment layouts | `references/horror-layouts.md` | Level blockout |
| Analog props | `references/analog-props.md` | Prop list |

##### Related Horror Packs
- `psx-horror-style`, `cosmic-eldritch-horror`, `body-horror-style`, `analog-found-footage-horror`
- `liminal-space-style`, `folk-horror-style`, `mascot-puppet-horror`, `dream-weirdcore-style`
- `indie-horror-aesthetics`

### `.claude/skills/indie-horror-aesthetics/SKILL.md`
_Indie horror aesthetic pack for Blender covering Silent Hill, Fear to Fathom, Puppet Combo, corporate horror, cabin/forest/hospital horror, and related looks._

#### Indie Horror Aesthetics

Reference-driven indie horror looks. Pick a lane; don’t mash all at once.

##### Load subtype refs
Silent Hill fog/rust; Fear to Fathom domestic analog; Puppet Combo PSX crunch; corporate/empty office; cabin/forest; hospital; urban decay.

### `.claude/skills/isometric-style/SKILL.md`
_Isometric and strategy-game art direction for Blender including diorama framing, true-iso camera setup, readable silhouettes, and tile asset rules._

#### Isometric Style

Readable dioramas. True iso framing. Tile-aware assets.

##### When to Use

- Strategy / sim / city-builder assets
- Isometric diorama renders
- Orthographic hero presentations

##### Camera Setup

```
Camera type: Orthographic
Rotation: typically 54.736° / 30° patterns (true iso) OR project-specific dimetric
Scale: frame subject with padding for UI
CAM_Iso_[Shot]
```

Match project’s exact iso angles — do not invent per asset.

##### Asset Rules

1. **Readable from iso angle first** — Not perspective hero camera
2. **Tile footprint** — Document cell size (e.g. 1×1, 2×2)
3. **Height clarity** — Vertical read without confusion
4. **Edge contrast** — Separate from ground plane
5. **LOD for dense maps** — Far tiles cheaper

##### Modeling

- Avoid detail only visible from ground FPS view
- Strong top/side planes
- Anchor pivot to tile corner or center per kit standard

##### Presentation

- Soft key + cool fill common for dioramas
- Slight AO / ground shadow for lift
- Optional `compositing` grade for portfolio

##### Constraints

###### MUST DO
- Lock camera angle for the set
- Document tile size and pivot rule
- Check readability at game ortho scale

###### MUST NOT DO
- Detail undersides invisible in iso
- Mix perspective cameras into iso kits without reason

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Iso Camera | `references/iso-camera.md` | When needed |
| Tile Footprints | `references/tile-footprints.md` | When needed |

### `.claude/skills/liminal-space-style/SKILL.md`
_Liminal space and Backrooms art direction for Blender with empty transitional architecture, wrong familiarity, and endless repetition._

#### Liminal Space / Backrooms

Familiar architecture without people. Repetition. Wrong lighting. Endless continuation.

##### Subplaces
Backrooms, empty mall, empty school, poolrooms, hotels, offices

##### Tenets
1. Repetitive modular kits
2. Fluorescent hum lighting
3. Stained carpet / yellowed walls (variant-dependent)
4. No narrative clutter — emptiness is the story
5. Soft wrongness over jump scares

### `.claude/skills/lowpoly-style/SKILL.md`
_Low-poly art direction for Blender inspired by PS1/PS2, Lethal Company, Mouthwashing, and Fear to Fathom. Use for readable silhouettes, minimal polygons, simple materials, and strong atmosphere._

#### Low Poly Style Specialist

Readable silhouettes. Large shapes. Minimal polygons. Atmosphere over detail.

##### When to Use

- Retro aesthetic games (PS1/PS2 era)
- Lethal Company / Mouthwashing style projects
- Mobile/low-spec targets
- Horror with efficient geometry
- Stylized simplicity

##### Core Rules

1. **Readable silhouettes** — Shape reads at distance without detail
2. **Minimal polygons** — Every face must earn its place
3. **Large shapes** — Primary forms dominate; micro-detail forbidden
4. **Simple materials** — Flat or lightly textured; 512px default
5. **Limited texture sizes** — 256–512px most assets; 1024 hero only
6. **Strong atmosphere** — Lighting and fog carry visual weight

##### Polygon Guidelines

| Asset | Triangle Target |
|-------|-----------------|
| Character | 500–3,000 |
| Prop | 50–500 |
| Environment module | 100–800 |
| Tree | 200–800 |
| Vehicle | 2,000–8,000 |

See `../references/polycount-budgets.md` — apply 50–90% reduction.

##### Modeling Approach

- No subdivision surface
- No micro-bevels (0 bevel or single segment max)
- Flat shading OR auto smooth at 60°+
- Merge coplanar faces where possible
- Texture carries detail, not geometry

##### PS1 Authenticity (Optional)

| Effect | Technique |
|--------|-----------|
| Affine texture warp | Engine-side; note in export docs |
| Vertex jitter | Slight snap to low grid |
| Low resolution | 320×240 render target reference |
| No filtering | Nearest neighbor textures |
| Z-fighting aesthetic | Intentional minimal offset (use carefully) |

##### PS2 Era

- Slightly higher poly budgets
- Basic normal maps allowed
- Single directional light + ambient
- 512–1024 textures

##### Material Approach

- Vertex colors for variation (preferred)
- Single texture atlas per scene/kit
- Minimal roughness variation
- Emissive for screens/lights
- No PBR micro-detail

##### Silhouette Test

Before approving any asset:
1. Solid flat color material
2. View at gameplay distance
3. Silhouette must communicate identity
4. If unreadable → simplify geometry, not add detail

##### Lethal Company Influence

- Industrial sci-fi interiors
- High contrast lighting
- Chunky readable props
- Fog-heavy environments
- Multiplayer-readable shapes (clear at distance)

##### Mouthwashing Influence

- Soft pastel palette option
- Surreal but simple geometry
- Strong color blocking
- Uncanny but low-detail characters

##### MCP Integration

1. Create low-poly blockouts via MCP
2. Enforce face count limits via MCP queries
3. Assign flat materials via MCP
4. Validate triangle budgets continuously
5. Skip subdiv/bevel modifiers entirely

##### Constraints

###### MUST DO
- Enforce strict poly budgets
- Prioritize silhouette over surface detail
- Use vertex colors and atlases
- Test at gameplay camera distance
- Coordinate atmosphere with lighting skill

###### MUST NOT DO
- Subdivision surfaces
- High-resolution textures on background assets
- Micro-bevels or weighted normal stacks
- Sculpting detail (bake workflow unnecessary)
- Exceed triangle budgets "just a little"

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| PS1 techniques | `references/ps1-aesthetic.md` | Retro authentic look |
| Asset budgets | `../references/polycount-budgets.md` | Budget setting |

### `.claude/skills/manga-style/SKILL.md`
_Manga-inspired art direction for Blender emphasizing monochrome value design, speed lines, screentone feel, and manga panel staging._

#### Manga Style

Value-first. Screentone feel. Panel staging. Distinct from full-color anime.

##### Tenets
1. Design in grayscale values first
2. Screentone / hatch textures sparingly
3. Speed lines and emphasis FX
4. Expressive faces / eyes per demographic
5. Black-heavy compositions OK

##### Vs anime-style
Anime = color cel; Manga = print value language (can still be 3D color with manga staging).

### `.claude/skills/mascot-puppet-horror/SKILL.md`
_Mascot and puppet horror art direction for Blender with cheerful brand characters made wrong, felt/foam materials, and uncanny performance._

#### Mascot / Puppet Horror

Cute brand language corrupted. Felt, foam, plastic eyes. Performance uncanny.

##### Tenets
1. Friendly shapes + dead/wrong eyes
2. Craft materials (felt, plush, plastic)
3. Stage/set like children’s show gone wrong
4. Bright palette with one sick shift
5. Often pairs with PSX or analog crunch

### `.claude/skills/minimalist-style/SKILL.md`
_Minimalist and abstract-leaning art direction for Blender with reduced forms, limited palettes, and negative space._

#### Minimalist Style

Reduce until it breaks — then add one thing back.

##### Tenets
1. Few shapes
2. Few colors
3. Negative space intentional
4. Typography-like clarity of form
5. Abstract OK if brief asks

### `.claude/skills/neon-retrofuturism/SKILL.md`
_Neon, vaporwave, synthwave, and retrofuturistic mood/art direction for Blender with grid horizons, chrome, and dusk palettes._

#### Neon / Retrofuturism

Sunset gradients. Grid perspective. Chrome + neon. 80s future memory.

### `.claude/skills/noir-style/SKILL.md`
_Noir art direction for Blender with high-contrast lighting, wet streets, silhouettes, and monochrome or limited-color grading._

#### Noir Style

Shadows as design. Silhouettes. Wet ground mirrors. Limited color or mono.

##### Tenets
1. Motivated hard keys / blinds / neon slash
2. Negative fill
3. Smoke/fog shafts
4. Costume readable in silhouette
5. Grade crushed but detailed shadows

### `.claude/skills/painterly-style/SKILL.md`
_Painterly art direction spanning watercolor and oil-painting looks for Blender using soft edges, pigment texture, and illustrative lighting._

#### Painterly Style

Pigment feel. Soft edges. Illustration lighting.

##### Sublooks
- Watercolor: paper grain, bleeds, light washes
- Oil: thicker strokes, richer impasto suggestion in texture

##### Tenets
1. Soft terminators
2. Pigment/paper overlays in mat or comp
3. Limited harsh specular
4. Composition like a canvas, not a game HUD shot

### `.claude/skills/physics-sim/SKILL.md`
_Rigid body, soft body, and destruction setups in Blender including constraints, cell fracture debris, and baked caches via MCP._

#### Physics Sim

Stable rigid/soft body setups. Motivated destruction. Baked caches.

##### When to Use

- Rigid body interactions and collapses
- Soft body jiggle / rubber / simple soft props
- Destruction and debris (cell fracture / pre-cut shards)
- Pre-vis physics before VFX polish

##### Workflow

```
Simplify collision meshes → Assign rigid/soft bodies
  → Constraints → Passive settings → Bake → Art-direct → Export cache
```

##### Rigid Body Quick Rules

| Role | Settings notes |
|------|----------------|
| Active | Moving debris / props |
| Passive | Floors, walls, heavy anchors |
| Convex hull | Fast, approximate |
| Mesh | Accurate, heavier |

- Apply scale before sim
- Use margin appropriate to scale
- Collection: `COL_Physics_[Shot]`

##### Constraints

- Hinge / fixed / motor for mechanical links
- Breakable constraints for destruction beats
- Name: `RBCON_[Object]_[Type]`

##### Destruction Approach

```
1. Pre-cut shards (cell fracture or manual)
2. Island meshes as active rigid bodies
3. Passive shell until trigger frame
4. Animate trigger (force / keyframed activation)
5. Bake → cleanup interpenetrations
```

##### Soft Body

- Prefer for simple soft props; use `cloth-sim` for garments
- Goal weights to retain shape
- Soft + collision object required

##### Bake / Export

- Bake to cache before render
- Alembic/USD for cinematic debris
- For games: bake key poses or flipbook; rarely live Blender physics

##### Constraints

###### MUST DO
- Apply scale; use simplified colliders
- Bake before final delivery
- Trigger destruction intentionally (frame)

###### MUST NOT DO
- High-res sculpt meshes as active colliders
- Unbounded shard counts
- Leave sims unbaked for final renders

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Rigid Body Presets | `references/rigid-body-presets.md` | When needed |
| Destruction Pipeline | `references/destruction-pipeline.md` | When needed |
| Sim Bake Checklist | `references/sim-bake-checklist.md` | When needed |

### `.claude/skills/pixel-art-style/SKILL.md`
_Pixel-art and texel-constrained art direction for Blender assets destined for pixel rendering, low-res textures, or HD-2D-adjacent pixel reads._

#### Pixel Art Style

Texel discipline. Crisp pixels. Limited palette.

##### Tenets
1. Declare target texel size / texture res
2. Nearest filtering intent
3. Limited palette
4. Avoid thin triangles that shimmer
5. Ortho or locked angles help readability

##### Reference Guide
| Topic | Reference |
|-------|-----------|
| Texel rules | `references/texel-rules.md` |

### `.claude/skills/prop-artist/SKILL.md`
_Everyday and hero prop modeling for furniture, tools, household objects, kitbash parts, and readable game props. Use when hard-surface is too sci-fi/mechanical and the asset is a grounded prop._

#### Prop Artist

Grounded, readable props. Silhouette first. Real-world scale. Kitbash-friendly parts.

##### When to Use

- Furniture, tools, containers, electronics, household objects
- Hero interactive props and background set dressing pieces
- Kitbash libraries (handles, brackets, panels, fasteners)
- When hard-surface sci-fi language would feel wrong

##### Design Principles

1. **Real-world scale** — Measure against human (door 2.0–2.1m, chair seat ~0.45m)
2. **Silhouette readability** — Reads at game camera distance
3. **Wear hierarchy** — Contact edges dirty; protected faces cleaner
4. **Part logic** — Separate meshes where materials or LODs differ
5. **Pivot correctness** — Floor contact, grip, hinge, or socket as needed

##### Workflow

```
Reference → Scale blockout → Primary volumes → Secondary forms
  → Edge bevels → Wear/damage → UVs → Materials → Optimize → Export
```

##### Prop Tiers

| Tier | Tris (guide) | Detail | Use |
|------|--------------|--------|-----|
| Hero | 2k–8k | Full bevels, unique wear | Interactables, close-ups |
| Standard | 500–2k | Clean forms, shared mats | Midground |
| Background | 100–500 | Block forms, atlas mats | Far / dense dressing |

##### Kitbash Rules

- Name parts `SM_KB_[Category]_[Part]`
- Keep origins at logical attach points
- Prefer modular dimensions (0.05 / 0.1 / 0.25m grid)
- Collection: `COL_Kitbash_[Set]`

##### Material Guidance

- Limit unique materials; atlas where possible
- Separate glass / emissive / opaque when needed for engine
- Wear via roughness/AO, not only albedo dirt

##### Handoff

- UVs → `uv-workflow`
- Look → `materials` / `lookdev`
- Placement → `set-dressing`
- Ship → `asset-optimization` → `export-pipeline` or engine export skill

##### Constraints

###### MUST DO
- Set real-world scale before detailing
- Place pivot intentionally
- Match prop tier to camera distance

###### MUST NOT DO
- Over-greeble everyday objects
- Use sci-fi panel language on mundane props
- Skip collision planning for interactables

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Prop Tiers | `references/prop-tiers.md` | When needed |
| Kitbash Library | `references/kitbash-library.md` | When needed |
| Everyday Prop Checklist | `references/everyday-prop-checklist.md` | When needed |

### `.claude/skills/psx-horror-style/SKILL.md`
_PS1/PSX-era horror art direction combining low-poly affine textures, limited color depth, fog, and psychological horror staging for Blender assets._

#### PSX Horror Style

Crunchy low-poly horror. Affine textures. Fog. Limited palette. Tension over fidelity.

##### When to Use

- PS1-era horror game looks
- Puppet Combo / retro survival horror vibes
- When `horror-style` needs explicit PSX constraints

##### Core Tenets

1. **Low poly, high dread** — Few tris, strong shapes
2. **Texture crunch** — Low-res, nearest filtering feel
3. **Vertex / affine warping cues** — Subtle wobble optional
4. **Fog + darkness** — Hide draw distance sins
5. **Analog grit** — VHS/CRT via compositing sparingly

##### Vs Related Styles

| Skill | Role |
|-------|------|
| `horror-style` | Broad psychological horror direction |
| `lowpoly-style` | General PS1/PS2 / Lethal Company |
| `psx-horror-style` | Horror + PSX crunch specifically |

##### Modeling

- 100–800 tris for many props
- Characters chunky; faces minimal
- Interiors modular, repetitive, oppressive

##### Materials / Textures

- 64–256px textures common
- Limited palette; indexed feel
- Flat shading or very low smooth
- Emissive screens as narrative props

##### Lighting & Camera

- Single practical lights; deep shadows
- Low camera, narrow spaces
- Fog/mist mandatory for depth
- Optional handheld noise (`camera-cinematography`)

##### Compositing Extras

- Slight blur / chromatic aberration
- Posterize / crush colors carefully
- Film grain / VHS overlay subtle

##### Constraints

###### MUST DO
- Keep poly and texture budgets intentionally low
- Prioritize fog, sound-design-friendly spaces
- Stage sparse narrative props

###### MUST NOT DO
- Modern PBR microdetail as primary look
- Bright clean global illumination

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Psx Horror Budgets | `references/psx-horror-budgets.md` | When needed |
| Psx Horror Palette | `references/psx-horror-palette.md` | When needed |

### `.claude/skills/realistic-style/SKILL.md`
_Photorealistic AAA art direction for Blender including photogrammetry cleanup, real-world scale, high-poly workflows, PBR accuracy, and scan optimization. Use for cinematic and AAA game realism._

#### Realistic Style Specialist

Physically accurate materials. Real-world scale. High-poly to baked low-poly pipeline. AAA standards.

##### When to Use

- AAA game assets requiring realism
- Cinematic renders
- Photogrammetry scan cleanup
- Product visualization
- Architectural visualization

##### Core Standards

1. **Real-world scale** — 1 Blender unit = 1 meter; verify all dimensions
2. **PBR accuracy** — Physically plausible material values
3. **High-poly to low-poly** — Sculpt/scan → bake → game mesh
4. **Micro-detail via textures** — Not geometry at distance
5. **Reference-driven** — Match real-world photography

##### Scale Verification

| Reference | Dimension |
|-----------|-----------|
| Door height | 2.03–2.13m |
| Human eye height | 1.6–1.7m |
| Hand width | 0.08–0.1m |
| Brick | 0.065 × 0.215m |
| Car height | 1.4–1.6m |

Always place scale reference in scene.

##### High-Poly Workflow

```
Scan/Sculpt High-Poly → Cleanup → UV Low-Poly → Bake Maps
    → PBR Texturing → Engine Export
```

Polycount on high-poly: unlimited for bake source; never exported to game.

##### Photogrammetry Cleanup

| Issue | Fix |
|-------|-----|
| Scan holes | Fill with sculpt/mesh patch |
| Floating geometry | Delete; rebuild clean |
| Decimation artifacts | Remesh problematic areas |
| Color variation | Rebake albedo; neutralize lighting |
| Wrong scale | Measure known feature; rescale |

##### PBR Accuracy

| Material | Albedo | Roughness | Metallic |
|----------|--------|-----------|----------|
| Fresh concrete | 0.5 gray | 0.85 | 0 |
| Polished chrome | 0.8 | 0.05 | 1 |
| Human skin | photographic | 0.4–0.6 | 0 |
| Clean glass | 0.9 | 0 | 0 (transmission) |
| Old iron | 0.3 dark | 0.7 | 1 |

Use photographic reference for albedo; never guess saturated colors.

##### Micro-Detail Strategy

| Distance | Detail Method |
|----------|---------------|
| Hero close-up | Geometry + normal + roughness |
| Mid distance | Normal + roughness maps |
| Far distance | Albedo + roughness only |
| Background | Decal/card detail |

##### AAA Asset Checklist

- [ ] Real-world scale verified
- [ ] High-poly source archived
- [ ] Clean low-poly with efficient UVs
- [ ] 2K–4K textures on hero (per budget)
- [ ] ORM packed for engine
- [ ] LODs generated
- [ ] Turntable render approved
- [ ] Engine import verified

##### Cinematic vs Game Realism

| Aspect | Cinematic | Game |
|--------|-----------|------|
| Polycount | Higher hero | Strict LOD |
| Textures | 4K–8K | 2K max typical |
| Materials | Complex shaders | Standard PBR |
| Lighting | HDRI + area | Baked + dynamic |
| Detail | Full geometry | Baked normal |

##### MCP Integration

1. Import/cleanup scan meshes via MCP
2. Setup bake high/low pairs via MCP
3. Assign PBR materials with accurate values via MCP
4. Query dimensions for scale validation via MCP
5. Export with full texture set via export-pipeline

##### Constraints

###### MUST DO
- Reference real-world photography
- Verify scale with known dimensions
- Bake micro-detail to normal maps
- Use physically plausible PBR values
- Archive high-poly source

###### MUST NOT DO
- Export high-poly to game engine
- Saturated albedo without reference
- Skip LOD generation for game assets
- Ignore photogrammetry artifacts
- Mix stylized proportions

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| PBR values | `references/pbr-values.md` | Material setup |
| Scan cleanup | `references/scan-cleanup.md` | Photogrammetry |

##### Related
- Photoreal path stays here; for era crunch use `visual-console-eras` or `lowpoly-style`.

### `.claude/skills/retro-16bit-style/SKILL.md`
_Retro 16-bit art direction for Blender-assisted SNES/Genesis-era color richness, dither cues, and sprite-like clarity._

#### Retro 16-bit Style

Richer palettes than 8-bit. Dither/gradient cues. Still texel-disciplined.

### `.claude/skills/retro-8bit-style/SKILL.md`
_Retro 8-bit art direction for Blender-assisted pixel/low-res aesthetics inspired by NES-era constraints._

#### Retro 8-bit Style

Severe palette limits. Chunky read. Sprite logic.

##### Constraints
Very low color count, high contrast characters, simple props, avoid gradients unless dithered.

### `.claude/skills/sci-fi-punk-worlds/SKILL.md`
_Sci-fi and punk world art direction for Blender including hard sci-fi, space, cyberpunk, steampunk, dieselpunk, atompunk, solarpunk, biopunk, and clockpunk._

#### Sci-Fi / Punk Worlds

Choose one punk/sci-fi lane. Don’t mix chrome cyber with brass steam unless intentional mashup.

##### Lanes
Hard sci-fi · Space opera · Cyberpunk · Steampunk · Dieselpunk · Atompunk · Solarpunk · Biopunk · Clockpunk

### `.claude/skills/set-dressing/SKILL.md`
_Set dressing and environmental storytelling placement for interiors and exteriors using prop density, narrative clusters, and readability rules via MCP._

#### Set Dressing

Story through placement. Controlled clutter. Readable clusters.

##### When to Use

- Interior/exterior dressing passes
- Narrative prop clusters
- Avoiding empty or overstuffed spaces
- After modular layout is locked

##### Workflow

```
Layout locked → Hero narrative props → Secondary clusters
  → Background filler → Decals/wear → Lighting check → QA
```

##### Density Rules

| Zone | Density |
|------|---------|
| Hero interact zone | High intent, low noise |
| Midground | Supporting story clusters |
| Background | Sparse; silhouette only |
| Traversal path | Clearance for player/camera |

##### Cluster Method

1. Pick a story beat (meal abandoned, workbench used, escape rushed)
2. Place 3–7 props that sell the beat
3. Add 1–2 wear/decal cues
4. Stop — do not fill every surface

##### Prop Sources

- `prop-artist` for unique pieces
- Kitbash / modular libraries for filler
- Instance repeats; vary rotation/scale slightly

##### Horror / Sparse Styles

- Fewer props, more meaning
- Negative space intentional
- Coordinate with `horror-style` / `psx-horror-style`

##### Constraints

###### MUST DO
- Dress after greybox navigation works
- Keep player/camera paths clear
- Instance repeated meshes

###### MUST NOT DO
- Uniform clutter wallpaper
- Block doors/windows without story reason

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Story Clusters | `references/story-clusters.md` | When needed |
| Density Map | `references/density-map.md` | When needed |

### `.claude/skills/stop-motion-craft-style/SKILL.md`
_Stop-motion and craft aesthetics for Blender including claymation, paper craft, and handmade physical-material cues._

#### Stop Motion / Craft Style

Handmade physicality. Imperfect edges. Material honesty.

##### Sublooks
Claymation, paper craft, felt/plush, wooden puppet

##### Tenets
1. Visible craft seams / fingerprints (subtle)
2. Real-world craft materials
3. Slight irregularity in forms
4. Practical light feel
5. Step-like motion if animating (optional)

### `.claude/skills/stylized-style/SKILL.md`
_Stylized art direction for Blender with shape language, exaggeration, color harmony, NPR rendering, and hand-painted asset workflows. Use for non-photorealistic game and animation projects._

#### Stylized Style Specialist

Deliberate shape language. Exaggerated proportions. Color harmony. NPR rendering.

##### When to Use

- Non-photorealistic games
- Hand-painted texture workflows
- Animated/stylized characters
- Fantasy environments with art direction
- Toon/cel-shaded rendering

##### Core Principles

1. **Shape language** — Circles=friendly, squares=stable, triangles=danger
2. **Exaggeration** — Push proportions beyond realistic
3. **Color harmony** — Limited palette; intentional accent colors
4. **Silhouette clarity** — Strong readable shapes
5. **Detail in texture** — Not micro-geometry

##### Shape Language

| Shape | Association | Use |
|-------|-------------|-----|
| Circle/Oval | Friendly, approachable | Heroes, cute creatures |
| Square/Rectangle | Stable, reliable | Architecture, guards |
| Triangle | Dynamic, dangerous | Villains, spikes, roofs |

Combine shapes consistently per character/faction.

##### Proportion Exaggeration

| Feature | Stylized Approach |
|---------|-------------------|
| Head | 25–40% of height (chibi to semi-realistic) |
| Hands | Larger for expressiveness |
| Eyes | Enlarged for emotion |
| Limbs | Tapered; simplified joints |
| Weapons | Oversized for readability |

##### Color Harmony

**Triadic:** Three equidistant hues — vibrant, balanced
**Complementary:** Opposite hues — high contrast accents
**Analogous:** Adjacent hues — harmonious environments

Rules:
- Limit palette to 3–5 core colors + neutrals
- Reserve saturated accents for interactive elements
- Desaturate backgrounds; saturate foreground subjects

##### Material Approach

- Hand-painted albedo priority over PBR accuracy
- Flat or stepped roughness (not continuous PBR)
- Rim lighting built into texture (not just shader)
- Subsurface on skin: exaggerated warm tones
- No photoreal micro-detail

##### NPR Rendering

Coordinate with rendering skill:
- Toon BSDF or Shader to RGB setups
- Stepped lighting (2–3 bands)
- Outline pass: inverted hull or Freestyle
- Bloom on emissive accents
- Flat ambient forbidden — maintain form readability

##### Hand-Painted Texture Workflow

```
1. Flat base color blocks
2. Define light/shadow shapes (not gradients from bake)
3. Edge highlights (warm) and shadows (cool)
4. Detail pass: minimal; suggestive not literal
5. Ambient occlusion painted, not baked
```

##### Character Stylization

- Simplified anatomy; avoid uncanny valley
- Hair as solid shapes or card clusters
- Clothing folds: painted, not simulated
- Facial features: large eyes, small nose (style dependent)

##### Environment Stylization

- Exaggerated verticality in forests/mountains
- Architecture: oversized elements (doors, windows)
- Vegetation: puff/cloud shapes (not botanical accuracy)
- Water: stylized foam patterns

##### MCP Integration

1. Block exaggerated proportions via MCP
2. Assign stylized materials via MCP
3. Configure NPR render settings via MCP
4. Validate silhouette with flat shading via MCP
5. Limit geometry detail per stylized budgets

##### Constraints

###### MUST DO
- Define shape language per asset/faction
- Maintain color palette consistency
- Exaggerate intentionally, not accidentally
- Paint detail in textures
- Test NPR render early

###### MUST NOT DO
- Mix photoreal PBR with stylized shapes without intent
- Micro-detail geometry (use texture)
- Realistic proportions unless semi-stylized target
- Full PBR roughness accuracy
- Skip outline/rim if NPR project requires

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| NPR shader setup | `references/npr-shaders.md` | Rendering setup |
| Color palettes | `references/palette-examples.md` | Art direction |

##### Related Style Packs
- `cartoon-style`, `anime-style`, `comic-book-style`, `manga-style`, `hand-painted-style`, `painterly-style`
- `chibi-style`, `pixel-art-style`, `hd-2d-style`, `stop-motion-craft-style`

### `.claude/skills/vector-style/SKILL.md`
_Vector-clean art direction for Blender with flat fills, sharp silhouettes, and UI-like graphic clarity._

#### Vector Style

Flat fills. Clean edges. Iconic shapes. Almost no gradients unless intentional.

### `.claude/skills/vegetation-artist/SKILL.md`
_Vegetation and foliage authoring for Blender including trees, plants, grass cards, canopy LODs, and game-friendly leaf atlases via MCP._

#### Vegetation Artist

Believable plants. Card efficiency. Wind-ready pivots. Canopy LODs.

##### When to Use

- Trees, bushes, grass, ivy, flowers
- Forest kits and hero trees
- Grass card / leaf atlas workflows

##### Path Decision

```
Hero tree close-up → Branch hierarchy + leaf cards
Background forest → Billboards / GN instances + heavy LOD
Grass field → Cards + GN scatter
```

##### Workflow

```
Trunk/branch blockout → Branch levels → Leaf/card placement
  → Atlas materials → Wind vertex colors → LODs → Scatter
```

##### Game Plant Structure

| Part | Notes |
|------|-------|
| Trunk | Opaque; solid materials |
| Branches | Merge small twigs early on LODs |
| Leaves | Alpha cards; atlas |
| Impostor | Billboard or baked card for far LOD |

##### Atlas Rules

- Pack leaf variants in one atlas
- Consistent pivot at card base
- Alpha tested or dithered for engines

##### Wind Prep

- Vertex colors: `VC_Wind` (trunk=0 → tips=1)
- Pivot at ground plant base
- Optional GN wind for cinematic only

##### Constraints

###### MUST DO
- Plan LODs with canopy silhouette
- Keep leaf alpha cheap
- Ground pivot correct for scatter

###### MUST NOT DO
- Unique leaf mesh per leaf on game trees
- Skip impostor for dense forests

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Leaf Atlas | `references/leaf-atlas.md` | When needed |
| Tree Lod | `references/tree-lod.md` | When needed |
| Wind Vertex Colors | `references/wind-vertex-colors.md` | When needed |

### `.claude/skills/vehicle-artist/SKILL.md`
_Dedicated vehicle modeling for cars, trucks, aircraft, ships, boats, mechs, and transit assets with proportion, panel flow, and game LOD awareness in Blender via MCP._

#### Vehicle Artist

Proportion-driven vehicles. Clear body language. Manufacturing panel flow. Engine-ready LODs.

##### When to Use

- Cars, trucks, bikes, aircraft, boats, ships
- Mechs and large mechanical walkers
- Transit / industrial vehicles
- When vehicle work should not live under generic hard-surface

##### Design Principles

1. **Proportion blockout first** — Wheelbase, cabin, mass distribution
2. **Centerline symmetry** — Mirror early; break only for damage/wear
3. **Panel flow** — Seams follow stamped/assembled construction
4. **Functional readability** — Lights, intakes, doors, wheels read clearly
5. **Separate systems** — Body, wheels, glass, interior, lights as objects

##### Workflow

```
Ortho refs → Chassis blockout → Body volumes → Wheel/suspension
  → Panel breaks → Booleans/cutters → Bevels → Glass/lights
  → Interior (LOD-aware) → UVs → Materials → LODs → Collision → Export
```

##### Blockout Checklist

- [ ] Overall length / width / height locked
- [ ] Wheel size and stance correct
- [ ] Cabin / canopy silhouette readable
- [ ] Ground clearance intentional
- [ ] Symmetry axis established

##### Object Split (Game)

| Object | Why |
|--------|-----|
| `SM_Vehicle_Body` | Main shell |
| `SM_Vehicle_Wheel_*` | Spin / steer |
| `SM_Vehicle_Glass` | Transparency / sorting |
| `SM_Vehicle_Light_*` | Emissive materials |
| `SM_Vehicle_Interior` | Cull on distant LODs |

##### LOD Guidance

| LOD | Focus |
|-----|-------|
| LOD0 | Full panels, interior if visible |
| LOD1 | Simplified panels, remove micro |
| LOD2 | Body + wheels + glass only |
| LOD3 | Impostor / ultra-low hull |

Use `lod-pipeline` for generation and validation.

##### Collision

- Simple convex hulls per major volume
- Wheel capsules/cylinders separate if physics-driven
- See `collision-proxy`

##### Constraints

###### MUST DO
- Lock proportions before panel detail
- Keep wheels as separate objects when animated
- Plan LODs and collision with body

###### MUST NOT DO
- Detail interior before exterior silhouette
- Boolean chaos without cutter collection
- Single merged mesh for all systems on game vehicles

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Proportion Blockout | `references/proportion-blockout.md` | When needed |
| Vehicle Object Split | `references/vehicle-object-split.md` | When needed |
| Vehicle Lod Targets | `references/vehicle-lod-targets.md` | When needed |

### `.claude/skills/vfx-fx/SKILL.md`
_Cinematic and game VFX in Blender including smoke, fire, particles, trails, and Geometry Nodes FX setups via MCP._

#### VFX / FX

Readable effects. Controlled simulation domains. Game sprites vs cinematic volumes.

##### When to Use

- Smoke, fire, dust, sparks, debris
- Magic / sci-fi energy FX
- Muzzle flashes, trails, impacts
- Geometry Nodes driven particle systems

##### Path Decision

```
Game real-time → Meshes/cards/ribbons + emissive mats (+ GN)
Cinematic     → Mantaflow / particles / GN → render → comp
Hybrid        → Sim in Blender → bake flipbooks/meshes for engine
```

##### Workflow

```
Brief (silhouette + timing) → Proxy emitter → Sim/GN prototype
  → Art-direct motion → Materials/lights → Cache → Render/comp or export
```

##### Effect Types

| Type | Blender Approach |
|------|------------------|
| Smoke/fire | Mantaflow domain + flow; keep domain tight |
| Sparks | Particle Newtonian + collision + trail |
| Debris | Rigid body shards (`physics-sim`) |
| Magic ribbons | Curves / GN extrude + emissive |
| Dust hit | Short particle burst + soft sprites |

##### Domain Rules (Volume)

- Domain only as large as needed
- Resolution from low → high after motion approved
- Open borders intentionally; avoid wasted empty voxels
- Collection: `COL_FX_[Shot]`

##### Naming

- Emitters: `FX_Emit_[Name]`
- Domains: `FX_Domain_[Name]`
- Caches: document frame range in brief

##### Game Export Notes

- Prefer mesh cards / GN instances over volume export
- Atlas flipbooks when baking fire/smoke for engines
- Keep pivot at logical spawn point

##### Constraints

###### MUST DO
- Approve motion at low res before high-res sim
- Light FX intentionally (emissive + key)
- Cache before final render

###### MUST NOT DO
- Huge empty domains
- Unbounded particle counts
- Skip timing brief (start/peak/end frames)

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Fx Timing Brief | `references/fx-timing-brief.md` | When needed |
| Volume Domain Rules | `references/volume-domain-rules.md` | When needed |
| Game Fx Export | `references/game-fx-export.md` | When needed |

### `.claude/skills/visual-console-eras/SKILL.md`
_Visual era art direction for Blender covering PS1–PS5 stylistic cues, retro arcade, DOS, CRT, VHS, and film-grain presentation._

#### Visual Console / Media Eras

Match era constraints: polycount, texture filtering, lighting model, and post stack.

### `.claude/skills/voxel-style/SKILL.md`
_Voxel and Minecraft-adjacent art direction for Blender with block grid modeling, limited palettes, and chunk-friendly assets._

#### Voxel Style

Block grid language. Limited palette. Chunk-friendly forms.

##### When to Use

- Minecraft-adjacent / voxel game assets
- Blockout aesthetic as final style
- Grid-snapped props and characters

##### Core Tenets

1. **Grid snap** — Occupancy on explicit voxel size (e.g. 0.1 / 1.0m)
2. **No diagonal organic bevels** — Cubes and stepped forms
3. **Palette atlas** — Few colors; readable blocks
4. **Silhouette via steps** — Not smooth curves
5. **Chunk modularity** — Pieces fit tile sizes

##### Workflow

```
Choose voxel size → Block occupancy → Merge cubes
  → Palette materials → Optional GN instance → Export
```

##### Modeling Tips

- Start from cubes; boolean union / merge by distance
- Characters: stepped limbs, clear head block
- Avoid subdivision surface (breaks voxel language)
- Remesh to blocks only if converting from smooth

##### Materials

- Flat colors or nearest-neighbor textures
- Atlas preferred
- Emission for glow blocks sparingly

##### Vs lowpoly-style

- `lowpoly-style` allows irregular low tris / PS1 vibes
- `voxel-style` enforces grid occupancy aesthetic

##### Constraints

###### MUST DO
- Declare voxel size in brief
- Snap consistently
- Keep palette small

###### MUST NOT DO
- Smooth shading that hides block edges (unless intentional glass)
- Organic sculpt detail

##### Reference Guide

| Topic | Reference | Load When |
|-------|-----------|----------|
| Voxel Grid | `references/voxel-grid.md` | When needed |
| Voxel Characters | `references/voxel-characters.md` | When needed |

---
**Source & credit:** [arjun988/blender-skills](https://github.com/arjun988/blender-skills) @ `904f095` (cloned 2026-11-22). License: MIT. All upstream text in the appendices is © its authors, inlined for personal use with attribution; this wrapper skill by Space Age.
