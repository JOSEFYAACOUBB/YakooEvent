import fs from 'fs';

let content = fs.readFileSync('src/app/Admin.tsx', 'utf-8');
const lines = content.split('\n');

let start = -1;
let end = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function ReviewsPage() {')) {
    start = i;
  }
  if (start !== -1 && lines[i].includes('return (')) {
    // End is the line right before return (
    end = i - 1;
    break;
  }
}

if (start !== -1 && end !== -1) {
  const replacement = `function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setReviews(data);
    } else {
      // Insert mock data if empty
      const { data: inserted } = await supabase.from('reviews').insert(initialReviews.map(({id, ...rest}) => rest)).select();
      if (inserted) setReviews(inserted);
    }
    setLoading(false);
  };

  const published = reviews.filter(r => r.status === "Publié").length;
  const pending = reviews.filter(r => r.status === "En attente").length;
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";

  const publish = async (id: string) => {
    const { error } = await supabase.from('reviews').update({ status: 'Publié' }).eq('id', id);
    if (!error) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "Publié" } : r));
      toast.success("Avis publié avec succès !");
    } else {
      toast.error("Erreur: " + error.message);
    }
  };

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) {
      setReviews(prev => prev.filter(r => r.id !== id));
      setConfirmDelete(null);
      toast.success("Avis supprimé.");
    } else {
      toast.error("Erreur: " + error.message);
    }
  };

  if (loading) return <div className="text-center py-10">Chargement...</div>;`;

  lines.splice(start, end - start + 1, ...replacement.split('\n'));
  content = lines.join('\n');
  
  // Now we must replace all occurrences of `confirmDelete!` with `confirmDelete as string`
  // and in the confirmDelete dialog we might need to handle string instead of number
  content = content.replace(/confirmDelete\!/g, 'confirmDelete');
  
  fs.writeFileSync('src/app/Admin.tsx', content);
  console.log("Replaced ReviewsPage logic successfully!");
} else {
  console.log("Could not find ReviewsPage in Admin.tsx", start, end);
}
