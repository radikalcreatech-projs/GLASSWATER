const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

data = data.replace(/'portal\.demo': '\*This is a demo\. In production, this will connect to your secure document storage\.',/, `'portal.demo': '*This is a demo. In production, this will connect to your secure document storage.',
    'portal.try_code': 'Try code:',
    'portal.doc_error_verify': 'Please verify your code and try again.',
    'portal.pdf_error': 'Failed to generate PDF. You can also use the Print button.',`);

data = data.replace(/'portal\.demo': '\*Ceci est une démo\. En production, cela sera connecté à votre stockage sécurisé de documents\.',/, `'portal.demo': '*Ceci est une démo. En production, cela sera connecté à votre stockage sécurisé de documents.',
    'portal.try_code': 'Essayer le code:',
    'portal.doc_error_verify': 'Veuillez vérifier votre code et réessayer.',
    'portal.pdf_error': 'Échec de la génération du PDF. Vous pouvez également utiliser le bouton Imprimer.',`);

fs.writeFileSync('src/data.ts', data);
