import pymupdf

doc = pymupdf.open('projectReportRef (2).pdf')
with open('ref_page_numbers_check.txt', 'w', encoding='utf-8') as out:
    for p in range(len(doc)):
        page = doc[p]
        rect = page.rect
        # look for any text in bottom 50 pt
        bottom_spans = []
        for b in page.get_text('dict')['blocks']:
            if 'lines' in b:
                for l in b['lines']:
                    for s in l['spans']:
                        if s['bbox'][1] > rect.height - 60:
                            bottom_spans.append((s['text'].strip(), s['bbox'], s['font'], s['size']))
        out.write(f"Page {p+1}: Bottom={bottom_spans}\n")
print("Written to ref_page_numbers_check.txt")
