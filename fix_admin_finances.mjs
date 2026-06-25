import fs from 'fs';

let content = fs.readFileSync('src/app/Admin.tsx', 'utf-8');

const oldLogic = `  const [transactions, setTransactions] = useState(initialTransactions);
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [showAddTx, setShowAddTx] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [txForm, setTxForm] = useState({ type: "recette" as "recette" | "depense", category: "Réservation", label: "", amount: "", status: "Payé" as "Payé" | "En attente" | "Annulé" });

  const totalRecettes = transactions.filter(t => t.type === "recette" && t.status === "Payé").reduce((s, t) => s + t.amount, 0);
  const totalDepenses = transactions.filter(t => t.type === "depense" && t.status === "Payé").reduce((s, t) => s + t.amount, 0);
  const benefice = totalRecettes - totalDepenses;
  const enAttente = transactions.filter(t => t.status === "En attente").reduce((s, t) => s + t.amount, 0);

  const filtered = transactions.filter(t => {
    const matchType = typeFilter === "Tous" || (typeFilter === "Recettes" && t.type === "recette") || (typeFilter === "Dépenses" && t.type === "depense");
    const matchStatus = statusFilter === "Tous" || t.status === statusFilter;
    return matchType && matchStatus;
  });

  const handleAddTx = () => {
    if (!txForm.label.trim() || !txForm.amount) { toast.error("Libellé et montant requis."); return; }
    const newTx: Transaction = {
      id: \`T-\${String(transactions.length + 1).padStart(3, "0")}\`,
      type: txForm.type,
      category: txForm.category,
      label: txForm.label,
      amount: Number(txForm.amount),
      date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
      status: txForm.status,
    };
    setTransactions(prev => [newTx, ...prev]);
    setTxForm({ type: "recette", category: "Réservation", label: "", amount: "", status: "Payé" });
    setShowAddTx(false);
    toast.success(\`Transaction \${newTx.id} enregistrée !\`);
  };

  const deleteTx = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setConfirmDelete(null);
    toast.success("Transaction supprimée.");
  };

  const markPaid = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "Payé" } : t));
    toast.success("Transaction marquée comme payée !");
  };`;

const newLogic = `  const [transactions, setTransactions] = useState<any[]>([]);
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
  }, {});
  const dynamicFinanceMonthly = Object.values(monthlyData).sort((a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month));

  if (loading) return <div className="text-center py-10">Chargement...</div>;`;

if (content.includes(oldLogic)) {
  content = content.replace(oldLogic, newLogic);
  console.log('Replaced logic successfully.');
} else {
  console.error('oldLogic not found in Admin.tsx');
  // fallback check line by line
}

// Replace financeMonthly with dynamicFinanceMonthly in the BarChart
if (content.includes('<BarChart data={financeMonthly} barGap={4}>')) {
  content = content.replace('<BarChart data={financeMonthly} barGap={4}>', '<BarChart data={dynamicFinanceMonthly} barGap={4}>');
  console.log('Replaced BarChart data prop successfully.');
}

// There is also `transactions.filter...` down below in the total calculation
// totalRecettes and totalDepenses use `.amount`, we already updated it in newLogic to `Number(t.amount)`.
// We need to also ensure `<span className="px-4 py-3 text-xs font-mono font-bold whitespace-nowrap" style={{ color: tx.type === "recette" ? "#16A34A" : "#DC2626" }}>{tx.type === "recette" ? "+" : "-"}{tx.amount.toLocaleString("fr-FR")} TND</span>`
// tx.amount could be a string if it's numeric in supabase.
content = content.replace(/\{tx\.amount\.toLocaleString\("fr-FR"\)\} TND/g, "{Number(tx.amount).toLocaleString(\"fr-FR\")} TND");
content = content.replace(/t => s \+ t\.amount/g, "t => s + Number(t.amount)"); // for any missed occurrences

fs.writeFileSync('src/app/Admin.tsx', content);
