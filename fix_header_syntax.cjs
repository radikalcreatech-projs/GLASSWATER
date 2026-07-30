const fs = require('fs');
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Find the {currentPage !== 'admin' && (<button ...>...FR/EN...</button>
// Add the closing brace after </button>
const lines = header.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("lang === 'en' ? 'FR' : 'EN'") && !lines[i+1].includes(')}')) {
    // lines[i] is {lang === 'en' ? 'FR' : 'EN'}
    // lines[i+1] is </button>
    if (lines[i+1].includes('</button>')) {
      lines[i+1] = lines[i+1].replace('</button>', '</button>)}');
    }
  }
}

fs.writeFileSync('src/components/Header.tsx', lines.join('\n'));
