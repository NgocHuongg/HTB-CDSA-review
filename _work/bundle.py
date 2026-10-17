import json, pathlib, sys, zipfile
root = pathlib.Path('data/modules')
mods = json.load(open(root / 'incident-handling-process/sections/01-incident-handling/_import/path_modules.json', encoding='utf-8'))
want = sys.argv[1:]  # danh sach module slug can dong goi (rong = tat ca module da du)
done, out = [], pathlib.Path('_work/out.zip')
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for m in mods:
        slug = 'incident-handling-process' if m['id'] == 148 else m['slug']
        if m['id'] == 148 or (want and slug not in want):
            continue
        folders = [s['folder'] for s in m['sections']]
        ok = all((root / slug / 'sections' / f / 'en.md').exists() and (root / slug / 'sections' / f / '_import/questions.json').exists() for f in folders)
        if not ok:
            continue
        for f in folders:
            for rel in ('en.md', '_import/questions.json'):
                p = root / slug / 'sections' / f / rel
                z.write(p, p.as_posix())
        z.write(root / slug / 'module.json', (root / slug / 'module.json').as_posix())
        done.append(f"{slug}:{len(folders)}")
print('bundled', out.stat().st_size, 'bytes:', ' '.join(done))
