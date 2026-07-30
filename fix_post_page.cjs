const fs = require('fs');
let data = fs.readFileSync('src/pages/PostPage.tsx', 'utf8');

data = data.replace(/const \{ lang \} = useI18n\(\);/, 'const { t, lang } = useI18n();');
data = data.replace(/useState\(defaultPosts\)/g, 'useState(getPosts(lang))');
data = data.replace(/← Back to Insights/g, '← {t(\'post.back\')}');
data = data.replace(/Back to Insights/g, '{t(\'post.back\')}');
data = data.replace(/Share Article/g, '{t(\'post.share\')}');
data = data.replace(/Engineering & Construction Experts/g, '{t(\'post.experts\')}');

fs.writeFileSync('src/pages/PostPage.tsx', data);

let dataTs = fs.readFileSync('src/data.ts', 'utf8');
const en = `
    'post.not_found': 'Post not found',
    'post.back': 'Back to Insights',
    'post.share': 'Share Article',
    'post.editorial': 'Editorial Team',
    'post.experts': 'Engineering & Construction Experts',
`;
const fr = `
    'post.not_found': 'Article non trouvé',
    'post.back': 'Retour aux actualités',
    'post.share': 'Partager l\\'article',
    'post.editorial': 'Équipe éditoriale',
    'post.experts': 'Experts en ingénierie et construction',
`;

dataTs = dataTs.replace(/'portal\.loginbtn': 'Access Portal',/, en + `\n    'portal.loginbtn': 'Access Portal',`);
dataTs = dataTs.replace(/'portal\.loginbtn': 'Accéder au portail',/, fr + `\n    'portal.loginbtn': 'Accéder au portail',`);

fs.writeFileSync('src/data.ts', dataTs);
