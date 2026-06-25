import fs from 'fs';

let adminContent = fs.readFileSync('src/app/Admin.tsx', 'utf-8');

// The goal is to add a button before the grid to allow adding a new pack
const oldPacksPageReturn = `  if (loading) return <div className="text-center py-10">Chargement...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" style={{ fontFamily: "Inter, sans-serif" }}>
      {packStates.map((pack, packIdx) => (`;

const newPacksPageReturn = `  const addNewPack = async () => {
    const newPackName = prompt("Nom du nouveau pack (ex: BRONZE) ?");
    if (!newPackName) return;
    
    const { data, error } = await supabase.from('packs').insert([{
      name: newPackName.toUpperCase(),
      description: "Nouveau pack",
      price: 100,
      features: [],
      is_active: true
    }]).select().single();
    
    if (error) {
      toast.error("Erreur lors de la création du pack: " + error.message);
    } else if (data) {
      toast.success("Pack créé !");
      setPackStates(prev => [...prev, {
        ...data,
        style: packStyles[data.name.toUpperCase()] || { emoji: "📦", color: "#1B2A4A", bg: "#F0F2F5", border: "#E8EBF0" },
        features: []
      }]);
    }
  };

  if (loading) return <div className="text-center py-10">Chargement...</div>;

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="space-y-4">
      <div className="flex justify-end">
        <button onClick={addNewPack} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
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
        {packStates.map((pack, packIdx) => (`;

adminContent = adminContent.replace(oldPacksPageReturn, newPacksPageReturn);
fs.writeFileSync('src/app/Admin.tsx', adminContent);
