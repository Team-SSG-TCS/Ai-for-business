import pymupdf

doc = pymupdf.open('projectReportRef (2).pdf')

with open('ref_analysis_output.txt', 'w', encoding='utf-8') as out:
    for p in range(11, 25):
        page = doc[p]
        out.write(f"\n==================== PAGE {p+1} ====================\n")
        blocks = page.get_text('dict')['blocks']
        for b in blocks:
            if 'lines' in b:
                for l in b['lines']:
                    for s in l['spans']:
                        txt = s['text'].strip()
                        if txt:
                            font = s['font']
                            size = round(s['size'], 1)
                            color = f"#{s['color']:06x}"
                            bbox = [round(x, 1) for x in s['bbox']]
                            flags = s['flags']
                            out.write(f"[{font} | {size}pt | {color} | bbox={bbox} | flags={flags}]: {txt[:70]}\n")
                            break
                    break

    out.write("\n==================== HEADER & FOOTER ANALYSIS ====================\n")
    for p in range(len(doc)):
        page = doc[p]
        h = page.rect.height
        w = page.rect.width
        blocks = page.get_text('dict')['blocks']
        top_texts = []
        bottom_texts = []
        for b in blocks:
            if 'lines' in b:
                for l in b['lines']:
                    for s in l['spans']:
                        txt = s['text'].strip()
                        if txt:
                            if s['bbox'][1] < 70:
                                top_texts.append((txt, s['bbox'], s['font'], round(s['size'], 1), f"#{s['color']:06x}"))
                            if s['bbox'][3] > h - 70:
                                bottom_texts.append((txt, s['bbox'], s['font'], round(s['size'], 1), f"#{s['color']:06x}"))
        if top_texts or bottom_texts:
            out.write(f"Page {p+1}: Top -> {top_texts} | Bottom -> {bottom_texts}\n")
print("Analysis written to ref_analysis_output.txt")
