const fs = require('fs');

let data = fs.readFileSync('src/pages/PostPage.tsx', 'utf8');

data = data.replace(
/if \(saved\) \{\n\s*try \{\n\s*setPosts\(JSON\.parse\(saved\)\);\n\s*\} catch \(e\) \{\}\n\s*\}/,
`if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPosts([...parsed.filter((p: any) => !getPosts(lang).find(dp => dp.slug === p.slug)), ...getPosts(lang)]);
      } catch (e) {}
    } else {
      setPosts(getPosts(lang));
    }`
);
data = data.replace(/getPosts\(lang\)\.find/, 'posts.find');
data = data.replace(/\[\]\);/g, '[lang]);');

fs.writeFileSync('src/pages/PostPage.tsx', data);
