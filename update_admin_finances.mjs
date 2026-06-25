import fs from 'fs';

let content = fs.readFileSync('src/app/Admin.tsx', 'utf-8');

const target1Start = `  const [transactions, setTransactions] = useState(initialTransactions);`;
const target1End = `  const markPaid = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "Payé" } : t));
    toast.success("Transaction marquée comme payée !");
  };`;

const newCode1 = `  const [transactions, setTransactions] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [showAddTx, setShowAddTx] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [txForm, setTxForm] = useState({ type: "recette" as "recette" | "depense", category: "Réservation", label: "", amount: "", status: "Payé" as "Payé" | "En attente" | "Annulé" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setTransactions(data);
    } else {
      const mockData = initialTransactions.map(({ id, ...rest }) => rest);
      const { data: inserted } = await supabase.from('transactions').insert(mockData).select();
      if (inserted) setTransactions(inserted);
    }
    setLoading(false);
  };

  const totalRecettes = transactions.filter(t => t.type === "recette" && t.status === "Payé").reduce((s, t) => s + Number(t.amount), 0);
  const totalDepenses = transactions.filter(t => t.type === "depense" && t.status === "Payé").reduce((s, t) => s + Number(t.amount), 0);
  const benefice = totalRecettes - totalDepenses;
  const enAttente = transactions.filter(t => t.status === "En attente").reduce((s, t) => s + Number(t.amount), 0);

  const filtered = transactions.filter(t => {
    const matchType = typeFilter === "Tous" || (typeFilter === "Recettes" && t.type === "recette") || (typeFilter === "Dépenses" && t.type === "depense");
    const matchStatus = statusFilter === "Tous" || t.status === statusFilter;
    return matchType && matchStatus;
  });

  const handleAddTx = async () => {
    if (!txForm.label.trim() || !txForm.amount) { toast.error("Libellé et montant requis."); return; }
    const newTx = {
      type: txForm.type,
      category: txForm.category,
      label: txForm.label,
      amount: Number(txForm.amount),
      date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
      status: txForm.status,
    };
    const { data, error } = await supabase.from('transactions').insert([newTx]).select();
    if (!error && data) {
      setTransactions(prev => [data[0], ...prev]);
      setTxForm({ type: "recette", category: "Réservation", label: "", amount: "", status: "Payé" });
      setShowAddTx(false);
      toast.success("Transaction enregistrée !");
    } else {
      toast.error("Erreur: " + error?.message);
    }
  };

  const deleteTx = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      setConfirmDelete(null);
      toast.success("Transaction supprimée.");
    } else {
      toast.error("Erreur: " + error?.message);
    }
  };

  const markPaid = async (id: string) => {
    const { error } = await supabase.from('transactions').update({ status: 'Payé' }).eq('id', id);
    if (!error) {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "Payé" } : t));
      toast.success("Transaction marquée comme payée !");
    } else {
      toast.error("Erreur: " + error?.message);
    }
  };

  const monthsOrder = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const monthlyData = transactions.reduce((acc, tx) => {
    const parts = tx.date.split(" ");
    if (parts.length >= 2) {
      const month = parts[1];
      if (!acc[month]) acc[month] = { month, recettes: 0, depenses: 0 };
      if (tx.status === "Payé") {
        if (tx.type === "recette") acc[month].recettes += Number(tx.amount);
        else if (tx.type === "depense") acc[month].depenses += Number(tx.amount);
      }
    }
    return acc;
  }, {} as Record<string, { month: string, recettes: number, depenses: number }>);
  const dynamicFinanceMonthly = Object.values(monthlyData).sort((a: any, b: any) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month));

  if (loading) return <div className="text-center py-10">Chargement...</div>;`;

let startIdx = content.indexOf(target1Start);
let endIdx = content.indexOf(target1End);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newCode1 + content.substring(endIdx + target1End.length);
  console.log("Replaced logic block successfully.");
} else {
  console.log("Could not find logic block.");
}

content = content.replace('<BarChart data={financeMonthly} barGap={4}>', '<BarChart data={dynamicFinanceMonthly} barGap={4}>');
content = content.replace(/\\{tx\\.amount\\.toLocaleString\\("fr-FR"\\)\\} TND/g, "{Number(tx.amount).toLocaleString(\"fr-FR\")} TND");

fs.writeFileSync('src/app/Admin.tsx', content);
console.log("Admin.tsx updated successfully.");
