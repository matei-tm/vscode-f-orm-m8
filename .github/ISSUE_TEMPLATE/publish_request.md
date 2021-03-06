---
name: Publish request
about: Publish master branch
title: 'Publish version x.x.x'
labels: 'publish'
assignees: ''

---

**Publish checklist**

- [ ] Update the package.json with the required version
- [ ] Update the CHANGELOG.md
- [ ] Update README.md
- [ ] Update docs/README.md
- [ ] Format the code
- [ ] Run tests ```npm run test``` 
- [ ] Commit with message `#xxxx. Publish review completed`
- [ ] Package extension ```vsce package```
- [ ] Publish extension ```vsce publish```
- [ ] Commit empty ```git commit --allow-empty -m "Completed publish closes #xxxx."```

