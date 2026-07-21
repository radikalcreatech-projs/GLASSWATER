const fs = require('fs');
let data = fs.readFileSync('src/context/SettingsContext.tsx', 'utf8');

data = data.replace(
`export interface WebsiteSettings {
  logoUrl: string;`, 
`export interface WebsiteSettings {
  companyName: string;
  logoUrl: string;`);

data = data.replace(
`const defaultSettings: WebsiteSettings = {
  logoUrl:`, 
`const defaultSettings: WebsiteSettings = {
  companyName: 'Glasswater Fit-Outs & Co. Ltd.',
  logoUrl:`);

fs.writeFileSync('src/context/SettingsContext.tsx', data);
