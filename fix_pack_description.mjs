import fs from 'fs';
let content = fs.readFileSync('src/app/App.tsx', 'utf-8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Accro') && lines[i].includes('Tyrolienne') && lines[i].includes('pack.acro')) {
    lines[i] = lines[i].replace(
      'Accro {pack.acro} Tyrolienne',
      '{pack.description || "Accrobranche + Tyrolienne"}'
    );
    console.log("Fixed line", i + 1);
    break;
  }
}
fs.writeFileSync('src/app/App.tsx', lines.join('\n'));
