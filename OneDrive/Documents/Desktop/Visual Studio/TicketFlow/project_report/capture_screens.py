import os
import subprocess
import time

screenshots_dir = r"c:\Users\deepa\OneDrive\Documents\Desktop\Visual Studio\TicketFlow\project_report\screenshots"
os.makedirs(screenshots_dir, exist_ok=True)

chrome_path = r"C:\Users\deepa\AppData\Local\Google\Chrome\Application\chrome.exe"

targets = [
    ("login_page.png", "http://localhost:3000/login.html"),
    ("admin_dashboard.png", "http://localhost:3000/admin.html"),
    ("user_booking.png", "http://localhost:3000/user.html"),
]

for filename, url in targets:
    out_path = os.path.join(screenshots_dir, filename)
    cmd = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--window-size=1440,900",
        f"--screenshot={out_path}",
        url
    ]
    print(f"Capturing {filename} from {url}...")
    subprocess.run(cmd, capture_output=True, timeout=15)
    if os.path.exists(out_path):
        print(f"Captured {filename}: {os.path.getsize(out_path)} bytes")
    else:
        print(f"Failed to capture {filename}")

print("Screenshot capture batch finished.")
