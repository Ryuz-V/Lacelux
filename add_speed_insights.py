import os
import re

snippet = """
<script>
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>
"""

public_dir = r"c:\Users\jathniel\.vscode\Tokoh Sepatu\public"

for root, dirs, files in os.walk(public_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            if "window.si = window.si || function ()" not in content:
                # Add snippet right before </body>
                new_content = re.sub(r'(</body>)', lambda m: snippet + m.group(1), content, flags=re.IGNORECASE)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Added Speed Insights to {filepath}")
