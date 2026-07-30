const fs = require('fs');

let reviewsPage = fs.readFileSync('src/pages/ReviewsPage.tsx', 'utf8');
reviewsPage = reviewsPage.replace(/import \{ defaultReviews \} from '\.\.\/data';/, "import { getReviews } from '../data';");
reviewsPage = reviewsPage.replace(/const \[reviews\] = useState\(defaultReviews\);/, "const { lang } = useI18n();\n  const [reviews, setReviews] = useState(getReviews(lang));\n  useEffect(() => { setReviews(getReviews(lang)); }, [lang]);");
if (!reviewsPage.includes('useEffect')) {
  reviewsPage = reviewsPage.replace(/import \{ useState \} from 'react';/, "import { useState, useEffect } from 'react';");
}
fs.writeFileSync('src/pages/ReviewsPage.tsx', reviewsPage);

let homePage = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
homePage = homePage.replace(/import \{ defaultReviews, getProjects, getPosts \} from '\.\.\/data';/, "import { getReviews, getProjects, getPosts } from '../data';");
homePage = homePage.replace(/const reviews = defaultReviews\.slice\(0, 3\);/, "const reviews = getReviews(lang).slice(0, 3);");
fs.writeFileSync('src/pages/HomePage.tsx', homePage);

let adminPage = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');
adminPage = adminPage.replace(/import \{ defaultReviews, getProjects, getPosts \} from '\.\.\/data';/, "import { getReviews, getProjects, getPosts } from '../data';");
adminPage = adminPage.replace(/setReviews\(defaultReviews\);/, "setReviews(getReviews('en'));"); // admin always english
fs.writeFileSync('src/pages/AdminPage.tsx', adminPage);

