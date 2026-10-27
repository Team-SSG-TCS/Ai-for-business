import os
import json
import time
from playwright.sync_api import sync_playwright

output_dir = r"c:\Users\deepa\OneDrive\Documents\Desktop\Visual Studio\TicketFlow\project_report\screenshots"
os.makedirs(output_dir, exist_ok=True)
chrome_exe = r"C:\Users\deepa\AppData\Local\Google\Chrome\Application\chrome.exe"

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_exe, headless=True)
    
    # 1. Login Page
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    page.goto("http://localhost:3000/login.html")
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(output_dir, "01_login_portal.png"))
    print("Saved 01_login_portal.png")
    context.close()

    # 2. Admin Sessions & Tabs
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    # Pre-seed session
    page.goto("http://localhost:3000/login.html")
    admin_session = json.dumps({"token": "admin-demo-jwt-token-xyz", "role": "ROLE_ADMIN", "username": "admin", "fullName": "Vikram Sharma"})
    page.evaluate(f"localStorage.setItem('ticketflow_session', '{admin_session}');")
    page.goto("http://localhost:3000/admin.html")
    page.wait_for_timeout(1500)
    page.screenshot(path=os.path.join(output_dir, "02_admin_overview.png"))
    print("Saved 02_admin_overview.png")

    # Admin: Anti-Scalp & Bot Shield tab
    page.evaluate("if (typeof switchTab === 'function') switchTab('tab-security');")
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(output_dir, "03_anti_scalp_shield.png"))
    print("Saved 03_anti_scalp_shield.png")

    # Admin: Virtual Queue Console tab
    page.evaluate("if (typeof switchTab === 'function') switchTab('tab-queue-console');")
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(output_dir, "04_virtual_queue_console.png"))
    print("Saved 04_virtual_queue_console.png")

    # Admin: Seat Map tab
    page.evaluate("if (typeof switchTab === 'function') switchTab('tab-seatmap');")
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(output_dir, "05_seat_matrix_map.png"))
    print("Saved 05_seat_matrix_map.png")
    context.close()

    # 3. User Portal
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    page.goto("http://localhost:3000/login.html")
    user_session = json.dumps({"token": "user-demo-jwt-token-abc", "role": "ROLE_USER", "username": "deepak", "fullName": "Deepak A"})
    page.evaluate(f"localStorage.setItem('ticketflow_session', '{user_session}');")
    page.goto("http://localhost:3000/user.html")
    page.wait_for_timeout(1500)
    page.screenshot(path=os.path.join(output_dir, "06_user_portal.png"))
    print("Saved 06_user_portal.png")
    context.close()

    browser.close()

print("All screenshots successfully captured!")
