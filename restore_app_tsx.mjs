import fs from 'fs';
let content = fs.readFileSync('src/app/App.tsx', 'utf-8');

const replacement = `{/* Card Body */}
                  <div className="p-8 flex flex-col flex-1">

                    {/* Tier label */}
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: pack.color, fontFamily: "'KG Red Hands', sans-serif" }}>
                          Pack
                        </p>
                        <h3 className="font-black text-5xl leading-none" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#fff", letterSpacing: "-0.04em" }}>
                          {pack.tier}
                        </h3>
                        <p className="text-sm mt-2 font-medium" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'KG Red Hands', sans-serif" }}>
                          {pack.tagline}
                        </p>
                      </div>

                      {/* Big number accent */}`;

content = content.replace(/\{\/\* Card Body \*\/\}\s*<\/div>\s*\{\/\* Big number accent \*\/\}/g, replacement);
fs.writeFileSync('src/app/App.tsx', content);
console.log("Fixed App.tsx!");
