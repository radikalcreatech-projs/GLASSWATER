const fs = require('fs');
let data = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

data = data.replace(
/import \{ getProjects \} from '\.\.\/data';/g,
"import { getProjects, getPosts, defaultReviews } from '../data';"
);
data = data.replace(/useState\(projects\)/g, 'useState(getProjects(lang))');
data = data.replace(/useState\(posts\)/g, 'useState(getPosts(lang))');

fs.writeFileSync('src/pages/HomePage.tsx', data);
