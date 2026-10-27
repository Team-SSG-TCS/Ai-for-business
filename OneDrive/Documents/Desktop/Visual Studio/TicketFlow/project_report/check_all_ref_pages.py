import pymupdf

doc = pymupdf.open('projectReportRef (2).pdf')
with open('all_ref_pages_summary.txt', 'w', encoding='utf-8') as f:
    for i, page in enumerate(doc):
        text = page.get_text()
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        top = lines[0] if lines else '[EMPTY]'
        bot = lines[-1] if lines else '[EMPTY]'
        f.write(f"Page {i+1} (Total lines: {len(lines)}): Top='{top[:40]}' | Bot='{bot[:40]}'\n")

print("Done writing to all_ref_pages_summary.txt")
