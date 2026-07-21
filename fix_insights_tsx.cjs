const fs = require('fs');
let data = fs.readFileSync('src/pages/InsightsPage.tsx', 'utf8');

data = data.replace(/>Insights &amp; News</g, ">{t('insights.label')}<");
data = data.replace(/>Knowledge Centre</g, ">{t('insights.title')}<");
data = data.replace(/>Industry trends, company updates, and expert perspectives\.</g, ">{t('insights.sub')}<");

fs.writeFileSync('src/pages/InsightsPage.tsx', data);
