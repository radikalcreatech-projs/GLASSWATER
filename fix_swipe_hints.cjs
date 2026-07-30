const fs = require('fs');

const hint = `<div className="md:hidden flex items-center justify-center gap-2 text-xs text-light-gray mt-2 animate-pulse"><ArrowRight size={14} /> Swipe to explore</div>`;
const hintDark = `<div className="md:hidden flex items-center justify-center gap-2 text-xs text-white/50 mt-2 animate-pulse"><ArrowRight size={14} /> Swipe to explore</div>`;

let home = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

// Projects (light)
home = home.replace(
  /<\/div>\n\s*<\/div>\n\s*<\/section>\n\s*\{\/\* Testimonials \*\/\}/,
  `</div>\n            {localProjects.length > 1 && <div className="md:hidden flex items-center justify-center gap-2 text-xs text-charcoal/50 mt-2 animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> Swipe to explore</div>}\n          </div>\n        </section>\n\n        {/* Testimonials */}`
);

// Testimonials (dark)
home = home.replace(
  /<\/div>\n\s*<\/div>\n\s*<div className="text-center mt-8 md:mt-12">/,
  `</div>\n              {reviews.length > 1 && <div className="md:hidden flex items-center justify-center gap-2 text-xs text-white/50 mt-2 animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> Swipe to explore</div>}\n            </div>\n            <div className="text-center mt-8 md:mt-12">`
);

// Insights (light)
home = home.replace(
  /<\/div>\n\s*<\/div>\n\s*<div className="text-center mt-8 md:mt-12">/,
  `</div>\n            {localPosts.length > 1 && <div className="md:hidden flex items-center justify-center gap-2 text-xs text-charcoal/50 mt-2 animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> Swipe to explore</div>}\n          </div>\n          <div className="text-center mt-8 md:mt-12">`
);

fs.writeFileSync('src/pages/HomePage.tsx', home);
