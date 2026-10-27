import pymupdf

doc = pymupdf.open('TicketFlow_Project_Report_Deepak_A.pdf')
print(f"Total Pages in final PDF: {len(doc)}")

with open('final_pdf_layout_check.txt', 'w', encoding='utf-8') as f:
    for i in range(len(doc)):
        page = doc[i]
        h = page.rect.height
        w = page.rect.width
        d = page.get_text('dict')
        boxes = []
        for b in d['blocks']:
            if 'lines' in b:
                for l in b['lines']:
                    for s in l['spans']:
                        txt = s['text'].strip()
                        if txt:
                            boxes.append((txt, s['bbox'], s['font'], round(s['size'], 1)))
        
        if boxes:
            min_y = min(b[1][1] for b in boxes)
            max_y = max(b[1][3] for b in boxes)
            fill_pct = ((max_y - min_y) / (h - 144)) * 100
            f.write(f"Page {i+1}: Top={min_y:.1f}pt, Bottom={max_y:.1f}pt, Fill={fill_pct:.1f}% | First='{boxes[0][0][:35]}' | Last='{boxes[-1][0][:35]}'\n")
        else:
            f.write(f"Page {i+1}: [NO TEXT BOXES FOUND]\n")

print("Inspection written to final_pdf_layout_check.txt")
