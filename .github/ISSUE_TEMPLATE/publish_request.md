---
name: Publish request
about: Publish master branch
title: ''
labels: ''
assignees: ''

---

**Publish checklist**

- [ ] Update the package.json with the required version
- [ ] Update the CHANGELOG.md
- [ ] Update README.md
- [ ] Format the code
- [ ] Run tests 
- [ ] Commit with message `#xxxx. Publish review completed`
- [ ] Package extension ```vsce package```
- [ ] Publish extension ```vsce publish```
- [ ] Commit with message `Completed publish closes #xxxx.`
