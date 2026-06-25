import fs from 'fs';

let content = fs.readFileSync('src/app/Admin.tsx', 'utf-8');

const brokenChunk = `                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}><div className="h-full rounded-full" style={{ width: \`\${row.fill}%\`, background: row.fill > 80 ? "#22C55E" : "#F5A623" }} /></div>
                      <span className="text-xs font-semibold w-8" style={{ color: "#1B2A4A" }}>{row.fill}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono font-semibold" style={{ color: "#F5A623" }}>{row.rev} TND</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1"><Star size={11} fill="#F5A623" color="#F5A623" /><span className="text-xs font-semibold" style={{ color: "#1B2A4A" }}>{row.note}</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>`;

const fixedChunk = `                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: i === 0 ? "#F5A623" : i === 1 ? "#1B2A4A" : "#9CA3AF", fontSize: 10 }}>{i + 1}</span>
                    <span style={{ color: "#1B2A4A" }}>{item.name}</span>
                  </div>
                  <span className="font-semibold" style={{ color: "#6B7A99" }}>{item.value} rés.</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}>
                  <div className="h-full rounded-full" style={{ width: \`\${(item.value / 50) * 100}%\`, background: i === 0 ? "#F5A623" : "#1B2A4A" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
          <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Rapport détaillé par activité</h3>
          <button onClick={() => toast.success("Rapport exporté en CSV !")} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border" style={{ borderColor: "#F5A623", color: "#F5A623" }}><Download size={13} /> Exporter</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#F8F9FB" }}>
                {["Activité", "Catégorie", "Réservations", "Personnes", "Taux remplissage", "Revenus", "Note"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#6B7A99" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                { act: "Accrobranche", cat: "Aventure", res: 48, pers: 384, fill: 87, rev: "5 760", note: 4.8 },
                { act: "Kayak", cat: "Aventure", res: 35, pers: 210, fill: 72, rev: "3 150", note: 4.6 },
                { act: "Paintball", cat: "Aventure", res: 29, pers: 580, fill: 65, rev: "7 250", note: 4.5 },
                { act: "Tyrolienne", cat: "Aventure", res: 24, pers: 144, fill: 58, rev: "2 880", note: 4.7 },
                { act: "Team Building", cat: "Team Building", res: 20, pers: 600, fill: 90, rev: "12 000", note: 4.9 },
              ].map(row => (
                <tr key={row.act} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: "#1B2A4A" }}>{row.act}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#6B7A99" }}>{row.cat}</td>
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-center" style={{ color: "#1B2A4A" }}>{row.res}</td>
                  <td className="px-4 py-3 text-xs font-mono text-center" style={{ color: "#6B7A99" }}>{row.pers}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}><div className="h-full rounded-full" style={{ width: \`\${row.fill}%\`, background: row.fill > 80 ? "#22C55E" : "#F5A623" }} /></div>
                      <span className="text-xs font-semibold w-8" style={{ color: "#1B2A4A" }}>{row.fill}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono font-semibold" style={{ color: "#F5A623" }}>{row.rev} TND</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1"><Star size={11} fill="#F5A623" color="#F5A623" /><span className="text-xs font-semibold" style={{ color: "#1B2A4A" }}>{row.note}</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>`;

if (content.includes(brokenChunk)) {
  content = content.replace(brokenChunk, fixedChunk);
  fs.writeFileSync('src/app/Admin.tsx', content);
  console.log("Restored StatsPage successfully");
} else {
  console.log("Broken chunk not found, might be slightly different. Attempting dynamic replace.");
  // Let's replace the block starting at 2187
  const startIdx = content.indexOf(`                    <div className="flex items-center gap-2">\n                      <div className="flex-1 h-1.5 rounded-full overflow-hidden"`);
  if (startIdx !== -1) {
    // find the `<div className="flex items-center gap-2">` before it
    const outerStart = content.lastIndexOf(`                  <div className="flex items-center gap-2">`, startIdx);
    const endIdx = content.indexOf(`    </div>`, startIdx) + 10;
    const blockToReplace = content.substring(outerStart, endIdx);
    content = content.replace(blockToReplace, fixedChunk);
    fs.writeFileSync('src/app/Admin.tsx', content);
    console.log("Restored StatsPage using dynamic matching");
  } else {
    console.log("Failed to restore dynamically");
  }
}
