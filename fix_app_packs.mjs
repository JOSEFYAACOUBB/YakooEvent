import fs from 'fs';

let content = fs.readFileSync('src/app/App.tsx', 'utf-8');

// The file has a mess between lines 1635 and 1702 — duplicated section header injected into the card
// Strategy: find the Packs function and replace it entirely with the correct version

// Find the marker where the Packs component returns its JSX
// The corrupted range starts right after the first motion.div style closing >
// and ends before the correct content (which is the Popular badge)

// Remove the duplicated block: lines 1635-1701 in the file contain duplicated section wrapper
// which was injected inside a card div. We need to remove lines 1635-1701.

const lines = content.split('\n');
let corrupted_start = -1;
let corrupted_end = -1;

for (let i = 0; i < lines.length; i++) {
  // Find the line with {/* Radial glow */} that is deeply indented (inside card, wrong)
  if (lines[i].includes('{/* Radial glow */}') && lines[i].match(/^\s{6}/)) {
    corrupted_start = i;
  }
  // The corruption ends just before {/* Popular badge */}
  if (corrupted_start !== -1 && lines[i].includes('{/* Popular badge */}')) {
    corrupted_end = i;
    break;
  }
}

if (corrupted_start !== -1 && corrupted_end !== -1) {
  // Remove the corrupted lines
  lines.splice(corrupted_start, corrupted_end - corrupted_start);
  console.log(`Removed lines ${corrupted_start + 1} to ${corrupted_end + 1} (${corrupted_end - corrupted_start} lines)`);
} else {
  console.log('Could not find corruption markers. corrupted_start:', corrupted_start, 'corrupted_end:', corrupted_end);
}

// Now also replace the old "Key highlight row" with chips UI (lines around 1727 after fix)
content = lines.join('\n');

// Replace the plain text activities section
const oldSection = `                    {/* Key highlight row */}\r
                    <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl" style={{ background: \`\${pack.color}10\`, border: \`1px solid \${pack.color}20\` }}>\r
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: pack.color }}>\r
                        <span className="text-xs font-black" style={{ color: pack.tier === "GOLD" ? NAVY : "#fff" }}>\r
                          {pack.gamesCount}\r
                        </span>\r
                      </div>\r
                      <div>\r
                        <p className="text-sm font-black" style={{ color: "#fff", fontFamily: "'KG Red Hands', sans-serif" }}>\r
                          {pack.gamesCount} jeux de team building\r
                        </p>\r
                        <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'KG Red Hands', sans-serif" }}>\r
                          {pack.description || "Accrobranche + Tyrolienne"}\r
                        </p>\r
                      </div>\r
                    </div>`;

const newSection = `                    {/* Activities chips */}
                    <div className="mb-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: pack.color, fontFamily: "'KG Red Hands', sans-serif" }}>
                        {pack.gamesCount > 0 ? \`\${pack.gamesCount} activités incluses\` : "Activités incluses"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(pack.description || "Accrobranche + Tyrolienne").split(" + ").filter(Boolean).map((act) => (
                          <span
                            key={act}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                            style={{
                              background: \`\${pack.color}18\`,
                              border: \`1px solid \${pack.color}35\`,
                              color: pack.color,
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: pack.color }} />
                            {act.trim()}
                          </span>
                        ))}
                      </div>
                    </div>`;

if (content.includes(oldSection)) {
  content = content.replace(oldSection, newSection);
  console.log('Replaced activity section with chips!');
} else {
  // Try CRLF version
  const lines2 = content.split('\n');
  for (let i = 0; i < lines2.length; i++) {
    if (lines2[i].includes('Key highlight row')) {
      // Replace from this line (i-1 = the blank line before it)
      const start = i - 1;
      const end = i + 15; // roughly covers the div
      lines2.splice(start, end - start + 1, ...newSection.split('\n'));
      content = lines2.join('\n');
      console.log('Replaced via line-based at line:', start + 1);
      break;
    }
  }
}

fs.writeFileSync('src/app/App.tsx', content);
console.log('Done!');
