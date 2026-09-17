import os
import re

def main():
    public_dir = r"c:\Users\jathniel\.vscode\Tokoh Sepatu\public"
    
    # 1. Update script.js to include getWishlistStorageKey
    script_js_path = os.path.join(public_dir, 'script.js')
    with open(script_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    helper_code = """window.getWishlistStorageKey = function() {
    const token = localStorage.getItem('token');
    if (!token) return 'wishlist';
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.userId) return 'wishlist_' + payload.userId;
        if (payload && payload.email) return 'wishlist_' + payload.email;
    } catch (e) {}
    return 'wishlist';
};
"""
    if "window.getWishlistStorageKey" not in content:
        content = helper_code + "\n" + content

    # Helper function to replace correctly
    # We want to replace localStorage.getItem('wishlist') with localStorage.getItem(window.getWishlistStorageKey())
    # and localStorage.setItem('wishlist', ... ) with localStorage.setItem(window.getWishlistStorageKey(), ...)
    content = re.sub(r"localStorage\.getItem\(['\"]wishlist['\"]\)", r"localStorage.getItem(window.getWishlistStorageKey())", content)
    content = re.sub(r"localStorage\.setItem\(['\"]wishlist['\"]", r"localStorage.setItem(window.getWishlistStorageKey()", content)
    # also for event listener
    content = re.sub(r"e\.key === ['\"]wishlist['\"]", r"e.key === window.getWishlistStorageKey()", content)

    with open(script_js_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated {script_js_path}")

    # 2. Update other html/js files in public directory
    for root, dirs, files in os.walk(public_dir):
        for file in files:
            if file.endswith('.js') or file.endswith('.html'):
                filepath = os.path.join(root, file)
                if filepath == script_js_path:
                    continue # already processed
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = re.sub(r"localStorage\.getItem\(['\"]wishlist['\"]\)", r"localStorage.getItem(window.getWishlistStorageKey())", content)
                new_content = re.sub(r"localStorage\.setItem\(['\"]wishlist['\"]", r"localStorage.setItem(window.getWishlistStorageKey()", new_content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

if __name__ == '__main__':
    main()
