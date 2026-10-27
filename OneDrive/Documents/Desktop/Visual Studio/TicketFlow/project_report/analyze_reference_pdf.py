import pymupdf
import json

doc = pymupdf.open('projectReportRef (2).pdf')
print(f'Total pages in reference PDF: {len(doc)}')

# Let's collect font statistics and bbox analysis across pages 5 to 25
font_stats = {}
margins = []

for page_idx in range(4, min(30, len(doc))):
    page = doc[page_idx]
    rect = page.rect
    d = page.get_text('dict')
    page_text_boxes = []
    
    for b in d['blocks']:
        if 'lines' in b:
            for l in b['lines']:
                for s in l['spans']:
                    txt = s['text'].strip()
                    if not txt:
                        continue
                    font = s['font']
                    size = round(s['size'], 1)
                    flags = s['flags']
                    color = f"#{s['color']:06x}"
                    bbox = [round(x, 1) for x in s['bbox']]
                    
                    key = (font, size, color)
                    if key not in font_stats:
                        font_stats[key] = {'count': 0, 'samples': []}
                    font_stats[key]['count'] += 1
                    if len(font_stats[key]['samples']) < 3 and txt not in font_stats[key]['samples']:
                        font_stats[key]['samples'].append(txt[:50])
                        
                    page_text_boxes.append(bbox)
                    
    if page_text_boxes:
        min_x = min(b[0] for b in page_text_boxes)
        max_x = max(b[2] for b in page_text_boxes)
        min_y = min(b[1] for b in page_text_boxes)
        max_y = max(b[3] for b in page_text_boxes)
        margins.append({
            'page': page_idx + 1,
            'left': min_x,
            'right': rect.width - max_x,
            'top': min_y,
            'bottom': rect.height - max_y,
            'width': rect.width,
            'height': rect.height
        })

print("\n--- MARGIN ANALYSIS (Sample of pages) ---")
for m in margins[:8]:
    print(f"Page {m['page']}: Left={m['left']}pt, Right={m['right']}pt, Top={m['top']}pt, Bottom={m['bottom']}pt, W={m['width']}, H={m['height']}")

print("\n--- FONT USAGE IN REFERENCE PDF ---")
sorted_fonts = sorted(font_stats.items(), key=lambda x: x[1]['count'], reverse=True)
for (font, size, color), data in sorted_fonts:
    print(f"Font: {font:25} | Size: {size:4}pt | Color: {color} | Count: {data['count']:4} | Samples: {data['samples']}")

# Inspect specific pages in detail
def inspect_page_detail(pno):
    page = doc[pno]
    print(f"\n==================== FULL DETAIL OF PAGE {pno+1} ====================")
    d = page.get_text('dict')
    for b_idx, b in enumerate(d['blocks']):
        if 'lines' in b:
            lines_str = []
            font_info = ""
            for l in b['lines']:
                line_spans = []
                for s in l['spans']:
                    line_spans.append(s['text'])
                    font_info = f"[{s['font']} {s['size']:.1f}pt #{s['color']:06x}]"
                lines_str.append("".join(line_spans))
            block_text = " \n ".join(lines_str)
            bbox = [round(x, 1) for x in b['bbox']]
            print(f"Block {b_idx} (bbox {bbox}) {font_info}:\n{block_text[:200]}...")
            print("-" * 50)

inspect_page_detail(4)   # Abstract
inspect_page_detail(5)   # Table of Contents
inspect_page_detail(9)   # Chapter 1 Title page
inspect_page_detail(10)  # Chapter 1 Body page
