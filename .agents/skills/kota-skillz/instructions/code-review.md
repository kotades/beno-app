# Industrial Code Review Checklist

## 🛠️ Implementation
- [ ] Does this code change accomplish what it is supposed to do?
- [ ] Can this solution be simplified?
- [ ] Does this change add unwanted compile-time or run-time dependencies?
- [ ] Is a framework, API, library, or service used that should not be used?
- [ ] Could an additional framework, API, library, or service improve the solution?
- [ ] Is the code at the right abstraction level?
- [ ] Is the code modular enough?
- [ ] Can a better solution be found in terms of maintainability, readability, performance, or security?
- [ ] Does similar functionality already exist in the codebase? If yes, why isn’t it reused?
- [ ] Are there any best practices, design patterns or language-specific patterns that could substantially improve this code?
- [ ] Does this code adhere to **SOLID** principles (SRP, OCP, LSP, ISP, DIP)?

## 🐛 Logic Errors and Bugs
- [ ] Can you think of any use case in which the code does not behave as intended?
- [ ] Can you think of any inputs or external events that could break the code?

## 🚨 Error Handling and Logging
- [ ] Is error handling done the correct way?
- [ ] Should any logging or debugging information be added or removed?
- [ ] Are error messages user-friendly?
- [ ] Are there enough log events for easy debugging?

## 📦 Dependencies
- [ ] Were updates to documentation, configuration, or readme files made?
- [ ] Are there potential impacts on other parts of the system or backward compatibility?

## 🔒 Security and Data Privacy
- [ ] Does the code introduce any security vulnerabilities?
- [ ] Are authorization and authentication handled correctly?
- [ ] Is user input validated, sanitized, and escaped (XSS, SQLi prevention)?
- [ ] Is sensitive data handled and stored securely?
- [ ] Is the right encryption used?
- [ ] Does this code change reveal any secrets (keys, passwords)?
- [ ] Is data from external APIs checked for security issues?

## ⚡ Performance
- [ ] Does this code change decrease system performance?
- [ ] Is there potential for significant performance improvement?

## ♿ Usability and Accessibility
- [ ] Is the solution well-designed from a usability perspective?
- [ ] Is the API well documented?
- [ ] Is the UI accessible?
- [ ] Is the API/UI intuitive?

## ⚖️ Ethics and Morality
- [ ] Does this change raise privacy concerns regarding user data?
- [ ] Does it exploit behavioral patterns or human weaknesses?
- [ ] Might the code lead to mental or physical harm?
- [ ] Are measures in place to prevent/limit/report harassment or abuse?
- [ ] Does it lead to exclusion of a certain group?
- [ ] Is there any unjust impact related to race, gender, ability, etc.?
- [ ] Does it introduce any algorithm/AI/ML bias?

## 🧪 Testing and Testability
- [ ] Is the code testable?
- [ ] Have automated tests been added or updated?
- [ ] Do tests cover unit, integration, and system levels?
- [ ] Are there additional edge cases that should be tested?

## 📖 Readability
- [ ] Is the code easy to understand?
- [ ] Are there confusing parts? Why?
- [ ] Can readability be improved by smaller methods?
- [ ] Can readability be improved by better naming?
- [ ] Is the code in the right file/folder?
- [ ] Is the control flow intuitive?
- [ ] Is the data flow understandable?
- [ ] Are there redundant or outdated comments?

## 👔 Experts' Opinion
- [ ] Should a specific expert (security, usability) look over this code?
- [ ] Will this change impact other teams? Should they review it?
