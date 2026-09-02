import sys

with open('public/index.html', 'r', encoding='utf-8') as f:
    index_lines = f.readlines()

navbar_lines = index_lines[12:222]

with open('public/profile/profile.html', 'r', encoding='utf-8') as f:
    profile_lines = f.readlines()

body_idx = -1
head_idx = -1
body_end_idx = -1
for i, line in enumerate(profile_lines):
    if '<body>' in line:
        body_idx = i
    if '<link rel="stylesheet" href="style.css">' in line:
        head_idx = i
    if '</body>' in line:
        body_end_idx = i

if body_idx != -1 and head_idx != -1 and body_end_idx != -1:
    profile_lines.insert(body_end_idx, '    <script src="../script.js"></script>\n')
    profile_lines = profile_lines[:body_idx+1] + navbar_lines + profile_lines[body_idx+1:]
    profile_lines.insert(head_idx, '    <link rel="stylesheet" href="../style.css">\n')
    
    with open('public/profile/profile.html', 'w', encoding='utf-8') as f:
        f.writelines(profile_lines)
    print('Success')
else:
    print('Failed', body_idx, head_idx, body_end_idx)
