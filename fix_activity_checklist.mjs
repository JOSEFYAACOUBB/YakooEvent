import fs from 'fs';

let content = fs.readFileSync('src/app/Admin.tsx', 'utf-8');

const lines = content.split('\n');

const CHECKLIST_CARD = `              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "#6B7A99" }}>Types d'activités incluses</label>
                <div className="grid grid-cols-2 gap-1.5 p-3 rounded-lg" style={{ background: "#F0F2F5" }}>
                  {ACTIVITIES_LIST.map(act => {
                    const selected = (pack.description || "").split(" + ").filter(Boolean).includes(act);
                    return (
                      <label key={act} className="flex items-center gap-2 text-xs cursor-pointer rounded-md px-2 py-1.5 transition-colors" style={{ background: selected ? pack.style.color + "25" : "transparent", color: selected ? pack.style.color : "#6B7A99", fontWeight: selected ? 600 : 400 }}>
                        <input type="checkbox" checked={selected} onChange={() => {
                          const current = (pack.description || "").split(" + ").filter(Boolean);
                          const updated = selected ? current.filter((a) => a !== act) : [...current, act];
                          setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, description: updated.join(" + ") } : p));
                        }} style={{ accentColor: pack.style.color }} />
                        {act}
                      </label>
                    );
                  })}
                </div>
              </div>`;

const CHECKLIST_MODAL = `              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "#6B7A99" }}>Types d'activités incluses</label>
                <div className="grid grid-cols-2 gap-1.5 p-3 rounded-lg" style={{ background: "#F0F2F5" }}>
                  {ACTIVITIES_LIST.map(act => {
                    const selected = newPackForm.selectedActivities.includes(act);
                    return (
                      <label key={act} className="flex items-center gap-2 text-xs cursor-pointer rounded-md px-2 py-1.5 transition-colors" style={{ background: selected ? "rgba(245,166,35,0.15)" : "transparent", color: selected ? "#F5A623" : "#6B7A99", fontWeight: selected ? 600 : 400 }}>
                        <input type="checkbox" checked={selected} onChange={() => {
                          const updated = selected
                            ? newPackForm.selectedActivities.filter(a => a !== act)
                            : [...newPackForm.selectedActivities, act];
                          setNewPackForm({...newPackForm, selectedActivities: updated});
                        }} style={{ accentColor: "#F5A623" }} />
                        {act}
                      </label>
                    );
                  })}
                </div>
              </div>`;

// Find and replace the two label lines
let fixedCard = false;
let fixedModal = false;

for (let i = 0; i < lines.length; i++) {
  // Card description field - look for the affiché label
  if (lines[i].includes("Types d") && lines[i].includes("affich")) {
    // remove this label line plus the next input line plus surrounding <div> tags
    const startDiv = i - 1; // <div>
    const endDiv = i + 2; // </div>
    const block = lines.slice(startDiv, endDiv + 1).join('\n');
    console.log("Found card block at line:", startDiv, ":\n", block);
    lines.splice(startDiv, endDiv - startDiv + 1, ...CHECKLIST_CARD.split('\n'));
    fixedCard = true;
    break;
  }
}

for (let i = 0; i < lines.length; i++) {
  // Modal description field - look for the Accrobranche label
  if (lines[i].includes("Types d") && lines[i].includes("Accrobranche")) {
    const startDiv = i - 1; // <div>
    const endDiv = i + 2; // </div>
    lines.splice(startDiv, endDiv - startDiv + 1, ...CHECKLIST_MODAL.split('\n'));
    fixedModal = true;
    break;
  }
}

console.log("Fixed card:", fixedCard, "Fixed modal:", fixedModal);
fs.writeFileSync('src/app/Admin.tsx', lines.join('\n'));
