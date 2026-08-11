# Web Usability Principles (Don't Make Me Think)

**Source**: Don't Make Me Think, Revisited — Steve Krug
**When to use**: Every interface decision. These are the psychological laws of how real users actually behave on the web.

---

## The First Law of Usability
> **"Don't make me think."**

Every page should be self-evident. If users have to pause even for a millisecond to wonder "Can I click this?" or "Where do I start?" — the design has failed. The goal is: **obvious > easy > possible**.

---

## Three Facts of User Behavior

### Fact 1: Users Don't Read — They Scan
Users don't read pages word by word. They scan for:
- **(a)** Words matching their current task
- **(b)** Personal interests
- **(c)** Hardwired trigger words: "Free," "Sale," "New," their own name

**Implication**: Design for scanning, not reading. Use clear visual hierarchy, short text, and highlighted keywords.

### Fact 2: Users Don't Optimize — They Satisfice
Users don't evaluate all options and pick the best one. They pick **the first reasonable option** they see (satisficing = satisfying + sufficing).

**Why?**
- They're in a hurry
- The penalty for guessing wrong is just a Back button click
- Guessing is more fun than deliberating

**Implication**: Make the right path obvious. The first link that *seems* right will be clicked. Don't bury the best option among 15 others.

### Fact 3: Users Don't Figure Out How Things Work — They Muddle Through
Users forge ahead and make up their own theories about how things work. They use things in ways designers never intended — and it often works well enough.

**Implication**: Don't rely on users reading instructions. Make the interface self-explanatory. If users are successfully muddling through, the design is fragile — it will break with the next change.

---

## Five Key Design Principles

### 1. Create Effective Visual Hierarchy
- Visually related things should be **grouped together**
- Things that are part of a **logical group** should be visually connected
- Things that are **nested** should look nested (indentation, smaller font)
- Headers should be **close to the content** they describe

### 2. Use Conventions
> "Innovate when you know you have a better idea. Otherwise, use conventions."

Conventions work because users bring expectations from every other site they've used. Common conventions:
- Logo in top-left → links to home
- Search box in top-right area
- Primary navigation near the top
- Shopping cart icon in top-right

**When to break conventions**: Only when the replacement is (a) so clear it requires no learning, OR (b) the value is so great it's worth a small learning curve.

### 3. Break Pages into Clearly Defined Areas
Users should be able to instantly identify:
- "This is the navigation"
- "This is the main content"
- "This is the sidebar"

**Avoid "visual noise"**: Too many things competing for attention = everything gets ignored.

### 4. Make What's Clickable Obvious
Three types of clickability failure:
1. **Things that ARE clickable but don't look it** (styled like plain text)
2. **Things that AREN'T clickable but look like they are** (underlined text that isn't a link)
3. **Things where it's unclear** (is the icon clickable? the text? the whole card?)

### 5. Keep Noise to a Minimum
Three kinds of noise:
- **Shouting**: Everything is bold/colorful/large (nothing stands out)
- **Disorganization**: Content lacks logical grouping
- **Clutter**: Too much stuff on the page

---

## Navigation: The Backbone

### Why Navigation Matters
> "Navigation isn't just a feature of a Web site; it IS the Web site."

### Users Are Missing Physical Cues
On the web, users have:
- **No sense of scale** (how big is this site?)
- **No sense of direction** (no left/right/up/down)
- **No sense of location** (can't remember "where" something was)

Navigation compensates for this by creating a sense of "there."

### Persistent Navigation Must Include
Every page should show:
1. **Site ID** (logo, always top-left)
2. **Sections** (top-level navigation)
3. **Utilities** (Search, Account, Cart, Help)
4. **"You Are Here"** indicator (highlighted current section)

### Breadcrumbs
- Put them at the **top of the page**
- Use `>` between levels
- **Bold the last item** (current page)
- Use them as supplements, not replacements for proper navigation

### Search
- Should look like a search box (text field + button saying "Search")
- Every site needs a **Search box** and **Browse structure** — users split roughly 50/50 on preference

---

## The Home Page Contract

The Home Page must answer 5 questions **within seconds**:
1. **What is this site?**
2. **What can I do here?**
3. **What do they have here?**
4. **Why should I be here and not somewhere else?**
5. **Where do I start?**

### Taglines
- 6-8 words, placed near the logo
- Must convey **what the site does** and **why it's different**
- A tagline is NOT a motto ("We bring good things to life" tells you nothing)

### Avoid "The Tragedy of the Commons"
Every stakeholder wants their section promoted on the homepage. The result: a cluttered, noisy mess where nothing gets noticed. **Resist promotional overload.**

---

## Usability Testing (The "Trunk Test")

### The Test
Print any page from your site. Show it to someone for 5 seconds. They should be able to identify:
1. What site is this? (Site ID)
2. What page am I on? (Page name)
3. What are the major sections? (Navigation)
4. What are my options at this level? (Local nav)
5. Where am I in the scheme of things? ("You Are Here")
6. How can I search?

If they can't answer these → the navigation has failed.

### DIY Usability Testing
- **Test early, test often**: One morning a month, 3 users, 1 hour each.
- **Anyone can run the tests**: You don't need a usability expert.
- **3 users find most issues**: Don't wait for a statistically significant sample.
- **Fix the most serious problems first**: Don't try to fix everything.
- **Watch behavior, not opinions**: Ignore "I like the color blue." Watch where they click.

---

## Goodwill: The Reservoir

Every user starts with a **reservoir of goodwill** toward your site. Every frustration drains it. Once empty, the user leaves.

### Things That Drain Goodwill
- Hiding information users want (phone numbers, prices, shipping costs)
- Punishing users for not formatting data "your way" (dashes in phone numbers)
- Asking for information you don't need
- Fake sincerity ("Your call is important to us")
- Blocking content with marketing fluff
- Amateurish appearance

### Things That Build Goodwill
- Making the top 3 user tasks **dead easy**
- Being upfront about costs and limitations
- Saving users steps (pre-filling forms, deep links)
- Providing honest, useful FAQs (not marketing disguised as questions)
- Offering printer-friendly pages
- Apologizing when you can't deliver what they want
