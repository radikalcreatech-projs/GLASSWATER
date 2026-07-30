const fs = require('fs');
let data = fs.readFileSync('src/components/Header.tsx', 'utf8');

data = data.replace(/import \{ useDarkMode \} from '\.\.\/hooks\/useDarkMode';\n/, '');
data = data.replace(/  const \{ isDark, toggle \} = useDarkMode\(\);\n/, '');
data = data.replace(/          <button \n            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-text-primary hover:text-gold transition-colors"\n            onClick=\{toggle\}\n            aria-label="Toggle Dark Mode"\n          >\n            \{isDark \? <Sun size=\{18\} \/> : <Moon size=\{18\} \/>\}\n          <\/button>\n/, '');

fs.writeFileSync('src/components/Header.tsx', data);
