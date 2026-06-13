import re
import os

with open('src/constants/content.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace base directories
content = content.replace('/images/months/', '/images/months-opt/')

# Now find all photos arrays
def repl(match):
    folder = match.group(1)
    dir_path = f"public/images/months-opt/{folder}"
    photos = []
    if os.path.exists(dir_path):
        # find all numbered jpgs
        for i in range(1, 15):
            if os.path.exists(f"{dir_path}/{i}.jpg"):
                photos.append(f"'/images/months-opt/{folder}/{i}.jpg'")
    
    if photos:
        array_str = "[\n            " + ",\n            ".join(photos) + "\n        ]"
    else:
        array_str = "[]"
    return f"photos: {array_str}"

pattern = re.compile(r"photos:\s*Array\.from[^`]+`/images/months-opt/([^/]+)/\$\{i \+ 1\}\.jpg`\)")
new_content = pattern.sub(repl, content)

with open('src/constants/content.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("content.js updated!")
