import fs from 'fs';

// Helper to normalize and search/replace
function processFile(path, replacements) {
  let content = fs.readFileSync(path, 'utf-8').replace(/\r\n/g, '\n');
  let updated = false;

  for (const [name, oldText, newText] of replacements) {
    if (content.includes(oldText)) {
      content = content.replace(oldText, newText);
      console.log(`[Success] Applied replacement: ${name}`);
      updated = true;
    } else {
      console.log(`[Warning] Pattern not found: ${name}`);
    }
  }

  if (updated) {
    fs.writeFileSync(path, content, 'utf-8');
  }
}

// ---------------------------------------------------------
// 1. App.tsx - Dynamic Fetching from Supabase
// ---------------------------------------------------------
const appReplacements = [
  [
    "Dynamic Equipment Showcase",
    `function EquipmentShowcaseSection() {
  const equipments = [
    {
      name: "Harnais & Mousquetons",
      category: "Escalade",
      location: "Entrepôt Principal — Zone A, Étagère 1",
      status: "Excellent état",
      icon: "🧗",
      desc: "Équipement de sécurité individuel haut de gamme de marque Edelrid, inspecté mensuellement.",
    },
    {
      name: "Kayaks & Gilets",
      category: "Kayak",
      location: "Hangar à Bateaux — Près du Lac",
      status: "Bon état",
      icon: "🛶",
      desc: "Kayaks monoplaces et biplaces robustes, avec gilets de sauvetage certifiés pour tous les âges.",
    },
    {
      name: "Marqueurs & Masques Paintball",
      category: "Paintball",
      location: "Armurerie Paintball — Stand de Tir",
      status: "Excellent état",
      icon: "🔫",
      desc: "Lanceurs Tippmann 98, masques antibuée double écran pour une protection et une visibilité optimales.",
    },
    {
      name: "Tentes & Matelas Camping",
      category: "Camping",
      location: "Entrepôt Logistique — Secteur B",
      status: "Excellent état",
      icon: "⛺",
      desc: "Tentes étanches Quechua de 2 à 4 places et matelas isolants confortables pour vos nuitées en nature.",
    },
  ];

  return (`,
    `function EquipmentShowcaseSection() {
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    const fetchPublicMateriels = async () => {
      const { data, error } = await supabase.from('materiels').select('*');
      if (!error && data) {
        setEquipments(data);
      }
    };
    fetchPublicMateriels();
  }, []);

  const displayList = equipments.length > 0 ? equipments.map(eq => ({
    name: eq.name,
    category: eq.category,
    location: eq.location || "Non spécifié",
    status: eq.condition || "Bon",
    desc: eq.description || "",
    icon: eq.category === "Escalade" ? "🧗" : eq.category === "Kayak" ? "🛶" : eq.category === "Paintball" ? "🔫" : "⛺"
  })) : [
    {
      name: "Harnais & Mousquetons",
      category: "Escalade",
      location: "Entrepôt Principal — Zone A, Étagère 1",
      status: "Excellent état",
      icon: "🧗",
      desc: "Équipement de sécurité individuel haut de gamme de marque Edelrid, inspecté mensuellement.",
    },
    {
      name: "Kayaks & Gilets",
      category: "Kayak",
      location: "Hangar à Bateaux — Près du Lac",
      status: "Bon état",
      icon: "🛶",
      desc: "Kayaks monoplaces et biplaces robustes, avec gilets de sauvetage certifiés pour tous les âges.",
    },
    {
      name: "Marqueurs & Masques Paintball",
      category: "Paintball",
      location: "Armurerie Paintball — Stand de Tir",
      status: "Excellent état",
      icon: "🔫",
      desc: "Lanceurs Tippmann 98, masques antibuée double écran pour une protection et une visibilité optimales.",
    },
    {
      name: "Tentes & Matelas Camping",
      category: "Camping",
      location: "Entrepôt Logistique — Secteur B",
      status: "Excellent état",
      icon: "⛺",
      desc: "Tentes étanches Quechua de 2 à 4 places et matelas isolants confortables pour vos nuitées en nature.",
    },
  ];

  return (`
  ],
  [
    "Display list map",
    `        <div className="grid md:grid-cols-2 gap-8">
          {equipments.map((eq, i) => (`,
    `        <div className="grid md:grid-cols-2 gap-8">
          {displayList.map((eq, i) => (`
  ]
];

processFile('src/app/App.tsx', appReplacements);

// ---------------------------------------------------------
// 2. Admin.tsx - Supabase Sync for Materiels & Events
// ---------------------------------------------------------
const adminReplacements = [
  // A. Replace CalendarPage component states & full DB sync CRUD
  [
    "CalendarPage full DB sync",
    `function CalendarPage() {
  const { lang } = useLang();
  const MONTHS = lang === "ar" ? MONTHS_AR : MONTHS_FR;
  const DAYS = lang === "ar" ? DAYS_AR : DAYS_FR;
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [events, setEvents] = useState(initialCalEvents);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", type: "event" as CalEvent["type"], time: "09:00" });
  const [editingEvent, setEditingEvent] = useState<CalEvent | null>(null);
  const [eventLocation, setEventLocation] = useState("");
  const [eventPersons, setEventPersons] = useState(0);
  const [eventStatus, setEventStatus] = useState<"En attente" | "Confirmé" | "Annulé">("Confirmé");
  const [assignedMats, setAssignedMats] = useState<{ materialId: number; name: string; qty: number }[]>([]);

  const openAddModal = () => {
    setEditingEvent(null);
    setNewEvent({ title: "", type: "event", time: "09:00" });
    setEventLocation("");
    setEventPersons(0);
    setEventStatus("Confirmé");
    setAssignedMats([]);
    setShowAdd(true);
  };

  const openEditModal = (ev: CalEvent) => {
    setEditingEvent(ev);
    setNewEvent({ title: ev.title, type: ev.type, time: ev.time || "09:00" });
    setEventLocation(ev.location || "");
    setEventPersons(ev.persons || 0);
    setEventStatus(ev.status || "Confirmé");
    setAssignedMats(ev.assignedMaterials || []);
    setShowAdd(true);
  };
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const getKey = (d: number) => \`\${viewYear}-\n\${String(viewMonth + 1).padStart(2, "0")}-\${String(d).padStart(2, "0")}\`;
  const typeColors: Record<CalEvent["type"], string> = { reservation: "#F5A623", task: "#EF4444", event: "#3B82F6", reminder: "#22C55E" };
  const typeLabels = { reservation: lang === "ar" ? "حجز" : "Réservation", task: lang === "ar" ? "مهمة" : "Tâche", event: lang === "ar" ? "حدث" : "Événement", reminder: lang === "ar" ? "تذكير" : "Rappel" };
  const addEvent = () => {
    if (!newEvent.title || !selectedDay) return;
    if (editingEvent) {
      const updated: CalEvent = {
        ...editingEvent,
        title: newEvent.title,
        type: newEvent.type,
        time: newEvent.time,
        color: typeColors[newEvent.type],
        location: eventLocation || undefined,
        persons: (newEvent.type === "event" || newEvent.type === "reservation") ? eventPersons : undefined,
        status: (newEvent.type === "event" || newEvent.type === "reservation") ? eventStatus : undefined,
        assignedMaterials: assignedMats
      };
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? updated : e));
      toast.success(lang === "ar" ? "تم تعديل الحدث!" : "Événement mis à jour !");
    } else {
      const ev: CalEvent = {
        id: Date.now(),
        date: selectedDay,
        title: newEvent.title,
        type: newEvent.type,
        time: newEvent.time,
        color: typeColors[newEvent.type],
        location: eventLocation || undefined,
        persons: (newEvent.type === "event" || newEvent.type === "reservation") ? eventPersons : undefined,
        status: (newEvent.type === "event" || newEvent.type === "reservation") ? eventStatus : undefined,
        assignedMaterials: assignedMats
      };
      setEvents(prev => [...prev, ev]);
      toast.success(lang === "ar" ? "تم إضافة الحدث!" : "Événement ajouté !");
    }
    setShowAdd(false);
  };
  const dayEvents = selectedDay ? events.filter(e => e.date === selectedDay) : [];`,
    `function CalendarPage() {
  const { lang } = useLang();
  const MONTHS = lang === "ar" ? MONTHS_AR : MONTHS_FR;
  const DAYS = lang === "ar" ? DAYS_AR : DAYS_FR;
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", type: "event" as CalEvent["type"], time: "09:00" });
  const [editingEvent, setEditingEvent] = useState<CalEvent | null>(null);
  const [eventLocation, setEventLocation] = useState("");
  const [eventPersons, setEventPersons] = useState(0);
  const [eventStatus, setEventStatus] = useState<"En attente" | "Confirmé" | "Annulé">("Confirmé");
  const [assignedMats, setAssignedMats] = useState<{ materialId: number; name: string; qty: number }[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase.from('events').select('*');
      if (error) throw error;
      const formatted: CalEvent[] = data.map((e: any) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        type: e.type as CalEvent["type"],
        color: e.color,
        time: e.time || undefined,
        persons: e.persons || undefined,
        location: e.location || undefined,
        status: e.status || undefined,
        assignedMaterials: e.assigned_materials || []
      }));
      setEvents(formatted);

      if (formatted.length === 0 && initialCalEvents.length > 0) {
        await seedEvents();
      }
    } catch (err: any) {
      console.error("Error fetching events:", err.message);
    }
  };

  const seedEvents = async () => {
    try {
      const payloads = initialCalEvents.map(e => ({
        title: e.title,
        date: e.date,
        type: e.type,
        color: e.color,
        time: e.time || null,
        persons: e.persons || null,
        location: e.location || null,
        status: e.status || null,
        assigned_materials: e.assignedMaterials || []
      }));
      await supabase.from('events').insert(payloads);
      fetchEvents();
    } catch (err: any) {
      console.error("Error seeding events:", err.message);
    }
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setNewEvent({ title: "", type: "event", time: "09:00" });
    setEventLocation("");
    setEventPersons(0);
    setEventStatus("Confirmé");
    setAssignedMats([]);
    setShowAdd(true);
  };

  const openEditModal = (ev: CalEvent) => {
    setEditingEvent(ev);
    setNewEvent({ title: ev.title, type: ev.type, time: ev.time || "09:00" });
    setEventLocation(ev.location || "");
    setEventPersons(ev.persons || 0);
    setEventStatus(ev.status || "Confirmé");
    setAssignedMats(ev.assignedMaterials || []);
    setShowAdd(true);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  
  // Adjusted getKey to use simple formatting to avoid formatting issues
  const getKey = (d: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return \`\${viewYear}-\${mm}-\${dd}\`;
  };

  const typeColors: Record<CalEvent["type"], string> = { reservation: "#F5A623", task: "#EF4444", event: "#3B82F6", reminder: "#22C55E" };
  const typeLabels = { reservation: lang === "ar" ? "حجز" : "Réservation", task: lang === "ar" ? "مهمة" : "Tâche", event: lang === "ar" ? "حدث" : "Événement", reminder: lang === "ar" ? "تذكير" : "Rappel" };
  
  const addEvent = async () => {
    if (!newEvent.title || !selectedDay) return;
    
    const payload = {
      title: newEvent.title,
      type: newEvent.type,
      time: newEvent.time,
      color: typeColors[newEvent.type],
      location: eventLocation || null,
      persons: (newEvent.type === "event" || newEvent.type === "reservation") ? eventPersons : null,
      status: (newEvent.type === "event" || newEvent.type === "reservation") ? eventStatus : null,
      assigned_materials: assignedMats
    };

    try {
      if (editingEvent) {
        const { error } = await supabase.from('events').update(payload).eq('id', editingEvent.id);
        if (error) throw error;
        toast.success(lang === "ar" ? "تم تعديل الحدث!" : "Événement mis à jour !");
      } else {
        const { error } = await supabase.from('events').insert([{ ...payload, date: selectedDay }]);
        if (error) throw error;
        toast.success(lang === "ar" ? "تم إضافة الحدث!" : "Événement ajouté !");
      }
      setShowAdd(false);
      fetchEvents();
    } catch (err: any) {
      toast.error("Erreur: " + err.message);
    }
  };

  const dayEvents = selectedDay ? events.filter(e => e.date === selectedDay) : [];`
  ],
  [
    "Day events deletion sync",
    `<button onClick={() => { setEvents(prev => prev.filter(e => e.id !== ev.id)); toast.success("Événement supprimé."); }} className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-50 text-red-500">`,
    `<button onClick={async () => {
                      try {
                        const { error } = await supabase.from('events').delete().eq('id', ev.id);
                        if (error) throw error;
                        toast.success("Événement supprimé.");
                        fetchEvents();
                      } catch (err: any) {
                        toast.error("Erreur: " + err.message);
                      }
                    }} className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-50 text-red-500">`
  ],
  [
    "MaterielsPage sync with fetch",
    `function MaterielsPage() {
  const [materiels, setMateriels] = useState(initialMateriels);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Tous");
  const [condFilter, setCondFilter] = useState("Tous");
  const [selected, setSelected] = useState<Materiel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Materiel | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showAssignModal, setShowAssignModal] = useState<Materiel | null>(null);
  const [assignForm, setAssignForm] = useState({ person: "", qty: 1, returnDate: "" });

  const categories: (MaterielCategory | "Tous")[] = ["Tous", "Escalade", "Kayak", "Paintball", "Camping", "Sécurité", "Animation", "Formation", "Tyrolienne"];
  const emptyForm = { name: "", category: "Escalade" as MaterielCategory, image: "photo-1504280390367-361c6d9f38f4", description: "", totalQty: 1, availableQty: 1, assignments: [] as Assignment[], rentalPricePerDay: 0, purchasePrice: 0, condition: "Bon" as MaterielCondition, serialNumber: "", purchaseDate: "", location: "" };
  const [form, setForm] = useState(emptyForm);

  const filtered = materiels.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
    const matchCat = catFilter === "Tous" || m.category === catFilter;
    const matchCond = condFilter === "Tous" || m.condition === condFilter;
    return matchSearch && matchCat && matchCond;
  });

  const totalItems = materiels.reduce((s, m) => s + m.totalQty, 0);
  const availableItems = materiels.reduce((s, m) => s + m.availableQty, 0);
  const inUse = totalItems - availableItems;
  const inRepair = materiels.filter(m => m.condition === "En réparation").length;

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (m: Materiel) => { setEditing(m); setForm({ ...m }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Le nom du matériel est requis."); return; }
    if (editing) {
      const updated = { ...editing, ...form };
      setMateriels(prev => prev.map(m => m.id === editing.id ? updated : m));
      if (selected?.id === editing.id) setSelected(updated);
      toast.success(\`"\${form.name}" mis à jour !\`);
    } else {
      const nm: Materiel = { id: Date.now(), ...form };
      setMateriels(prev => [...prev, nm]);
      toast.success(\`"\${form.name}" ajouté à l'inventaire !\`);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    const m = materiels.find(x => x.id === id);
    setMateriels(prev => prev.filter(x => x.id !== id));
    if (selected?.id === id) setSelected(null);
    setConfirmDelete(null);
    toast.success(\`"\${m?.name}" supprimé de l'inventaire.\`);
  };

  const handleAssign = () => {
    if (!assignForm.person.trim()) { toast.error("Nom du bénéficiaire requis."); return; }
    if (!showAssignModal) return;
    if (assignForm.qty > showAssignModal.availableQty) { toast.error(\`Seulement \${showAssignModal.availableQty} disponibles.\`); return; }
    const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    const newA: Assignment = { person: assignForm.person, qty: assignForm.qty, since: today, returnDate: assignForm.returnDate || undefined };
    const updated = { ...showAssignModal, availableQty: showAssignModal.availableQty - assignForm.qty, assignments: [...showAssignModal.assignments, newA] };
    setMateriels(prev => prev.map(m => m.id === showAssignModal.id ? updated : m));
    if (selected?.id === showAssignModal.id) setSelected(updated);
    setShowAssignModal(null);
    setAssignForm({ person: "", qty: 1, returnDate: "" });
    toast.success(\`\${assignForm.qty}× "\${showAssignModal.name}" attribué à \${assignForm.person} !\`);
  };

  const handleReturn = (materielId: number, assignIdx: number) => {
    setMateriels(prev => prev.map(m => {
      if (m.id !== materielId) return m;
      const a = m.assignments[assignIdx];
      const updated = { ...m, availableQty: m.availableQty + a.qty, assignments: m.assignments.filter((_, i) => i !== assignIdx) };
      if (selected?.id === materielId) setSelected(updated);
      return updated;
    }));
    toast.success("Retour enregistré !");
  };`,
    `function MaterielsPage() {
  const [materiels, setMateriels] = useState([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Tous");
  const [condFilter, setCondFilter] = useState("Tous");
  const [selected, setSelected] = useState<Materiel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Materiel | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [showAssignModal, setShowAssignModal] = useState<Materiel | null>(null);
  const [assignForm, setAssignForm] = useState({ person: "", qty: 1, returnDate: "" });

  const categories: (MaterielCategory | "Tous")[] = ["Tous", "Escalade", "Kayak", "Paintball", "Camping", "Sécurité", "Animation", "Formation", "Tyrolienne"];
  const emptyForm = { name: "", category: "Escalade" as MaterielCategory, image: "photo-1504280390367-361c6d9f38f4", description: "", totalQty: 1, availableQty: 1, assignments: [] as Assignment[], rentalPricePerDay: 0, purchasePrice: 0, condition: "Bon" as MaterielCondition, serialNumber: "", purchaseDate: "", location: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchMateriels();
  }, []);

  const fetchMateriels = async () => {
    try {
      const { data: matsData, error: matsError } = await supabase.from('materiels').select('*');
      if (matsError) throw matsError;

      const { data: assignData, error: assignError } = await supabase.from('materiel_assignments').select('*');
      if (assignError) throw assignError;

      const formatted: Materiel[] = matsData.map((m: any) => {
        const assignments = assignData
          ? assignData
              .filter((a: any) => a.materiel_id === m.id)
              .map((a: any) => ({
                id: a.id,
                person: a.person,
                qty: a.qty,
                since: a.since,
                returnDate: a.return_date || undefined
              }))
          : [];

        return {
          id: m.id,
          name: m.name,
          category: m.category as MaterielCategory,
          image: m.image || "photo-1504280390367-361c6d9f38f4",
          description: m.description || "",
          totalQty: m.total_qty,
          availableQty: m.available_qty,
          assignments,
          rentalPricePerDay: Number(m.rental_price_per_day || 0),
          purchasePrice: m.purchase_price ? Number(m.purchase_price) : undefined,
          condition: m.condition as MaterielCondition,
          serialNumber: m.serial_number || undefined,
          purchaseDate: m.purchase_date || undefined,
          location: m.location || undefined
        };
      });

      setMateriels(formatted);

      if (formatted.length === 0 && initialMateriels.length > 0) {
        await seedMateriels();
      }
    } catch (err: any) {
      console.error("Error fetching materials:", err.message);
    }
  };

  const seedMateriels = async () => {
    try {
      for (const m of initialMateriels) {
        const payload = {
          name: m.name,
          category: m.category,
          image: m.image,
          description: m.description,
          total_qty: m.totalQty,
          available_qty: m.availableQty,
          rental_price_per_day: m.rentalPricePerDay,
          purchase_price: m.purchasePrice || null,
          condition: m.condition,
          serial_number: m.serialNumber || null,
          purchase_date: m.purchaseDate || null,
          location: m.location || null
        };
        const { data, error } = await supabase.from('materiels').insert([payload]).select();
        if (error) throw error;
        
        if (data && data[0] && m.assignments && m.assignments.length > 0) {
          const matId = data[0].id;
          const assignPayloads = m.assignments.map(a => ({
            materiel_id: matId,
            person: a.person,
            qty: a.qty,
            since: a.since,
            return_date: a.returnDate || null
          }));
          await supabase.from('materiel_assignments').insert(assignPayloads);
        }
      }
      fetchMateriels();
    } catch (err: any) {
      console.error("Error seeding materials:", err.message);
    }
  };

  const filtered = materiels.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
    const matchCat = catFilter === "Tous" || m.category === catFilter;
    const matchCond = condFilter === "Tous" || m.condition === condFilter;
    return matchSearch && matchCat && matchCond;
  });

  const totalItems = materiels.reduce((s, m) => s + m.totalQty, 0);
  const availableItems = materiels.reduce((s, m) => s + m.availableQty, 0);
  const inUse = totalItems - availableItems;
  const inRepair = materiels.filter(m => m.condition === "En réparation").length;

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (m: Materiel) => { setEditing(m); setForm({ ...m }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Le nom du matériel est requis."); return; }
    
    const payload = {
      name: form.name,
      category: form.category,
      image: form.image,
      description: form.description,
      total_qty: form.totalQty,
      available_qty: form.availableQty,
      rental_price_per_day: form.rentalPricePerDay,
      purchase_price: form.purchasePrice || null,
      condition: form.condition,
      serial_number: form.serialNumber || null,
      purchase_date: form.purchaseDate || null,
      location: form.location || null
    };

    try {
      if (editing) {
        const { error } = await supabase.from('materiels').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success(\`"\${form.name}" mis à jour !\`);
      } else {
        const { error } = await supabase.from('materiels').insert([payload]);
        if (error) throw error;
        toast.success(\`"\${form.name}" ajouté à l'inventaire !\`);
      }
      setShowModal(false);
      fetchMateriels();
    } catch (err: any) {
      toast.error("Erreur lors de la sauvegarde: " + err.message);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      const { error } = await supabase.from('materiels').delete().eq('id', id);
      if (error) throw error;
      toast.success("Matériel supprimé de l'inventaire.");
      if (selected?.id === id) setSelected(null);
      setConfirmDelete(null);
      fetchMateriels();
    } catch (err: any) {
      toast.error("Erreur lors de la suppression: " + err.message);
    }
  };

  const handleAssign = async () => {
    if (!assignForm.person.trim()) { toast.error("Nom du bénéficiaire requis."); return; }
    if (!showAssignModal) return;
    if (assignForm.qty > showAssignModal.availableQty) { toast.error(\`Seulement \${showAssignModal.availableQty} disponibles.\`); return; }
    
    const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    
    try {
      const assignPayload = {
        materiel_id: showAssignModal.id,
        person: assignForm.person,
        qty: assignForm.qty,
        since: today,
        return_date: assignForm.returnDate || null
      };
      const { error: assignErr } = await supabase.from('materiel_assignments').insert([assignPayload]);
      if (assignErr) throw assignErr;

      const { error: matErr } = await supabase.from('materiels')
        .update({ available_qty: showAssignModal.availableQty - assignForm.qty })
        .eq('id', showAssignModal.id);
      if (matErr) throw matErr;

      setShowAssignModal(null);
      setAssignForm({ person: "", qty: 1, returnDate: "" });
      toast.success(\`\${assignForm.qty}× "\${showAssignModal.name}" attribué à \${assignForm.person} !\`);
      fetchMateriels();
    } catch (err: any) {
      toast.error("Erreur lors de l'attribution: " + err.message);
    }
  };

  const handleReturn = async (materielId: any, assignIdx: number) => {
    const mat = materiels.find(m => m.id === materielId);
    if (!mat) return;
    const a = mat.assignments[assignIdx];
    if (!a) return;

    try {
      if (a.id) {
        const { error: delErr } = await supabase.from('materiel_assignments').delete().eq('id', a.id);
        if (delErr) throw delErr;
      }

      const { error: updateErr } = await supabase.from('materiels')
        .update({ available_qty: mat.availableQty + a.qty })
        .eq('id', materielId);
      if (updateErr) throw updateErr;

      toast.success("Retour enregistré !");
      fetchMateriels();
    } catch (err: any) {
      toast.error("Erreur lors du retour: " + err.message);
    }
  };`
  ]
];

processFile('src/app/Admin.tsx', adminReplacements);

console.log("normalization and replacement completed!");
