const fs = require('fs');

function repl(file, search, replace) {
    let data = fs.readFileSync(file, 'utf8');
    data = data.replace(search, replace);
    fs.writeFileSync(file, data);
}

repl('src/pages/ContactPage.tsx', />Service Interest</g, `>{t('contact.service')}<`);
repl('src/pages/ContactPage.tsx', />Engineering</g, `>{t('contact.opt_eng')}<`);
repl('src/pages/ContactPage.tsx', />Construction</g, `>{t('contact.opt_const')}<`);
repl('src/pages/ContactPage.tsx', />Interior Fit‑Out</g, `>{t('contact.opt_int')}<`);
repl('src/pages/ContactPage.tsx', />Finishing Works</g, `>{t('contact.opt_fin')}<`);
repl('src/pages/ContactPage.tsx', />Waterproofing</g, `>{t('contact.opt_water')}<`);
repl('src/pages/ContactPage.tsx', />Swimming Pool Engineering</g, `>{t('contact.opt_pool')}<`);
repl('src/pages/ContactPage.tsx', />Facilities Management</g, `>{t('contact.opt_fm')}<`);
repl('src/pages/ContactPage.tsx', />Other</g, `>{t('contact.opt_other')}<`);

repl('src/pages/ReviewsPage.tsx', />Feedback</g, `>{t('reviews.feedback')}<`);
repl('src/pages/ReviewsPage.tsx', />Rating</g, `>{t('reviews.rating')}<`);
repl('src/pages/ReviewsPage.tsx', />No reviews yet\. Be the first to share your experience!</g, `>{t('reviews.empty')}<`);

repl('src/pages/PostPage.tsx', />Article not found\.</g, `>{t('post.not_found')}<`);
repl('src/pages/PostPage.tsx', />GlassWater Editorial</g, `>{t('post.editorial')}<`);

repl('src/pages/HomePage.tsx', />Projects</g, `>{t('home.stats.proj')}<`);
repl('src/pages/HomePage.tsx', />Commercial</g, `>{t('home.stats.comm')}<`);
repl('src/pages/HomePage.tsx', />Satisfaction</g, `>{t('home.stats.sat')}<`);
repl('src/pages/HomePage.tsx', />About Us</g, `>{t('home.about_label')}<`);
repl('src/pages/HomePage.tsx', />Featured Work</g, `>{t('home.feat_work')}<`);
repl('src/pages/HomePage.tsx', />Premium Projects</g, `>{t('home.prem_proj')}<`);
repl('src/pages/HomePage.tsx', />Testimonials</g, `>{t('home.testi')}<`);
repl('src/pages/HomePage.tsx', />Client Feedback</g, `>{t('home.client_feed')}<`);
repl('src/pages/HomePage.tsx', />Knowledge Centre</g, `>{t('home.know_centre')}<`);

repl('src/pages/AboutPage.tsx', />About Us</g, `>{t('about.label')}<`);

repl('src/pages/ProjectsPage.tsx', />Portfolio</g, `>{t('projects.label')}<`);
repl('src/pages/ProjectsPage.tsx', />Value</g, `>{t('projects.value')}<`);
repl('src/pages/ProjectsPage.tsx', />Duration</g, `>{t('projects.duration')}<`);
