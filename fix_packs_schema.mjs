import fs from 'fs';

// --- Fix Admin.tsx ---
let adminContent = fs.readFileSync('src/app/Admin.tsx', 'utf-8');

adminContent = adminContent.replace(/p\.name/g, "p.tier");
adminContent = adminContent.replace(/newPackForm\.name/g, "newPackForm.tier");
adminContent = adminContent.replace(/name: newPackForm\.tier/g, "tier: newPackForm.tier");
adminContent = adminContent.replace(/name: "SILVER"/g, "tier: 'SILVER'");
adminContent = adminContent.replace(/name: "GOLD"/g, "tier: 'GOLD'");
adminContent = adminContent.replace(/name: "PLATINUM"/g, "tier: 'PLATINUM'");
adminContent = adminContent.replace(/pack\.name/g, "pack.tier");
adminContent = adminContent.replace(/is_active: pack\.is_active/g, "/* no is_active column */");
adminContent = adminContent.replace(/is_active: true/g, "/* no is_active column */");
adminContent = adminContent.replace(/pack\.is_active \? pack\.style\.color : "#E8EBF0"/g, "true ? pack.style.color : '#E8EBF0'");
adminContent = adminContent.replace(/!p\.is_active/g, "true");
adminContent = adminContent.replace(/pack\.is_active \? 2 : "auto"/g, "true ? 2 : 'auto'");
adminContent = adminContent.replace(/pack\.is_active \? "auto" : 2/g, "true ? 'auto' : 2");
adminContent = adminContent.replace(/description: newPackForm\.description\.trim\(\)/g, "tagline: newPackForm.tagline.trim()");
adminContent = adminContent.replace(/newPackForm\.description/g, "newPackForm.tagline");
adminContent = adminContent.replace(/description: "Nouveau pack"/g, "tagline: 'Nouveau pack'");
adminContent = adminContent.replace(/description: "L'essentiel pour s'amuser"/g, "tagline: \"L'essentiel pour s'amuser\"");
adminContent = adminContent.replace(/description: "L'expérience complète"/g, "tagline: \"L'expérience complète\"");
adminContent = adminContent.replace(/description: "Le sur-mesure absolu"/g, "tagline: \"Le sur-mesure absolu\"");
adminContent = adminContent.replace(/pack\.description/g, "pack.tagline");
adminContent = adminContent.replace(/p\.description/g, "p.tagline");
adminContent = adminContent.replace(/newPackForm = useState\(\{ tier: "", tagline: "", price: 0 \}\)/g, "newPackForm = useState({ tier: '', tagline: '', price: 0 })");
adminContent = adminContent.replace(/setNewPackForm\(\{ tier: "", tagline: "", price: 0 \}\)/g, "setNewPackForm({ tier: '', tagline: '', price: 0 })");
adminContent = adminContent.replace(/Nom du pack \(ex: BRONZE\)/g, "Nom du pack / Tier (ex: BRONZE)");

fs.writeFileSync('src/app/Admin.tsx', adminContent);

// --- Fix App.tsx ---
let appContent = fs.readFileSync('src/app/App.tsx', 'utf-8');

appContent = appContent.replace(/p\.name/g, "p.tier");
appContent = appContent.replace(/p\.description/g, "p.tagline");
appContent = appContent.replace(/\.eq\('is_active', true\)/g, "");

fs.writeFileSync('src/app/App.tsx', appContent);
