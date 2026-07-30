const fs = require('fs');

let data = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

data = data.replace(
/if \(p\) setLocalProjects\(JSON\.parse\(p\)\);/g,
'if (p) { const parsed = JSON.parse(p); setLocalProjects([...parsed.filter((p: any) => !getProjects(lang).find(dp => dp.id === p.id)), ...getProjects(lang)]); } else { setLocalProjects(getProjects(lang)); }'
);
data = data.replace(
/if \(postsStr\) setLocalPosts\(JSON\.parse\(postsStr\)\);/g,
'if (postsStr) { const parsed = JSON.parse(postsStr); setLocalPosts([...parsed.filter((p: any) => !getPosts(lang).find(dp => dp.slug === p.slug)), ...getPosts(lang)]); } else { setLocalPosts(getPosts(lang)); }'
);

fs.writeFileSync('src/pages/HomePage.tsx', data);
