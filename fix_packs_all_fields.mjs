import fs from 'fs';

let adminContent = fs.readFileSync('src/app/Admin.tsx', 'utf-8');

const oldPacksPagePattern = /function PacksPage\(\) \{[\s\S]*?(?=function ContentPage\(\))/;

const newPacksPage = `function PacksPage() {
  const [packStates, setPackStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPackForm, setNewPackForm] = useState({ tier: "", tagline: "", description: "", price: 0, games_count: 0, badge: "" });

  // Mapping styling based on pack name since it's hardcoded on the UI side
  const packStyles: Record<string, any> = {
    "SILVER": { emoji: "🥈", color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.25)" },
    "GOLD":   { emoji: "🥇", color: "#F5A623", bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.35)" },
    "PLATINUM":{ emoji: "💎", color: "#3B82F6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.35)" },
    "BRONZE": { emoji: "🥉", color: "#CD7F32", bg: "rgba(205,127,50,0.08)", border: "rgba(205,127,50,0.25)" }
  };

  useEffect(() => {
    const fetchPacks = async () => {
      const { data } = await supabase.from('packs').select('*').order('price', { ascending: true });
      if (data && data.length > 0) {
        setPackStates(data.map(p => ({
          ...p,
          style: packStyles[p.tier.toUpperCase()] || { emoji: "📦", color: "#1B2A4A", bg: "#F0F2F5", border: "#E8EBF0" },
          features: Array.isArray(p.features) ? p.features : []
        })));
      } else {
        // Fallback if db empty, insert default packs
        const defaults = [
          { tier: "SILVER", tagline: "L'essentiel pour s'amuser", price: 150, games_count: 3, badge: "", features: [{label: "3 jeux de team building", included: true}, {label: "Photographe", included: false}] },
          { tier: "GOLD", tagline: "L'expérience complète", price: 250, games_count: 5, badge: "POPULAIRE", features: [{label: "5 jeux de team building", included: true}, {label: "Photographe", included: true}] },
          { tier: "PLATINUM", tagline: "Le sur-mesure absolu", price: 400, games_count: 8, badge: "PREMIUM", features: [{label: "8 jeux de team building", included: true}, {label: "Photographe", included: true}] }
        ];
        const { data: inserted } = await supabase.from('packs').insert(defaults).select();
        if (inserted) {
          setPackStates(inserted.map((p: any) => ({
            ...p,
            style: packStyles[p.tier.toUpperCase()] || { emoji: "📦", color: "#1B2A4A", bg: "#F0F2F5", border: "#E8EBF0" },
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
      tagline: pack.tagline,
      description: pack.description,
      games_count: pack.games_count,
      badge: pack.badge,
      features: pack.features
    }).eq('id', pack.id);
    
    if (error) {
      toast.error("Erreur: " + error.message);
    } else {
      toast.success(\`Pack \${pack.tier} enregistré avec succès !\`);
    }
  };

  const handleAddPackSubmit = async () => {
    if (!newPackForm.tier.trim()) return toast.error("Le nom du pack est requis.");
    
    const { data, error } = await supabase.from('packs').insert([{
      tier: newPackForm.tier.trim().toUpperCase(),
      tagline: newPackForm.tagline.trim(),
      description: newPackForm.description.trim(),
      price: newPackForm.price,
      games_count: newPackForm.games_count,
      badge: newPackForm.badge.trim(),
      features: []
    }]).select().single();
    
    if (error) {
      if (error.code === '23505') {
        toast.error("Erreur: Ce nom de pack (Tier) existe déjà ! Veuillez en choisir un autre.");
      } else {
        toast.error("Erreur lors de la création du pack: " + error.message);
      }
    } else if (data) {
      toast.success("Pack créé !");
      setPackStates(prev => [...prev, {
        ...data,
        style: packStyles[data.tier.toUpperCase()] || { emoji: "📦", color: "#1B2A4A", bg: "#F0F2F5", border: "#E8EBF0" },
        features: []
      }]);
      setShowAddModal(false);
      setNewPackForm({ tier: "", tagline: "", description: "", price: 0, games_count: 0, badge: "" });
    }
  };

  if (loading) return <div className="text-center py-10">Chargement...</div>;

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="space-y-4 relative">
      <div className="flex justify-end">
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
          <Plus size={15} /> Ajouter un Pack
        </button>
      </div>
      
      {packStates.length === 0 && (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4">Aucun pack n'existe dans la base de données.</p>
          <p className="text-xs text-red-500 max-w-md mx-auto">Astuce: Si l'ajout échoue, pensez à désactiver temporairement les règles RLS (Row Level Security) sur la table "packs" dans Supabase.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {packStates.map((pack, packIdx) => (
          <div key={pack.id} className="bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ background: pack.style.bg, borderColor: pack.style.border }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{pack.style.emoji}</span>
                <div>
                  <div className="font-bold text-base" style={{ color: pack.style.color }}>Pack {pack.tier}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{pack.tagline}</div>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Prix (TND)</label>
                  <input type="number" value={pack.price || ""} onChange={e => setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, price: Number(e.target.value) } : p))} className="w-full px-3 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A", fontFamily: "DM Mono, monospace" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Nombre de jeux</label>
                  <input type="number" value={pack.games_count || ""} onChange={e => setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, games_count: Number(e.target.value) } : p))} className="w-full px-3 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Slogan / Tagline</label>
                <input value={pack.tagline || ""} onChange={e => setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, tagline: e.target.value } : p))} className="w-full px-3 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Description (Optionnelle)</label>
                <textarea rows={2} value={pack.description || ""} onChange={e => setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, description: e.target.value } : p))} className="w-full px-3 py-2 text-sm rounded-lg outline-none resize-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Badge (ex: PREMIUM, POPULAIRE)</label>
                <input value={pack.badge || ""} onChange={e => setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, badge: e.target.value } : p))} className="w-full px-3 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
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
              <button onClick={() => savePack(packIdx)}
                className="w-full py-2.5 text-sm font-semibold rounded-xl text-white transition-opacity hover:opacity-90 mt-4" style={{ background: pack.style.color, color: (pack.tier || "").toUpperCase() === "SILVER" ? "#1B2A4A" : "white" }}>
                Enregistrer ce pack
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-up max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <h3 className="text-lg font-bold" style={{ color: "#1B2A4A" }}>Ajouter un nouveau pack</h3>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Nom du pack / Tier (ex: BRONZE)</label>
                <input value={newPackForm.tier} onChange={e => setNewPackForm({...newPackForm, tier: e.target.value})} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} placeholder="Nom..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Prix initial (TND)</label>
                  <input type="number" value={newPackForm.price || ""} onChange={e => setNewPackForm({...newPackForm, price: Number(e.target.value)})} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} placeholder="Prix..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Nombre de jeux</label>
                  <input type="number" value={newPackForm.games_count || ""} onChange={e => setNewPackForm({...newPackForm, games_count: Number(e.target.value)})} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} placeholder="Jeux..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Slogan / Tagline (courte phrase)</label>
                <input value={newPackForm.tagline} onChange={e => setNewPackForm({...newPackForm, tagline: e.target.value})} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} placeholder="Slogan..." />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Badge (ex: PREMIUM, optionnel)</label>
                <input value={newPackForm.badge} onChange={e => setNewPackForm({...newPackForm, badge: e.target.value})} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} placeholder="Badge..." />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Description détaillée</label>
                <textarea rows={3} value={newPackForm.description} onChange={e => setNewPackForm({...newPackForm, description: e.target.value})} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} placeholder="Description..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t flex items-center justify-end gap-3 shrink-0" style={{ background: "#FAFAFB", borderColor: "rgba(27,42,74,0.08)" }}>
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#E8EBF0", color: "#1B2A4A" }}>Annuler</button>
              <button onClick={handleAddPackSubmit} className="px-5 py-2.5 text-sm font-bold rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>Créer le pack</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

adminContent = adminContent.replace(oldPacksPagePattern, newPacksPage + "\n\n");
fs.writeFileSync('src/app/Admin.tsx', adminContent);
