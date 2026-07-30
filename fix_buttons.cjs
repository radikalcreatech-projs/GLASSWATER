const fs = require('fs');

let home = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
home = home.replace(/>View Project<\/a>/g, ">{t('btn.view_project')}</a>");
home = home.replace(/>Explore Projects<\/button>/g, ">{t('btn.explore_projects')}</button>");
fs.writeFileSync('src/pages/HomePage.tsx', home);

let proj = fs.readFileSync('src/pages/ProjectsPage.tsx', 'utf8');
proj = proj.replace(/>View Project<\/a>/g, ">{t('btn.view_project')}</a>");
proj = proj.replace(/>All Projects<\/option>/g, ">{t('btn.all_projects')}</option>");
fs.writeFileSync('src/pages/ProjectsPage.tsx', proj);

