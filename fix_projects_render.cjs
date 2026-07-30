const fs = require('fs');

let data = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf8');
data = data.replace(/getProjects\(lang\)\.map/g, 'projects.map');
data = data.replace(/\[\]\);/g, '[lang]);');
data = data.replace(/setProjects\(JSON\.parse\(saved\)\);/g, 'const parsed = JSON.parse(saved); setProjects([...parsed, ...getProjects(lang).filter(p => !parsed.find(op => op.id === p.id))]);');
fs.writeFileSync('src/pages/ProjectsPage.tsx', data);

data = fs.readFileSync('src/pages/InsightsPage.tsx', 'utf8');
data = data.replace(/getPosts\(lang\)\.map/g, 'posts.map');
data = data.replace(/\[\]\);/g, '[lang]);');
data = data.replace(/setPosts\(JSON\.parse\(saved\)\);/g, 'const parsed = JSON.parse(saved); setPosts([...parsed, ...getPosts(lang).filter(p => !parsed.find(op => op.slug === p.slug))]);');
fs.writeFileSync('src/pages/InsightsPage.tsx', data);

data = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
data = data.replace(/getProjects\(lang\)\.map/g, 'localProjects.map');
data = data.replace(/getPosts\(lang\)\.map/g, 'localPosts.map');
data = data.replace(/\[\]\);/g, '[lang]);');
fs.writeFileSync('src/pages/HomePage.tsx', data);
