import os
import sys
import pymupdf

BASE_DIR = r"c:\Users\deepa\OneDrive\Documents\Desktop\Visual Studio\TicketFlow\project_report"

# Let's inspect the exact lines and pages in ticketflow_body_generated.pdf
doc = pymupdf.open(os.path.join(BASE_DIR, "ticketflow_body_generated.pdf"))
print(f"Body pages: {len(doc)}")
for i in range(len(doc)):
    txt = doc[i].get_text("text").strip()
    first = txt.splitlines()[0] if txt.splitlines() else "EMPTY"
    last = txt.splitlines()[-1] if txt.splitlines() else "EMPTY"
    print(f"Page {i+1}: Start='{first[:30]}' | End='{last[:30]}' | chars={len(txt)}")
doc.close()
