from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Access via 127.0.0.1 to test dynamic hostname
    url = "http://127.0.0.1:8000"

    print(f"Navigating to {url}")
    try:
        page.goto(url)
    except Exception as e:
        print(f"Error navigating: {e}")
        return

    # 1. Set localStorage to have a twitch stream
    print("Injecting localStorage...")
    page.evaluate("""
        localStorage.setItem('streams', JSON.stringify([{
            id: 'test-stream',
            platform: 'twitch',
            videoId: 'twitch',
            twitchContentType: 'channel'
        }]));
    """)

    print("Reloading page...")
    page.reload()

    # 2. Wait for iframe
    print("Waiting for iframe...")
    try:
        iframe = page.locator("iframe")
        iframe.wait_for(timeout=10000)
    except Exception as e:
        print(f"Error waiting for iframe: {e}")
        # Take screenshot anyway
        page.screenshot(path="verification/twitch_embed_error.png")
        return

    # 3. Get src
    src = iframe.get_attribute("src")
    print(f"Iframe SRC: {src}")

    if "parent=127.0.0.1" in src:
        print("SUCCESS: parent parameter matches hostname 127.0.0.1")
    else:
        print("FAILURE: parent parameter does not match hostname 127.0.0.1")

    # 4. Screenshot
    page.screenshot(path="verification/twitch_embed.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
