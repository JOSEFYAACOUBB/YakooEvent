import fs from 'fs';
let content = fs.readFileSync('src/app/Admin.tsx', 'utf-8');

content = content.replace(
  /<label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Description détaillée<\/label>\s*<textarea rows=\{3\} value=\{newPackForm.description\}/g,
  `<label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Types d'activités (ex: Accrobranche + Tyrolienne)</label>
                <input value={newPackForm.description}`
);
content = content.replace(
  /onChange=\{e => setNewPackForm\(\{\.\.\.newPackForm, description: e.target.value\}\)\} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none" style=\{\{ background: "#F0F2F5", border: "none", color: "#1B2A4A" \}\} placeholder="Description\.\.\." \/>/g,
  `onChange={e => setNewPackForm({...newPackForm, description: e.target.value})} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} placeholder="ex: Escalade + Kayak..." />`
);

fs.writeFileSync('src/app/Admin.tsx', content);
