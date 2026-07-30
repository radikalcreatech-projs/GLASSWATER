const fs = require('fs');

let data = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf8');
data = data.replace(/useState\(defaultProjects\)/g, 'useState(getProjects(lang))');
fs.writeFileSync('src/pages/ProjectsPage.tsx', data);

data = fs.readFileSync('src/pages/InsightsPage.tsx', 'utf8');
data = data.replace(/useState\(defaultPosts\)/g, 'useState(getPosts(lang))');
fs.writeFileSync('src/pages/InsightsPage.tsx', data);

data = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
data = data.replace(/setLocalProjects\(projects\)/g, 'setLocalProjects(getProjects(lang))');
data = data.replace(/setLocalPosts\(posts\)/g, 'setLocalPosts(getPosts(lang))');
fs.writeFileSync('src/pages/HomePage.tsx', data);
