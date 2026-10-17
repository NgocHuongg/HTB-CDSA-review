# HTB CDSA Review

A local, offline study site for the **HTB Certified Defensive Security Analyst (CDSA)** path, styled after HTB Academy. It runs on a single Python file with no dependencies and is used for self-review in English and Vietnamese.

## Features

- **Modules → Sections:** all 15 modules of the SOC Analyst path (167 sections), with original images and code/output blocks
- **EN ↔ VI switch:** every section has both an English and a Vietnamese version, switchable at any time
- **Progress tracking:** mark sections as complete, see progress per module, reset a module
- **Readable content:** sidebar table of contents, code blocks with a copy button (shell prompts are left out of the copy), callouts, tables
- **Cheatsheets:** view or download each official HTB cheatsheet, or download all of them as one `.zip`
- **Answers:** answers for every section that has questions, one entry per section, with copy buttons and export to `.md` (one module or all of them)
- Dark HTB-style theme, works on desktop and mobile

## Requirements

- Python 3.8+ (standard library only, nothing to install)

## Getting started

**Windows:** double-click `start.bat`. It tries `py -3`, then `python`, then Python inside WSL, and opens the browser.

**Any OS:**

```bash
python server.py
```

Then open http://127.0.0.1:8765/

| Option | Default | Description |
|---|---|---|
| `--port` | `8765` | Port to listen on (moves to the next free port if it is busy) |
| `--host` | `127.0.0.1` | Address to bind |
| `--data` | `./data` | Content folder |
| `--no-browser` | off | Do not open the browser on start |

## Project structure

```
htb-cdsa-review/
├── server.py              # HTTP server + JSON API
├── start.bat              # Windows launcher
├── web/                   # Single-page app (HTML, CSS, JS, Markdown renderer)
└── data/
    ├── modules/
    │   └── <module-id>/
    │       ├── module.json            # title + description (en/vi)
    │       └── sections/
    │           └── <NN-section-id>/
    │               ├── en.md          # section content (first "# " line = section title)
    │               ├── vi.md          # Vietnamese version
    │               ├── questions.json # questions + answers
    │               └── images/        # images referenced from the .md files
    ├── cheatsheets/                   # cheatsheet files, grouped in subfolders
    └── progress.json                  # created automatically
```
