const fs = require('fs');

const filesToUpdate = [
  'src/pages/HomePage.tsx',
  'src/pages/ProjectsPage.tsx',
  'src/pages/InsightsPage.tsx',
  'src/pages/PostPage.tsx',
  'src/pages/FAQPage.tsx'
];

for (const file of filesToUpdate) {
  let data = fs.readFileSync(file, 'utf8');
  
  if (data.includes('import { projects')) {
    data = data.replace(/import \{.*?projects.*?\} from '\.\.\/data';/g, "import { getProjects } from '../data';");
    data = data.replace(/projects\.map/g, 'getProjects(lang).map');
    data = data.replace(/projects\.slice/g, 'getProjects(lang).slice');
  }
  
  if (data.includes('import { posts')) {
    data = data.replace(/import \{.*?posts.*?\} from '\.\.\/data';/g, "import { getPosts } from '../data';");
    data = data.replace(/posts\.map/g, 'getPosts(lang).map');
    data = data.replace(/posts\.find/g, 'getPosts(lang).find');
    data = data.replace(/posts\.slice/g, 'getPosts(lang).slice');
  }
  
  if (data.includes('import { faqs')) {
    data = data.replace(/import \{.*?faqs.*?\} from '\.\.\/data';/g, "import { getFaqs } from '../data';");
    data = data.replace(/faqs\.map/g, 'getFaqs(lang).map');
  }
  
  // Make sure useI18n is imported and lang is extracted if needed
  if (!data.includes('useI18n') && (data.includes('getProjects(lang)') || data.includes('getPosts(lang)') || data.includes('getFaqs(lang)'))) {
    data = "import { useI18n } from '../context/I18nContext';\n" + data;
    // Inject `const { lang } = useI18n();` inside the component
    data = data.replace(/export function [A-Za-z]+\(.*\) \{/, match => match + "\n  const { lang } = useI18n();");
  } else if (data.includes('useI18n') && !data.includes('lang,') && !data.includes('lang } = useI18n()')) {
    data = data.replace(/const \{ t \} = useI18n\(\);/, "const { t, lang } = useI18n();");
  }

  fs.writeFileSync(file, data);
}
