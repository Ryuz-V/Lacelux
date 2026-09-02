import sys

with open('public/profile/profile.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('href="products.html', 'href="../products.html')
text = text.replace('href="#"', 'href="../#"') # Just in case, actually no let's not touch #
text = text.replace('href="/public/', 'href="../')

with open('public/profile/profile.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed links in profile.html')
