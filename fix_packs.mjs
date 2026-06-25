import fs from 'fs';

// --- Update Admin.tsx ---
let adminContent = fs.readFileSync('src/app/Admin.tsx', 'utf-8');

const newPacksPage = `function PacksPage() {
  const [packStates, setPackStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mapping styling based on pack name since it's hardcoded on the UI side
  const packStyles: Record<string, any> = {
    "SILVER": { emoji: "🥈", color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.25)" },
    "GOLD":   { emoji: "🥇", color: "#F5A623", bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.35)" },
    "PLATINUM":{ emoji: "💎", color: "#3B82F6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.35)" }
  };

  useEffect(() => {
    const fetchPacks = async () => {
      const { data } = await supabase.from('packs').select('*').order('price', { ascending: true });
      if (data && data.length > 0) {
        setPackStates(data.map(p => ({
          ...p,
          style: packStyles[p.name.toUpperCase()] || { emoji: "📦", color: "#1B2A4A", bg: "#F0F2F5", border: "#E8EBF0" },
          features: Array.isArray(p.features) ? p.features : []
        })));
      } else {
        // Fallback if db empty, insert default packs
        const defaults = [
          { name: "SILVER", description: "L'essentiel pour s'amuser", price: 150, features: [{label: "3 jeux de team building", included: true}, {label: "Photographe", included: false}], is_active: true },
          { name: "GOLD", description: "L'expérience complète", price: 250, features: [{label: "5 jeux de team building", included: true}, {label: "Photographe", included: true}], is_active: true },
          { name: "PLATINUM", description: "Le sur-mesure absolu", price: 400, features: [{label: "Jeux illimités", included: true}, {label: "Photographe", included: true}], is_active: true }
        ];
        const { data: inserted } = await supabase.from('packs').insert(defaults).select();
        if (inserted) {
          setPackStates(inserted.map((p: any) => ({
            ...p,
            style: packStyles[p.name.toUpperCase()],
            features: p.features || []
          })));
        }
      }
      setLoading(false);
    };
    fetchPacks();
  }, []);

  const updateFeatureLabel = (packIdx: number, featIdx: number, val: string) => {
    setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, features: p.features.map((f:any, fi:number) => fi === featIdx ? { ...f, label: val } : f) } : p));
  };
  const toggleFeatureIncluded = (packIdx: number, featIdx: number) => {
    setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, features: p.features.map((f:any, fi:number) => fi === featIdx ? { ...f, included: !f.included } : f) } : p));
  };
  const addFeature = (packIdx: number) => {
    setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, features: [...p.features, { label: "Nouvelle fonctionnalité", included: true }] } : p));
  };
  const removeFeature = (packIdx: number, featIdx: number) => {
    setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, features: p.features.filter((_:any, fi:number) => fi !== featIdx) } : p));
  };

  const savePack = async (packIdx: number) => {
    const pack = packStates[packIdx];
    const { error } = await supabase.from('packs').update({
      price: pack.price,
      description: pack.description,
      features: pack.features,
      is_active: pack.is_active
    }).eq('id', pack.id);
    
    if (error) {
      toast.error("Erreur: " + error.message);
    } else {
      toast.success(\`Pack \${pack.name} enregistré avec succès !\`);
    }
  };

  if (loading) return <div className="text-center py-10">Chargement...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" style={{ fontFamily: "Inter, sans-serif" }}>
      {packStates.map((pack, packIdx) => (
        <div key={pack.id} className="bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="px-5 py-4 border-b" style={{ background: pack.style.bg, borderColor: pack.style.border }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{pack.style.emoji}</span>
              <div>
                <div className="font-bold text-base" style={{ color: pack.style.color }}>Pack {pack.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{pack.description}</div>
              </div>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Prix (TND)</label>
              <input type="number" value={pack.price} onChange={e => setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, price: Number(e.target.value) } : p))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A", fontFamily: "DM Mono, monospace" }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Slogan / Description</label>
              <input value={pack.description || ""} onChange={e => setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, description: e.target.value } : p))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
            </div>
            
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#6B7A99" }}>Fonctionnalités</label>
              {pack.features.map((f: any, fi: number) => (
                <div key={fi} className="flex items-center gap-2 mb-2">
                  <input type="checkbox" checked={f.included} onChange={() => toggleFeatureIncluded(packIdx, fi)} style={{ accentColor: pack.style.color }} title="Inclus ?" />
                  <input value={f.label} onChange={e => updateFeatureLabel(packIdx, fi, e.target.value)} className="flex-1 px-3 py-1.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: f.included ? "#1B2A4A" : "#9BA3AF", textDecoration: f.included ? "none" : "line-through" }} />
                  <button onClick={() => removeFeature(packIdx, fi)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-50"><X size={11} style={{ color: "#EF4444" }} /></button>
                </div>
              ))}
              <button onClick={() => addFeature(packIdx)} className="flex items-center gap-1.5 text-xs font-medium mt-2" style={{ color: pack.style.color }}><Plus size={13} /> Ajouter une fonctionnalité</button>
            </div>
            <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <span className="text-xs font-semibold" style={{ color: "#1B2A4A" }}>Statut actif</span>
              <button onClick={() => setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, is_active: !p.is_active } : p))} className="w-10 h-5 rounded-full relative transition-colors" style={{ background: pack.is_active ? pack.style.color : "#E8EBF0" }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ right: pack.is_active ? 2 : "auto", left: pack.is_active ? "auto" : 2 }} />
              </button>
            </div>
            <button onClick={() => savePack(packIdx)}
              className="w-full py-2.5 text-sm font-semibold rounded-xl text-white transition-opacity hover:opacity-90" style={{ background: pack.style.color, color: pack.name === "SILVER" ? "#1B2A4A" : "white" }}>
              Enregistrer ce pack
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}`;

adminContent = adminContent.replace(/function PacksPage\(\) \{[\s\S]*?(?=function TeamPage\(\))/g, newPacksPage + "\n\n");
fs.writeFileSync('src/app/Admin.tsx', adminContent);

// --- Update App.tsx ---
let appContent = fs.readFileSync('src/app/App.tsx', 'utf-8');

// Replace PACKS_DATA usage in Packs component with state
const oldPacks = `function Packs() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (`;

const newPacks = `function Packs() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [packsData, setPacksData] = useState<any[]>([]);

  useEffect(() => {
    const fetchPacks = async () => {
      const { data } = await supabase.from('packs').select('*').eq('is_active', true).order('price', { ascending: true });
      if (data && data.length > 0) {
        // Merge with static styles based on tier name
        const styles: Record<string, any> = {
          "SILVER": { color: "#94a3b8", gradientFrom: "#94a3b8", gradientTo: "#cbd5e1" },
          "GOLD": { color: "#F5A623", gradientFrom: "#F5A623", gradientTo: "#f59e0b" },
          "PLATINUM": { color: "#3B82F6", gradientFrom: "#3B82F6", gradientTo: "#60A5FA" }
        };
        const mappedPacks = data.map(p => {
          const s = styles[p.name.toUpperCase()] || { color: "#FFF", gradientFrom: "#444", gradientTo: "#888" };
          return {
            tier: p.name.toUpperCase(),
            tagline: p.description,
            color: s.color,
            gradientFrom: s.gradientFrom,
            gradientTo: s.gradientTo,
            price: p.price,
            features: Array.isArray(p.features) ? p.features : []
          };
        });
        setPacksData(mappedPacks);
      } else {
        setPacksData(PACKS_DATA); // fallback to original static data if db empty
      }
    };
    fetchPacks();
  }, []);

  return (`;

appContent = appContent.replace(oldPacks, newPacks);
appContent = appContent.replace(/PACKS_DATA\.map\(\(pack, i\)/g, 'packsData.map((pack, i)');

fs.writeFileSync('src/app/App.tsx', appContent);
