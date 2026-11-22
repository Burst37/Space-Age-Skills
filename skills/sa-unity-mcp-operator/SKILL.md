---
name: sa-unity-mcp-operator
description: Control the Unity Editor via MCP for Unity: scenes, GameObjects, C# scripts, assets, ProBuilder, tests, profiling, builds; plus Blender-to-Unity handoff. Use when the user says Unity MCP, do this in Unity, create a scene/prefab/script in Unity, or move my Blender model into Unity.
---

# SA Unity MCP Operator
MCP for Unity (CoplayDev): ~50 MCP tool entrypoints over the Unity Editor. Unity 2021.3 LTS → 6.x, Python 3.10+ via uv.

## Setup
1. Unity → Package Manager → Add from git URL: `https://github.com/CoplayDev/unity-mcp.git?path=/MCPForUnity#main` (or `openupm add com.coplaydev.unity-mcp`).
2. `Window → MCP for Unity → Configure All Detected Clients`.
3. Test: "Create a cube at the origin and add a Rigidbody."

## Workflow (resource-first)
1. Read `mcpforunity://editor/state` → scene API → `find_gameobjects`.
2. Act: `manage_gameobject`, `create_script`, `script_apply_edits`/`apply_text_edits`, `validate_script`.
3. After script edits wait for compile; check console; run tests.
4. Templates in references are placeholders; validate names/enums first.
- Blender → Unity: blender-to-unity section (needs sa-blender-mcp-operator connected).
- `/mcp-source [main|beta|branch|local]` swaps package source.

## Space Age rules (override anything in the appendices)
- Lean: do the job, no filler. Read the matching appendix section before acting; don't load everything.
- Ask Chuma before any paid API, credit spend, plan upgrade or new subscription. Use his existing subscriptions first. Never pay or deposit anything.
- Ask before publishing, posting, emailing or submitting a form anywhere.
- Borrow structure from third-party work, never its text, images, branding or code (clean-room via replica-skill-sa).
- Only games Chuma owns. Single-player/offline use only. No anti-cheat, DRM or ownership-check bypass, no online/multiplayer cheating, no touching clients of online games with anti-cheat. (Stricter than upstream, which also allows self-hosted servers.)

## Appendix A — Sub-skill index

| Sub-skill | When | Source |
|---|---|---|
| unity-mcp-orchestrator | Orchestrate Unity Editor via MCP (Model Context Protocol) tools and resources. Use when working with Unity projects through MCP for Unity - creating/modifying GameObjects, editing scripts, managing scenes, running tes... | `unity-mcp-skill/SKILL.md` |
| blender-to-unity | Hand off a model from Blender (via BlenderMCP) into Unity (via MCP for Unity) — export the current Blender model, import it through import_model_file, and place it in the open scene. Use when the user has BlenderMCP a... | `.claude/skills/blender-to-unity/SKILL.md` |
| mcp-source | Switch MCP for Unity package source in connected Unity projects. Use /mcp-source [main/beta/branch/local] to swap between upstream releases, your remote branch, or local dev checkout. | `.claude/skills/mcp-source/SKILL.md` |

## Appendix B — Operator guide

### `unity-mcp-skill/SKILL.md`
_Orchestrate Unity Editor via MCP (Model Context Protocol) tools and resources. Use when working with Unity projects through MCP for Unity - creating/modifying GameObjects, editing scripts, managing scenes, running tests, or any Unity Editor automation. Provides best practices, tool schemas, and workflow patterns for effective Unity-MCP integration._

#### Unity-MCP Operator Guide

This skill helps you effectively use the Unity Editor with MCP tools and resources.

##### Template Notice

Examples in `references/workflows.md` and `references/tools-reference.md` are reusable templates. They may be inaccurate across Unity versions, package setups (UGUI/TMP/Input System), and project-specific conventions. Please check console, compilation errors, or use screenshot after implementation.

Before applying a template:
- Validate targets/components first via resources and `find_gameobjects`.
- Treat names, enum values, and property payloads as placeholders to adapt.

##### Quick Start: Resource-First Workflow

**Always read relevant resources before using tools.** This prevents errors and provides the necessary context.

```
1. Check editor state     → mcpforunity://editor/state
2. Understand the scene   → mcpforunity://scene/gameobject-api
3. Find what you need     → find_gameobjects or resources
4. Take action            → tools (manage_gameobject, create_script, script_apply_edits, apply_text_edits, validate_script, delete_script, get_sha, etc.)
5. Verify results         → read_console, manage_camera(action="screenshot"), resources
```

**If a tool you need is not in your tool list, it is not necessarily missing.** Check these before troubleshooting the connection:

- **Project custom tools** (C# `[McpForUnityTool]`): with project-scoped tools enabled on the server, they are *not* callable by name. List them via `mcpforunity://custom-tools` and run them with `execute_custom_tool(tool_name="...", parameters={...})`. With it disabled, they are registered as ordinary tools and appear in your list.
- **Disabled tool groups**: over HTTP, a session starts with only the `core` group enabled. Over stdio, all groups start enabled and are then synced to the tool toggles in the Unity editor, so a tool can still be hidden. `manage_tools(action="list_groups")` shows the groups, `manage_tools(action="activate", group="...")` enables one.

##### Critical Best Practices

###### 1. After Writing/Editing Scripts: Wait for Compilation and Check Console

```python
# After create_script or script_apply_edits:
# Both tools already trigger AssetDatabase.ImportAsset + RequestScriptCompilation automatically.
# No need to call refresh_unity — just wait for compilation to finish, then check console.

# 1. Poll editor state until compilation completes
# Read mcpforunity://editor/state → wait until is_compiling == false

# 2. Check for compilation errors
read_console(types=["error"], count=10, include_stacktrace=True)
```

**Why:** Unity must compile scripts before they're usable. `create_script` and `script_apply_edits` already trigger import and compilation automatically — calling `refresh_unity` afterward is redundant.

###### 2. Use `batch_execute` for Multiple Operations

```python
# 10-100x faster than sequential calls
batch_execute(
    commands=[
        {"tool": "manage_gameobject", "params": {"action": "create", "name": "Cube1", "primitive_type": "Cube"}},
        {"tool": "manage_gameobject", "params": {"action": "create", "name": "Cube2", "primitive_type": "Cube"}},
        {"tool": "manage_gameobject", "params": {"action": "create", "name": "Cube3", "primitive_type": "Cube"}}
    ],
    parallel=True  # Hint only: Unity may still execute sequentially
)
```

**Max 25 commands per batch by default (configurable in Unity MCP Tools window, max 100).** Use `fail_fast=True` for dependent operations.

**Tip:** Also use `batch_execute` for discovery — batch multiple `find_gameobjects` calls instead of calling them one at a time:
```python
batch_execute(commands=[
    {"tool": "find_gameobjects", "params": {"search_term": "Camera", "search_method": "by_component"}},
    {"tool": "find_gameobjects", "params": {"search_term": "Player", "search_method": "by_tag"}},
    {"tool": "find_gameobjects", "params": {"search_term": "GameManager", "search_method": "by_name"}}
])
```

###### 3. Use Screenshots to Verify Visual Results

```python
# Basic screenshot (saves to Assets/, returns file path only)
manage_camera(action="screenshot")

# Inline screenshot (returns base64 PNG directly to the AI)
manage_camera(action="screenshot", include_image=True)

# Use a specific camera and cap resolution for smaller payloads
manage_camera(action="screenshot", camera="MainCamera", include_image=True, max_resolution=512)

# Batch surround: captures front/back/left/right/top/bird_eye around the scene
manage_camera(action="screenshot", batch="surround", max_resolution=256)

# Batch surround centered on a specific object
manage_camera(action="screenshot", batch="surround", view_target="Player", max_resolution=256)

# Positioned screenshot: place a temp camera and capture in one call
manage_camera(action="screenshot", view_target="Player", view_position=[0, 10, -10], max_resolution=512)

# Scene View screenshot: capture what the developer sees in the editor
manage_camera(action="screenshot", capture_source="scene_view", include_image=True)

# Scene View framed on a specific object
manage_camera(action="screenshot", capture_source="scene_view", view_target="Canvas", include_image=True)
```

**Best practices for AI scene understanding:**
- Use `include_image=True` when you need to *see* the scene, not just save a file.
- Use `batch="surround"` for a comprehensive overview (6 angles, one command).
- Use `view_target`/`view_position` to capture from a specific viewpoint without needing a scene camera.
- Use `capture_source="scene_view"` to see the editor viewport (gizmos, wireframes, grid).
- Keep `max_resolution` at 256–512 to balance quality vs. token cost.

```python
# Agentic camera loop: point, shoot, analyze
manage_gameobject(action="look_at", target="MainCamera", look_at_target="Player")
manage_camera(action="screenshot", camera="MainCamera", include_image=True, max_resolution=512)
# → Analyze image, decide next action

# Multi-view screenshot (6-angle contact sheet)
manage_camera(action="screenshot_multiview", max_resolution=480)

# Scene View for editor-level inspection (shows gizmos, debug overlays, etc.)
manage_camera(action="screenshot", capture_source="scene_view", view_target="Player", include_image=True)
```

###### 4. Check Console After Major Changes

```python
read_console(
    action="get",
    types=["error", "warning"],  # Focus on problems
    count=10,
    format="detailed"
)
```

###### 5. Always Check `mcpforunity://editor/state` Before Complex Operations

```python
# Read mcpforunity://editor/state to check:
# - is_compiling: Wait if true
# - is_domain_reload_pending: Wait if true  
# - ready_for_tools: Only proceed if true
# - blocking_reasons: Why tools might fail
```

##### Parameter Type Conventions

These are common patterns, not strict guarantees. `manage_components.set_property` payload shapes can vary by component/property; if a template fails, inspect the component resource payload and adjust.

###### Vectors (position, rotation, scale, color)
```python
# Both forms accepted:
position=[1.0, 2.0, 3.0]        # List
position="[1.0, 2.0, 3.0]"     # JSON string
```

###### Booleans
```python
# Both forms accepted:
include_inactive=True           # Boolean
include_inactive="true"         # String
```

###### Colors
```python
# Auto-detected format:
color=[255, 0, 0, 255]         # 0-255 range
color=[1.0, 0.0, 0.0, 1.0]    # 0.0-1.0 normalized (auto-converted)
```

###### Paths
```python
# Assets-relative (default):
path="Assets/Scripts/MyScript.cs"

# URI forms:
uri="mcpforunity://path/Assets/Scripts/MyScript.cs"
uri="file:///full/path/to/file.cs"
```

##### Core Tool Categories

| Category | Key Tools | Use For |
|----------|-----------|---------|
| **Scene** | `manage_scene`, `find_gameobjects` | Scene operations, finding objects. Multi-scene editing (additive load, close, set active, move GO between scenes), scene templates (`3d_basic`, `2d_basic`, `empty`, `default`), scene validation with `auto_repair`. For build settings, use `manage_build(action="scenes")`. |
| **Objects** | `manage_gameobject`, `manage_components` | Creating/modifying GameObjects |
| **Scripts** | `create_script`, `script_apply_edits`, `validate_script` | C# code management (auto-refreshes on create/edit) |
| **Assets** | `manage_asset`, `manage_prefabs` | Asset operations. **Prefab instantiation** is done via `manage_gameobject(action="create", prefab_path="...")`, not `manage_prefabs`. |
| **Editor** | `manage_editor`, `execute_menu_item`, `read_console` | Editor control, package deployment (`deploy_package`/`restore_package`), undo/redo (`undo`/`redo` actions) |
| **Testing** | `run_tests`, `get_test_job` | Unity Test Framework |
| **Batch** | `batch_execute` | Parallel/bulk operations |
| **Camera** | `manage_camera` | Camera management (Unity Camera + Cinemachine). **Tier 1** (always available): create, target, lens, priority, list, screenshot. **Tier 2** (requires `com.unity.cinemachine`): brain, body/aim/noise pipeline, extensions, blending, force/release. 7 presets: follow, third_person, freelook, dolly, static, top_down, side_scroller. Resource: `mcpforunity://scene/cameras`. Use `ping` to check Cinemachine availability. See [tools-reference.md](references/tools-reference.md#camera-tools). |
| **Animation** | `manage_animation`, `manage_sprite` | Animator control, clips and controllers. **2D sprite sheets**: `manage_sprite(action="get_info")` returns a PNG or JPEG sheet as an image to count the grid from, then `full_setup` slices it and builds clips and a controller; clip names decide the states (idle, walk/run, attack-type triggers). Off by default over HTTP: `manage_tools(action="activate", group="animation")`. |
| **Graphics** | `manage_graphics` | Rendering and post-processing management. 33 actions across 5 groups: **Volume** (create/configure volumes and effects, URP/HDRP), **Bake** (lightmaps, light probes, reflection probes, Edit mode only), **Stats** (draw calls, batches, memory), **Pipeline** (quality levels, pipeline settings), **Features** (URP renderer features: add, remove, toggle, reorder). Resources: `mcpforunity://scene/volumes`, `mcpforunity://rendering/stats`, `mcpforunity://pipeline/renderer-features`. Use `ping` to check pipeline status. See [tools-reference.md](references/tools-reference.md#graphics-tools). |
| **Packages** | `manage_packages` | Install, remove, search, and manage Unity packages and scoped registries. Query actions: list installed, search registry, get info, ping, poll status. Mutating actions: add/remove packages, embed for editing, add/remove scoped registries, force resolve. Validates identifiers, warns on git URLs, checks dependents before removal (`force=true` to override). See [tools-reference.md](references/tools-reference.md#package-tools). |
| **Physics** | `manage_physics` | Manage 3D and 2D physics (21 actions). Settings, collision matrix, materials, joints (14 types). Queries: `raycast`, `raycast_all`, `linecast`, `shapecast` (sphere/box/capsule sweep), `overlap`. Forces: `apply_force` (AddForce/AddTorque/AddExplosionForce with ForceMode). Rigidbody: `get_rigidbody`, `configure_rigidbody` (mass, drag, gravity, constraints, collision detection). Validation: scene-wide checks. Simulation: `simulate_step` in edit mode. See [tools-reference.md](references/tools-reference.md#physics-tools). |
| **ProBuilder** | `manage_probuilder` | 3D modeling, mesh editing, complex geometry. **When `com.unity.probuilder` is installed, prefer ProBuilder shapes over primitive GameObjects** for editable geometry, multi-material faces, or complex shapes. Supports 12 shape types, face/edge/vertex editing, smoothing, and per-face materials. See [ProBuilder Guide](references/probuilder-guide.md). |
| **UI** | `manage_ui`, `batch_execute` with `manage_gameobject` + `manage_components` | **UI Toolkit**: Use `manage_ui` to create UXML/USS files, attach UIDocument, inspect visual trees. **uGUI (Canvas)**: Use `batch_execute` for Canvas, Panel, Button, Text, Slider, Toggle, Input Field. **Read `mcpforunity://project/info` first** to detect uGUI/TMP/Input System/UI Toolkit availability. (see [UI workflows](references/workflows.md#ui-creation-workflows)) |
| **Docs** | `unity_reflect`, `unity_docs` | API verification and documentation lookup. **`unity_reflect`** inspects live C# APIs via reflection (requires Unity connection): `search` types across assemblies, `get_type` for member summary, `get_member` for full signatures. **`unity_docs`** fetches official docs from docs.unity3d.com (no Unity connection needed): `get_doc` (ScriptReference), `get_manual` (Manual pages), `get_package_doc` (package docs), `lookup` (parallel search all sources + project assets). **Trust hierarchy: reflection > project assets > docs.** Workflow: `unity_reflect` search -> get_type -> get_member -> `unity_docs` lookup. See [tools-reference.md](references/tools-reference.md#docs-tools). |
| **More** | `manage_material`, `manage_texture`, `manage_shader`, `manage_vfx`, `manage_profiler`, `execute_code`, `manage_scriptable_object`, `generate_image`, `generate_model`, `generate_audio`, `import_model`, `import_model_file`, `blender_bridge` | Materials; textures, shaders and VFX (`vfx` group); profiling (`profiling`); in-editor C# and ScriptableObjects (`scripting_ext`); AI asset generation, Sketchfab and on-disk model import, Blender (`asset_gen`). Every tool has a section in [tools-reference.md](references/tools-reference.md). |

##### Common Workflows

###### Creating a New Script and Using It

```python
# 1. Create the script (automatically triggers import + compilation)
create_script(
    path="Assets/Scripts/PlayerController.cs",
    contents="using UnityEngine;\n\npublic class PlayerController : MonoBehaviour\n{\n    void Update() { }\n}"
)

# 2. Wait for compilation to finish
# Read mcpforunity://editor/state → wait until is_compiling == false

# 3. Check for compilation errors
read_console(types=["error"], count=10)

# 4. Only then attach to GameObject
manage_gameobject(action="modify", target="Player", components_to_add=["PlayerController"])
```

###### Finding and Modifying GameObjects

```python
# 1. Find by name/tag/component (returns IDs only)
result = find_gameobjects(search_term="Enemy", search_method="by_tag", page_size=50)

# 2. Get full data via resource
# mcpforunity://scene/gameobject/{instance_id}

# 3. Modify using the ID
manage_gameobject(action="modify", target=instance_id, position=[10, 0, 0])
```

###### Running and Monitoring Tests

```python
# 1. Start test run (async)
result = run_tests(mode="EditMode", test_names=["MyTests.TestSomething"])
job_id = result["job_id"]

# 2. Poll for completion
result = get_test_job(job_id=job_id, wait_timeout=60, include_failed_tests=True)
```

##### Pagination Pattern

Large queries return paginated results. Always follow `next_cursor`:

```python
cursor = 0
all_items = []
while True:
    result = manage_scene(action="get_hierarchy", page_size=50, cursor=cursor)
    all_items.extend(result["data"]["items"])
    if not result["data"].get("next_cursor"):
        break
    cursor = result["data"]["next_cursor"]
```

##### Multi-Instance Workflow

When multiple Unity Editors are running:

```python
# 1. List instances via resource: mcpforunity://instances
# 2. Set active instance
set_active_instance(instance="MyProject@abc123")
# 3. All subsequent calls route to that instance
```

##### Error Recovery

| Symptom | Cause | Solution |
|---------|-------|----------|
| Tools return "busy" | Compilation in progress | Wait, check `mcpforunity://editor/state` |
| "stale_file" error | File changed since SHA | Re-fetch SHA with `get_sha`, retry |
| Connection lost | Domain reload | Wait ~5s, reconnect |
| Commands fail silently | Wrong instance | Check `set_active_instance` |

##### Reference Files

For detailed schemas and examples:

- **[tools-reference.md](references/tools-reference.md)**: Every tool's main actions, parameters, and examples, with links to the full parameter tables
- **[resources-reference.md](references/resources-reference.md)**: All available resources and their data
- **[workflows.md](references/workflows.md)**: Extended workflow examples and patterns
- **[probuilder-guide.md](references/probuilder-guide.md)**: ProBuilder modeling patterns

## Appendix C — References

### `unity-mcp-skill/references/workflows.md`
#### Unity-MCP Workflow Patterns

Common workflows and patterns for effective Unity-MCP usage.

##### Table of Contents

- [Setup & Verification](#setup--verification)
- [Scene Creation Workflows](#scene-creation-workflows)
- [Script Development Workflows](#script-development-workflows)
- [Asset Management Workflows](#asset-management-workflows)
- [Testing Workflows](#testing-workflows)
- [Debugging Workflows](#debugging-workflows)
- [UI Creation Workflows](#ui-creation-workflows)
- [Camera & Cinemachine Workflows](#camera--cinemachine-workflows)
- [ProBuilder Workflows](#probuilder-workflows)
- [Graphics & Rendering Workflows](#graphics--rendering-workflows)
- [Package Management Workflows](#package-management-workflows)
- [Package Deployment Workflows](#package-deployment-workflows)
- [API Verification Workflows](#api-verification-workflows)
- [Batch Operations](#batch-operations)

---

##### Setup & Verification

###### Initial Connection Verification

```python
# 1. Check editor state
# Read mcpforunity://editor/state

# 2. Verify ready_for_tools == true
# If false, wait for recommended_retry_after_ms

# 3. Check active scene
# Read mcpforunity://editor/state → active_scene

# 4. List available instances (multi-instance)
# Read mcpforunity://instances
```

###### Before Any Operation

```python
# Quick readiness check pattern:
editor_state = read_resource("mcpforunity://editor/state")

if not editor_state["ready_for_tools"]:
    # Check blocking_reasons
    # Wait recommended_retry_after_ms
    pass

if editor_state["is_compiling"]:
    # Wait for compilation to complete
    pass
```

---

##### Scene Generator Build Workflow

###### Fresh Scene Before Building

**Always start a generated scene build with `manage_scene(action="create")`** to get a clean empty scene. This avoids conflicts with existing default objects (Camera, Light) that would cause "already exists" errors when the execution plan tries to create its own.

```python
# Step 0: Create fresh empty scene (replaces current scene entirely)
manage_scene(action="create", name="MyGeneratedScene", path="Assets/Scenes/")

# Now proceed with the phased execution plan...
# Phase 1: Environment (camera, lights) — no conflicts
# Phase 2: Objects (GameObjects)
# Phase 3: Materials
# etc.
```

###### Wiring Object References Between Components

After creating scripts and attaching components, use `set_property` to wire cross-references between GameObjects. Use the `{"name": "ObjectName"}` format to reference scene objects by name:

```python
# Wire a list of target GameObjects into a script's serialized field
manage_components(
    action="set_property",
    target="BeeManager",
    component_type="BeeManagerScript",
    property="targetObjects",
    value=[{"name": "Flower_1"}, {"name": "Flower_2"}, {"name": "Flower_3"}]
)
```

###### Physics Requirements for Trigger-Based Interactions

When scripts use `OnTriggerEnter` / `OnTriggerStay` / `OnTriggerExit`, at least one of the two colliding objects **must** have a `Rigidbody` component. Common pattern:

```python
# Moving objects (bees, players) need Rigidbody for triggers to fire
batch_execute(commands=[
    {"tool": "manage_components", "params": {
        "action": "add", "target": "Bee_1", "component_type": "Rigidbody"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "Bee_1",
        "component_type": "Rigidbody",
        "properties": {"useGravity": false, "isKinematic": true}
    }}
])
```

###### Script Overwrites with `replace_class`

When a generated script needs to be rewritten (e.g., to add auto-wiring logic), replace its class in place instead of deleting and recreating the file: a recreated script gets a new GUID, so components already using it lose their reference. `create_script` refuses to overwrite an existing file, and `manage_script` has no update action.

```python
script_apply_edits(
    name="MyScript",
    path="Assets/Scripts",
    edits=[{"op": "replace_class", "className": "MyScript",
            "replacement": "public class MyScript : MonoBehaviour { ... }"}]
)
# script_apply_edits auto-triggers import + compile — just wait and check console
# Read mcpforunity://editor/state → wait until is_compiling == false
read_console(types=["error"], count=10)
```

---

##### Scene Creation Workflows

###### Create Complete Scene from Scratch

```python
# 1. Create new scene
manage_scene(action="create", name="GameLevel", path="Assets/Scenes/")

# 2. Batch create environment objects
batch_execute(commands=[
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "Ground", "primitive_type": "Plane",
        "position": [0, 0, 0], "scale": [10, 1, 10]
    }},
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "Light", "primitive_type": "Cube"
    }},
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "Player", "primitive_type": "Capsule",
        "position": [0, 1, 0]
    }}
])

# 3. Add light component (delete cube mesh, add light)
manage_components(action="remove", target="Light", component_type="MeshRenderer")
manage_components(action="remove", target="Light", component_type="MeshFilter")
manage_components(action="remove", target="Light", component_type="BoxCollider")
manage_components(action="add", target="Light", component_type="Light")
manage_components(action="set_property", target="Light", component_type="Light",
    property="type", value="Directional")

# 4. Set up camera
manage_gameobject(action="modify", target="Main Camera", position=[0, 5, -10],
    rotation=[30, 0, 0])

# 5. Verify with screenshot
manage_camera(action="screenshot")

# 6. Save scene
manage_scene(action="save")
```

###### Populate Scene with Grid of Objects

```python
# Create 5x5 grid of cubes using batch
commands = []
for x in range(5):
    for z in range(5):
        commands.append({
            "tool": "manage_gameobject",
            "params": {
                "action": "create",
                "name": f"Cube_{x}_{z}",
                "primitive_type": "Cube",
                "position": [x * 2, 0, z * 2]
            }
        })

# Execute in batches of 25
batch_execute(commands=commands[:25], parallel=True)
```

###### Clone and Arrange Objects

```python
# Find template object
result = find_gameobjects(search_term="Template", search_method="by_name")
template_id = result["ids"][0]

# Duplicate in a line
for i in range(10):
    manage_gameobject(
        action="duplicate",
        target=template_id,
        new_name=f"Instance_{i}",
        offset=[i * 2, 0, 0]
    )
```

---

##### Script Development Workflows

###### Create New Script and Attach

```python
# 1. Create script (automatically triggers import + compilation)
create_script(
    path="Assets/Scripts/EnemyAI.cs",
    contents='''using UnityEngine;

public class EnemyAI : MonoBehaviour
{
    public float speed = 5f;
    public Transform target;

    void Update()
    {
        if (target != null)
        {
            Vector3 direction = (target.position - transform.position).normalized;
            transform.position += direction * speed * Time.deltaTime;
        }
    }
}'''
)

# 2. Wait for compilation to finish
# Read mcpforunity://editor/state → wait until is_compiling == false

# 3. Check for errors
console = read_console(types=["error"], count=10)
if console["messages"]:
    # Handle compilation errors
    print("Compilation errors:", console["messages"])
else:
    # 4. Attach to GameObject
    manage_gameobject(action="modify", target="Enemy", components_to_add=["EnemyAI"])

    # 5. Set component properties
    manage_components(
        action="set_property",
        target="Enemy",
        component_type="EnemyAI",
        properties={
            "speed": 10.0
        }
    )
```

###### Edit Existing Script Safely

```python
# 1. Get current SHA
sha_info = get_sha(uri="mcpforunity://path/Assets/Scripts/PlayerController.cs")

# 2. Find the method to edit
matches = find_in_file(
    uri="mcpforunity://path/Assets/Scripts/PlayerController.cs",
    pattern="void Update\\(\\)"
)

# 3. Apply structured edit
script_apply_edits(
    name="PlayerController",
    path="Assets/Scripts",
    edits=[{
        "op": "replace_method",
        "methodName": "Update",
        "replacement": '''void Update()
    {
        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");
        transform.Translate(new Vector3(h, 0, v) * speed * Time.deltaTime);
    }'''
    }]
)

# 4. Validate
validate_script(
    uri="mcpforunity://path/Assets/Scripts/PlayerController.cs",
    level="standard"
)

# 5. Wait for compilation (script_apply_edits auto-triggers import + compile)
# Read mcpforunity://editor/state → wait until is_compiling == false

# 6. Check console
read_console(types=["error"], count=10)
```

###### Add Method to Existing Class

```python
script_apply_edits(
    name="GameManager",
    path="Assets/Scripts",
    edits=[
        {
            "op": "insert_method",
            "afterMethod": "Start",
            "code": '''
    public void ResetGame()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }'''
        },
        {
            "op": "anchor_insert",
            "anchor": "using UnityEngine;",
            "position": "after",
            "text": "\nusing UnityEngine.SceneManagement;"
        }
    ]
)
```

---

##### Asset Management Workflows

###### Create and Apply Material

```python
# 1. Create material
manage_material(
    action="create",
    material_path="Assets/Materials/PlayerMaterial.mat",
    shader="Standard",
    properties={
        "_Color": [0.2, 0.5, 1.0, 1.0],
        "_Metallic": 0.5,
        "_Glossiness": 0.8
    }
)

# 2. Assign to renderer
manage_material(
    action="assign_material_to_renderer",
    target="Player",
    material_path="Assets/Materials/PlayerMaterial.mat",
    slot=0
)

# 3. Verify visually
manage_camera(action="screenshot")
```

###### Create Procedural Texture

```python
# 1. Create base texture
manage_texture(
    action="create",
    path="Assets/Textures/Checkerboard.png",
    width=256,
    height=256,
    fill_color=[255, 255, 255, 255]
)

# 2. Apply checkerboard pattern
manage_texture(
    action="apply_pattern",
    path="Assets/Textures/Checkerboard.png",
    pattern="checkerboard",
    palette=[[0, 0, 0, 255], [255, 255, 255, 255]],
    pattern_size=32
)

# 3. Create material with texture
manage_material(
    action="create",
    material_path="Assets/Materials/CheckerMaterial.mat",
    shader="Standard"
)

# 4. Assign texture to material (via manage_material set_material_shader_property)
```

###### Organize Assets into Folders

```python
# 1. Create folder structure
batch_execute(commands=[
    {"tool": "manage_asset", "params": {"action": "create_folder", "path": "Assets/Prefabs"}},
    {"tool": "manage_asset", "params": {"action": "create_folder", "path": "Assets/Materials"}},
    {"tool": "manage_asset", "params": {"action": "create_folder", "path": "Assets/Scripts"}},
    {"tool": "manage_asset", "params": {"action": "create_folder", "path": "Assets/Textures"}}
])

# 2. Move existing assets
manage_asset(action="move", path="Assets/MyMaterial.mat", destination="Assets/Materials/MyMaterial.mat")
manage_asset(action="move", path="Assets/MyScript.cs", destination="Assets/Scripts/MyScript.cs")
```

###### Search and Process Assets

```python
# Find all prefabs
result = manage_asset(
    action="search",
    path="Assets",
    search_pattern="*.prefab",
    page_size=50,
    generate_preview=False
)

# Process each prefab
for asset in result["assets"]:
    prefab_path = asset["path"]
    # Get prefab info
    info = manage_prefabs(action="get_info", prefab_path=prefab_path)
    print(f"Prefab: {prefab_path}, Children: {info['childCount']}")
```

###### Instantiate Prefab in Scene

Use `manage_gameobject` (not `manage_prefabs`) to place prefab instances in the scene.

```python
# Full path
manage_gameobject(
    action="create",
    name="Enemy_1",
    prefab_path="Assets/Prefabs/Enemy.prefab",
    position=[5, 0, 3],
    parent="Enemies"
)

# Smart lookup — just the prefab name works too
manage_gameobject(action="create", name="Enemy_2", prefab_path="Enemy", position=[10, 0, 3])

# Batch-spawn multiple instances
batch_execute(commands=[
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": f"Enemy_{i}",
        "prefab_path": "Enemy", "position": [i * 3, 0, 0], "parent": "Enemies"
    }}
    for i in range(5)
])
```

> **Note:** `manage_prefabs` is for headless prefab editing (inspect, modify contents, create from GameObject). To *instantiate* a prefab into the scene, always use `manage_gameobject(action="create", prefab_path="...")`.

---

##### Testing Workflows

###### Run Specific Tests

```python
# 1. List available tests
# Read mcpforunity://tests/EditMode

# 2. Run specific tests
result = run_tests(
    mode="EditMode",
    test_names=["MyTests.TestPlayerMovement", "MyTests.TestEnemySpawn"],
    include_failed_tests=True
)
job_id = result["job_id"]

# 3. Wait for results
final_result = get_test_job(
    job_id=job_id,
    wait_timeout=60,
    include_failed_tests=True
)

# 4. Check results
if final_result["status"] == "complete":
    for test in final_result.get("failed_tests", []):
        print(f"FAILED: {test['name']}: {test['message']}")
```

###### Run Tests by Category

```python
# Run all unit tests
result = run_tests(
    mode="EditMode",
    category_names=["Unit"],
    include_failed_tests=True
)

# Poll until complete
while True:
    status = get_test_job(job_id=result["job_id"], wait_timeout=30)
    if status["status"] in ["complete", "failed"]:
        break
```

###### Test-Driven Development Pattern

```python
# 1. Write test first
create_script(
    path="Assets/Tests/Editor/PlayerTests.cs",
    contents='''using NUnit.Framework;
using UnityEngine;

public class PlayerTests
{
    [Test]
    public void TestPlayerStartsAtOrigin()
    {
        var player = new GameObject("TestPlayer");
        Assert.AreEqual(Vector3.zero, player.transform.position);
        Object.DestroyImmediate(player);
    }
}'''
)

# 2. Wait for compilation (create_script auto-triggers import + compile)
# Read mcpforunity://editor/state → wait until is_compiling == false

# 3. Run test (expect pass for this simple test)
result = run_tests(mode="EditMode", test_names=["PlayerTests.TestPlayerStartsAtOrigin"])
get_test_job(job_id=result["job_id"], wait_timeout=30)
```

---

##### Debugging Workflows

###### Diagnose Compilation Errors

```python
# 1. Check console for errors
errors = read_console(
    types=["error"],
    count=20,
    include_stacktrace=True,
    format="detailed"
)

# 2. For each error, find the file and line
for error in errors["messages"]:
    # Parse error message for file:line info
    # Use find_in_file to locate the problematic code
    pass

# 3. After fixing, refresh and check again
refresh_unity(mode="force", scope="scripts", compile="request", wait_for_ready=True)
read_console(types=["error"], count=10)
```

###### Investigate Missing References

```python
# 1. Find the GameObject
result = find_gameobjects(search_term="Player", search_method="by_name")

# 2. Get all components
# Read mcpforunity://scene/gameobject/{id}/components

# 3. Check for null references in serialized fields
# Look for fields with null/missing values

# 4. Find the referenced object
result = find_gameobjects(search_term="Target", search_method="by_name")

# 5. Set the reference
manage_components(
    action="set_property",
    target="Player",
    component_type="PlayerController",
    property="target",
    value={"instanceID": result["ids"][0]}  # Reference by ID
)
```

###### Check Scene State

```python
# 1. Get hierarchy
hierarchy = manage_scene(action="get_hierarchy", page_size=100, include_transform=True)

# 2. Find objects at unexpected positions
for item in hierarchy["data"]["items"]:
    if item.get("transform", {}).get("position", [0,0,0])[1] < -100:
        print(f"Object {item['name']} fell through floor!")

# 3. Visual verification
manage_camera(action="screenshot")
```

---

##### UI Creation Workflows

Unity has two UI systems: **UI Toolkit** (modern, recommended) and **uGUI** (Canvas-based, legacy). Use `manage_ui` for UI Toolkit workflows, and `batch_execute` with `manage_gameobject` + `manage_components` for uGUI.

> **Template warning:** This section is a skill template library, not a guaranteed source of truth. Examples may be inaccurate for your Unity version, package setup, or project conventions.
> **Use safely:**
> 1. **Always read `mcpforunity://project/info` first** to detect installed packages and input system.
> 2. Validate component/property names against the current project.
> 3. Prefer targeting by instance ID or full path over generic names.
> 4. Treat numeric enum values as placeholders and verify before reuse.

###### Step 0: Detect Project UI Capabilities

**Before creating any UI**, read project info to determine which packages and input system are available.

```python
# Read mcpforunity://project/info — returns:
# {
#   "renderPipeline": "BuiltIn" | "Universal" | "HighDefinition" | "Custom",
#   "activeInputHandler": "Old" | "New" | "Both",
#   "packages": {
#     "ugui": true/false,        — com.unity.ugui (Canvas, Image, Button, etc.)
#     "textmeshpro": true/false,  — com.unity.textmeshpro (TextMeshProUGUI)
#     "inputsystem": true/false,  — com.unity.inputsystem (new Input System)
#     "uiToolkit": true/false,    — UI Toolkit (always true for Unity 2021.3+)
#     "screenCapture": true/false  — ScreenCapture module enabled
#   }
# }
```

**Decision matrix:**

| project_info field | Value | What to use |
|---|---|---|
| `packages.uiToolkit` | `true` | **Preferred:** Use `manage_ui` for UI Toolkit (UXML/USS) |
| `packages.ugui` | `true` | Canvas-based UI (Image, Button, etc.) via `batch_execute` |
| `packages.textmeshpro` | `true` | `TextMeshProUGUI` for text (uGUI) |
| `packages.textmeshpro` | `false` | `UnityEngine.UI.Text` (legacy, lower quality) |
| `activeInputHandler` | `"Old"` | `StandaloneInputModule` for EventSystem (uGUI) |
| `activeInputHandler` | `"New"` | `InputSystemUIInputModule` for EventSystem (uGUI) |
| `activeInputHandler` | `"Both"` | Either works; prefer `InputSystemUIInputModule` for UI |

###### UI Toolkit Workflows (manage_ui)

UI Toolkit uses a web-like approach: **UXML** (like HTML) for structure, **USS** (like CSS) for styling. This is the preferred UI system for new projects.

> **Important:** Always use `<ui:Style>` (with the `ui:` namespace prefix) in UXML, not bare `<Style>`. UI Builder will fail to open files that use `<Style>` without the prefix.

###### Create a Complete UI Screen

```python
# 1. Create UXML document (structure)
manage_ui(
    action="create",
    path="Assets/UI/MainMenu.uxml",
    contents='''<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements">
    <ui:Style src="Assets/UI/MainMenu.uss" />
    <ui:VisualElement name="root" class="root-container">
        <ui:Label text="My Game" class="title" />
        <ui:Button text="Play" name="play-btn" class="menu-button" />
        <ui:Button text="Settings" name="settings-btn" class="menu-button" />
        <ui:Button text="Quit" name="quit-btn" class="menu-button" />
    </ui:VisualElement>
</ui:UXML>'''
)

# 2. Create USS stylesheet (styling)
manage_ui(
    action="create",
    path="Assets/UI/MainMenu.uss",
    contents='''.root-container {
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
}
.title {
    font-size: 48px;
    color: white;
    -unity-font-style: bold;
    margin-bottom: 40px;
}
.menu-button {
    width: 300px;
    height: 60px;
    font-size: 24px;
    margin: 8px;
    background-color: rgb(50, 120, 200);
    color: white;
    border-radius: 8px;
}
.menu-button:hover {
    background-color: rgb(70, 140, 220);
}'''
)

# 3. Create a GameObject and attach UIDocument
manage_gameobject(action="create", name="UIRoot")
manage_ui(
    action="attach_ui_document",
    target="UIRoot",
    source_asset="Assets/UI/MainMenu.uxml"
    # panel_settings auto-created if omitted
)

# 4. Verify the visual tree
manage_ui(action="get_visual_tree", target="UIRoot", max_depth=5)
```

###### Update Existing UI

```python
# Read current content
result = manage_ui(action="read", path="Assets/UI/MainMenu.uss")
# Modify and update
manage_ui(
    action="update",
    path="Assets/UI/MainMenu.uss",
    contents=".title { font-size: 64px; color: yellow; }"
)
```

###### Custom PanelSettings

```python
# Create PanelSettings with ScaleWithScreenSize
manage_ui(
    action="create_panel_settings",
    path="Assets/UI/GamePanelSettings.asset",
    scale_mode="ScaleWithScreenSize",
    reference_resolution={"width": 1920, "height": 1080}
)

# Attach UIDocument with custom PanelSettings
manage_ui(
    action="attach_ui_document",
    target="UIRoot",
    source_asset="Assets/UI/MainMenu.uxml",
    panel_settings="Assets/UI/GamePanelSettings.asset"
)
```

###### uGUI (Canvas-Based) Workflows

The sections below cover legacy Canvas-based UI using `batch_execute`. Use these when working with existing uGUI projects or when UI Toolkit is not suitable.

###### RectTransform Sizing (Critical for All UI Children)

Every GameObject under a Canvas gets a `RectTransform` instead of `Transform`. **Without setting anchor/size, UI elements default to zero size and won't be visible.** Use `set_property` on `RectTransform`:

```python
# Stretch to fill parent (common for panels/backgrounds)
{"tool": "manage_components", "params": {
    "action": "set_property", "target": "MyPanel",
    "component_type": "RectTransform",
    "properties": {
        "anchorMin": [0, 0],        # bottom-left corner
        "anchorMax": [1, 1],        # top-right corner
        "sizeDelta": [0, 0],        # no extra size beyond anchors
        "anchoredPosition": [0, 0]  # centered on anchors
    }
}}

# Fixed-size centered element (e.g. 300x50 button)
{"tool": "manage_components", "params": {
    "action": "set_property", "target": "MyButton",
    "component_type": "RectTransform",
    "properties": {
        "anchorMin": [0.5, 0.5],
        "anchorMax": [0.5, 0.5],
        "sizeDelta": [300, 50],
        "anchoredPosition": [0, 0]
    }
}}

# Top-anchored bar (e.g. health bar at top of screen)
{"tool": "manage_components", "params": {
    "action": "set_property", "target": "TopBar",
    "component_type": "RectTransform",
    "properties": {
        "anchorMin": [0, 1],        # left-top
        "anchorMax": [1, 1],        # right-top (stretch horizontally)
        "sizeDelta": [0, 60],       # 60px tall, full width
        "anchoredPosition": [0, -30] # offset down by half height
    }
}}
```

> **Note:** Vector2 properties accept both `[x, y]` array format and `{"x": ..., "y": ...}` object format.

###### Create Canvas (Foundation for All UI)

Every UI element must be under a Canvas. A Canvas requires three components: `Canvas`, `CanvasScaler`, and `GraphicRaycaster`.

```python
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "MainCanvas"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "MainCanvas", "component_type": "Canvas"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "MainCanvas", "component_type": "CanvasScaler"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "MainCanvas", "component_type": "GraphicRaycaster"
    }},
    # renderMode: 0=ScreenSpaceOverlay, 1=ScreenSpaceCamera, 2=WorldSpace
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "MainCanvas",
        "component_type": "Canvas", "property": "renderMode", "value": 0
    }},
    # CanvasScaler: uiScaleMode 1=ScaleWithScreenSize
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "MainCanvas",
        "component_type": "CanvasScaler", "property": "uiScaleMode", "value": 1
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "MainCanvas",
        "component_type": "CanvasScaler", "property": "referenceResolution",
        "value": [1920, 1080]
    }}
])
```

###### Create EventSystem (Required Once Per Scene for UI Interaction)

If no EventSystem exists in the scene, buttons and other interactive UI elements won't respond to input. Create one alongside your first Canvas. **Check `project_info.activeInputHandler` to pick the correct input module.**

```python
# For activeInputHandler == "New" or "Both" (project has Input System package):
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "EventSystem"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "EventSystem",
        "component_type": "UnityEngine.EventSystems.EventSystem"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "EventSystem",
        "component_type": "UnityEngine.InputSystem.UI.InputSystemUIInputModule"
    }}
])

# For activeInputHandler == "Old" (legacy Input Manager only):
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "EventSystem"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "EventSystem",
        "component_type": "UnityEngine.EventSystems.EventSystem"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "EventSystem",
        "component_type": "UnityEngine.EventSystems.StandaloneInputModule"
    }}
])
```

###### Create Panel (Background Container)

A Panel is an Image component used as a background/container for other UI elements.

```python
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "MenuPanel", "parent": "MainCanvas"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "MenuPanel", "component_type": "Image"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "MenuPanel",
        "component_type": "Image", "property": "color",
        "value": [0.1, 0.1, 0.1, 0.8]
    }},
    # Size the panel (stretch to 60% of canvas, centered)
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "MenuPanel",
        "component_type": "RectTransform",
        "properties": {
            "anchorMin": [0.2, 0.1], "anchorMax": [0.8, 0.9],
            "sizeDelta": [0, 0], "anchoredPosition": [0, 0]
        }
    }}
])
```

###### Create Text (TextMeshPro)

TextMeshProUGUI automatically adds a RectTransform when added to a child of a Canvas. If `packages.textmeshpro` is `false`, use `UnityEngine.UI.Text` instead.

```python
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "TitleText", "parent": "MenuPanel"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "TitleText",
        "component_type": "TextMeshProUGUI"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "TitleText",
        "component_type": "TextMeshProUGUI",
        "properties": {
            "text": "My Game Title",
            "fontSize": 48,
            "alignment": 514,
            "color": [1, 1, 1, 1]
        }
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "TitleText",
        "component_type": "RectTransform",
        "properties": {
            "anchorMin": [0, 0.8], "anchorMax": [1, 1],
            "sizeDelta": [0, 0], "anchoredPosition": [0, 0]
        }
    }}
])
```

> **TextMeshPro alignment values:** 257=TopLeft, 258=TopCenter, 260=TopRight, 513=MiddleLeft, 514=MiddleCenter, 516=MiddleRight, 1025=BottomLeft, 1026=BottomCenter, 1028=BottomRight.

###### Create Button (With Label)

A Button needs an `Image` (visual) + `Button` (interaction) on the parent, and a child with `TextMeshProUGUI` for the label.

```python
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "StartButton", "parent": "MenuPanel"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "StartButton", "component_type": "Image"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "StartButton", "component_type": "Button"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "StartButton",
        "component_type": "Image", "property": "color",
        "value": [0.2, 0.6, 1.0, 1.0]
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "StartButton",
        "component_type": "RectTransform",
        "properties": {
            "anchorMin": [0.5, 0.5], "anchorMax": [0.5, 0.5],
            "sizeDelta": [300, 60], "anchoredPosition": [0, 0]
        }
    }},
    # Child text label (stretches to fill button)
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "StartButton_Label", "parent": "StartButton"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "StartButton_Label",
        "component_type": "TextMeshProUGUI"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "StartButton_Label",
        "component_type": "TextMeshProUGUI",
        "properties": {"text": "Start Game", "fontSize": 24, "alignment": 514}
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "StartButton_Label",
        "component_type": "RectTransform",
        "properties": {
            "anchorMin": [0, 0], "anchorMax": [1, 1],
            "sizeDelta": [0, 0], "anchoredPosition": [0, 0]
        }
    }}
])
```

###### Create Slider (With Reference Wiring)

A Slider requires a specific hierarchy and **must have its `fillRect` and `handleRect` references wired** to function.

```python
# Step 1: Create hierarchy
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "HealthSlider", "parent": "MainCanvas"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "HealthSlider", "component_type": "Slider"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "HealthSlider", "component_type": "Image"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "HealthSlider",
        "component_type": "RectTransform",
        "properties": {
            "anchorMin": [0.5, 0.5], "anchorMax": [0.5, 0.5],
            "sizeDelta": [400, 30], "anchoredPosition": [0, 0]
        }
    }},
    # Background
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "SliderBG", "parent": "HealthSlider"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "SliderBG", "component_type": "Image"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "SliderBG",
        "component_type": "Image", "property": "color", "value": [0.3, 0.3, 0.3, 1.0]
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "SliderBG",
        "component_type": "RectTransform",
        "properties": {"anchorMin": [0, 0], "anchorMax": [1, 1], "sizeDelta": [0, 0]}
    }},
    # Fill Area + Fill
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "FillArea", "parent": "HealthSlider"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "FillArea",
        "component_type": "RectTransform",
        "properties": {"anchorMin": [0, 0], "anchorMax": [1, 1], "sizeDelta": [0, 0]}
    }},
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "SliderFill", "parent": "FillArea"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "SliderFill", "component_type": "Image"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "SliderFill",
        "component_type": "Image", "property": "color", "value": [0.2, 0.8, 0.2, 1.0]
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "SliderFill",
        "component_type": "RectTransform",
        "properties": {"anchorMin": [0, 0], "anchorMax": [1, 1], "sizeDelta": [0, 0]}
    }},
    # Handle Area + Handle
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "HandleArea", "parent": "HealthSlider"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "HandleArea",
        "component_type": "RectTransform",
        "properties": {"anchorMin": [0, 0], "anchorMax": [1, 1], "sizeDelta": [0, 0]}
    }},
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "SliderHandle", "parent": "HandleArea"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "SliderHandle", "component_type": "Image"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "SliderHandle",
        "component_type": "RectTransform",
        "properties": {"anchorMin": [0.5, 0], "anchorMax": [0.5, 1], "sizeDelta": [20, 0]}
    }}
])

# Step 2: Wire Slider references (CRITICAL — slider won't work without this)
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "HealthSlider",
        "component_type": "Slider", "property": "fillRect",
        "value": {"name": "SliderFill"}
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "HealthSlider",
        "component_type": "Slider", "property": "handleRect",
        "value": {"name": "SliderHandle"}
    }}
])
```

###### Create Input Field (With Reference Wiring)

```python
# Step 1: Create hierarchy
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "NameInput", "parent": "MenuPanel"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "NameInput", "component_type": "Image"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "NameInput",
        "component_type": "TMP_InputField"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "NameInput",
        "component_type": "RectTransform",
        "properties": {
            "anchorMin": [0.5, 0.5], "anchorMax": [0.5, 0.5],
            "sizeDelta": [400, 50], "anchoredPosition": [0, 0]
        }
    }},
    # Text Area child (clips text to input bounds)
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "InputTextArea", "parent": "NameInput"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "InputTextArea", "component_type": "RectMask2D"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "InputTextArea",
        "component_type": "RectTransform",
        "properties": {"anchorMin": [0, 0], "anchorMax": [1, 1], "sizeDelta": [-16, -8]}
    }},
    # Placeholder
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "InputPlaceholder", "parent": "InputTextArea"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "InputPlaceholder", "component_type": "TextMeshProUGUI"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "InputPlaceholder",
        "component_type": "TextMeshProUGUI",
        "properties": {"text": "Enter name...", "fontStyle": 2, "color": [0.5, 0.5, 0.5, 0.5]}
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "InputPlaceholder",
        "component_type": "RectTransform",
        "properties": {"anchorMin": [0, 0], "anchorMax": [1, 1], "sizeDelta": [0, 0]}
    }},
    # Actual text display
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "InputText", "parent": "InputTextArea"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "InputText", "component_type": "TextMeshProUGUI"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "InputText",
        "component_type": "RectTransform",
        "properties": {"anchorMin": [0, 0], "anchorMax": [1, 1], "sizeDelta": [0, 0]}
    }}
])

# Step 2: Wire TMP_InputField references (CRITICAL)
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "NameInput",
        "component_type": "TMP_InputField", "property": "textViewport",
        "value": {"name": "InputTextArea"}
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "NameInput",
        "component_type": "TMP_InputField", "property": "textComponent",
        "value": {"name": "InputText"}
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "NameInput",
        "component_type": "TMP_InputField", "property": "placeholder",
        "value": {"name": "InputPlaceholder"}
    }}
])
```

###### Create Toggle (With Reference Wiring)

```python
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "SoundToggle", "parent": "MenuPanel"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "SoundToggle", "component_type": "Toggle"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "SoundToggle",
        "component_type": "RectTransform",
        "properties": {
            "anchorMin": [0.5, 0.5], "anchorMax": [0.5, 0.5],
            "sizeDelta": [200, 30], "anchoredPosition": [0, 0]
        }
    }},
    # Background box
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "ToggleBG", "parent": "SoundToggle"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "ToggleBG", "component_type": "Image"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "ToggleBG",
        "component_type": "RectTransform",
        "properties": {"anchorMin": [0, 0.5], "anchorMax": [0, 0.5], "sizeDelta": [26, 26], "anchoredPosition": [13, 0]}
    }},
    # Checkmark
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "ToggleCheckmark", "parent": "ToggleBG"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "ToggleCheckmark", "component_type": "Image"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "ToggleCheckmark",
        "component_type": "RectTransform",
        "properties": {"anchorMin": [0.1, 0.1], "anchorMax": [0.9, 0.9], "sizeDelta": [0, 0]}
    }},
    # Label
    {"tool": "manage_gameobject", "params": {
        "action": "create", "name": "ToggleLabel", "parent": "SoundToggle"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "ToggleLabel", "component_type": "TextMeshProUGUI"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "ToggleLabel",
        "component_type": "TextMeshProUGUI",
        "properties": {"text": "Sound Effects", "fontSize": 18, "alignment": 513}
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "ToggleLabel",
        "component_type": "RectTransform",
        "properties": {"anchorMin": [0, 0], "anchorMax": [1, 1], "sizeDelta": [-35, 0], "anchoredPosition": [17.5, 0]}
    }}
])

# Wire Toggle references (CRITICAL)
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "SoundToggle",
        "component_type": "Toggle", "property": "graphic",
        "value": {"name": "ToggleCheckmark"}
    }}
])
```

###### Add Layout Group (Vertical/Horizontal/Grid)

Layout groups auto-arrange child elements, so you can skip manual RectTransform positioning for children.

```python
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_components", "params": {
        "action": "add", "target": "MenuPanel",
        "component_type": "VerticalLayoutGroup"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "MenuPanel",
        "component_type": "VerticalLayoutGroup",
        "properties": {
            "spacing": 10,
            "childAlignment": 4,
            "childForceExpandWidth": True,
            "childForceExpandHeight": False,
            "padding": {"left": 20, "right": 20, "top": 20, "bottom": 20}
        }
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "MenuPanel",
        "component_type": "ContentSizeFitter"
    }},
    {"tool": "manage_components", "params": {
        "action": "set_property", "target": "MenuPanel",
        "component_type": "ContentSizeFitter",
        "properties": { "verticalFit": 2 }
    }}
])
```

> **childAlignment values:** 0=UpperLeft, 1=UpperCenter, 2=UpperRight, 3=MiddleLeft, 4=MiddleCenter, 5=MiddleRight, 6=LowerLeft, 7=LowerCenter, 8=LowerRight.
> **ContentSizeFitter fit modes:** 0=Unconstrained, 1=MinSize, 2=PreferredSize.

###### Complete Example: Main Menu Screen

Combines multiple templates into a full menu screen in two batch calls (default 25 command limit per batch, configurable in Unity MCP Tools window up to 100). **Assumes `project_info` has been read and `activeInputHandler` is known.**

```python
# Batch 1: Canvas + EventSystem + Panel + Title
batch_execute(fail_fast=True, commands=[
    # Canvas
    {"tool": "manage_gameobject", "params": {"action": "create", "name": "MenuCanvas"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "MenuCanvas", "component_type": "Canvas"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "MenuCanvas", "component_type": "CanvasScaler"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "MenuCanvas", "component_type": "GraphicRaycaster"}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "MenuCanvas", "component_type": "Canvas", "property": "renderMode", "value": 0}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "MenuCanvas", "component_type": "CanvasScaler", "properties": {"uiScaleMode": 1, "referenceResolution": [1920, 1080]}}},
    # EventSystem — use StandaloneInputModule OR InputSystemUIInputModule based on project_info
    {"tool": "manage_gameobject", "params": {"action": "create", "name": "EventSystem"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "EventSystem", "component_type": "UnityEngine.EventSystems.EventSystem"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "EventSystem", "component_type": "UnityEngine.EventSystems.StandaloneInputModule"}},
    # Panel (centered, 60% width)
    {"tool": "manage_gameobject", "params": {"action": "create", "name": "MenuPanel", "parent": "MenuCanvas"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "MenuPanel", "component_type": "Image"}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "MenuPanel", "component_type": "Image", "property": "color", "value": [0.1, 0.1, 0.15, 0.9]}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "MenuPanel", "component_type": "RectTransform", "properties": {"anchorMin": [0.2, 0.15], "anchorMax": [0.8, 0.85], "sizeDelta": [0, 0]}}},
    {"tool": "manage_components", "params": {"action": "add", "target": "MenuPanel", "component_type": "VerticalLayoutGroup"}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "MenuPanel", "component_type": "VerticalLayoutGroup", "properties": {"spacing": 20, "childAlignment": 4, "childForceExpandWidth": True, "childForceExpandHeight": False}}},
    # Title
    {"tool": "manage_gameobject", "params": {"action": "create", "name": "Title", "parent": "MenuPanel"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "Title", "component_type": "TextMeshProUGUI"}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "Title", "component_type": "TextMeshProUGUI", "properties": {"text": "My Game", "fontSize": 64, "alignment": 514, "color": [1, 1, 1, 1]}}}
])

# Batch 2: Buttons
batch_execute(fail_fast=True, commands=[
    # Play Button
    {"tool": "manage_gameobject", "params": {"action": "create", "name": "PlayButton", "parent": "MenuPanel"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "PlayButton", "component_type": "Image"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "PlayButton", "component_type": "Button"}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "PlayButton", "component_type": "Image", "property": "color", "value": [0.2, 0.6, 1.0, 1.0]}},
    {"tool": "manage_gameobject", "params": {"action": "create", "name": "PlayLabel", "parent": "PlayButton"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "PlayLabel", "component_type": "TextMeshProUGUI"}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "PlayLabel", "component_type": "TextMeshProUGUI", "properties": {"text": "Play", "fontSize": 32, "alignment": 514}}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "PlayLabel", "component_type": "RectTransform", "properties": {"anchorMin": [0, 0], "anchorMax": [1, 1], "sizeDelta": [0, 0]}}},
    # Settings Button
    {"tool": "manage_gameobject", "params": {"action": "create", "name": "SettingsButton", "parent": "MenuPanel"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "SettingsButton", "component_type": "Image"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "SettingsButton", "component_type": "Button"}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "SettingsButton", "component_type": "Image", "property": "color", "value": [0.3, 0.3, 0.35, 1.0]}},
    {"tool": "manage_gameobject", "params": {"action": "create", "name": "SettingsLabel", "parent": "SettingsButton"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "SettingsLabel", "component_type": "TextMeshProUGUI"}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "SettingsLabel", "component_type": "TextMeshProUGUI", "properties": {"text": "Settings", "fontSize": 32, "alignment": 514}}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "SettingsLabel", "component_type": "RectTransform", "properties": {"anchorMin": [0, 0], "anchorMax": [1, 1], "sizeDelta": [0, 0]}}},
    # Quit Button
    {"tool": "manage_gameobject", "params": {"action": "create", "name": "QuitButton", "parent": "MenuPanel"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "QuitButton", "component_type": "Image"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "QuitButton", "component_type": "Button"}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "QuitButton", "component_type": "Image", "property": "color", "value": [0.8, 0.2, 0.2, 1.0]}},
    {"tool": "manage_gameobject", "params": {"action": "create", "name": "QuitLabel", "parent": "QuitButton"}},
    {"tool": "manage_components", "params": {"action": "add", "target": "QuitLabel", "component_type": "TextMeshProUGUI"}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "QuitLabel", "component_type": "TextMeshProUGUI", "properties": {"text": "Quit", "fontSize": 32, "alignment": 514}}},
    {"tool": "manage_components", "params": {"action": "set_property", "target": "QuitLabel", "component_type": "RectTransform", "properties": {"anchorMin": [0, 0], "anchorMax": [1, 1], "sizeDelta": [0, 0]}}}
])
```

###### UI Component Quick Reference

| UI Element | Required Components | Notes |
| ---------- | ------------------- | ----- |
| **Canvas** | Canvas + CanvasScaler + GraphicRaycaster | Root for all UI. One per screen. |
| **EventSystem** | EventSystem + input module (see below) | One per scene. Required for interaction. |
| **Panel** | Image + RectTransform sizing | Container. Set color for background. |
| **Text** | TextMeshProUGUI (or Text if no TMP) + RectTransform | Check `packages.textmeshpro`. |
| **Button** | Image + Button + child(TextMeshProUGUI) + RectTransform | Image = visual, Button = click handler. |
| **Slider** | Slider + Image + children + **wire fillRect/handleRect** | Won't function without wiring. |
| **Toggle** | Toggle + children + **wire graphic** | Wire checkmark Image to `graphic`. |
| **Input Field** | Image + TMP_InputField + children + **wire textViewport/textComponent/placeholder** | Won't function without wiring. |
| **Layout Group** | VerticalLayoutGroup / HorizontalLayoutGroup / GridLayoutGroup | Auto-arranges children; skip manual RectTransform on children. |

---

##### Input System: Old vs New

Unity has two input systems that affect UI interaction, script input handling, and EventSystem configuration. **Always check `project_info.activeInputHandler` before creating EventSystems or writing input code.**

###### Detection

```python
# Read mcpforunity://project/info
# activeInputHandler: "Old" | "New" | "Both"
# packages.inputsystem: true/false (whether com.unity.inputsystem is installed)
```

###### EventSystem — Old Input Manager

Used when `activeInputHandler` is `"Old"`. Uses `StandaloneInputModule` which reads from `Input.GetAxis()` / `Input.GetButton()`.

```python
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_gameobject", "params": {"action": "create", "name": "EventSystem"}},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "EventSystem",
        "component_type": "UnityEngine.EventSystems.EventSystem"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "EventSystem",
        "component_type": "UnityEngine.EventSystems.StandaloneInputModule"
    }}
])
```

Script pattern (old Input Manager):

```csharp
// Input.GetAxis / Input.GetKey — works with old Input Manager
void Update()
{
    float h = Input.GetAxis("Horizontal");
    float v = Input.GetAxis("Vertical");
    transform.Translate(new Vector3(h, 0, v) * speed * Time.deltaTime);

    if (Input.GetKeyDown(KeyCode.Space))
        Jump();

    if (Input.GetMouseButtonDown(0))
        Fire();
}
```

###### EventSystem — New Input System

Used when `activeInputHandler` is `"New"` or `"Both"`. Uses `InputSystemUIInputModule` from the `com.unity.inputsystem` package.

```python
batch_execute(fail_fast=True, commands=[
    {"tool": "manage_gameobject", "params": {"action": "create", "name": "EventSystem"}},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "EventSystem",
        "component_type": "UnityEngine.EventSystems.EventSystem"
    }},
    {"tool": "manage_components", "params": {
        "action": "add", "target": "EventSystem",
        "component_type": "UnityEngine.InputSystem.UI.InputSystemUIInputModule"
    }}
])
```

Script pattern (new Input System with `PlayerInput` component):

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerController : MonoBehaviour
{
    public float speed = 5f;
    private Vector2 moveInput;

    // Called by PlayerInput component via SendMessages or UnityEvents
    public void OnMove(InputValue value)
    {
        moveInput = value.Get<Vector2>();
    }

    public void OnJump(InputValue value)
    {
        if (value.isPressed)
            Jump();
    }

    void Update()
    {
        Vector3 move = new Vector3(moveInput.x, 0, moveInput.y);
        transform.Translate(move * speed * Time.deltaTime);
    }
}
```

###### When `activeInputHandler` is `"Both"`

Both systems are active simultaneously. For UI, prefer `InputSystemUIInputModule`. For gameplay scripts, either approach works — `Input.GetAxis()` still functions alongside the new Input System.

```python
# UI: use new Input System module
{"tool": "manage_components", "params": {
    "action": "add", "target": "EventSystem",
    "component_type": "UnityEngine.InputSystem.UI.InputSystemUIInputModule"
}}

# Gameplay scripts: Input.GetAxis() still works in "Both" mode
# But prefer the new Input System for consistency
```

> **Gotcha:** Adding `StandaloneInputModule` when `activeInputHandler` is `"New"` will cause a runtime error. Always check first.

---

##### Camera & Cinemachine Workflows

###### Setting Up a Third-Person Camera

```python
# 1. Check Cinemachine availability
manage_camera(action="ping")

# 2. Ensure Brain on main camera
manage_camera(action="ensure_brain")

# 3. Create third-person camera with preset
manage_camera(action="create_camera", properties={
    "name": "FollowCam", "preset": "third_person",
    "follow": "Player", "lookAt": "Player", "priority": 20
})

# 4. Fine-tune body
manage_camera(action="set_body", target="FollowCam", properties={
    "cameraDistance": 5.0, "shoulderOffset": [0.5, 0.5, 0]
})

# 5. Add camera shake
manage_camera(action="set_noise", target="FollowCam", properties={
    "amplitudeGain": 0.3, "frequencyGain": 0.8
})

# 6. Verify with screenshot
manage_camera(action="screenshot", camera="FollowCam", include_image=True, max_resolution=512)
```

###### Multi-Camera Setup with Blending

```python
# 1. Read current cameras
# Read mcpforunity://scene/cameras

# 2. Create gameplay camera (highest priority = active by default)
manage_camera(action="create_camera", properties={
    "name": "GameplayCam", "preset": "follow",
    "follow": "Player", "lookAt": "Player", "priority": 10
})

# 3. Create cinematic camera (lower priority, activated on demand)
manage_camera(action="create_camera", properties={
    "name": "CinematicCam", "preset": "dolly",
    "lookAt": "CutsceneTarget", "priority": 5
})

# 4. Set blend transition
manage_camera(action="set_blend", properties={"style": "EaseInOut", "duration": 2.0})

# 5. Force cinematic camera for a cutscene
manage_camera(action="force_camera", target="CinematicCam")

# 6. Release override to return to priority-based selection
manage_camera(action="release_override")
```

###### Camera Without Cinemachine

```python
# Tier 1 actions work with plain Unity Camera
manage_camera(action="create_camera", properties={
    "name": "MainCam", "fieldOfView": 50
})

# Set lens
manage_camera(action="set_lens", target="MainCam", properties={
    "fieldOfView": 60, "nearClipPlane": 0.1, "farClipPlane": 1000
})

# Point camera at target (uses manage_gameobject look_at under the hood)
manage_camera(action="set_target", target="MainCam", properties={
    "lookAt": "Player"
})

# Screenshot from this camera
manage_camera(action="screenshot", camera="MainCam", include_image=True, max_resolution=512)
```

###### Camera Inspection Workflow

```python
# 1. Read all cameras via resource
# Read mcpforunity://scene/cameras
# → Shows brain status, all Cinemachine cameras (priority, pipeline, targets),
#   all Unity cameras (FOV, depth, brain)

# 2. Get brain status for blending info
manage_camera(action="get_brain_status")

# 3. List cameras via tool (alternative to resource)
manage_camera(action="list_cameras")

# 4. Multi-view screenshot to see from different angles
manage_camera(action="screenshot_multiview", max_resolution=480)
```

###### Scene View Screenshot Workflow

Use `capture_source="scene_view"` to capture the editor's Scene View viewport — useful for seeing gizmos, wireframes, grid, debug overlays, and objects without cameras.

```python
# 1. Capture the Scene View as-is
manage_camera(action="screenshot", capture_source="scene_view", include_image=True)

# 2. Frame on a specific object first, then capture
manage_camera(action="screenshot", capture_source="scene_view",
    view_target="Player", include_image=True, max_resolution=512)

# 3. Frame on UI Canvas (RectTransform bounds are supported)
manage_camera(action="screenshot", capture_source="scene_view",
    view_target="Canvas", include_image=True)

# Limitations: scene_view does not support batch, view_position, view_rotation, or camera selection.
# Use capture_source="game_view" (default) for those features.
```

---

##### ProBuilder Workflows

When `com.unity.probuilder` is installed, prefer ProBuilder shapes over primitive GameObjects for any geometry that needs editing, multi-material faces, or non-trivial shapes. Check availability first with `manage_probuilder(action="ping")`.

See [ProBuilder Workflow Guide](probuilder-guide.md) for full reference with complex object examples.

###### ProBuilder vs Primitives Decision

| Need | Use Primitives | Use ProBuilder |
|------|---------------|----------------|
| Simple placeholder cube | `manage_gameobject(action="create", primitive_type="Cube")` | - |
| Editable geometry | - | `manage_probuilder(action="create_shape", ...)` |
| Per-face materials | - | `set_face_material` |
| Custom shapes (L-rooms, arches) | - | `create_poly_shape` or `create_shape` |
| Mesh editing (extrude, bevel) | - | Face/edge/vertex operations |
| Batch environment building | Either | ProBuilder + `batch_execute` |

###### Basic ProBuilder Scene Build

```python
# 1. Check ProBuilder availability
manage_probuilder(action="ping")

# 2. Create shapes (use batch for multiple)
batch_execute(commands=[
    {"tool": "manage_probuilder", "params": {
        "action": "create_shape",
        "properties": {"shape_type": "Cube", "name": "Floor", "width": 20, "height": 0.2, "depth": 20}
    }},
    {"tool": "manage_probuilder", "params": {
        "action": "create_shape",
        "properties": {"shape_type": "Cube", "name": "Wall1", "width": 20, "height": 3, "depth": 0.3,
                       "position": [0, 1.5, 10]}
    }},
    {"tool": "manage_probuilder", "params": {
        "action": "create_shape",
        "properties": {"shape_type": "Cylinder", "name": "Pillar1", "radius": 0.4, "height": 3,
                       "position": [5, 1.5, 5]}
    }},
])

# 3. Edit geometry (always get_mesh_info first!)
info = manage_probuilder(action="get_mesh_info", target="Wall1",
    properties={"include": "faces"})
# Find direction="front" face, subdivide it, delete center for a window

# 4. Apply materials per face
manage_probuilder(action="set_face_material", target="Floor",
    properties={"faceIndices": [0], "materialPath": "Assets/Materials/Stone.mat"})

# 5. Smooth organic shapes
manage_probuilder(action="auto_smooth", target="Pillar1",
    properties={"angleThreshold": 45})

# 6. Screenshot to verify
manage_camera(action="screenshot", include_image=True, max_resolution=512)
```

###### Edit-Verify Loop Pattern

Face indices change after every edit. Always re-query:

```python
# WRONG: Assume face indices are stable
manage_probuilder(action="subdivide", target="Obj", properties={"faceIndices": [2]})
manage_probuilder(action="delete_faces", target="Obj", properties={"faceIndices": [5]})  # Index may be wrong!

# RIGHT: Re-query after each edit
manage_probuilder(action="subdivide", target="Obj", properties={"faceIndices": [2]})
info = manage_probuilder(action="get_mesh_info", target="Obj", properties={"include": "faces"})
# Find the correct face by direction/center, then delete
manage_probuilder(action="delete_faces", target="Obj", properties={"faceIndices": [correct_index]})
```

###### Known Limitations

- **`set_pivot`**: Broken -- vertex positions don't persist through mesh rebuild. Use `center_pivot` or Transform positioning.
- **`convert_to_probuilder`**: Broken -- MeshImporter throws. Create shapes natively with `create_shape`/`create_poly_shape`.
- **`subdivide`**: Uses `ConnectElements.Connect` (not traditional quad subdivision). Connects face midpoints.

---

##### Graphics & Rendering Workflows

###### Setting Up Post-Processing

Add post-processing effects to a URP/HDRP scene using Volumes.

```python
# 1. Check pipeline status and available effects
manage_graphics(action="ping")

# 2. List available volume effects for the active pipeline
manage_graphics(action="volume_list_effects")

# 3. Create a global post-processing volume with common effects
manage_graphics(action="volume_create", name="GlobalPostProcess", is_global=True,
    effects=[
        {"type": "Bloom", "parameters": {"intensity": 1.0, "threshold": 0.9, "scatter": 0.7}},
        {"type": "Vignette", "parameters": {"intensity": 0.35}},
        {"type": "Tonemapping", "parameters": {"mode": 1}},
        {"type": "ColorAdjustments", "parameters": {"postExposure": 0.2, "contrast": 10}}
    ])

# 4. Verify the volume was created
# Read mcpforunity://scene/volumes

# 5. Fine-tune an effect parameter
manage_graphics(action="volume_set_effect", target="GlobalPostProcess",
    effect="Bloom", parameters={"intensity": 1.5})

# 6. Screenshot to verify visual result
manage_camera(action="screenshot", include_image=True, max_resolution=512)
```

**Tips:**
- Always `ping` first to confirm URP/HDRP is active. Volumes do nothing on Built-in RP.
- Use `volume_list_effects` to discover available effect types for the active pipeline (URP and HDRP have different sets).
- Use `volume_get_info` to inspect current effect parameters before modifying.
- Create a reusable VolumeProfile asset with `volume_create_profile` and reference it via `profile_path` on multiple volumes.

###### Adding a Full-Screen Effect via Renderer Features (URP)

Add a custom full-screen shader pass using URP Renderer Features.

```python
# 1. Check pipeline and confirm URP
manage_graphics(action="ping")

# 2. Create a material for the full-screen effect
manage_material(action="create",
    material_path="Assets/Materials/GrayscaleEffect.mat",
    shader="Shader Graphs/GrayscaleFullScreen")

# 3. List current renderer features
manage_graphics(action="feature_list")

# 4. Add a FullScreenPassRendererFeature with the material
manage_graphics(action="feature_add",
    feature_type="FullScreenPassRendererFeature",
    name="GrayscalePass",
    material="Assets/Materials/GrayscaleEffect.mat")

# 5. Verify it was added
manage_graphics(action="feature_list")

# 6. Toggle it on/off to compare
manage_graphics(action="feature_toggle", index=0, active=False)  # disable
manage_camera(action="screenshot", include_image=True, max_resolution=512)

manage_graphics(action="feature_toggle", index=0, active=True)   # re-enable
manage_camera(action="screenshot", include_image=True, max_resolution=512)

# 7. Reorder features if needed (execution order matters)
manage_graphics(action="feature_reorder", order=[1, 0, 2])
```

**Tips:**
- Renderer Features are URP-only. `feature_*` actions return an error on HDRP or Built-in RP.
- Read `mcpforunity://pipeline/renderer-features` to inspect features without modifying.
- Feature execution order affects the final image. Use `feature_reorder` to control pass ordering.

###### Configuring Light Baking

Set up lightmaps, light probes, and reflection probes for baked GI.

```python
# 1. Set lights to Baked or Mixed mode
manage_components(action="set_property", target="Directional Light",
    component_type="Light", properties={"lightmapBakeType": 1})  # 1 = Mixed

# 2. Mark static objects for lightmapping
manage_gameobject(action="modify", target="Environment",
    component_properties={"StaticFlags": "ContributeGI"})

# 3. Configure lightmap settings
manage_graphics(action="bake_get_settings")
manage_graphics(action="bake_set_settings", settings={
    "lightmapper": 1,           # 1 = Progressive GPU
    "directSamples": 32,
    "indirectSamples": 128,
    "maxBounces": 4,
    "lightmapResolution": 40
})

# 4. Place light probes for dynamic objects
manage_graphics(action="bake_create_light_probe_group", name="MainProbeGrid",
    position=[0, 1.5, 0], grid_size=[5, 3, 5], spacing=3.0)

# 5. Place a reflection probe for an interior room
manage_graphics(action="bake_create_reflection_probe", name="RoomReflection",
    position=[0, 2, 0], size=[8, 4, 8], resolution=256,
    hdr=True, box_projection=True)

# 6. Start async bake
manage_graphics(action="bake_start", async_bake=True)

# 7. Poll bake status
manage_graphics(action="bake_status")
# Repeat until complete

# 8. Bake the reflection probe separately if needed
manage_graphics(action="bake_reflection_probe", target="RoomReflection")

# 9. Check rendering stats after bake
manage_graphics(action="stats_get")
```

**Tips:**
- Baking only works in Edit mode. If the editor is in Play mode, `bake_start` will fail.
- Use `bake_cancel` to abort a long bake.
- `bake_clear` removes all baked data (lightmaps, probes). Use before re-baking from scratch.
- For large scenes, use `async_bake=True` (default) and poll `bake_status` periodically.

---

##### Package Management Workflows

###### Install a Package and Verify

```python
# 1. Check what's installed
manage_packages(action="ping")
manage_packages(action="list_packages")
# Poll status until complete
manage_packages(action="status", job_id="<job_id>")

# 2. Install the package
manage_packages(action="add_package", package="com.unity.inputsystem")
# Poll until domain reload completes
manage_packages(action="status", job_id="<job_id>")

# 3. Verify no compilation errors
read_console(types=["error"], count=10)

# 4. Confirm it's installed
manage_packages(action="get_package_info", package="com.unity.inputsystem")
```

###### Add OpenUPM Registry and Install Package

```python
# 1. Add the OpenUPM scoped registry
manage_packages(
    action="add_registry",
    name="OpenUPM",
    url="https://package.openupm.com",
    scopes=["com.cysharp"]
)

# 2. Force resolution to pick up the new registry
manage_packages(action="resolve_packages")

# 3. Install a package from OpenUPM
manage_packages(action="add_package", package="com.cysharp.unitask")
manage_packages(action="status", job_id="<job_id>")
```

###### Safe Package Removal

```python
# 1. Check dependencies before removing
manage_packages(action="remove_package", package="com.unity.modules.ui")
# If blocked: "Cannot remove: 3 package(s) depend on it"

# 2. Force removal if you're sure
manage_packages(action="remove_package", package="com.unity.modules.ui", force=True)
manage_packages(action="status", job_id="<job_id>")
```

###### Install from Git URL (e.g., NuGetForUnity)

```python
# Git URLs trigger a security warning — ensure the source is trusted
manage_packages(
    action="add_package",
    package="https://github.com/GlitchEnzo/NuGetForUnity.git?path=/src/NuGetForUnity"
)
manage_packages(action="status", job_id="<job_id>")
```

---

##### Package Deployment Workflows

###### Iterative Development Loop (Edit → Deploy → Test)

Use `deploy_package` to copy your local MCPForUnity source into the project's installed package location. This bypasses the UI dialog and triggers recompilation automatically.

```python
# Prerequisites: Set the MCPForUnity source path in Advanced Settings first.

# 1. Make code changes (e.g., edit C# tools)
# script_apply_edits or create_script as needed

# 2. Deploy the updated package (copies source → installed package, creates backup)
manage_editor(action="deploy_package")

# 3. Wait for recompilation to finish
refresh_unity(mode="force", compile="request", wait_for_ready=True)

# 4. Check for compilation errors
read_console(types=["error"], count=10, include_stacktrace=True)

# 5. Test the changes
run_tests(mode="EditMode")
```

###### Rollback After Failed Deploy

```python
# Restore from the automatic pre-deployment backup
manage_editor(action="restore_package")

# Wait for recompilation
refresh_unity(mode="force", compile="request", wait_for_ready=True)
```

---

##### API Verification Workflows

> These tools live in the opt-in `docs` group. Activate it first: `manage_tools(action="activate", group="docs")`

###### Full API Verification Before Writing Code

Use `unity_reflect` and `unity_docs` to verify Unity APIs before writing C# code. This prevents hallucinated or outdated API references.

**Trust hierarchy:** reflection (live runtime) > project assets > official docs.

```python
# Step 1: Search for the type you need
unity_reflect(action="search", query="NavMesh")
# → Returns matching types: NavMeshAgent, NavMeshPath, NavMeshHit, etc.

# Step 2: Get member summary for the type
unity_reflect(action="get_type", class_name="UnityEngine.AI.NavMeshAgent")
# → Returns all methods, properties, fields (names only)

# Step 3: Get full signature for specific members you plan to use
unity_reflect(action="get_member", class_name="NavMeshAgent", member_name="SetDestination")
# → Returns parameter types, return type, all overloads

# Step 4: Get official docs for usage patterns and examples
unity_docs(action="get_doc", class_name="NavMeshAgent", member_name="SetDestination")
# → Returns description, signatures, parameters, code examples
```

###### Batch API Lookup

Use `unity_docs` `lookup` action to search multiple APIs in a single call:

```python
# Search ScriptReference + Manual in parallel (+ package docs if package/pkg_version provided)
unity_docs(action="lookup", queries="Physics.Raycast,NavMeshAgent,Light2D")

# Include package docs in the search
unity_docs(action="lookup", query="VolumeProfile",
           package="com.unity.render-pipelines.universal", pkg_version="17.0")
```

###### Finding Shaders and Materials in Project

The `lookup` action automatically searches project assets for asset-related queries:

```python
# This searches both docs AND project assets for shader-related content
unity_docs(action="lookup", query="Lit shader")
# → Returns doc hits + matching project assets (shaders, materials, etc.)
```

###### Manual and Package Documentation

```python
# Fetch Unity Manual pages (execution order, scripting concepts, etc.)
unity_docs(action="get_manual", slug="execution-order")

# Fetch package-specific documentation
unity_docs(action="get_package_doc",
           package="com.unity.render-pipelines.universal",
           page="2d-index", pkg_version="17.0")
```

###### Verifying APIs Across Unity Versions

```python
# Specify Unity version for version-specific docs
unity_docs(action="get_doc", class_name="Camera", member_name="main", version="6000.0.38f1")

# Use reflection to check what's actually available in the running editor
unity_reflect(action="search", query="InputAction", scope="packages")
```

---

##### Batch Operations

###### Batch Discovery (Multi-Search)

Use `batch_execute` to search for multiple things in a single call instead of calling `find_gameobjects` repeatedly:

```python
# Instead of 4 separate find_gameobjects calls, batch them:
batch_execute(commands=[
    {"tool": "find_gameobjects", "params": {"search_term": "Camera", "search_method": "by_component"}},
    {"tool": "find_gameobjects", "params": {"search_term": "Rigidbody", "search_method": "by_component"}},
    {"tool": "find_gameobjects", "params": {"search_term": "Player", "search_method": "by_tag"}},
    {"tool": "find_gameobjects", "params": {"search_term": "GameManager", "search_method": "by_name"}}
])
# Returns array of results, one per command
```

###### Mass Property Update

```python
# Find all enemies
enemies = find_gameobjects(search_term="Enemy", search_method="by_tag")

# Update health on all enemies
commands = []
for enemy_id in enemies["ids"]:
    commands.append({
        "tool": "manage_components",
        "params": {
            "action": "set_property",
            "target": enemy_id,
            "component_type": "EnemyHealth",
            "property": "maxHealth",
            "value": 100
        }
    })

# Execute in batches
for i in range(0, len(commands), 25):
    batch_execute(commands=commands[i:i+25], parallel=True)
```

###### Mass Object Creation with Variations

```python
import random

commands = []
for i in range(20):
    commands.append({
        "tool": "manage_gameobject",
        "params": {
            "action": "create",
            "name": f"Tree_{i}",
            "primitive_type": "Capsule",
            "position": [random.uniform(-50, 50), 0, random.uniform(-50, 50)],
            "scale": [1, random.uniform(2, 5), 1]
        }
    })

batch_execute(commands=commands, parallel=True)
```

###### Cleanup Pattern

```python
# Find all temporary objects
temps = find_gameobjects(search_term="Temp_", search_method="by_name")

# Delete in batch
commands = [
    {"tool": "manage_gameobject", "params": {"action": "delete", "target": id}}
    for id in temps["ids"]
]

batch_execute(commands=commands, fail_fast=False)
```

---

##### Error Recovery Patterns

###### Stale File Recovery

```python
try:
    apply_text_edits(uri=script_uri, edits=[...], precondition_sha256=old_sha)
except Exception as e:
    if "stale_file" in str(e):
        # Re-fetch SHA
        new_sha = get_sha(uri=script_uri)
        # Retry with new SHA
        apply_text_edits(uri=script_uri, edits=[...], precondition_sha256=new_sha["sha256"])
```

###### Domain Reload Recovery

```python
# After domain reload, connection may be lost
# Wait and retry pattern:
import time

max_retries = 5
for attempt in range(max_retries):
    try:
        editor_state = read_resource("mcpforunity://editor/state")
        if editor_state["ready_for_tools"]:
            break
    except:
        time.sleep(2 ** attempt)  # Exponential backoff
```

###### Compilation Block Recovery

```python
# If tools fail due to compilation:
# 1. Check console for errors
errors = read_console(types=["error"], count=20)

# 2. Fix the script errors
# ... edit scripts ...

# 3. Force refresh
refresh_unity(mode="force", scope="scripts", compile="request", wait_for_ready=True)

# 4. Verify clean console
errors = read_console(types=["error"], count=5)
if not errors["messages"]:
    # Safe to proceed with tools
    pass
```

### `unity-mcp-skill/references/resources-reference.md`
#### Unity-MCP Resources Reference

Resources provide read-only access to Unity state. Use resources to inspect before using tools to modify.

##### Table of Contents

- [Editor State Resources](#editor-state-resources)
- [Camera Resources](#camera-resources)
- [Graphics Resources](#graphics-resources)
- [Scene & GameObject Resources](#scene--gameobject-resources)
- [Prefab Resources](#prefab-resources)
- [Project Resources](#project-resources)
- [Instance Resources](#instance-resources)
- [Test Resources](#test-resources)

---

##### URI Scheme

All resources use `mcpforunity://` scheme:

```
mcpforunity://{category}/{resource_path}[?query_params]
```

**Categories:** `editor`, `scene`, `prefab`, `project`, `pipeline`, `rendering`, `menu-items`, `custom-tools`, `tool-groups`, `tests`, `instances`

---

##### Editor State Resources

###### mcpforunity://editor/state

**Purpose:** Editor readiness snapshot - check before tool operations.

**Returns:**
```json
{
  "unity_version": "2022.3.10f1",
  "is_compiling": false,
  "is_domain_reload_pending": false,
  "play_mode": {
    "is_playing": false,
    "is_paused": false
  },
  "active_scene": {
    "path": "Assets/Scenes/Main.unity",
    "name": "Main"
  },
  "ready_for_tools": true,
  "blocking_reasons": [],
  "recommended_retry_after_ms": null,
  "staleness": {
    "age_ms": 150,
    "is_stale": false
  }
}
```

**Key Fields:**
- `ready_for_tools`: Only proceed if `true`
- `is_compiling`: Wait if `true`
- `blocking_reasons`: Array explaining why tools might fail
- `recommended_retry_after_ms`: Suggested wait time

###### mcpforunity://editor/selection

**Purpose:** Currently selected objects.

**Returns:**
```json
{
  "activeObject": "Player",
  "activeGameObject": "Player",
  "activeInstanceID": 12345,
  "count": 3,
  "gameObjects": ["Player", "Enemy", "Wall"],
  "assetGUIDs": []
}
```

###### mcpforunity://editor/active-tool

**Purpose:** Current editor tool state.

**Returns:**
```json
{
  "activeTool": "Move",
  "isCustom": false,
  "pivotMode": "Center",
  "pivotRotation": "Global"
}
```

###### mcpforunity://editor/windows

**Purpose:** All open editor windows.

**Returns:**
```json
{
  "windows": [
    {
      "title": "Scene",
      "typeName": "UnityEditor.SceneView",
      "isFocused": true,
      "position": {"x": 0, "y": 0, "width": 800, "height": 600}
    }
  ]
}
```

###### mcpforunity://editor/prefab-stage

**Purpose:** Current prefab editing context.

**Returns:**
```json
{
  "isOpen": true,
  "assetPath": "Assets/Prefabs/Player.prefab",
  "prefabRootName": "Player",
  "isDirty": false
}
```

---

##### Camera Resources

###### mcpforunity://scene/cameras

**Purpose:** List all cameras in the scene (Unity Camera + CinemachineCamera) with full status. Read this before using `manage_camera` to understand the current camera setup.

**Returns:**
```json
{
  "brain": {
    "exists": true,
    "gameObject": "Main Camera",
    "instanceID": 55504,
    "activeCameraName": "Cam_Cinematic",
    "activeCameraID": -39420,
    "isBlending": false
  },
  "cinemachineCameras": [
    {
      "instanceID": -39420,
      "name": "Cam_Cinematic",
      "isLive": true,
      "priority": 50,
      "follow": {"name": "CameraTarget", "instanceID": -26766},
      "lookAt": {"name": "CameraTarget", "instanceID": -26766},
      "body": "CinemachineThirdPersonFollow",
      "aim": "CinemachineRotationComposer",
      "noise": "CinemachineBasicMultiChannelPerlin",
      "extensions": []
    }
  ],
  "unityCameras": [
    {
      "instanceID": 55504,
      "name": "Main Camera",
      "depth": 0.0,
      "fieldOfView": 50.0,
      "hasBrain": true
    }
  ],
  "cinemachineInstalled": true
}
```

**Key Fields:**
- `brain`: CinemachineBrain status — which camera is active, blend state
- `cinemachineCameras`: All CinemachineCamera components with pipeline info (body, aim, noise, extensions)
- `unityCameras`: All Unity Camera components with depth and FOV
- `cinemachineInstalled`: Whether Cinemachine package is available

**Use with:** `manage_camera` tool for creating/configuring cameras

---

##### Graphics Resources

###### mcpforunity://scene/volumes

**Purpose:** List all Volume components in the scene with effects and parameters. Read this before using `manage_graphics` volume actions.

**Returns:**
```json
{
  "pipeline": "Universal (URP)",
  "volumes": [
    {
      "name": "PostProcessVolume",
      "instance_id": -24600,
      "is_global": true,
      "weight": 1.0,
      "priority": 0,
      "blend_distance": 0,
      "profile": "MyProfile",
      "profile_path": "Assets/Settings/MyProfile.asset",
      "effects": [
        {
          "type": "Bloom",
          "active": true,
          "overridden_params": ["intensity", "threshold", "scatter"]
        },
        {
          "type": "Vignette",
          "active": true,
          "overridden_params": ["intensity", "smoothness"]
        }
      ]
    }
  ]
}
```

**Key Fields:**
- `is_global`: Whether the volume applies everywhere or only within its collider bounds
- `effects[].overridden_params`: Which parameters are actively overridden (not using defaults)
- `profile_path`: Empty string for embedded profiles, asset path for shared profiles

**Use with:** `manage_graphics` volume actions (volume_create, volume_add_effect, volume_set_effect, etc.)

###### mcpforunity://rendering/stats

**Purpose:** Current rendering performance counters (draw calls, batches, triangles, memory).

**Returns:**
```json
{
  "draw_calls": 42,
  "batches": 35,
  "set_pass_calls": 12,
  "triangles": 15234,
  "vertices": 8456,
  "dynamic_batches": 5,
  "static_batches": 20,
  "shadow_casters": 3,
  "render_textures": 8,
  "render_textures_bytes": 16777216,
  "visible_skinned_meshes": 2
}
```

**Use with:** `manage_graphics` stats actions (stats_get, stats_list_counters, stats_get_memory)

###### mcpforunity://pipeline/renderer-features

**Purpose:** URP renderer features on the active renderer (SSAO, Decals, etc.).

**Returns:**
```json
{
  "rendererDataName": "PC_Renderer",
  "features": [
    {
      "index": 0,
      "name": "ScreenSpaceAmbientOcclusion",
      "type": "ScreenSpaceAmbientOcclusion",
      "isActive": true,
      "properties": { "m_Settings": "Generic" }
    }
  ]
}
```

**Key Fields:**
- `index`: Position in the feature list (use for feature_toggle, feature_remove, feature_configure)
- `isActive`: Whether the feature is enabled
- `rendererDataName`: Which URP renderer data asset is active

**Use with:** `manage_graphics` feature actions (feature_list, feature_add, feature_remove, feature_toggle, etc.)

---

##### Scene & GameObject Resources

###### mcpforunity://scene/gameobject-api

**Purpose:** Documentation for GameObject resources (read this first).

###### mcpforunity://scene/gameobject/{instance_id}

**Purpose:** Basic GameObject data (metadata, no component properties).

**Parameters:**
- `instance_id` (int): GameObject instance ID from `find_gameobjects`

**Returns:**
```json
{
  "instanceID": 12345,
  "name": "Player",
  "tag": "Player",
  "layer": 8,
  "layerName": "Player",
  "active": true,
  "activeInHierarchy": true,
  "isStatic": false,
  "transform": {
    "position": [0, 1, 0],
    "rotation": [0, 0, 0],
    "scale": [1, 1, 1]
  },
  "parent": {"instanceID": 0},
  "children": [{"instanceID": 67890}],
  "componentTypes": ["Transform", "Rigidbody", "PlayerController"],
  "path": "/Player"
}
```

###### mcpforunity://scene/gameobject/{instance_id}/components

**Purpose:** All components with full property serialization (paginated).

**Parameters:**
- `instance_id` (int): GameObject instance ID
- `page_size` (int): Default 25, max 100
- `cursor` (int): Pagination cursor
- `include_properties` (bool): Default true, set false for just types

**Returns:**
```json
{
  "gameObjectID": 12345,
  "gameObjectName": "Player",
  "components": [
    {
      "type": "Transform",
      "properties": {
        "position": {"x": 0, "y": 1, "z": 0},
        "rotation": {"x": 0, "y": 0, "z": 0, "w": 1}
      }
    },
    {
      "type": "Rigidbody",
      "properties": {
        "mass": 1.0,
        "useGravity": true
      }
    }
  ],
  "cursor": 0,
  "pageSize": 25,
  "nextCursor": null,
  "hasMore": false
}
```

###### mcpforunity://scene/gameobject/{instance_id}/component/{component_name}

**Purpose:** Single component with full properties.

**Parameters:**
- `instance_id` (int): GameObject instance ID
- `component_name` (string): e.g., "Rigidbody", "Camera", "Transform"

**Returns:**
```json
{
  "gameObjectID": 12345,
  "gameObjectName": "Player",
  "component": {
    "type": "Rigidbody",
    "properties": {
      "mass": 1.0,
      "drag": 0,
      "angularDrag": 0.05,
      "useGravity": true,
      "isKinematic": false
    }
  }
}
```

---

##### Prefab Resources

###### mcpforunity://prefab-api

**Purpose:** Documentation for prefab resources.

###### mcpforunity://prefab/{encoded_path}

**Purpose:** Prefab asset information.

**Parameters:**
- `encoded_path` (string): URL-encoded path, e.g., `Assets%2FPrefabs%2FPlayer.prefab`

**Path Encoding:**
```
Assets/Prefabs/Player.prefab → Assets%2FPrefabs%2FPlayer.prefab
```

**Returns:**
```json
{
  "assetPath": "Assets/Prefabs/Player.prefab",
  "guid": "abc123...",
  "prefabType": "Regular",
  "rootObjectName": "Player",
  "rootComponentTypes": ["Transform", "PlayerController"],
  "childCount": 5,
  "isVariant": false,
  "parentPrefab": null
}
```

###### mcpforunity://prefab/{encoded_path}/hierarchy

**Purpose:** Full prefab hierarchy with nested prefab info.

**Returns:**
```json
{
  "prefabPath": "Assets/Prefabs/Player.prefab",
  "total": 6,
  "items": [
    {
      "name": "Player",
      "instanceId": 12345,
      "path": "/Player",
      "activeSelf": true,
      "childCount": 2,
      "componentTypes": ["Transform", "PlayerController"]
    },
    {
      "name": "Model",
      "path": "/Player/Model",
      "isNestedPrefab": true,
      "nestedPrefabPath": "Assets/Prefabs/PlayerModel.prefab"
    }
  ]
}
```

---

##### Project Resources

###### mcpforunity://project/info

**Purpose:** Static project configuration.

**Returns:**
```json
{
  "projectRoot": "/Users/dev/MyProject",
  "projectName": "MyProject",
  "unityVersion": "2022.3.10f1",
  "platform": "StandaloneWindows64",
  "assetsPath": "/Users/dev/MyProject/Assets"
}
```

###### mcpforunity://project/tags

**Purpose:** All tags defined in TagManager.

**Returns:**
```json
["Untagged", "Respawn", "Finish", "EditorOnly", "MainCamera", "Player", "GameController", "Enemy"]
```

###### mcpforunity://project/layers

**Purpose:** All layers with indices (0-31).

**Returns:**
```json
{
  "0": "Default",
  "1": "TransparentFX",
  "2": "Ignore Raycast",
  "4": "Water",
  "5": "UI",
  "8": "Player",
  "9": "Enemy"
}
```

###### mcpforunity://menu-items

**Purpose:** All available Unity menu items.

**Returns:**
```json
[
  "File/New Scene",
  "File/Open Scene",
  "File/Save",
  "Edit/Undo",
  "Edit/Redo",
  "GameObject/Create Empty",
  "GameObject/3D Object/Cube",
  "Window/General/Console"
]
```

###### mcpforunity://custom-tools

**Purpose:** Custom tools available in the active Unity project.

**Returns** (abbreviated: one of the 3 tools is shown):
```json
{
  "project_id": "MyProject",
  "tool_count": 3,
  "tools": [
    {
      "name": "capture_screenshot",
      "description": "Capture screenshots in Unity",
      "parameters": [
        {"name": "filename", "type": "string", "required": true},
        {"name": "width", "type": "int", "required": false},
        {"name": "height", "type": "int", "required": false}
      ]
    }
  ]
}
```

###### mcpforunity://tool-groups

**Purpose:** Every tool group, whether it is on by default, and its tools. Enable or hide a group for the session with `manage_tools`.

**Returns** (abbreviated: `groups` has one entry per group, in name order; one is shown):
```json
{
  "groups": [
    {"name": "animation", "description": "Animator control, AnimationClip creation & 2D sprite-sheet animation",
     "default_enabled": false, "tools": ["manage_animation", "manage_sprite"], "tool_count": 2}
  ],
  "total_groups": 10,
  "default_enabled": ["core"],
  "usage": "Call manage_tools(action='activate', group='<name>') to enable a group."
}
```

---

##### Instance Resources

###### mcpforunity://instances

**Purpose:** All running Unity Editor instances (for multi-instance workflows).

**Returns:**
```json
{
  "transport": "http",
  "instance_count": 2,
  "instances": [
    {
      "id": "MyProject@abc123",
      "name": "MyProject",
      "hash": "abc123",
      "unity_version": "2022.3.10f1",
      "connected_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "TestProject@def456",
      "name": "TestProject",
      "hash": "def456",
      "unity_version": "2022.3.10f1",
      "connected_at": "2024-01-15T11:00:00Z"
    }
  ],
  "warnings": []
}
```

**Use with:** `set_active_instance(instance="MyProject@abc123")`

---

##### Test Resources

###### mcpforunity://tests

**Purpose:** All tests in the project.

**Returns:**
```json
[
  {
    "name": "TestSomething",
    "full_name": "MyTests.TestSomething",
    "mode": "EditMode"
  },
  {
    "name": "TestOther",
    "full_name": "MyTests.TestOther",
    "mode": "PlayMode"
  }
]
```

###### mcpforunity://tests/{mode}

**Purpose:** Tests filtered by mode.

**Parameters:**
- `mode` (string): "EditMode" or "PlayMode"

**Example:** `mcpforunity://tests/EditMode`

---

##### Best Practices

###### 1. Check Editor State First

```python
# Before any complex operation:
# Read mcpforunity://editor/state
# Check ready_for_tools == true
```

###### 2. Use Find Then Read Pattern

```python
# 1. find_gameobjects to get IDs
result = find_gameobjects(search_term="Player")

# 2. Read resource for full data
# mcpforunity://scene/gameobject/{id}
```

###### 3. Paginate Large Queries

```python
# Start with include_properties=false for component lists
# mcpforunity://scene/gameobject/{id}/components?include_properties=false&page_size=25

# Then read specific components as needed
# mcpforunity://scene/gameobject/{id}/component/Rigidbody
```

###### 4. URL-Encode Prefab Paths

```python
# Wrong:
# mcpforunity://prefab/Assets/Prefabs/Player.prefab

# Correct:
# mcpforunity://prefab/Assets%2FPrefabs%2FPlayer.prefab
```

###### 5. Multi-Instance Awareness

```python
# Always check mcpforunity://instances when:
# - First connecting
# - Commands fail unexpectedly
# - Working with multiple projects
```

### `unity-mcp-skill/references/probuilder-guide.md`
#### ProBuilder Workflow Guide

Patterns and best practices for AI-driven ProBuilder mesh editing through MCP for Unity.

##### Availability

ProBuilder is an **optional** Unity package (`com.unity.probuilder`). Check `mcpforunity://project/info` or call `manage_probuilder(action="ping")` to verify it's installed before using any ProBuilder tools. If available, **prefer ProBuilder over primitive GameObjects** for any geometry that needs editing, multi-material faces, or non-trivial shapes.

##### Core Workflow: Always Get Info First

Before any mesh edit, call `get_mesh_info` with `include='faces'` to understand the geometry:

```python
# Step 1: Get face info with directions
result = manage_probuilder(action="get_mesh_info", target="MyCube",
    properties={"include": "faces"})

# Response includes per-face:
#   index: 0, normal: [0, 1, 0], center: [0, 0.5, 0], direction: "top"
#   index: 1, normal: [0, -1, 0], center: [0, -0.5, 0], direction: "bottom"
#   index: 2, normal: [0, 0, 1], center: [0, 0, 0.5], direction: "front"
#   ...

# Step 2: Use the direction labels to pick faces
# Want to extrude the top? Find the face with direction="top"
manage_probuilder(action="extrude_faces", target="MyCube",
    properties={"faceIndices": [0], "distance": 1.5})
```

###### Include Parameter

| Value | Returns | Use When |
|-------|---------|----------|
| `"summary"` | Counts, bounds, materials | Quick check / validation |
| `"faces"` | + normals, centers, directions | Selecting faces for editing |
| `"edges"` | + edge vertex pairs with world positions (max 200) | Edge-based operations |
| `"all"` | Everything | Full mesh analysis |

##### Shape Creation

###### All 12 Shape Types

```python
# Basic shapes
manage_probuilder(action="create_shape", properties={"shape_type": "Cube", "name": "MyCube"})
manage_probuilder(action="create_shape", properties={"shape_type": "Sphere", "name": "MySphere"})
manage_probuilder(action="create_shape", properties={"shape_type": "Cylinder", "name": "MyCyl"})
manage_probuilder(action="create_shape", properties={"shape_type": "Plane", "name": "MyPlane"})
manage_probuilder(action="create_shape", properties={"shape_type": "Cone", "name": "MyCone"})
manage_probuilder(action="create_shape", properties={"shape_type": "Prism", "name": "MyPrism"})

# Parametric shapes
manage_probuilder(action="create_shape", properties={
    "shape_type": "Torus", "name": "MyTorus",
    "rows": 16, "columns": 24, "innerRadius": 0.5, "outerRadius": 1.0
})
manage_probuilder(action="create_shape", properties={
    "shape_type": "Pipe", "name": "MyPipe",
    "radius": 1.0, "height": 2.0, "thickness": 0.2
})
manage_probuilder(action="create_shape", properties={
    "shape_type": "Arch", "name": "MyArch",
    "radius": 2.0, "angle": 180, "segments": 12
})

# Architectural shapes
manage_probuilder(action="create_shape", properties={
    "shape_type": "Stair", "name": "MyStairs", "steps": 10
})
manage_probuilder(action="create_shape", properties={
    "shape_type": "CurvedStair", "name": "Spiral", "steps": 12
})
manage_probuilder(action="create_shape", properties={
    "shape_type": "Door", "name": "MyDoor"
})

# Custom polygon
manage_probuilder(action="create_poly_shape", properties={
    "points": [[0,0,0], [5,0,0], [5,0,5], [2.5,0,7], [0,0,5]],
    "extrudeHeight": 3.0, "name": "Pentagon"
})
```

##### Common Editing Operations

###### Extrude a Roof

```python
# 1. Create a building base
manage_probuilder(action="create_shape", properties={
    "shape_type": "Cube", "name": "Building", "size": [4, 3, 6]
})

# 2. Find the top face
info = manage_probuilder(action="get_mesh_info", target="Building",
    properties={"include": "faces"})
# Find face with direction="top" -> e.g. index 2

# 3. Extrude upward for a flat roof extension
manage_probuilder(action="extrude_faces", target="Building",
    properties={"faceIndices": [2], "distance": 0.5})
```

###### Cut a Hole (Delete Faces)

```python
# 1. Get face info
info = manage_probuilder(action="get_mesh_info", target="Wall",
    properties={"include": "faces"})
# Find the face with direction="front" -> e.g. index 4

# 2. Subdivide to create more faces
manage_probuilder(action="subdivide", target="Wall",
    properties={"faceIndices": [4]})

# 3. Get updated face info (indices changed after subdivide!)
info = manage_probuilder(action="get_mesh_info", target="Wall",
    properties={"include": "faces"})

# 4. Delete the center face(s) for the hole
manage_probuilder(action="delete_faces", target="Wall",
    properties={"faceIndices": [6]})
```

###### Bevel Edges

```python
# Get edge info
info = manage_probuilder(action="get_mesh_info", target="MyCube",
    properties={"include": "edges"})

# Bevel specific edges
manage_probuilder(action="bevel_edges", target="MyCube",
    properties={"edgeIndices": [0, 1, 2, 3], "amount": 0.1})
```

###### Detach Faces to New Object

```python
# Detach and keep original (default)
manage_probuilder(action="detach_faces", target="MyCube",
    properties={"faceIndices": [0, 1], "deleteSourceFaces": False})

# Detach and remove from source
manage_probuilder(action="detach_faces", target="MyCube",
    properties={"faceIndices": [0, 1], "deleteSourceFaces": True})
```

###### Select Faces by Direction

```python
# Select all upward-facing faces
manage_probuilder(action="select_faces", target="MyMesh",
    properties={"direction": "up", "tolerance": 0.7})

# Grow selection from a seed face
manage_probuilder(action="select_faces", target="MyMesh",
    properties={"growFrom": [0], "growAngle": 45})
```

###### Double-Sided Geometry

```python
# Create inside faces for a room (duplicate and flip normals)
manage_probuilder(action="duplicate_and_flip", target="Room",
    properties={"faceIndices": [0, 1, 2, 3, 4, 5]})
```

###### Create Polygon from Existing Vertices

```python
# Connect existing vertices into a new face (auto-finds winding order)
manage_probuilder(action="create_polygon", target="MyMesh",
    properties={"vertexIndices": [0, 3, 7, 4]})
```

##### Vertex Operations

```python
# Move vertices by offset. Only the listed indices move: faces that meet at a corner
# usually each have their own vertex there, so moving one face's corners opens a gap.
manage_probuilder(action="move_vertices", target="MyCube",
    properties={"vertexIndices": [0, 1, 2, 3], "offset": [0, 1, 0]})

# Weld nearby vertices (proximity-based merge)
manage_probuilder(action="weld_vertices", target="MyCube",
    properties={"vertexIndices": [0, 1, 2, 3], "radius": 0.1})

# Insert vertex on an edge
manage_probuilder(action="insert_vertex", target="MyCube",
    properties={"edge": {"a": 0, "b": 1}, "point": [0.5, 0, 0]})

# Add evenly-spaced points along edges
manage_probuilder(action="append_vertices_to_edge", target="MyCube",
    properties={"edgeIndices": [0, 1], "count": 3})
```

##### Smoothing Workflow

###### Auto-Smooth (Recommended Default)

```python
# Apply auto-smoothing with default 30 degree threshold
manage_probuilder(action="auto_smooth", target="MyMesh",
    properties={"angleThreshold": 30})
```

- **Low angle (15-25)**: More hard edges, faceted look
- **Medium angle (30-45)**: Good default, smooth curves + sharp corners
- **High angle (60-80)**: Very smooth, only sharpest edges remain hard

###### Manual Smoothing Groups

```python
# Set specific faces to smooth group 1
manage_probuilder(action="set_smoothing", target="MyMesh",
    properties={"faceIndices": [0, 1, 2], "smoothingGroup": 1})

# Set other faces to hard edges (group 0)
manage_probuilder(action="set_smoothing", target="MyMesh",
    properties={"faceIndices": [3, 4, 5], "smoothingGroup": 0})
```

##### Mesh Cleanup Pattern

After editing, always clean up:

```python
# 1. Center the pivot (important after extrusions that shift geometry)
manage_probuilder(action="center_pivot", target="MyMesh")

# 2. Optionally freeze transform if you moved/rotated the object
manage_probuilder(action="freeze_transform", target="MyMesh")

# 3. Validate mesh health
result = manage_probuilder(action="validate_mesh", target="MyMesh")
# Check result.data.healthy -- if false, repair

# 4. Auto-repair if needed
manage_probuilder(action="repair_mesh", target="MyMesh")
```

##### Building Complex Objects with ProBuilder

When ProBuilder is available, prefer it over primitive GameObjects for complex geometry. ProBuilder lets you create, edit, and combine shapes into detailed objects without external 3D tools.

###### Example: Simple House

```python
# 1. Create base building
manage_probuilder(action="create_shape", properties={
    "shape_type": "Cube", "name": "House", "width": 6, "height": 3, "depth": 8
})

# 2. Get face info to find the top face
info = manage_probuilder(action="get_mesh_info", target="House",
    properties={"include": "faces"})
# Find direction="top" -> e.g. index 2

# 3. Extrude the top face to create a flat raised section
manage_probuilder(action="extrude_faces", target="House",
    properties={"faceIndices": [2], "distance": 0.3})

# 4. Add a peaked roof as a separate Prism; its ridge runs along Z, like the house.
#    (Moving the top face's vertices would pull it away from the walls; see Vertex Operations.)
#    Shapes are centered on their position: the walls now reach y = 1.8,
#    so a roof 2 high sits on them at y = 1.8 + 1.
manage_probuilder(action="create_shape", properties={
    "shape_type": "Prism", "name": "Roof",
    "width": 6, "height": 2, "depth": 8, "position": [0, 2.8, 0]
})

# 5. Cut a doorway: subdivide front face, delete center sub-face
info = manage_probuilder(action="get_mesh_info", target="House",
    properties={"include": "faces"})
# Find direction="front", subdivide it
manage_probuilder(action="subdivide", target="House",
    properties={"faceIndices": [4]})

# Re-query, find bottom-center face, delete it
info = manage_probuilder(action="get_mesh_info", target="House",
    properties={"include": "faces"})
manage_probuilder(action="delete_faces", target="House",
    properties={"faceIndices": [12]})

# 6. Add a door frame with arch
manage_probuilder(action="create_shape", properties={
    "shape_type": "Door", "name": "Doorway",
    "position": [0, 0, 4], "width": 1.5, "height": 2.5
})

# 7. Add stairs to the door
manage_probuilder(action="create_shape", properties={
    "shape_type": "Stair", "name": "FrontSteps",
    "position": [0, 0, 5], "steps": 3, "width": 2
})

# 8. Smooth organic parts, keep architectural edges sharp
manage_probuilder(action="auto_smooth", target="House",
    properties={"angleThreshold": 30})

# 9. Assign materials per face
manage_probuilder(action="set_face_material", target="House",
    properties={"faceIndices": [0, 1, 2, 3], "materialPath": "Assets/Materials/Brick.mat"})
# A Prism's faces 1 and 3 are its two slopes
manage_probuilder(action="set_face_material", target="Roof",
    properties={"faceIndices": [1, 3], "materialPath": "Assets/Materials/Roof.mat"})

# 10. Cleanup
manage_probuilder(action="center_pivot", target="House")
manage_probuilder(action="validate_mesh", target="House")
```

###### Example: Pillared Corridor (Batch)

```python
# Create multiple columns efficiently
batch_execute(commands=[
    {"tool": "manage_probuilder", "params": {
        "action": "create_shape",
        "properties": {"shape_type": "Cylinder", "name": f"Pillar_{i}",
                       "radius": 0.3, "height": 4, "segments": 12,
                       "position": [i * 3, 0, 0]}
    }} for i in range(6)
] + [
    # Floor
    {"tool": "manage_probuilder", "params": {
        "action": "create_shape",
        "properties": {"shape_type": "Plane", "name": "Floor",
                       "width": 18, "height": 6, "position": [7.5, 0, 0]}
    }},
    # Ceiling
    {"tool": "manage_probuilder", "params": {
        "action": "create_shape",
        "properties": {"shape_type": "Plane", "name": "Ceiling",
                       "width": 18, "height": 6, "position": [7.5, 4, 0]}
    }},
])

# Bevel all pillar tops for decoration
for i in range(6):
    info = manage_probuilder(action="get_mesh_info", target=f"Pillar_{i}",
        properties={"include": "edges"})
    # Find top ring edges, bevel them
    manage_probuilder(action="bevel_edges", target=f"Pillar_{i}",
        properties={"edgeIndices": [0, 1, 2, 3], "amount": 0.05})

# Smooth the pillars
for i in range(6):
    manage_probuilder(action="auto_smooth", target=f"Pillar_{i}",
        properties={"angleThreshold": 45})
```

###### Example: Custom L-Shaped Room

```python
# Use polygon shape for non-rectangular footprint
manage_probuilder(action="create_poly_shape", properties={
    "points": [
        [0, 0, 0], [10, 0, 0], [10, 0, 6],
        [4, 0, 6], [4, 0, 10], [0, 0, 10]
    ],
    "extrudeHeight": 3.0,
    "name": "LRoom"
})

# Create inside faces for the room interior
info = manage_probuilder(action="get_mesh_info", target="LRoom",
    properties={"include": "faces"})
# Duplicate and flip all faces to make interior visible
all_faces = list(range(info["data"]["faceCount"]))
manage_probuilder(action="duplicate_and_flip", target="LRoom",
    properties={"faceIndices": all_faces})

# Cut a window: subdivide a wall face, delete center
# (follow the get_mesh_info -> subdivide -> get_mesh_info -> delete pattern)
```

###### Example: Torus Knot / Decorative Ring

```python
# Create a torus
manage_probuilder(action="create_shape", properties={
    "shape_type": "Torus", "name": "Ring",
    "innerRadius": 0.3, "outerRadius": 2.0,
    "rows": 24, "columns": 32
})

# Smooth it for organic look
manage_probuilder(action="auto_smooth", target="Ring",
    properties={"angleThreshold": 60})

# Assign metallic material
manage_probuilder(action="set_face_material", target="Ring",
    properties={"faceIndices": [], "materialPath": "Assets/Materials/Gold.mat"})
# Note: empty faceIndices = all faces
```

##### Batch Patterns

Use `batch_execute` for multi-step workflows to reduce round-trips:

```python
batch_execute(commands=[
    {"tool": "manage_probuilder", "params": {
        "action": "create_shape",
        "properties": {"shape_type": "Cube", "name": "Column1", "position": [0, 0, 0]}
    }},
    {"tool": "manage_probuilder", "params": {
        "action": "create_shape",
        "properties": {"shape_type": "Cube", "name": "Column2", "position": [5, 0, 0]}
    }},
    {"tool": "manage_probuilder", "params": {
        "action": "create_shape",
        "properties": {"shape_type": "Cube", "name": "Column3", "position": [10, 0, 0]}
    }},
])
```

##### Known Limitations

###### Not Yet Working

These actions exist in the API but have known bugs that prevent them from working correctly:

| Action | Issue | Workaround |
|--------|-------|------------|
| `set_pivot` | Vertex positions don't persist through `ToMesh()`/`RefreshMesh()`. The `positions` property setter is overwritten when ProBuilder rebuilds the mesh. Needs `SetVertices(IList<Vertex>)` or direct `m_Positions` field access. | Use `center_pivot` instead, or position objects via Transform. |
| `convert_to_probuilder` | `MeshImporter` constructor throws internally. May need ProBuilder's editor-only `ProBuilderize` API instead of runtime `MeshImporter`. | Create shapes natively with `create_shape` or `create_poly_shape` instead of converting existing meshes. |

###### General Limitations

- Face indices are **not stable** across edits -- always re-query `get_mesh_info` after any modification
- Edge data is capped at **200 edges** in `get_mesh_info` results
- Face data is capped at **100 faces** in `get_mesh_info` results
- `subdivide` uses `ConnectElements.Connect` internally (ProBuilder has no public `Subdivide` API), which connects face midpoints rather than traditional quad subdivision

##### Key Rules

1. **Always get_mesh_info before editing** -- face indices are not stable across edits
2. **Re-query after modifications** -- subdivide, extrude, delete all change face indices
3. **Use direction labels** -- don't guess face indices, use the direction field
4. **Cleanup after editing** -- center_pivot + validate is good practice
5. **Auto-smooth for organic shapes** -- 30 degrees is a good default
6. **Prefer ProBuilder over primitives** -- when the package is available and you need editable geometry
7. **Use batch_execute** -- for creating multiple shapes or repetitive operations
8. **Screenshot to verify** -- use `manage_camera(action="screenshot", include_image=True)` to check visual results after complex edits

## Appendix D — Handoff + source switching

### `.claude/skills/blender-to-unity/SKILL.md`
_Hand off a model from Blender (via BlenderMCP) into Unity (via MCP for Unity) — export the current Blender model, import it through import_model_file, and place it in the open scene. Use when the user has BlenderMCP and MCP for Unity both connected and wants to bring a Blender model into Unity. Does NOT drive Blender's own generators; BlenderMCP owns how the model got into Blender._

#### Blender → Unity Model Handoff

Bring whatever model is currently in Blender into the open Unity scene. The seam is the
local filesystem: Blender exports a file, Unity imports it. The two servers never talk
directly.

##### Preconditions
- Both `mcp__blender__*` tools and MCP for Unity tools are connected.
- A model exists in the Blender scene (confirm with `mcp__blender__get_scene_info` /
  `mcp__blender__get_object_info`). If empty, stop and tell the user — this skill does not generate models.
- **`import_model_file` is in the `asset_gen` tool group, which is off by default** (only `core`
  loads). Enable it first with `manage_tools` (enable the `asset_gen` group), **or** call the C#
  handler straight through `batch_execute` —
  `{"tool":"import_model_file","params":{"sourcePath":...,"name":...,"outputFolder":...}}` (camelCase)
  — which dispatches by name regardless of group gating.

##### Steps
1. **Resolve the Unity project path.** Read `mcpforunity://editor/state` for the project
   root (the editor dataPath's parent). Decide the export format:
   - **GLB (glTFast) when the model has a rig, animation, PBR (metallic/roughness), emission,
     or transparency** — glTFast carries all of these automatically, no post-processing
     (see [references/bridge-fidelity.md](references/bridge-fidelity.md)). Multi-material zones
     survive either format, so they alone don't force GLB.
   - **FBX otherwise** — when glTFast isn't installed, the model is plain geometry, or you
     specifically need the built-in importer's humanoid-avatar pipeline. FBX drops emission/metallic
     (Step 5 restores emission) and surfaces animation only with `animation_type` set (Step 3).
2. **Export from Blender to a temp path** via `mcp__blender__execute_blender_code`:
   ```python
   import bpy, os, tempfile
   out = os.path.join(tempfile.gettempdir(), "blender_to_unity.fbx")
   # Export the selection if any, else the whole scene:
   bpy.ops.export_scene.fbx(filepath=out, use_selection=bool(bpy.context.selected_objects),
                            apply_unit_scale=True, bake_space_transform=True)
   print(out)
   ```
   (glTF branch: `out_glb = os.path.join(tempfile.gettempdir(), "blender_to_unity.glb")`, then
   `bpy.ops.export_scene.gltf(filepath=out_glb, export_format='GLB', use_active_scene=True)`
   — its default `use_active_scene=False` can silently export a *different* open scene.)
3. **Import into Unity** with `import_model_file`:
   `import_model_file(source_path=<temp path>, name=<asset name>, target_size=<final size in meters>)`.
   For a **rigged/animated FBX**, also pass `animation_type="generic"` (or `"humanoid"`; `"legacy"`
   targets the old Animation-component system) — the importer defaults to `"none"`, which
   deliberately imports the mesh with **zero animation clips**. GLB ignores this (glTFast imports
   animation itself), so it's an FBX-only knob.
   It returns `{ asset_path, asset_guid }`. Pass `target_size` as the intended final size, but treat
   it only as a hint: it rescales at import solely when the project's **Auto-normalize** pref is on,
   and even then is unreliable for Blender FBX (see the **Scale** note). Step 4 does the reliable
   normalization.
4. **Place it in the scene, normalized to size.** Ensure the scene has a camera + directional
   light (`manage_scene` / `manage_gameobject`). Instantiate the model at the chosen position via
   `manage_gameobject(action="create", prefab_path=<asset_path>, name=<asset name>, position=[x,y,z])`.
   Then normalize its size deterministically — Blender FBX commonly imports ~100× too large — by
   measuring the placed model's world bounds and scaling so its largest dimension equals your target
   size. Run via `execute_code` (substitute your object name and target meters):
   ```csharp
   var go = GameObject.Find("<asset name>");
   var rs = go.GetComponentsInChildren<Renderer>();
   var b = rs[0].bounds; for (int i = 1; i < rs.Length; i++) b.Encapsulate(rs[i].bounds);
   float maxDim = Mathf.Max(b.size.x, Mathf.Max(b.size.y, b.size.z));
   float target = 2f; // intended size in meters
   if (maxDim > 0.0001f) go.transform.localScale *= target / maxDim;
   ```
5. **Restore emission FBX dropped (FBX path).** Blender scenes commonly store their color/glow
   in *material emission* (and other Principled-node inputs). FBX carries base/diffuse color but
   **not emission**, so neon / "Tron" scenes import as dark bodies with black accents. If the
   import looks flat vs. Blender, restore it:
   a. Dump the emissive materials from Blender via `execute_blender_code`:
      ```python
      import bpy, json
      out = {}
      for m in bpy.data.materials:
          if not (m.use_nodes and m.node_tree): continue
          col, s = (0, 0, 0), 0.0
          p = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
          es = next((k for k in ('Emission Color', 'Emission') if p and k in p.inputs), None)  # 4.x / 3.x name
          if es:
              col = tuple(p.inputs[es].default_value)[:3]
              s = float(p.inputs['Emission Strength'].default_value)
          e = next((n for n in m.node_tree.nodes if n.type == 'EMISSION'), None)
          if e and s == 0:
              col = tuple(e.inputs['Color'].default_value)[:3]; s = float(e.inputs['Strength'].default_value)
          if s > 0 and sum(col) > 0.01:
              out[m.name] = [round(col[0], 3), round(col[1], 3), round(col[2], 3), round(s, 3)]
      print(json.dumps(out))
      ```
   b. In Unity (`execute_code`): extract the FBX's materials so they're editable
      (`AssetDatabase.ExtractAsset` per `Material`, then `ImportAsset(fbx, ForceUpdate)`), then for
      each dumped name set `_EmissionColor = color * Mathf.Clamp(strength*0.45f, 1.5f, 5f)`,
      `EnableKeyword("_EMISSION")`, and `globalIlluminationFlags = RealtimeEmissive`. Match names
      **case-insensitively** — FBX mangles case and can split one material into variants
      (`EdgeCyan` → `EdgeCyan` + `EDGE_CYAN`); set every match. Add a global Bloom volume and enable
      the camera's `renderPostProcessing` so the emission actually glows.
6. **Verify** with `manage_camera(action="screenshot", include_image=true)` and report the
   asset path + a screenshot.

##### Notes
- **Scale.** Models from Blender almost always arrive at the wrong scale — its FBX unit handling
  makes them land ~100× too large in Unity. `import_model_file`'s `target_size` only rescales at
  import when the project's Auto-normalize pref is enabled, and its importer-level normalization is
  unreliable for Blender FBX (it can over- or under-shoot, e.g. a `target_size=2` model measured 200 m).
  The robust fix is the Step 4 measure-bounds-then-set-`localScale` routine, which hits the target
  size deterministically regardless of the import scale or the Auto-normalize pref.
- **Materials & emission.** FBX carries base/diffuse color and transforms fine, but **drops
  emission and any node-based color** — so Blender neon / "Tron" scenes (color stored in
  emission) import as dark bodies with black accents. Two fixes: **(a) prefer glTF/GLB when glTFast
  is installed** — glTF's PBR model carries `emissiveFactor` + `KHR_materials_emissive_strength`
  natively, so emission survives with no post-step (`bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_active_scene=True)`);
  **(b) with FBX, run Step 5** to dump Blender's emission and reapply it. Also check the mesh for a
  `color_attributes` (vertex color) layer — the *data* survives FBX, but URP Lit won't *display* it;
  that needs a vertex-color-reading shader, not `_EmissionColor`.
- FBX is the default because glTFast is optional in MCP for Unity. If the import errors with
  "GLB import requires glTFast", re-export as FBX (or install glTFast from the Dependencies tab).
- **Format fidelity.** [references/bridge-fidelity.md](references/bridge-fidelity.md) is a tested
  matrix of what each format carries. Summary: **GLB (glTFast)** keeps textures, metallic/roughness,
  emission, transparency, and animation automatically; **FBX** drops metallic + emission, needs
  `ModelImporter.animationType = Generic` to surface transform animation, and needs material/texture
  extraction to assign an embedded texture. Both bake modifiers and carry geometry + vertex-color
  *data* (URP Lit won't *display* vertex colors). Neither carries procedural/node materials — bake
  them to image textures in Blender first.
- **Animation doesn't auto-play.** An imported clip won't move the model until an `AnimatorController`
  drives it — the placed model has an `Animator` with a **null controller**, so it looks frozen. Build
  one with `manage_animation` (`controller_create` → add the clip as a looping state → `controller_assign`
  onto the instance) rather than hand-rolling `execute_code`. See bridge-fidelity gotcha #7.
- **Multi-material zones survive.** A mesh split into material slots in Blender (e.g. skin/shirt/pants
  regions) imports as submeshes with one material each — base colors carry over GLB natively — so you
  can "dress" a model with material zones and it arrives intact.
- Keep one model per handoff; for batches, repeat the loop with distinct names.
- This skill never sends API keys or file bytes over the MCP bridge — Unity reads the file from disk.
- `import_model_file` copies only the single source file; for multi-file exports (a text `.gltf` with an external `.bin`, or an `.obj` with a sibling `.mtl`/textures), zip them first and pass the `.zip` — a bare `.gltf`/`.obj` will lose its sidecars.

### `.claude/skills/mcp-source/SKILL.md`
_Switch MCP for Unity package source in connected Unity projects. Use /mcp-source [main|beta|branch|local] to swap between upstream releases, your remote branch, or local dev checkout._

#### Switch MCP for Unity Package Source

You are switching the `com.coplaydev.unity-mcp` package source in one or more Unity projects.

##### allowed-tools

Bash, Read, Edit, ReadMcpResourceTool, ListMcpResourcesTool

##### Instructions

###### 1. Parse arguments

The user's argument is: `$ARGUMENTS`

Valid values: `main`, `beta`, `branch`, `local`, or empty.

If empty or not one of the four valid values, ask the user to choose:
- **main** — upstream main branch (stable releases)
- **beta** — upstream beta branch (pre-release)
- **branch** — your current remote branch (for testing a PR)
- **local** — local file reference to your checkout (for live dev iteration)

###### 2. Detect repo context

Run these git commands from the current working directory to find the unity-mcp repo:

```bash
git rev-parse --show-toplevel    # → repo_root
git rev-parse --abbrev-ref HEAD  # → branch_name
git remote get-url origin        # → origin_url
```

Convert SSH origins to HTTPS: if `origin_url` starts with `git@github.com:`, transform it to `https://github.com/{owner}/{repo}.git`.

###### 3. Discover target Unity projects

Try two approaches to find `Packages/manifest.json` files to update:

**Approach A — MCP resources (preferred):**
Read `mcpforunity://project/info` for each connected Unity instance (use `ListMcpResourcesTool` to find available instances). Extract `projectRoot` and use `{projectRoot}/Packages/manifest.json`.

**Approach B — filesystem fallback:**
If no MCP instances are connected, search upward from the current working directory for `Packages/manifest.json` files using Bash:
```bash
find "$(pwd)" -maxdepth 3 -name "manifest.json" -path "*/Packages/manifest.json" 2>/dev/null
```

If multiple manifests are found, update all of them (confirming with the user first).

###### 4. Build the package URL

Based on the user's selection, construct the dependency value:

| Selection | URL |
|-----------|-----|
| `main`    | `https://github.com/CoplayDev/unity-mcp.git?path=/MCPForUnity#main` |
| `beta`    | `https://github.com/CoplayDev/unity-mcp.git?path=/MCPForUnity#beta` |
| `branch`  | `{origin_https}?path=/MCPForUnity#{branch_name}` |
| `local`   | `file:{repo_root}/MCPForUnity` |

For `branch`: use the HTTPS-normalized origin URL and current git branch name.
For `local`: use the absolute path to the repo root with `file:` prefix (no `//`), e.g. `file:/Users/davidsarno/unity-mcp/MCPForUnity`.

###### 5. Update each manifest

For each discovered `manifest.json`:

1. Read the file with the Read tool
2. Find the `"com.coplaydev.unity-mcp"` dependency line
3. Use the Edit tool to replace the old value with the new URL
4. Report what was changed: old value → new value, file path

###### 6. Report results

After updating, tell the user:
- Which manifests were updated
- The old and new package source values
- Remind them: "Unity will re-resolve the package automatically. If it doesn't, open Package Manager and click Refresh."

## Appendix E — Not inlined (size budget), read from source when needed
- [`unity-mcp-skill/references/tools-reference.md`](https://github.com/CoplayDev/unity-mcp/blob/19b66ec/unity-mcp-skill/references/tools-reference.md)

---
**Source & credit:** [CoplayDev/unity-mcp](https://github.com/CoplayDev/unity-mcp) @ `19b66ec` (cloned 2026-11-22). License: MIT. All upstream text in the appendices is © its authors, inlined for personal use with attribution; this wrapper skill by Space Age.
