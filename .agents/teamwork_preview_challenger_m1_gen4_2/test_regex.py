import re

text = "12 guests"
m = re.search(r'(\\d+)', text)
print(m)
