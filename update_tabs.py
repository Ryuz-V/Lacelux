import re

with open('public/profile/profile.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update sidebar links
text = text.replace(
    '<li class="active"><a href="../#"><i data-feather="user"></i> My Accounts</a></li>',
    '<li class="active" id="nav-my-accounts"><a href="#my-accounts"><i data-feather="user"></i> My Accounts</a></li>'
)
text = text.replace(
    '<li><a href="../#"><i data-feather="shopping-bag"></i> My Orders</a></li>',
    '<li id="nav-my-orders"><a href="#my-orders"><i data-feather="shopping-bag"></i> My Orders</a></li>'
)

# 2. Wrap existing content in section-my-accounts
# Find <main class="main-content">
main_start = text.find('<main class="main-content">') + len('<main class="main-content">')
# Find the closing </main>
main_end = text.find('</main>', main_start)

main_content = text[main_start:main_end]

new_main_content = """
            <div id="section-my-accounts" class="profile-section">""" + main_content + """</div>
            
            <div id="section-my-orders" class="profile-section" style="display: none;">
                <div class="main-header">
                    <h2>My Orders</h2>
                </div>
                <div class="profile-details">
                    <p style="padding: 20px 0; color: #666; font-size: 16px;">You have no orders yet.</p>
                </div>
            </div>
"""

text = text[:main_start] + new_main_content + text[main_end:]

# 3. Add JS
js_script = """
    <script>
        function switchTab() {
            const hash = window.location.hash || '#my-accounts';
            
            document.querySelectorAll('.profile-section').forEach(sec => sec.style.display = 'none');
            document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
            
            if (hash === '#my-orders') {
                const sec = document.getElementById('section-my-orders');
                const nav = document.getElementById('nav-my-orders');
                if(sec) sec.style.display = 'block';
                if(nav) nav.classList.add('active');
            } else {
                const sec = document.getElementById('section-my-accounts');
                const nav = document.getElementById('nav-my-accounts');
                if(sec) sec.style.display = 'block';
                if(nav) nav.classList.add('active');
            }
        }

        window.addEventListener('hashchange', switchTab);
        document.addEventListener('DOMContentLoaded', switchTab);
    </script>
"""

# Insert before </body>
body_end = text.find('</body>')
text = text[:body_end] + js_script + text[body_end:]

with open('public/profile/profile.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
