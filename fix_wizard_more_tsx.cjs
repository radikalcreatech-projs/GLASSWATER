const fs = require('fs');
let data = fs.readFileSync('src/components/WizardModal.tsx', 'utf8');

data = data.replace(/placeholder="Floor area \(sqm\)"/g, `placeholder={t('wizard.area')}`);
data = data.replace(/placeholder="Number of floors"/g, `placeholder={t('wizard.floors')}`);
data = data.replace(/placeholder="Property age \(years\)"/g, `placeholder={t('wizard.age')}`);
data = data.replace(/placeholder="Desired start date"/g, `placeholder={t('wizard.start')}`);
data = data.replace(/placeholder="Email"/g, `placeholder={t('wizard.email')}`);

fs.writeFileSync('src/components/WizardModal.tsx', data);
