Confluence export html을 다듬어 줍니다.
---

# 1. `config.js`를 작성합니다.

> 예시
```javascript
const resourcesPath = `${__dirname}/resources`
const outPath = `${__dirname}/out`
const searchTitleValue = /(키워드1|키워드2) : /
const searchBreadcrumbsValue = /(키워드1|키워드2)/

module.exports = {
    resourcesPath,
    outPath,
    searchTitleValue,
    searchBreadcrumbsValue
}
```

# 2. resources/ 폴더 혹은 `resourcesPath`를 설정한 위치에 **디렉토리**를 만듭니다.

> ex) ${__dirname}/resource/${spacename}/

# 3. 실행

node script.js
