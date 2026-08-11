# Challenge Summary

**Overall risk assessment**: HIGH

## Challenges

### [High] Challenge 1: Negative Indexing in Price Parsing

- **Assumption challenged**: The text `/ hour` will always appear at index `i >= 2` in the `full_text` list.
- **Attack scenario**: If `/ hour` appears at index 0 or 1, `i-2` evaluates to a negative index (e.g., `-2`). Python uses negative indices to read from the end of a list. 
- **Blast radius**: If the trailing elements in `full_text` happen to be numeric strings (e.g., pagination numbers or review counts like `"500"`), the scraper will silently parse them as `price` and `original_price`, leading to corrupted pricing data in the database.
- **Mitigation**: Add a guard condition: `if i >= 2: price = ...` to prevent negative index wraparound.

### [Medium] Challenge 2: Fragile String Parsing for Attributes

- **Assumption challenged**: The values for Guests, Cabins, and Length will exactly match the word + a space + digits (e.g., `"Guests 12"`).
- **Attack scenario**: If the source HTML includes a colon or any other delimiter (e.g., `"Guests: 12"`, `"Cabins - 4"`), `text.replace('Guests', '')` yields `": 12"`. Calling `int(": 12")` raises a `ValueError`, which is swallowed by a bare `except: pass`.
- **Blast radius**: `guests`, `cabins`, and `length` default to 0 for valid yachts.
- **Mitigation**: Use regular expressions (e.g., `re.search(r'\d+', text)`) to extract the numeric portion reliably.

### [Medium] Challenge 3: Yacht Names with Digits are Ignored

- **Assumption challenged**: Yacht names do not contain digits.
- **Attack scenario**: The name assignment logic explicitly skips any text containing numbers: `not any(char.isdigit() for char in text)`. A yacht named `"Azimut 60"` or `"Benetti 45"` will evaluate to `False` and be ignored.
- **Blast radius**: Yachts with numbers in their names will silently be assigned the fallback name `"Unknown"`.
- **Mitigation**: Change the heuristic for identifying the title (e.g., relying on HTML tags like `<h2>` or index positions rather than string heuristics).

## 1. Observation
- In `scripts/scrape_yachts.py:134-138`, `price` is parsed using `full_text[i-2]`.
- In `scripts/scrape_yachts.py:125-133`, `guests`, `cabins`, and `length` are parsed using a rigid `.replace()` and `int()` cast.
- In `scripts/scrape_yachts.py:140-142`, `name` is assigned only if `not any(char.isdigit() for char in text)`.

## 2. Logic Chain
- For price, if `i < 2`, `i-2` is negative. Python returns list elements from the end. If these elements are parseable as integers, false prices are stored.
- For attributes, if formatting changes slightly (e.g., `"Guests: 12"`), `int()` will fail on non-numeric characters, and the bare `except: pass` will silently ignore the failure, storing `0`.
- For names, checking `char.isdigit()` guarantees that any yacht model containing its length (a very common naming convention in yachts) will be rejected as a name, resulting in `"Unknown"`.

## 3. Caveats
- I was unable to execute the `test_harness.py` dynamically due to an OS-level permission timeout, so this analysis relies on deterministic static analysis of Python's semantic behavior.

## 4. Conclusion
The scraping logic in `process_data` makes extremely fragile assumptions about the structure and content of the scraped text. It will silently corrupt data (negative indexing for prices) or drop data (names with digits, attributes with punctuation) under completely realistic conditions.

## 5. Verification Method
1. Write a python test that calls `process_data` with `fullText: ['/ hour', 'filler', '5000', '6000']` and observe `price` being assigned `5000`.
2. Call `process_data` with `fullText: ['Azimut 60', 'Guests: 5']` and observe `name` remaining `"Unknown"` and `guests` remaining `0`.
