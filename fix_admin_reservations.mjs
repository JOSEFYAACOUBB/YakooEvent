import fs from 'fs';

let content = fs.readFileSync('src/app/Admin.tsx', 'utf-8');

const oldAppInnerPrefix = `function AppInner() {
  const { lang } = useLang();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>("dashboard");
  const [reservations, setReservations] = useState(initialReservations);

  const handleLogout = () => {
    toast.success("Déconnexion réussie. À bientôt !");
    setTimeout(() => setIsLoggedIn(false), 600);
  };

  const confirmReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "Confirmée" } : r));
    toast.success(\`Réservation \${id} confirmée !\`, { icon: <CheckCircle2 size={16} color="#22C55E" /> });
  };
  const cancelReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "Annulée" } : r));
    toast.warning(\`Réservation \${id} annulée.\`);
  };
  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };
  const updateReservationStatus = (id: string, status: ReservationStatus) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success(\`Statut mis à jour.\`);
  };
  const addReservation = (r: Reservation) => {
    setReservations([r, ...reservations]);
  };`;

// Note: the original file has French accents encoded strangely if read as utf-8 but the terminal output above shows replacement characters ().
// Let's use Regex to replace the function start block to be safe.

const newAppInnerPrefix = `function AppInner() {
  const { lang } = useLang();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>("dashboard");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
      if (data) {
        const mapped = data.map(r => ({
          id: r.id,
          client: r.contact_name || 'Anonyme',
          phone: r.contact_phone || '',
          activity: r.activity_name || '',
          date: r.reservation_date ? new Date(r.reservation_date).toLocaleDateString('fr-FR') : '',
          persons: r.group_size || 0,
          pack: r.notes || '',
          status: (r.status === 'confirmed' ? 'Confirmée' : r.status === 'cancelled' ? 'Annulée' : 'En attente') as ReservationStatus,
          received: new Date(r.created_at).toLocaleDateString('fr-FR')
        }));
        setReservations(mapped);
      }
    };
    if (isLoggedIn) fetchReservations();
  }, [isLoggedIn]);

  const handleLogout = () => {
    toast.success("Déconnexion réussie. À bientôt !");
    setTimeout(() => setIsLoggedIn(false), 600);
  };

  const confirmReservation = async (id: string) => {
    await supabase.from('reservations').update({ status: 'confirmed' }).eq('id', id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "Confirmée" } : r));
    toast.success(\`Réservation confirmée !\`, { icon: <CheckCircle2 size={16} color="#22C55E" /> });
  };
  const cancelReservation = async (id: string) => {
    await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "Annulée" } : r));
    toast.warning(\`Réservation annulée.\`);
  };
  const deleteReservation = async (id: string) => {
    await supabase.from('reservations').delete().eq('id', id);
    setReservations(prev => prev.filter(r => r.id !== id));
    toast.success(\`Réservation supprimée.\`);
  };
  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    const dbStatus = status === "Confirmée" ? 'confirmed' : status === "Annulée" ? 'cancelled' : 'pending';
    await supabase.from('reservations').update({ status: dbStatus }).eq('id', id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success(\`Statut mis à jour.\`);
  };
  const addReservation = async (r: Reservation) => {
    // Add logic later if admin needs to add manually
    setReservations([r, ...reservations]);
  };`;

content = content.replace(/function AppInner\(\) \{[\s\S]*?const addReservation = \(r: Reservation\) => \{[\s\S]*?setReservations\(\[r, \.\.\.reservations\]\);\s*\};/, newAppInnerPrefix);

fs.writeFileSync('src/app/Admin.tsx', content);
