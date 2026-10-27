import os
import pymupdf

BASE_DIR = r"c:\Users\deepa\OneDrive\Documents\Desktop\Visual Studio\TicketFlow\project_report"
BODY_PDF = os.path.join(BASE_DIR, "ticketflow_body_generated.pdf")
ORIG_PDF = os.path.join(BASE_DIR, "projectReportRef (2).pdf")
FINAL_PDF = os.path.join(BASE_DIR, "TicketFlow_Project_Report_Deepak_A.pdf")

doc = pymupdf.open(FINAL_PDF)
print(f"Current final page count: {len(doc)}")
doc.close()
