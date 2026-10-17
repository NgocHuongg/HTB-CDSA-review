import sys, zipfile, pathlib
z = zipfile.ZipFile(sys.argv[1] if len(sys.argv) > 1 else '_work/in.zip')
n = 0
for info in z.infolist():
    if info.is_dir(): continue
    p = pathlib.Path(info.filename)
    if p.is_absolute() or '..' in p.parts or p.parts[0] != 'data': raise SystemExit('bad path ' + info.filename)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, 'wb') as f: f.write(z.read(info))   # ghi de, khong xoa file cu
    n += 1
print('extracted', n, 'files')
