"""Builds ../docs/index.html, a single self-contained page, from the files in this folder.
GitHub Pages publishes the docs/ folder.

Run from anywhere:  python3 src/build.py
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'docs', 'index.html')
SCRIPTS = ['data2028.js', 'hist_data.js', 'history.js', 'history2.js', 'history3.js', 'full.js']

def read(name):
    with open(os.path.join(HERE, name), encoding='utf-8') as f:
        return f.read()

body = read('body.html')
css = read('style.css')
js = '\n'.join(read(f) for f in SCRIPTS)
js += '\nconst MAP = ' + json.dumps(json.loads(read('map.json')), separators=(',', ':')) + ';\n' + read('game.js')
page = body.replace('/*STYLE*/', css).replace('/*SCRIPT*/', js)

# Everything before the first screen belongs in <head>; the rest is the page body.
cut = page.index('<section id="scr-title"')
head, rest = page[:cut], page[cut:]

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Crect width='64' height='64' rx='12' fill='%23111316'/%3E"
           "%3Cellipse cx='32' cy='32' rx='19' ry='12' fill='none' stroke='%23fff' stroke-width='5'/%3E"
           "%3Cpath d='M16 34c8-6 22-8 32-4' stroke='%23d5544d' stroke-width='6' stroke-linecap='round' fill='none'/%3E%3C/svg%3E")

doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="A presidential campaign game. Run the 2028 race or replay elections from 1948 to 2000 with the real candidates, from Labor Day to Election Night.">
<link rel="icon" href="{FAVICON}">
<style>
:root {{ color-scheme: light; padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }}
body {{ margin: 0; font: 14px system-ui, sans-serif; }}
img {{ max-width: 100%; }}
[hidden] {{ display: none !important; }}
</style>
{head.strip()}
</head>
<body>
{rest.strip()}
</body>
</html>
"""
with open(OUT, 'w', encoding='utf-8') as f:
    f.write(doc)
print('wrote', os.path.normpath(OUT), len(doc), 'bytes')
