import pymupdf

doc = pymupdf.open(r"c:\Users\deepa\OneDrive\Documents\Desktop\Visual Studio\TicketFlow\project_report\projectReportRef (2).pdf")
page = doc[11] # Chapter 1 page
print("Page size:", page.rect)
blocks = page.get_text("dict")["blocks"]
for b in blocks[:6]:
    if "lines" in b:
        for line in b["lines"]:
            for span in line["spans"]:
                if span["text"].strip():
                    print(f"Font: {span['font']}, Size: {span['size']:.1f}, Text: {span['text'][:50]}")
