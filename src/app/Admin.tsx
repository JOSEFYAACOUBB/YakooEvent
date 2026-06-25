import { supabase } from "../supabaseClient";
import { useState, useRef, useEffect, createContext, useContext } from "react";
import {
  LayoutDashboard, CalendarCheck, Target, Package, MessageSquare,
  HelpCircle, FileEdit, Megaphone, BarChart2, Users, Settings,
  LogOut, Bell, Search, ChevronDown, Eye, Check, Trash2, X,
  Plus, Pencil, TrendingUp, TrendingDown, Star, DollarSign,
  Calendar, Activity, GripVertical, Upload, ChevronLeft,
  ChevronRight, Download, ToggleLeft, ToggleRight,
  Printer, Mail, AlertCircle, Lock, AtSign, EyeOff,
  CheckCircle2, XCircle, RefreshCw, BellOff, Wallet,
  ArrowUpRight, ArrowDownLeft, CreditCard, Receipt, PiggyBank,
  Banknote, TrendingDown as TrendDown, Filter,
  UserPlus, UserCheck, UserX, Shield, ShieldCheck, ShieldOff,
  Globe, Phone, MapPin, Clock, Key, Smartphone, Database,
  Save, Palette, Link, BellRing, Mail as MailIcon, MessageSquare as MsgIcon,
  Wifi, Server, HardDrive, RefreshCcw, ChevronUp, Info,
  Building, Image as ImageIcon, Sliders, CheckSquare, XSquare,
  BookOpen, Box, Tag, Layers, Wrench, PackageCheck, PackageX,
  Hash, Euro, CalendarDays, UserCircle, Briefcase, ClipboardList,
  PhoneCall, ExternalLink, Copy, CheckCheck,
  Ticket, Gift, Sparkles, Share2, Instagram, Facebook,
  Award, Crown, Zap, Heart, Star as StarIcon, ArrowRight,
  ChevronLeft as ChevLeft, ChevronRight as ChevRight,
  Clock as ClockIcon, Flag, MessageCircle, ThumbsUp, Send,
  RefreshCw as Refresh, Coins, Menu,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { toast, Toaster } from "sonner";

// ─── Translation System ───────────────────────────────────────────────────────
type Lang = "fr" | "ar";

const AR: Record<string, string> = {
  // Nav
  "Tableau de bord": "لوحة التحكم", "Réservations": "الحجوزات", "Gestion des Activités": "إدارة الأنشطة",
  "Packs & Tarifs": "الباقات والأسعار", "Avis Clients": "آراء العملاء", "FAQ": "الأسئلة الشائعة",
  "Contenu du site": "محتوى الموقع", "Sponsors": "الرعاة", "Statistiques": "الإحصائيات",
  "Utilisateurs": "المستخدمون", "Paramètres": "الإعدادات", "Gestion Financière": "الإدارة المالية",
  "Liste des Contacts": "قائمة جهات الاتصال", "Gestion des Matériels": "إدارة المعدات",
  "Calendrier de travail": "تقويم العمل", "Liste des Tâches": "قائمة المهام",
  "Tickets Support": "تذاكر الدعم", "Carte de Fidélité": "بطاقة الولاء",
  "Services Offerts": "الخدمات المقدمة", "Réseaux Sociaux": "وسائل التواصل الاجتماعي",
  "Finances": "المالية", "Contacts": "جهات الاتصال", "Matériels": "المعدات",
  "Calendrier": "التقويم", "Tâches": "المهام", "Fidélité": "الولاء", "Services": "الخدمات",
  "Agence Événementielle": "وكالة الأحداث", "Yakoo Events": "ياكو إيفنتس",
  // Common actions
  "Ajouter": "إضافة", "Modifier": "تعديل", "Supprimer": "حذف", "Enregistrer": "حفظ",
  "Annuler": "إلغاء", "Confirmer": "تأكيد", "Fermer": "إغلاق", "Créer": "إنشاء",
  "Rechercher...": "بحث...", "Exporter": "تصدير", "Enregistrer les modifications": "حفظ التغييرات",
  "Voir toutes →": "عرض الكل ←", "Voir toutes les réservations →": "عرض جميع الحجوزات ←",
  "Déconnexion": "تسجيل الخروج", "Se connecter": "تسجيل الدخول",
  "Connexion": "تسجيل الدخول", "Accédez à votre espace administrateur": "الوصول إلى لوحة الإدارة",
  "Accès démo": "وصول تجريبي", "Super Admin": "مدير عام",
  "Tout marquer lu": "تعليم الكل كمقروء", "Voir toutes les notifications": "عرض جميع الإشعارات",
  "Notifications": "الإشعارات", "Profil": "الملف الشخصي",
  // Common labels
  "Statut": "الحالة", "Date": "التاريخ", "Actions": "الإجراءات", "Nom": "الاسم",
  "Téléphone": "الهاتف", "Notes": "ملاحظات", "Description": "الوصف", "Tous": "الكل",
  "Actif": "نشط", "Inactif": "غير نشط", "Activité": "النشاط", "Client": "العميل",
  "Total": "المجموع", "Catégorie": "الفئة", "Pack": "الباقة", "Priorité": "الأولوية",
  "Aucune donnée trouvée": "لا توجد بيانات",
  // Status
  "Confirmée": "مؤكدة", "En attente": "قيد الانتظار", "Annulée": "ملغاة",
  "En cours": "جارٍ", "Terminé": "مكتمل", "Annulé": "ملغى", "À faire": "للقيام به",
  "Ouvert": "مفتوح", "Résolu": "محلول", "Fermé": "مغلق",
  "Publié": "منشور", "Haute": "عالية", "Moyenne": "متوسطة", "Basse": "منخفضة",
  "Excellent": "ممتاز", "Bon": "جيد", "Usagé": "مستعمل", "En réparation": "قيد الإصلاح",
  "Payé": "مدفوع",
  // Dashboard
  "Réservations du mois": "حجوزات الشهر", "Activités actives": "الأنشطة النشطة",
  "Revenus estimés": "الإيرادات المقدرة", "sur 22 disponibles": "من 22 متاحة",
  "Réservations par mois": "الحجوزات حسب الشهر", "Cette semaine": "هذا الأسبوع",
  "Ce mois": "هذا الشهر", "Cette année": "هذه السنة", "Personnalisé": "مخصص",
  "Réservations par catégorie": "الحجوزات حسب الفئة", "total": "المجموع",
  "Dernières Réservations": "آخر الحجوزات", "Activités les plus demandées": "الأنشطة الأكثر طلبًا",
  "Réservations récentes": "الحجوزات الأخيرة", "il y a 2h": "منذ ساعتين",
  "Aventure": "مغامرة", "Team Building": "بناء الفريق", "Hébergement": "إقامة",
  "Anniversaires": "أعياد الميلاد", "Formation": "تدريب",
  // Reservations
  "Gestion des Réservations": "إدارة الحجوزات", "Rechercher un client...": "بحث عن عميل...",
  "Toutes les activités": "جميع الأنشطة", "Exporter CSV": "تصدير CSV",
  "Nouvelle Réservation": "حجز جديد", "Créer manuellement une réservation": "إنشاء حجز يدويًا",
  "Informations client": "معلومات العميل", "Détails de la réservation": "تفاصيل الحجز",
  "Statut initial": "الحالة الأولية", "Créer la réservation": "إنشاء الحجز",
  "Nom complet": "الاسم الكامل", "Nombre de personnes": "عدد الأشخاص",
  "Date souhaitée": "التاريخ المطلوب", "Message du client": "رسالة العميل",
  "Informations supplémentaires...": "معلومات إضافية...",
  "Affichage": "عرض", "sur": "من", "Voir détail": "عرض التفاصيل",
  "Activité choisie": "النشاط المختار", "Pack sélectionné": "الباقة المختارة",
  "Date de soumission": "تاريخ التقديم", "Statut actuel": "الحالة الحالية",
  "Changer le statut": "تغيير الحالة", "Mettre à jour": "تحديث",
  "Envoyer confirmation": "إرسال التأكيد", "Imprimer": "طباعة",
  "Note interne": "ملاحظة داخلية", "Enregistrer la note": "حفظ الملاحظة",
  "Pers.": "أشخاص", "Reçu le": "تاريخ الاستلام",
  "Cette réservation sera supprimée définitivement. Cette action est irréversible.": "سيتم حذف هذا الحجز نهائيًا. هذا الإجراء لا يمكن التراجع عنه.",
  "Aucune réservation trouvée.": "لا توجد حجوزات.",
  "Impression en cours...": "جارٍ الطباعة...", "Note enregistrée !": "تم حفظ الملاحظة!",
  // Activities
  "Ajouter une activité": "إضافة نشاط", "Modifier l'activité": "تعديل النشاط",
  "Nouvelle activité": "نشاط جديد", "Nom de l'activité": "اسم النشاط",
  "Image principale": "الصورة الرئيسية", "Aucune activité dans cette catégorie.": "لا توجد أنشطة في هذه الفئة.",
  "Hébergement & Camping": "الإقامة والتخييم", "Scientifiques": "علمية",
  // Packs
  "Tarif groupe": "سعر المجموعة", "Prix (TND / personne)": "السعر (دينار / شخص)",
  "Taille min. du groupe": "الحد الأدنى لحجم المجموعة", "Durée": "المدة",
  "½ journée": "نصف يوم", "Journée complète": "يوم كامل", "Inclusions": "المشمولات",
  "Fonctionnalités": "الميزات", "Ajouter une fonctionnalité": "إضافة ميزة",
  "Statut actif": "الحالة النشطة", "Enregistrer ce pack": "حفظ هذه الباقة",
  "Accrobranche": "تسلق الأشجار", "Tyrolienne": "تيروليان", "Animation": "ترفيه",
  "Matériel": "معدات", "Encadrement": "إشراف",
  // Reviews
  "Note moyenne": "متوسط التقييم", "Total avis": "إجمالي الآراء",
  "Titre/Métier": "المسمى/المهنة", "Avis": "الرأي", "Note": "التقييم",
  // Finances
  "Revenus encaissés": "الإيرادات المحصلة", "Dépenses totales": "إجمالي المصروفات",
  "Bénéfice net": "صافي الربح", "Revenus vs Dépenses": "الإيرادات مقابل المصروفات",
  "Répartition dépenses": "توزيع المصروفات", "Transactions": "المعاملات",
  "Recettes": "إيرادات", "Dépenses": "مصروفات", "Libellé": "البيان", "Montant": "المبلغ",
  "Nouvelle Transaction": "معاملة جديدة", "Recette": "إيراد", "Dépense": "مصروف",
  "Taux remplissage": "نسبة الإشغال", "Revenus": "الإيرادات",
  "Salaires": "الرواتب", "Entretien": "صيانة", "Marketing": "تسويق", "Fournitures": "لوازم",
  "Autre": "أخرى", "Marquer payé": "تعليم كمدفوع",
  "Total recettes filtrées:": "إجمالي الإيرادات المصفاة:", "Total dépenses filtrées:": "إجمالي المصروفات المصفاة:",
  "Libellé et montant requis.": "البيان والمبلغ مطلوبان.",
  // Sponsors
  "Ajouter un sponsor": "إضافة راعٍ", "Niveau": "المستوى", "Or": "ذهب", "Argent": "فضة",
  "Bronze": "برونز", "Partenaire": "شريك", "Sponsor depuis": "راعٍ منذ",
  "Modifier le sponsor": "تعديل الراعي", "Nouveau sponsor": "راعٍ جديد",
  // Calendar
  "Sélectionnez un jour": "اختر يومًا", "Aucun événement": "لا توجد أحداث",
  "Ajouter un événement": "إضافة حدث", "Titre de l'événement": "عنوان الحدث",
  "CE MOIS": "هذا الشهر", "Rappel": "تذكير", "Événement": "حدث", "Tâche": "مهمة",
  "Cliquez sur un jour pour voir les événements": "انقر على يوم لرؤية الأحداث",
  // Tasks
  "Nouvelle tâche": "مهمة جديدة", "Titre *": "العنوان *", "Assigné à": "مُسند إلى",
  "Échéance": "تاريخ الاستحقاق", "En retard": "متأخرة", "Aucune tâche": "لا توجد مهام",
  "Supprimer cette tâche ?": "حذف هذه المهمة؟", "Titre requis.": "العنوان مطلوب.",
  // Tickets
  "Nouveau ticket": "تذكرة جديدة", "Sujet du ticket *": "موضوع التذكرة *",
  "Nom client *": "اسم العميل *", "Sujet": "الموضوع", "Mis à jour": "محدث",
  "Aucun message": "لا توجد رسائل", "Répondre...": "الرد...",
  "Réponse envoyée !": "تم إرسال الرد!", "Rechercher un ticket...": "بحث عن تذكرة...",
  "Sujet et client requis.": "الموضوع والعميل مطلوبان.",
  "Technique": "تقني", "Information": "معلومة", "Paiement": "دفع",
  // Loyalty
  "Membres actifs": "الأعضاء النشطون", "Points en circulation": "النقاط المتداولة",
  "Membres Platinum": "أعضاء بلاتينيوم", "Membres Gold": "أعضاء ذهبيون",
  "Niveaux de fidélité": "مستويات الولاء", "Membres du programme": "أعضاء البرنامج",
  "Points": "النقاط", "Dernière activité": "آخر نشاط",
  "+ Points": "+ نقاط", "Échanger": "استبدال", "Catalogue récompenses": "كتالوج المكافآت",
  "Ajouter des points": "إضافة نقاط", "Échanger des points": "استبدال النقاط",
  "Points à ajouter": "النقاط المضافة", "Raison": "السبب", "Nouveau solde :": "الرصيد الجديد:",
  "Parrainage": "إحالة", "Anniversaire": "عيد ميلاد", "Promotion": "ترقية", "Manuel": "يدوي",
  "Réduction 10%": "خصم 10%", "Activité offerte": "نشاط مجاني",
  "Pack Silver offert": "باقة فضية مجانية", "Weekend Aventure": "عطلة مغامرة",
  "Nombre de points invalide.": "عدد النقاط غير صالح.",
  // Services
  "Ajouter un service": "إضافة خدمة", "Modifier le service": "تعديل الخدمة",
  "Nouveau service": "خدمة جديدة", "Groupe min.": "الحد الأدنى للمجموعة",
  "Groupe max.": "الحد الأقصى للمجموعة", "Tags": "الوسوم", "Ajouter un tag...": "إضافة وسم...",
  "Nom requis.": "الاسم مطلوب.", "/ pers.": "/ شخص", "Groupe :": "المجموعة:",
  // Social
  "Instagram Business": "إنستغرام بزنس", "Connecté": "متصل", "Déconnecté": "غير متصل",
  "Abonnés": "المتابعون", "Publications": "المنشورات", "Portée moy.": "متوسط الوصول",
  "Reconnecter": "إعادة الاتصال", "Connecter Instagram": "ربط إنستغرام",
  "Facebook Page": "صفحة فيسبوك", "J'aime": "إعجابات", "Check-ins": "تسجيلات الحضور",
  "Connecter Facebook": "ربط فيسبوك",
  "Automatisation & Synchronisation": "الأتمتة والمزامنة",
  "Publication automatique": "نشر تلقائي", "Synchroniser les avis": "مزامنة الآراء",
  "Enregistrer la configuration": "حفظ الإعدادات",
  "Aperçu flux Instagram": "معاينة خلاصة إنستغرام", "Voir le profil": "عرض الملف الشخصي",
  "Composer une publication": "إنشاء منشور", "Rédigez votre publication...": "اكتب منشورك...",
  "Aperçu Facebook": "معاينة فيسبوك", "Publier maintenant": "نشر الآن", "Programmer": "جدولة",
  // Settings
  "Général": "عام", "Sécurité": "الأمان",
  "Apparence": "المظهر", "Intégrations": "التكاملات", "Sauvegardes": "النسخ الاحتياطية",
  "Informations du site": "معلومات الموقع", "Nom du site": "اسم الموقع",
  "Tagline / Slogan": "الشعار", "Langue par défaut": "اللغة الافتراضية",
  "Fuseau horaire": "المنطقة الزمنية", "Contact & localisation": "الاتصال والموقع",
  "Email de contact": "البريد الإلكتروني للتواصل", "Téléphone principal": "الهاتف الرئيسي",
  "Adresse physique": "العنوان الفعلي", "Horaires d'ouverture": "أوقات العمل",
  "Changer le mot de passe": "تغيير كلمة المرور", "Mot de passe actuel": "كلمة المرور الحالية",
  "Nouveau mot de passe": "كلمة المرور الجديدة",
  "Authentification à deux facteurs (2FA)": "المصادقة الثنائية",
  "Délai d'expiration de session": "مهلة انتهاء الجلسة",
  "Historique des connexions": "سجل تسجيلات الدخول",
  "Déconnecter toutes les sessions": "قطع جميع الجلسات",
  "Notifications par email": "إشعارات البريد الإلكتروني",
  "Rapport hebdomadaire": "تقرير أسبوعي", "Couleurs & thème": "الألوان والثيم",
  "Mode sombre": "الوضع الداكن", "Mode compact": "الوضع المضغوط",
  "Aperçu en temps réel": "معاينة في الوقت الفعلي", "Logo & médias": "الشعار والوسائط",
  "Appliquer le thème": "تطبيق الثيم", "Zone dangereuse": "منطقة خطرة",
  "Sauvegarde automatique": "نسخ احتياطي تلقائي", "Fréquence": "التكرار",
  "Lancer une sauvegarde maintenant": "بدء نسخ احتياطي الآن",
  "Historique des sauvegardes": "سجل النسخ الاحتياطية", "Succès": "ناجح", "Échec": "فاشل",
  // Users
  "Total utilisateurs": "إجمالي المستخدمين", "Administrateurs": "المديرون",
  "Actifs": "النشطون", "Suspendus": "الموقوفون",
  "Rechercher un utilisateur...": "بحث عن مستخدم...",
  "Nouvel utilisateur": "مستخدم جديد", "Modifier l'utilisateur": "تعديل المستخدم",
  "Matrice des rôles et permissions": "مصفوفة الأدوار والصلاحيات",
  "Jamais": "أبدًا", "Créé le": "تاريخ الإنشاء", "Dernière connexion": "آخر تسجيل دخول",
  "Admin": "مدير", "Éditeur": "محرر", "Modérateur": "مشرف", "Lecteur": "قارئ",
  // Contacts
  "Ajouter un contact": "إضافة جهة اتصال", "Modifier le contact": "تعديل جهة الاتصال",
  "Nouveau contact": "جهة اتصال جديدة", "Type de contact": "نوع جهة الاتصال",
  "Fournisseur": "مورد", "Moniteur": "مشرف", "Staff": "موظف",
  "Dernier contact :": "آخر تواصل:", "Aucun contact trouvé.": "لا توجد جهات اتصال.",
  // Materiels
  "Total articles": "إجمالي المقالات", "Disponibles": "متاح",
  "En location/usage": "في الإيجار", "Rechercher un matériel...": "بحث عن معدة...",
  "Ajouter un matériel": "إضافة معدة", "Modifier le matériel": "تعديل المعدة",
  "Nouveau matériel": "معدة جديدة", "N° de série": "الرقم التسلسلي",
  "Date d'achat": "تاريخ الشراء", "Emplacement de stockage": "موقع التخزين",
  "Attribuer le matériel": "تخصيص المعدة", "Attribué à": "مخصص لـ",
  "Quantité": "الكمية", "Date de retour prévue": "تاريخ الإرجاع المتوقع",
  "Estimation du coût": "تقدير التكلفة", "Confirmer l'attribution": "تأكيد التخصيص",
  "Retour": "إرجاع", "Disponibilité": "التوفر", "Attribuer": "تخصيص",
  "Aucune attribution active": "لا توجد تخصيصات نشطة",
  "Escalade": "تسلق", "Kayak": "كاياك", "Paintball": "بينتبول", "Camping": "تخييم",
  "Prix d'achat (TND)": "سعر الشراء (دينار)", "Prix de location (TND/jour)": "سعر الإيجار (دينار/يوم)",
  // FAQ / Content
  "Éditeur FAQ": "محرر الأسئلة الشائعة", "Ajouter une question": "إضافة سؤال",
  "Enregistrer la FAQ": "حفظ الأسئلة الشائعة", "Aucune question pour le moment.": "لا توجد أسئلة حاليًا.",
  "Éditeur Hero": "محرر الصفحة الرئيسية", "Titre principal": "العنوان الرئيسي",
  "Sous-titre": "العنوان الفرعي", "Image de fond": "صورة الخلفية",
  "Opacité overlay :": "عتامة التغطية:", "Aperçu mobile": "معاينة الجوال",
  "Éditeur À propos": "محرر قسم حول", "Mission": "المهمة",
  "Gestion des Témoignages": "إدارة الشهادات", "Éditeur Footer": "محرر التذييل",
  "Paramètres SEO": "إعدادات SEO", "Enregistrer SEO": "حفظ SEO",
  "Enregistrer Footer": "حفظ التذييل", "Hero": "الرئيسية", "À propos": "حول",
  "Témoignages": "الشهادات", "Footer": "التذييل",
  // General
  "Confirmer la suppression": "تأكيد الحذف",
};

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: (text: string) => string;
}
const LanguageContext = createContext<LangCtx>({
  lang: "fr", setLang: () => { },
  tr: (t) => t,
});
const useLang = () => useContext(LanguageContext);

type Page =
  | "dashboard" | "reservations" | "activities" | "packs"
  | "reviews" | "faq" | "content" | "sponsors" | "stats"
  | "users" | "settings" | "finances" | "contacts" | "materiel"
  | "calendar" | "tasks" | "tickets" | "loyalty" | "services" | "social";

type ReservationStatus = "Confirmée" | "En attente" | "Annulée";

interface Reservation {
  id: string; client: string; phone: string; activity: string;
  date: string; persons: number; pack: string;
  status: ReservationStatus; received: string;
}

interface Activity {
  id: string; title: string; category: string; description: string;
  image_url: string; duration?: string; min_age?: string;
  max_people?: number; highlights?: string[]; active?: boolean;
}

interface Review {
  id: number; name: string; job: string; review: string;
  rating: number; status: string; date: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialReservations: Reservation[] = [
  { id: "R-0042", client: "Karim Benali", phone: "+216 22 345 678", activity: "Accrobranche", date: "22 Jun 2025", persons: 12, pack: "Silver", status: "Confirmée", received: "15 Jun 2025" },
  { id: "R-0041", client: "Sonia Mrad", phone: "+216 55 987 654", activity: "Kayak", date: "25 Jun 2025", persons: 8, pack: "Bronze", status: "En attente", received: "14 Jun 2025" },
  { id: "R-0040", client: "Tarek Hamdi", phone: "+216 98 123 456", activity: "Paintball", date: "20 Jun 2025", persons: 20, pack: "Gold", status: "Confirmée", received: "13 Jun 2025" },
  { id: "R-0039", client: "Leila Zouari", phone: "+216 71 456 789", activity: "Team Building", date: "18 Jun 2025", persons: 30, pack: "Gold", status: "Annulée", received: "12 Jun 2025" },
  { id: "R-0038", client: "Mehdi Trabelsi", phone: "+216 29 654 321", activity: "Tyrolienne", date: "28 Jun 2025", persons: 6, pack: "Silver", status: "En attente", received: "11 Jun 2025" },
  { id: "R-0037", client: "Rania Cherif", phone: "+216 52 789 123", activity: "Anniversaire", date: "30 Jun 2025", persons: 15, pack: "Silver", status: "Confirmée", received: "10 Jun 2025" },
  { id: "R-0036", client: "Youssef Ben Amor", phone: "+216 98 321 654", activity: "Formation", date: "05 Jul 2025", persons: 25, pack: "Bronze", status: "En attente", received: "09 Jun 2025" },
  { id: "R-0035", client: "Amira Nasri", phone: "+216 55 123 987", activity: "Accrobranche", date: "08 Jul 2025", persons: 10, pack: "Bronze", status: "Confirmée", received: "08 Jun 2025" },
];

const initialActivities: Activity[] = [
  { id: 1, name: "Accrobranche Aventure", category: "Aventure", description: "Parcours acrobatiques dans les arbres pour tous niveaux, sensations fortes garanties.", image: "photo-1504280390367-361c6d9f38f4", active: true },
  { id: 2, name: "Kayak & Canoë", category: "Aventure", description: "Descentes en kayak sur rivières et lacs, activité eau vive pour groupes.", image: "photo-1544551763-46a013bb70d5", active: true },
  { id: 3, name: "Paintball Professionnel", category: "Aventure", description: "Terrain de paintball homologué avec équipement complet fourni.", image: "photo-1581578731548-c64695cc6952", active: true },
  { id: 4, name: "Team Building Corporate", category: "Team Building", description: "Activités de cohésion d'équipe sur mesure pour entreprises et groupes.", image: "photo-1542744173-8e7e53415bb0", active: true },
  { id: 5, name: "Tyrolienne & Zip-line", category: "Aventure", description: "Glissade sur câble avec vue panoramique, sensations de vol garanties.", image: "photo-1551632811-561732d1e306", active: true },
  { id: 6, name: "Hébergement Camping", category: "Hébergement & Camping", description: "Nuitées en pleine nature sous tentes équipées avec repas inclus.", image: "photo-1478131143081-80f7f84ca84d", active: false },
];

const initialReviews: Review[] = [
  { id: 1, name: "Sami Bourguiba", job: "Directeur RH, TechCorp", review: "Expérience extraordinaire pour notre team building annuel. L'équipe Yakoo a su créer une ambiance parfaite...", rating: 5, status: "Publié", date: "10 Jun 2025" },
  { id: 2, name: "Fatma Ben Youssef", job: "Étudiante", review: "Super journée d'accrobranche avec mes amis ! Le personnel est très professionnel et à l'écoute.", rating: 5, date: "08 Jun 2025", status: "Publié" },
  { id: 3, name: "Rachid Melliti", job: "Chef de projet", review: "Très bonne organisation. Le parcours tyrolienne est incroyable. Je recommande vivement.", rating: 4, date: "05 Jun 2025", status: "En attente" },
  { id: 4, name: "Nadia Khlifi", job: "Enseignante", review: "Journée parfaite pour l'anniversaire de mon fils. Tout était bien organisé et sécurisé.", rating: 5, date: "02 Jun 2025", status: "En attente" },
  { id: 5, name: "Khaled Ochi", job: "Manager", review: "Activité paintball au top ! Bon équipement, terrain varié. Seul bémol : un peu loin.", rating: 3, date: "28 Mai 2025", status: "Publié" },
];

const initialFaq = [
  { id: 1, question: "Quelles sont les activités disponibles pour les enfants ?", answer: "Nous proposons des activités adaptées dès 6 ans : accrobranche junior, kayak encadré, et animations d'anniversaire spécialement conçues pour les enfants avec nos moniteurs certifiés." },
  { id: 2, question: "Comment effectuer une réservation ?", answer: "Vous pouvez réserver en ligne via notre formulaire, par téléphone au +216 71 234 567, ou directement sur place. Un acompte de 30% est demandé pour confirmer votre réservation." },
  { id: 3, question: "Quelles sont les conditions d'annulation ?", answer: "Annulation gratuite jusqu'à 48h avant. Entre 24h et 48h, l'acompte est retenu. Moins de 24h, 100% du montant est dû. Des exceptions sont faites pour cause météo." },
  { id: 4, question: "Le matériel est-il fourni ?", answer: "Oui, tout le matériel de sécurité et d'équipement est fourni et vérifié régulièrement. Vous n'avez besoin que de vêtements confortables et de chaussures de sport fermées." },
];

const lineData = [
  { month: "Jan", current: 18, prev: 12 }, { month: "Fév", current: 24, prev: 18 },
  { month: "Mar", current: 32, prev: 22 }, { month: "Avr", current: 28, prev: 25 },
  { month: "Mai", current: 42, prev: 30 }, { month: "Jun", current: 48, prev: 35 },
  { month: "Jul", current: 38, prev: 40 }, { month: "Aoû", current: 55, prev: 42 },
  { month: "Sep", current: 44, prev: 38 }, { month: "Oct", current: 36, prev: 30 },
  { month: "Nov", current: 28, prev: 22 }, { month: "Déc", current: 22, prev: 18 },
];
const donutData = [
  { name: "Aventure", value: 30, color: "#F5A623" },
  { name: "Team Building", value: 25, color: "#1B2A4A" },
  { name: "Hébergement", value: 20, color: "#3B82F6" },
  { name: "Anniversaires", value: 15, color: "#22C55E" },
  { name: "Formation", value: 10, color: "#8B5CF6" },
];
const barData = [
  { name: "Accrobranche", value: 48 }, { name: "Kayak", value: 35 },
  { name: "Paintball", value: 29 }, { name: "Tyrolienne", value: 24 },
  { name: "Team Building", value: 20 },
];
const areaData = [
  { month: "Jan", reservations: 18 }, { month: "Fév", reservations: 24 },
  { month: "Mar", reservations: 32 }, { month: "Avr", reservations: 28 },
  { month: "Mai", reservations: 42 }, { month: "Jun", reservations: 48 },
  { month: "Jul", reservations: 38 }, { month: "Aoû", reservations: 55 },
  { month: "Sep", reservations: 44 }, { month: "Oct", reservations: 36 },
  { month: "Nov", reservations: 28 }, { month: "Déc", reservations: 22 },
];
const revenueData = [
  { month: "Jan", revenue: 4200 }, { month: "Fév", revenue: 5800 },
  { month: "Mar", revenue: 7200 }, { month: "Avr", revenue: 6400 },
  { month: "Mai", revenue: 9800 }, { month: "Jun", revenue: 12400 },
  { month: "Jul", revenue: 8600 }, { month: "Aoû", revenue: 13200 },
  { month: "Sep", revenue: 10400 }, { month: "Oct", revenue: 8100 },
  { month: "Nov", revenue: 6300 }, { month: "Déc", revenue: 5100 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReservationStatus }) {
  const map: Record<ReservationStatus, string> = {
    "Confirmée": "bg-green-50 text-green-700 border border-green-200",
    "En attente": "bg-amber-50 text-amber-700 border border-amber-200",
    "Annulée": "bg-red-50 text-red-700 border border-red-200",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[status]}`}>{status}</span>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] ${className}`}>{children}</div>;
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}
const avatarColors = ["#1B2A4A", "#3B82F6", "#8B5CF6", "#22C55E", "#F5A623", "#EF4444"];
function avatarColor(name: string) { return avatarColors[name.charCodeAt(0) % avatarColors.length]; }

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }: {
  message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.1)" }}>
          <AlertCircle size={24} style={{ color: "#EF4444" }} />
        </div>
        <h3 className="text-base font-semibold text-center mb-2" style={{ color: "#1B2A4A" }}>Confirmer la suppression</h3>
        <p className="text-sm text-center mb-6" style={{ color: "#6B7A99" }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>Annuler</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 text-sm font-medium rounded-lg text-white" style={{ background: "#EF4444" }}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const { lang, setLang, tr } = useLang();
  const isAr = lang === "ar";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Veuillez remplir tous les champs."); return; }
    setLoading(true);

    try {
      // Authenticate with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;

      if (data?.user) {
        // Fetch from admin_users by email to verify if this user is a registered admin
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("role, status")
          .eq("email", data.user.email)
          .single();

        if (adminError || !adminUser || adminUser.status !== "Actif") {
          await supabase.auth.signOut();
          throw new Error("Accès refusé. Compte administrateur actif requis.");
        }

        toast.success("Bienvenue, Admin Yakoo !");
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || "Email ou mot de passe incorrect.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ fontFamily: isAr ? "'Noto Sans Arabic', sans-serif" : "Inter, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      {/* Language selector on login */}
      <div className="absolute top-5 right-5 z-20 flex gap-1 rounded-lg overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
        {(["fr", "ar"] as Lang[]).map(l => (
          <button key={l} onClick={() => setLang(l)} className="px-3 py-1.5 text-xs font-bold transition-colors" style={{ background: lang === l ? "rgba(245,166,35,0.9)" : "rgba(255,255,255,0.1)", color: lang === l ? "#0F1C30" : "rgba(255,255,255,0.8)" }}>
            {l === "fr" ? "FR" : "AR"}
          </button>
        ))}
      </div>
      {/* Full-bleed background */}
      <img
        src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&h=1000&fit=crop&auto=format"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay — dark navy left, fades right */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(10,18,32,0.98) 0%, rgba(15,28,48,0.92) 45%, rgba(27,42,74,0.75) 100%)" }} />

      {/* Decorative gold diagonal strip */}
      <div className="absolute top-0 right-0 w-1 h-full opacity-60" style={{ background: "linear-gradient(to bottom, transparent, #F5A623, transparent)" }} />

      {/* Main content — brand left + form right */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex items-center gap-16 lg:gap-24">

        {/* Right — form card */}
        <div className="w-full lg:w-[420px] flex-shrink-0 mx-auto">
          <div className="rounded-3xl p-8 backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.96)", boxShadow: "0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15)" }}>

            <div className="mb-7">
              <h2 className="text-2xl font-black mb-1.5" style={{ color: "#0F1C30", letterSpacing: "-0.5px" }}>{tr("Connexion")}</h2>
              <p className="text-sm" style={{ color: "#6B7A99" }}>{tr("Accédez à votre espace administrateur")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: "#1B2A4A" }}>Email</label>
                <div className="relative">
                  <AtSign size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focused === "email" ? "#F5A623" : "#9CA3AF" }} />
                  <input
                    type="email"
                    value={email}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="admin@yakoo.tn"
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl outline-none transition-all"
                    style={{
                      background: focused === "email" ? "white" : "#F8F9FC",
                      border: error ? "2px solid #EF4444" : focused === "email" ? "2px solid #F5A623" : "2px solid transparent",
                      color: "#1B2A4A",
                      boxShadow: focused === "email" ? "0 0 0 4px rgba(245,166,35,0.1)" : "none",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: "#1B2A4A" }}>Mot de passe</label>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: focused === "pass" ? "#F5A623" : "#9CA3AF" }} />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused(null)}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 text-sm rounded-xl outline-none transition-all"
                    style={{
                      background: focused === "pass" ? "white" : "#F8F9FC",
                      border: error ? "2px solid #EF4444" : focused === "pass" ? "2px solid #F5A623" : "2px solid transparent",
                      color: "#1B2A4A",
                      boxShadow: focused === "pass" ? "0 0 0 4px rgba(245,166,35,0.1)" : "none",
                    }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    {showPass ? <EyeOff size={15} style={{ color: "#9CA3AF" }} /> : <Eye size={15} style={{ color: "#9CA3AF" }} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1.5px solid rgba(239,68,68,0.2)" }}>
                  <AlertCircle size={15} style={{ color: "#EF4444", flexShrink: 0 }} />
                  <span className="text-xs font-medium" style={{ color: "#DC2626" }}>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-sm font-black rounded-xl transition-all hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2.5 mt-2"
                style={{ background: loading ? "#F5A623" : "linear-gradient(135deg, #F5A623, #E8920F)", color: "#0F1C30", boxShadow: loading ? "none" : "0 8px 24px rgba(245,166,35,0.35)", letterSpacing: "0.2px" }}
              >
                {loading
                  ? <><RefreshCw size={15} className="animate-spin" /> {isAr ? "جارٍ التحقق..." : "Vérification..."}</>
                  : <><Lock size={15} /> {tr("Se connecter")}</>}
              </button>
            </form>

            <p className="text-center text-xs mt-5" style={{ color: "#9CA3AF" }}>
              © 2025 Yakoo Events — Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const navItems: { icon: React.ReactNode; label: string; page: Page; badge?: number }[] = [
  { icon: <LayoutDashboard size={18} />, label: "Tableau de bord", page: "dashboard" },
  { icon: <CalendarCheck size={18} />, label: "Réservations", page: "reservations", badge: 12 },
  { icon: <Target size={18} />, label: "Activités", page: "activities" },
  { icon: <Package size={18} />, label: "Packs & Tarifs", page: "packs" },
  { icon: <MessageSquare size={18} />, label: "Avis Clients", page: "reviews" },
  { icon: <HelpCircle size={18} />, label: "FAQ", page: "faq" },
  { icon: <FileEdit size={18} />, label: "Contenu du site", page: "content" },
  { icon: <Megaphone size={18} />, label: "Sponsors", page: "sponsors" },
  { icon: <BarChart2 size={18} />, label: "Statistiques", page: "stats" },
  { icon: <Wallet size={18} />, label: "Finances", page: "finances" },
  { icon: <Users size={18} />, label: "Utilisateurs", page: "users" },
  { icon: <BookOpen size={18} />, label: "Contacts", page: "contacts" },
  { icon: <Box size={18} />, label: "Matériels", page: "materiel" },
  { icon: <CalendarDays size={18} />, label: "Événements", page: "calendar" },
  { icon: <CheckSquare size={18} />, label: "Tâches", page: "tasks" },
  { icon: <Ticket size={18} />, label: "Tickets Support", page: "tickets" },
  { icon: <Gift size={18} />, label: "Fidélité", page: "loyalty" },
  { icon: <Sparkles size={18} />, label: "Services", page: "services" },
  { icon: <Share2 size={18} />, label: "Réseaux Sociaux", page: "social" },
  { icon: <Settings size={18} />, label: "Paramètres", page: "settings" },
];

function Sidebar({ activePage, onNavigate, onLogout, isOpen, onClose }: {
  activePage: Page; onNavigate: (p: Page) => void; onLogout: () => void;
  isOpen: boolean; onClose: () => void;
}) {
  const { lang, tr } = useLang();
  const isAr = lang === "ar";
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      <aside
        style={{
          background: "#0F1C30",
          width: 260,
          minHeight: "100vh",
          fontFamily: isAr ? "'Noto Sans Arabic', sans-serif" : "Inter, sans-serif"
        }}
        className={`flex flex-col fixed top-0 bottom-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isAr
            ? `right-0 ${isOpen ? "translate-x-0" : "translate-x-full"}`
            : `left-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
        }`}
      >
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: "#F5A623", color: "#0F1C30" }}>YE</div>
            <div>
              <div className="font-bold text-white text-sm leading-tight">Yakoo Events</div>
              <div className="text-xs" style={{ color: "#F5A623" }}>Agence Événementielle</div>
            </div>
          </div>
          {/* Close button for mobile screens */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center lg:hidden hover:bg-white/10 text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mx-4 mb-4 rounded-lg px-3 py-3" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm" style={{ background: "#F5A623", color: "#0F1C30" }}>AY</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">Admin Yakoo</div>
              <div className="text-xs px-2 py-0.5 rounded-full inline-block mt-0.5" style={{ background: "rgba(245,166,35,0.2)", color: "#F5A623" }}>{tr("Super Admin")}</div>
            </div>
          </div>
        </div>
        <div className="h-px mx-4 mb-3" style={{ background: "rgba(255,255,255,0.08)" }} />
        <nav className="flex-1 px-3 overflow-y-auto">
          {navItems.map(item => {
            const active = activePage === item.page;
            return (
              <button key={item.page} onClick={() => { onNavigate(item.page); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-all duration-150"
                style={{ background: active ? "rgba(245,166,35,0.12)" : "transparent", borderLeft: active ? "3px solid #F5A623" : "3px solid transparent", color: active ? "#F5A623" : "rgba(255,255,255,0.65)" }}>
                <span style={{ color: active ? "#F5A623" : "rgba(255,255,255,0.5)" }}>{item.icon}</span>
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge && <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ background: "#F5A623", color: "#0F1C30" }}>{item.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-4">
          <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.08)" }} />
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm hover:bg-red-500/10"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            <LogOut size={18} /><span>{tr("Déconnexion")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
const pageTitles: Record<Page, string> = {
  dashboard: "Tableau de bord", reservations: "Réservations",
  activities: "Gestion des Activités", packs: "Packs & Tarifs",
  reviews: "Avis Clients", faq: "FAQ", content: "Contenu du site",
  sponsors: "Sponsors", stats: "Statistiques", users: "Utilisateurs",
  settings: "Paramètres", finances: "Gestion Financière",
  contacts: "Liste des Contacts", materiel: "Gestion des Matériels",
  calendar: "Calendrier de travail", tasks: "Liste des Tâches",
  tickets: "Tickets Support", loyalty: "Carte de Fidélité",
  services: "Services Offerts", social: "Réseaux Sociaux",
};

function Header({ page, onNavigate, onLogout, onToggleSidebar }: { page: Page; onNavigate: (p: Page) => void; onLogout: () => void; onToggleSidebar: () => void }) {
  const { lang, setLang, tr } = useLang();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState([
    { id: 1, text: "Nouvelle réservation de Karim Benali", time: "il y a 5 min", read: false },
    { id: 2, text: "Avis client en attente de modération", time: "il y a 1h", read: false },
    { id: 3, text: "Réservation R-0041 à confirmer", time: "il y a 2h", read: false },
  ]);

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <header className="h-16 flex items-center px-6 gap-4 sticky top-0 z-20 bg-white border-b" style={{ borderColor: "rgba(27,42,74,0.08)", fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar mobile toggle */}
      <button
        onClick={onToggleSidebar}
        className="w-9 h-9 rounded-lg flex items-center justify-center lg:hidden hover:bg-gray-100 mr-2 flex-shrink-0"
        aria-label="Toggle navigation menu"
      >
        <Menu size={20} style={{ color: "#1B2A4A" }} />
      </button>
      <h1 className="text-base font-semibold flex-1 truncate" style={{ color: "#1B2A4A" }}>{pageTitles[page]}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7A99" }} />
          <input placeholder="Rechercher..." className="pl-9 pr-4 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", color: "#1B2A4A", width: 200, border: "none" }} />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#F0F2F5" }}>
            <Bell size={17} style={{ color: "#1B2A4A" }} />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: "#EF4444", color: "white", fontSize: 10 }}>{unreadCount}</span>}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-xl z-50 overflow-hidden" style={{ background: "white", border: "1px solid rgba(27,42,74,0.1)" }}>
              <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
                <span className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>Notifications</span>
                <button onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))} className="text-xs" style={{ color: "#F5A623" }}>Tout marquer lu</button>
              </div>
              {notifs.map(n => (
                <div key={n.id} className="px-4 py-3 flex gap-3 hover:bg-gray-50 cursor-pointer border-b" style={{ borderColor: "rgba(27,42,74,0.05)", background: n.read ? "white" : "rgba(245,166,35,0.04)" }} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.read ? "transparent" : "#F5A623" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed" style={{ color: "#1B2A4A", fontWeight: n.read ? 400 : 500 }}>{n.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5 text-center">
                <button className="text-xs font-medium" style={{ color: "#6B7A99" }}>Voir toutes les notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Lang toggle */}
        <div className="flex text-xs font-medium rounded-lg overflow-hidden border" style={{ borderColor: "rgba(27,42,74,0.15)" }}>
          {(["fr", "ar"] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)} className="px-2.5 py-1.5 transition-colors"
              style={{ background: lang === l ? "#1B2A4A" : "white", color: lang === l ? "white" : "#6B7A99" }}>
              {l === "fr" ? "FR" : "AR"}
            </button>
          ))}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
            style={{ background: showProfile ? "#F0F2F5" : "transparent" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#F5A623", color: "#0F1C30" }}>AY</div>
            <ChevronDown size={14} style={{ color: "#6B7A99" }} />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-xl shadow-lg py-2 z-50" style={{ background: "white", border: "1px solid rgba(27,42,74,0.1)" }}>
              <button onClick={() => { setShowProfile(false); toast.info("Page profil en cours de développement."); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors" style={{ color: "#1B2A4A" }}>Profil</button>
              <button onClick={() => { setShowProfile(false); onNavigate("settings"); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors" style={{ color: "#1B2A4A" }}>Paramètres</button>
              <div className="h-px mx-3 my-1" style={{ background: "rgba(27,42,74,0.08)" }} />
              <button onClick={() => { setShowProfile(false); onLogout(); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors" style={{ color: "#EF4444" }}>Déconnexion</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({ title, value, sub, icon, iconBg, trend }: {
  title: string; value: string; sub?: string;
  icon: React.ReactNode; iconBg: string; trend?: { val: string; up: boolean };
}) {
  return (
    <Card className="p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>{icon}</div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: trend.up ? "#22C55E" : "#EF4444" }}>
            {trend.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{trend.val}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: "#1B2A4A" }}>{value}</div>
      <div className="text-sm font-medium mb-0.5" style={{ color: "#1B2A4A" }}>{title}</div>
      {sub && <div className="text-xs" style={{ color: "#6B7A99" }}>{sub}</div>}
    </Card>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
function DashboardPage({ reservations, onNavigate, onConfirm, onDelete }: {
  reservations: Reservation[];
  onNavigate: (p: Page) => void;
  onConfirm: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [period, setPeriod] = useState("Cette année");
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  // ── Real-data KPIs ──────────────────────────────────────────────────────
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-based
  const currentYear = now.getFullYear();

  // Parse fr-FR date strings like "25/06/2025" into Date objects
  const parseDate = (s: string): Date => {
    if (!s) return new Date(0);
    // Try ISO format first (YYYY-MM-DD or similar)
    const iso = new Date(s);
    if (!isNaN(iso.getTime()) && s.includes('-')) return iso;
    // Try DD/MM/YYYY format
    const parts = s.split('/');
    if (parts.length === 3) {
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
    return new Date(s);
  };

  const thisMonthReservations = reservations.filter(r => {
    const d = parseDate(r.received);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonthReservations = reservations.filter(r => {
    const d = parseDate(r.received);
    const lm = currentMonth === 0 ? 11 : currentMonth - 1;
    const ly = currentMonth === 0 ? currentYear - 1 : currentYear;
    return d.getMonth() === lm && d.getFullYear() === ly;
  });

  const monthCount = thisMonthReservations.length;
  const lastMonthCount = lastMonthReservations.length;
  const monthTrend = lastMonthCount > 0
    ? Math.round(((monthCount - lastMonthCount) / lastMonthCount) * 100)
    : 0;

  // ── Monthly chart data from real reservations ───────────────────────────
  const FR_MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  const monthlyData = FR_MONTHS.map((month, i) => {
    const current = reservations.filter(r => {
      const d = parseDate(r.received);
      return d.getMonth() === i && d.getFullYear() === currentYear;
    }).length;
    const prev = reservations.filter(r => {
      const d = parseDate(r.received);
      return d.getMonth() === i && d.getFullYear() === currentYear - 1;
    }).length;
    return { month, current, prev };
  });

  // ── Category breakdown from real reservations ───────────────────────────
  const CATEGORY_COLORS: Record<string, string> = {
    "Accrobranche": "#F5A623", "Kayak": "#3B82F6", "Paintball": "#EF4444",
    "Tyrolienne": "#22C55E", "Team Building": "#8B5CF6", "Anniversaire": "#EC4899",
    "Formation": "#14B8A6", "Hébergement": "#F97316",
  };
  const categoryCounts: Record<string, number> = {};
  reservations.forEach(r => {
    const cat = r.activity || "Autre";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const totalReservations = reservations.length;
  const categoryData = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      value: totalReservations > 0 ? Math.round((count / totalReservations) * 100) : 0,
      color: CATEGORY_COLORS[name] || "#6B7A99",
    }));

  // ── Top activities from real reservations ───────────────────────────────
  const topActivities = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const maxTopValue = topActivities.length > 0 ? Math.max(...topActivities.map(a => a.value)) : 1;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Réservations du mois" value={String(monthCount)} iconBg="rgba(245,166,35,0.1)" icon={<Calendar size={22} style={{ color: "#F5A623" }} />} trend={lastMonthCount > 0 ? { val: `${monthTrend > 0 ? "+" : ""}${monthTrend}%`, up: monthTrend >= 0 } : undefined} />
        <KPICard title="Total réservations" value={String(totalReservations)} sub={`${Object.keys(categoryCounts).length} activité(s)`} iconBg="rgba(20,184,166,0.1)" icon={<Activity size={22} style={{ color: "#14B8A6" }} />} />
        <KPICard title="En attente" value={String(reservations.filter(r => r.status === "En attente").length)} sub="à confirmer" iconBg="rgba(245,166,35,0.1)" icon={<DollarSign size={22} style={{ color: "#F5A623" }} />} />
        <KPICard title="Confirmées" value={String(reservations.filter(r => r.status === "Confirmée").length)} sub={`/ ${totalReservations} total`} iconBg="rgba(139,92,246,0.1)" icon={<Star size={22} style={{ color: "#8B5CF6" }} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Réservations par mois</h3>
            <select value={period} onChange={e => setPeriod(e.target.value)} className="text-xs px-3 py-1.5 rounded-lg outline-none" style={{ background: "#F0F2F5", color: "#1B2A4A", border: "none" }}>
              {["Cette semaine", "Ce mois", "Cette année"].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7A99" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7A99" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid rgba(27,42,74,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="current" name={String(currentYear)} stroke="#F5A623" strokeWidth={2.5} dot={{ r: 3, fill: "#F5A623" }} />
              <Line type="monotone" dataKey="prev" name={String(currentYear - 1)} stroke="#1B2A4A" strokeWidth={2} strokeDasharray="5 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="lg:col-span-2 p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Réservations par catégorie</h3>
          <div className="flex items-center justify-center mb-3">
            <div className="relative">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={categoryData.length > 0 ? categoryData : [{ name: "Aucune", value: 1, color: "#E5E7EB" }]} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                    {(categoryData.length > 0 ? categoryData : [{ name: "Aucune", value: 1, color: "#E5E7EB" }]).map(d => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-xl font-bold" style={{ color: "#1B2A4A" }}>{totalReservations}</div>
                <div className="text-xs" style={{ color: "#6B7A99" }}>total</div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {categoryData.length > 0 ? categoryData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} /><span style={{ color: "#6B7A99" }}>{d.name}</span></div>
                <span className="font-semibold" style={{ color: "#1B2A4A" }}>{d.value}%</span>
              </div>
            )) : <p className="text-xs text-center" style={{ color: "#6B7A99" }}>Aucune donnée</p>}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
            <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Dernières Réservations</h3>
            <button onClick={() => onNavigate("reservations")} className="text-xs font-medium transition-opacity hover:opacity-70" style={{ color: "#F5A623" }}>Voir toutes →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#F8F9FB" }}>
                  {["#ID", "Client", "Activité", "Date", "Pers.", "Statut", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#6B7A99" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.slice(0, 5).map(r => (
                  <tr key={r.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
                    <td className="px-4 py-3 text-xs font-mono font-medium" style={{ color: "#6B7A99" }}>{r.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ background: avatarColor(r.client) }}>{initials(r.client)}</div>
                        <span className="text-xs font-medium" style={{ color: "#1B2A4A" }}>{r.client}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#6B7A99" }}>{r.activity}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#6B7A99" }}>{r.date}</td>
                    <td className="px-4 py-3 text-xs font-medium text-center" style={{ color: "#1B2A4A" }}>{r.persons}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedRes(r)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"><Eye size={13} style={{ color: "#3B82F6" }} /></button>
                        <button onClick={() => onConfirm(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-green-50 transition-colors"><Check size={13} style={{ color: "#22C55E" }} /></button>
                        <button onClick={() => onDelete(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"><Trash2 size={13} style={{ color: "#EF4444" }} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Activités les plus demandées</h3>
            <div className="space-y-3">
              {topActivities.length > 0 ? topActivities.map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1"><span style={{ color: "#1B2A4A" }}>{item.name}</span><span className="font-semibold" style={{ color: "#F5A623" }}>{item.value} rés.</span></div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}><div className="h-full rounded-full" style={{ width: `${(item.value / maxTopValue) * 100}%`, background: "#F5A623" }} /></div>
                </div>
              )) : <p className="text-xs" style={{ color: "#6B7A99" }}>Aucune donnée</p>}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3" style={{ color: "#1B2A4A" }}>Réservations récentes</h3>
            <div className="space-y-3">
              {reservations.slice(0, 3).map(r => (
                <div key={r.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ background: avatarColor(r.client) }}>{initials(r.client)}</div>
                  <div className="flex-1 min-w-0"><div className="text-xs font-medium truncate" style={{ color: "#1B2A4A" }}>{r.client}</div><div className="text-xs truncate" style={{ color: "#6B7A99" }}>{r.activity}</div></div>
                  <span className="text-xs whitespace-nowrap" style={{ color: "#6B7A99" }}>il y a 2h</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick detail panel from dashboard */}
      {selectedRes && (
        <div className="fixed inset-0 z-40 flex justify-end" style={{ fontFamily: "Inter, sans-serif" }}>
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedRes(null)} />
          <div className="relative w-[380px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <span className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Réservation {selectedRes.id}</span>
              <button onClick={() => setSelectedRes(null)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={15} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#F0F2F5" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: avatarColor(selectedRes.client) }}>{initials(selectedRes.client)}</div>
                <div><div className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>{selectedRes.client}</div><div className="text-xs" style={{ color: "#6B7A99" }}>{selectedRes.phone}</div></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[["Activité", selectedRes.activity], ["Date", selectedRes.date], ["Personnes", String(selectedRes.persons)], ["Pack", selectedRes.pack]].map(([l, v]) => (
                  <div key={l} className="p-3 rounded-lg" style={{ background: "#F8F9FB" }}>
                    <div className="text-xs mb-1" style={{ color: "#6B7A99" }}>{l}</div>
                    <div className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div><StatusBadge status={selectedRes.status} /></div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { onConfirm(selectedRes.id); setSelectedRes(null); }} className="flex-1 py-2.5 text-sm font-medium rounded-lg text-white" style={{ background: "#22C55E" }}>Confirmer</button>
                <button onClick={() => { onDelete(selectedRes.id); setSelectedRes(null); }} className="flex-1 py-2.5 text-sm font-medium rounded-lg text-white" style={{ background: "#EF4444" }}>Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Reservations Page ────────────────────────────────────────────────────────
const emptyForm = { client: "", phone: "", email: "", activity: "Accrobranche", date: "", persons: 1, pack: "Bronze" as "Bronze" | "Silver" | "Gold", message: "", status: "En attente" as ReservationStatus };

function ReservationsPage({ reservations, onConfirm, onCancel, onDelete, onUpdateStatus, onAdd }: {
  reservations: Reservation[];
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: ReservationStatus) => void;
  onAdd: (r: Reservation) => void;
}) {
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [newStatus, setNewStatus] = useState<ReservationStatus>("En attente");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  const validateAdd = () => {
    const errs: Record<string, string> = {};
    if (!addForm.client.trim()) errs.client = "Nom requis";
    if (!addForm.phone.trim()) errs.phone = "Téléphone requis";
    if (!addForm.date) errs.date = "Date requise";
    if (addForm.persons < 1) errs.persons = "Min. 1 personne";
    return errs;
  };

  const handleAdd = () => {
    const errs = validateAdd();
    if (Object.keys(errs).length) { setAddErrors(errs); return; }
    const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    const id = `R-${String(reservations.length + 43).padStart(4, "0")}`;
    const dateFormatted = addForm.date
      ? new Date(addForm.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "";
    onAdd({
      id,
      client: addForm.client,
      phone: addForm.phone,
      activity: addForm.activity,
      date: dateFormatted,
      persons: addForm.persons,
      pack: addForm.pack,
      status: addForm.status,
      received: today,
    });
    setAddForm(emptyForm);
    setAddErrors({});
    setShowAddModal(false);
    toast.success(`Réservation ${id} créée pour ${addForm.client} !`);
  };
  const perPage = 5;

  useEffect(() => {
    if (selected) setNewStatus(selected.status);
  }, [selected]);

  const filtered = reservations.filter(r => {
    const matchSearch = r.client.toLowerCase().includes(search.toLowerCase()) || r.activity.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Tous" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const pending = reservations.filter(r => r.status === "En attente").length;
  const confirmed = reservations.filter(r => r.status === "Confirmée").length;
  const cancelled = reservations.filter(r => r.status === "Annulée").length;

  return (
    <div className="space-y-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "En attente", val: pending, color: "#F59E0B", bg: "#FEF3C7" },
          { label: "Confirmées", val: confirmed, color: "#16A34A", bg: "#DCFCE7" },
          { label: "Annulées", val: cancelled, color: "#DC2626", bg: "#FEE2E2" },
          { label: "Total", val: reservations.length, color: "#1B2A4A", bg: "#E8EBF0" },
        ].map(s => (
          <div key={s.label} className="rounded-[10px] px-4 py-3 flex items-center gap-3" style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: s.bg, color: s.color }}>{s.val}</div>
            <span className="text-sm font-medium" style={{ color: "#6B7A99" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7A99" }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Rechercher un client..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
            {["Tous", "En attente", "Confirmée", "Annulée"].map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="px-3 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
            <option>Toutes les activités</option>
            {["Accrobranche", "Kayak", "Paintball", "Tyrolienne", "Team Building"].map(a => <option key={a}>{a}</option>)}
          </select>
          <button onClick={() => toast.success("Export CSV généré avec succès !")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors hover:bg-amber-50" style={{ borderColor: "#F5A623", color: "#F5A623" }}>
            <Download size={14} /> Exporter CSV
          </button>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white flex-shrink-0" style={{ background: "#1B2A4A" }}>
            <Plus size={14} /> Ajouter
          </button>
        </div>
      </Card>

      {/* Add Reservation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ fontFamily: "Inter, sans-serif" }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="px-6 py-5 border-b flex items-center justify-between sticky top-0 bg-white z-10" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <div>
                <h2 className="font-bold text-base" style={{ color: "#1B2A4A" }}>Nouvelle Réservation</h2>
                <p className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>Créer manuellement une réservation</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Client info */}
              <div className="pb-3 mb-1 border-b" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#6B7A99" }}>Informations client</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Nom complet <span style={{ color: "#EF4444" }}>*</span></label>
                    <input value={addForm.client} onChange={e => { setAddForm(f => ({ ...f, client: e.target.value })); setAddErrors(er => ({ ...er, client: "" })); }}
                      className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Karim Benali"
                      style={{ background: addErrors.client ? "rgba(239,68,68,0.05)" : "#F0F2F5", border: addErrors.client ? "1.5px solid #EF4444" : "1.5px solid transparent", color: "#1B2A4A" }} />
                    {addErrors.client && <p className="text-xs mt-0.5" style={{ color: "#EF4444" }}>{addErrors.client}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Téléphone <span style={{ color: "#EF4444" }}>*</span></label>
                    <input value={addForm.phone} onChange={e => { setAddForm(f => ({ ...f, phone: e.target.value })); setAddErrors(er => ({ ...er, phone: "" })); }}
                      className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="+216 XX XXX XXX"
                      style={{ background: addErrors.phone ? "rgba(239,68,68,0.05)" : "#F0F2F5", border: addErrors.phone ? "1.5px solid #EF4444" : "1.5px solid transparent", color: "#1B2A4A" }} />
                    {addErrors.phone && <p className="text-xs mt-0.5" style={{ color: "#EF4444" }}>{addErrors.phone}</p>}
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Email</label>
                  <input value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="client@email.com"
                    style={{ background: "#F0F2F5", border: "1.5px solid transparent", color: "#1B2A4A" }} />
                </div>
              </div>

              {/* Reservation details */}
              <div className="pb-3 mb-1 border-b" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#6B7A99" }}>Détails de la réservation</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Activité</label>
                    <select value={addForm.activity} onChange={e => setAddForm(f => ({ ...f, activity: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "1.5px solid transparent", color: "#1B2A4A" }}>
                      {["Accrobranche", "Kayak", "Paintball", "Tyrolienne", "Team Building", "Formation", "Anniversaire", "Hébergement"].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Pack</label>
                    <select value={addForm.pack} onChange={e => setAddForm(f => ({ ...f, pack: e.target.value as "Bronze" | "Silver" | "Gold" }))}
                      className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "1.5px solid transparent", color: "#1B2A4A" }}>
                      {["Bronze", "Silver", "Gold"].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Date souhaitée <span style={{ color: "#EF4444" }}>*</span></label>
                    <input type="date" value={addForm.date} onChange={e => { setAddForm(f => ({ ...f, date: e.target.value })); setAddErrors(er => ({ ...er, date: "" })); }}
                      className="w-full px-3 py-2.5 text-sm rounded-lg outline-none"
                      style={{ background: addErrors.date ? "rgba(239,68,68,0.05)" : "#F0F2F5", border: addErrors.date ? "1.5px solid #EF4444" : "1.5px solid transparent", color: "#1B2A4A" }} />
                    {addErrors.date && <p className="text-xs mt-0.5" style={{ color: "#EF4444" }}>{addErrors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Nombre de personnes <span style={{ color: "#EF4444" }}>*</span></label>
                    <input type="number" min={1} value={addForm.persons} onChange={e => { setAddForm(f => ({ ...f, persons: Number(e.target.value) })); setAddErrors(er => ({ ...er, persons: "" })); }}
                      className="w-full px-3 py-2.5 text-sm rounded-lg outline-none"
                      style={{ background: addErrors.persons ? "rgba(239,68,68,0.05)" : "#F0F2F5", border: addErrors.persons ? "1.5px solid #EF4444" : "1.5px solid transparent", color: "#1B2A4A" }} />
                    {addErrors.persons && <p className="text-xs mt-0.5" style={{ color: "#EF4444" }}>{addErrors.persons}</p>}
                  </div>
                </div>
              </div>

              {/* Status + message */}
              <div>
                <div className="mb-3">
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Statut initial</label>
                  <div className="flex gap-2">
                    {(["En attente", "Confirmée", "Annulée"] as ReservationStatus[]).map(s => (
                      <button key={s} onClick={() => setAddForm(f => ({ ...f, status: s }))}
                        className="flex-1 py-2 text-xs font-medium rounded-lg transition-colors"
                        style={{ background: addForm.status === s ? (s === "Confirmée" ? "#22C55E" : s === "Annulée" ? "#EF4444" : "#F5A623") : "#F0F2F5", color: addForm.status === s ? "white" : "#6B7A99" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Message du client</label>
                  <textarea value={addForm.message} onChange={e => setAddForm(f => ({ ...f, message: e.target.value }))}
                    rows={3} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none"
                    placeholder="Informations supplémentaires..." style={{ background: "#F0F2F5", border: "1.5px solid transparent", color: "#1B2A4A" }} />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3 justify-end sticky bottom-0 bg-white" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>Annuler</button>
              <button onClick={handleAdd} className="px-5 py-2.5 text-sm font-bold rounded-lg text-white flex items-center gap-2" style={{ background: "#1B2A4A" }}>
                <Plus size={14} /> Créer la réservation
              </button>
            </div>
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#F8F9FB" }}>
                {["#", "Client", "Téléphone", "Activité", "Date", "Pers.", "Pack", "Statut", "Reçu le", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: "#6B7A99" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-sm" style={{ color: "#6B7A99" }}>Aucune réservation trouvée.</td></tr>
              ) : paged.map(r => (
                <tr key={r.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
                  <td className="px-4 py-3 text-xs font-mono font-medium" style={{ color: "#6B7A99" }}>{r.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ background: avatarColor(r.client) }}>{initials(r.client)}</div>
                      <span className="text-xs font-medium whitespace-nowrap" style={{ color: "#1B2A4A" }}>{r.client}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#6B7A99" }}>{r.phone}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#1B2A4A" }}>{r.activity}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#6B7A99" }}>{r.date}</td>
                  <td className="px-4 py-3 text-xs text-center font-medium" style={{ color: "#1B2A4A" }}>{r.persons}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: r.pack === "Gold" ? "rgba(245,166,35,0.1)" : r.pack === "Silver" ? "rgba(107,122,153,0.1)" : "rgba(180,120,60,0.1)", color: r.pack === "Gold" ? "#D97706" : r.pack === "Silver" ? "#4B5563" : "#7C5C3A" }}>{r.pack}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#6B7A99" }}>{r.received}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(r)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors" title="Voir détail"><Eye size={13} style={{ color: "#3B82F6" }} /></button>
                      <button onClick={() => onConfirm(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-green-50 transition-colors" title="Confirmer"><Check size={13} style={{ color: "#22C55E" }} /></button>
                      <button onClick={() => onCancel(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-amber-50 transition-colors" title="Annuler"><X size={13} style={{ color: "#F59E0B" }} /></button>
                      <button onClick={() => setConfirmDelete(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors" title="Supprimer"><Trash2 size={13} style={{ color: "#EF4444" }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 flex items-center justify-between border-t" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
          <span className="text-xs" style={{ color: "#6B7A99" }}>Affichage {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} sur {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40 hover:bg-gray-100 transition-colors"><ChevronLeft size={15} style={{ color: "#1B2A4A" }} /></button>
            {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setCurrentPage(n)} className="w-8 h-8 rounded-lg text-xs font-medium transition-colors" style={{ background: n === currentPage ? "#1B2A4A" : "transparent", color: n === currentPage ? "white" : "#6B7A99" }}>{n}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40 hover:bg-gray-100 transition-colors"><ChevronRight size={15} style={{ color: "#1B2A4A" }} /></button>
          </div>
        </div>
      </Card>

      {/* Delete confirm */}
      {confirmDelete && (
        <ConfirmDialog
          message="Cette réservation sera supprimée définitivement. Cette action est irréversible."
          onConfirm={() => { onDelete(confirmDelete); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end" style={{ fontFamily: "Inter, sans-serif" }}>
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="relative w-[420px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <h2 className="font-semibold text-base" style={{ color: "#1B2A4A" }}>Réservation {selected.id}</h2>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="p-6 space-y-5 flex-1">
              <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: "#F0F2F5" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: avatarColor(selected.client) }}>{initials(selected.client)}</div>
                <div>
                  <div className="font-semibold" style={{ color: "#1B2A4A" }}>{selected.client}</div>
                  <div className="text-sm" style={{ color: "#6B7A99" }}>{selected.phone}</div>
                  <div className="text-sm" style={{ color: "#6B7A99" }}>client@email.com</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[["Activité", selected.activity], ["Date souhaitée", selected.date], ["Nombre de personnes", String(selected.persons)], ["Pack sélectionné", selected.pack], ["Date de soumission", selected.received], ["Statut actuel", selected.status]].map(([label, val]) => (
                  <div key={label} className="rounded-lg p-3" style={{ background: "#F8F9FB" }}>
                    <div className="text-xs mb-1" style={{ color: "#6B7A99" }}>{label}</div>
                    <div className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>{val}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-medium mb-2" style={{ color: "#6B7A99" }}>Message du client</div>
                <div className="text-sm p-3 rounded-lg" style={{ background: "#F8F9FB", color: "#1B2A4A" }}>
                  Bonjour, je souhaite organiser un événement pour notre équipe de {selected.persons} personnes. Merci de confirmer la disponibilité.
                </div>
              </div>
              <div>
                <div className="text-xs font-medium mb-2" style={{ color: "#6B7A99" }}>Changer le statut</div>
                <div className="flex gap-2">
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value as ReservationStatus)} className="flex-1 px-3 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                    <option>En attente</option><option>Confirmée</option><option>Annulée</option>
                  </select>
                  <button onClick={() => { onUpdateStatus(selected.id, newStatus); setSelected(null); }} className="px-4 py-2 text-sm font-medium rounded-lg text-white" style={{ background: "#1B2A4A" }}>Mettre à jour</button>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.success(`Email de confirmation envoyé à ${selected.client} !`)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg border" style={{ borderColor: "rgba(27,42,74,0.15)", color: "#1B2A4A" }}>
                  <Mail size={14} /> Envoyer confirmation
                </button>
                <button onClick={() => toast.info("Impression en cours...")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg border" style={{ borderColor: "rgba(27,42,74,0.15)", color: "#1B2A4A" }}>
                  <Printer size={14} /> Imprimer
                </button>
              </div>
              <div>
                <div className="text-xs font-medium mb-2" style={{ color: "#6B7A99" }}>Note interne</div>
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Ajouter une note interne..." className="w-full p-3 text-sm rounded-lg resize-none outline-none" rows={3} style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                <button onClick={() => { toast.success("Note enregistrée !"); }} className="mt-2 px-4 py-2 text-sm font-medium rounded-lg text-white" style={{ background: "#1B2A4A" }}>Enregistrer la note</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Activities Page ───────────────────────────────────────────────────────────
function ActivitiesPage() {
  const [tab, setTab] = useState("Tous");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", category: "Aventure", description: "", image_url: "", duration: "", min_age: "", max_people: 0, highlights: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      const { data, error } = await supabase.from('activities').select('*');
      if (!error && data) {
        setActivities(data);
      }
      setLoading(false);
    };
    fetchActivities();
  }, []);

  const tabs = ["Tous", "Aventure", "Team Building", "Hébergement & Camping", "Formation", "Anniversaires", "Scientifiques", "Centre de formation"];
  const filtered = tab === "Tous" ? activities : activities.filter(a => a.category === tab);
  const categoryColors: Record<string, string> = { "Aventure": "#F5A623", "Team Building": "#3B82F6", "Hébergement & Camping": "#22C55E", "Formation": "#8B5CF6", "Anniversaires": "#EF4444", "Scientifiques": "#a78bfa", "Centre de formation": "#e879f9" };

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", category: "Aventure", description: "", image_url: "", duration: "", min_age: "", max_people: 0, highlights: "" });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (act: Activity) => {
    setEditing(act);
    setForm({
      title: act.title,
      category: act.category,
      description: act.description || "",
      image_url: act.image_url || "",
      duration: act.duration || "",
      min_age: act.min_age || "",
      max_people: act.max_people || 0,
      highlights: (act.highlights || []).join(", "),
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Le nom de l'activité est requis."); return; }
    if (!form.image_url.trim() && !imageFile) { toast.error("L'image est requise."); return; }

    setIsUploading(true);
    let finalImageUrl = form.image_url;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `activities/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);

      if (uploadError) {
        toast.error("Erreur lors de l'upload de l'image: " + uploadError.message);
        setIsUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
      finalImageUrl = publicUrlData.publicUrl;
    }

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      image_url: finalImageUrl,
      duration: form.duration || null,
      min_age: form.min_age || null,
      max_people: form.max_people || null,
      highlights: form.highlights ? form.highlights.split(",").map(h => h.trim()).filter(Boolean) : [],
    };

    if (editing) {
      const { error } = await supabase.from('activities').update(payload).eq('id', editing.id);
      if (!error) {
        setActivities(prev => prev.map(a => a.id === editing.id ? { ...a, ...payload } : a));
        toast.success(`Activité "${form.title}" mise à jour !`);
        setShowModal(false);
      } else {
        toast.error("Erreur lors de la mise à jour: " + error.message);
      }
    } else {
      const { data, error } = await supabase.from('activities').insert(payload).select().single();
      if (!error && data) {
        setActivities(prev => [...prev, data]);
        toast.success(`Activité "${form.title}" ajoutée !`);
        setShowModal(false);
      } else {
        toast.error("Erreur lors de l'ajout: " + (error?.message || ""));
      }
    }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (!error) {
      setActivities(prev => prev.filter(a => a.id !== id));
      setConfirmDelete(null);
      toast.success("Activité supprimée.");
    } else {
      toast.error("Erreur de suppression");
    }
  };

  return (
    <div className="space-y-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 flex-wrap">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
              style={{ background: tab === t ? "#1B2A4A" : "white", color: tab === t ? "white" : "#6B7A99", boxShadow: tab === t ? "none" : "0 2px 8px rgba(0,0,0,0.06)" }}>{t}</button>
          ))}
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
          <Plus size={15} /> Ajouter une activité
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle size={32} className="mb-3" style={{ color: "#B8C0D0" }} />
          <p className="text-sm" style={{ color: "#6B7A99" }}>Aucune activité dans cette catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(act => (
            <Card key={act.id} className="overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow">
              <div className="relative h-44 bg-gray-100">
                <img src={act.image_url || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=176&fit=crop"} alt={act.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold" style={{ background: categoryColors[act.category] || "#1B2A4A", color: "white" }}>{act.category}</div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-1" style={{ color: "#1B2A4A" }}>{act.title}</h4>
                <p className="text-xs leading-relaxed line-clamp-2 mb-2" style={{ color: "#6B7A99" }}>{act.description}</p>
                <div className="flex items-center gap-3 text-[10px] mb-3" style={{ color: "#9BA3AF" }}>
                  {act.duration && <span>⏱ {act.duration}</span>}
                  {act.min_age && <span>👤 {act.min_age}</span>}
                  {act.max_people && <span>👥 Max {act.max_people}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(act)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors hover:bg-gray-50"><Pencil size={12} /> Modifier</button>
                  <button onClick={() => setConfirmDelete(act.id)} className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"><Trash2 size={13} style={{ color: "#EF4444" }} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {confirmDelete !== null && (
        <ConfirmDialog
          message="Supprimer cette activité ? Cette action est irréversible."
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ fontFamily: "Inter, sans-serif" }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => !isUploading && setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-base">{editing ? "Modifier l'activité" : "Nouvelle activité"}</h2>
              <button onClick={() => !isUploading && setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100" disabled={isUploading}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Nom de l'activité <span style={{ color: "#EF4444" }}>*</span></label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} disabled={isUploading} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none focus:ring-2 focus:ring-amber-400" style={{ background: "#F0F2F5" }} placeholder="Ex: Accrobranche Aventure" />
              </div>
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Catégorie</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} disabled={isUploading} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5" }}>
                  {["Aventure", "Team Building", "Hébergement & Camping", "Formation", "Anniversaires", "Scientifiques", "Centre de formation"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {/* Description */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} disabled={isUploading} rows={3} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none" style={{ background: "#F0F2F5" }} placeholder="Décrivez l'activité en quelques lignes..." />
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Image de l'activité <span style={{ color: "#EF4444" }}>*</span></label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} disabled={isUploading} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5" }} />

                {(imageFile || form.image_url) && (
                  <div className="mt-2 rounded-lg overflow-hidden h-32 bg-gray-100">
                    <img src={imageFile ? URL.createObjectURL(imageFile) : form.image_url} alt="Aperçu" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                  </div>
                )}
              </div>
              {/* Duration + Min Age + Max People (row) */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Durée</label>
                  <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} disabled={isUploading} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5" }} placeholder="2–3 heures" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Âge min</label>
                  <input value={form.min_age} onChange={e => setForm(f => ({ ...f, min_age: e.target.value }))} disabled={isUploading} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5" }} placeholder="6 ans" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Max personnes</label>
                  <input type="number" value={form.max_people || ""} onChange={e => setForm(f => ({ ...f, max_people: parseInt(e.target.value) || 0 }))} disabled={isUploading} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5" }} placeholder="10" />
                </div>
              </div>
              {/* Highlights */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Points forts <span className="font-normal" style={{ color: "#6B7A99" }}>(séparés par des virgules)</span></label>
                <input value={form.highlights} onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))} disabled={isUploading} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5" }} placeholder="Équipements fournis, Encadrement certifié, Assurance incluse" />
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3 justify-end sticky bottom-0 bg-white" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <button onClick={() => setShowModal(false)} disabled={isUploading} className="px-5 py-2 text-sm font-medium rounded-lg disabled:opacity-50" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>Annuler</button>
              <button onClick={handleSave} disabled={isUploading} className="px-5 py-2 text-sm font-medium rounded-lg text-white flex items-center gap-2 disabled:opacity-50" style={{ background: "#F5A623", color: "#0F1C30" }}>
                {isUploading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PacksPage() {
  const [packStates, setPackStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPackForm, setNewPackForm] = useState({ tier: "", tagline: "", selectedActivities: [] as string[], price: 0, games_count: 0, badge: "" });

  const ACTIVITIES_LIST = [
    "Accrobranche", "Tyrolienne", "Kayak", "Paintball",
    "Mur d'escalade", "Tir à l'arc", "Team Building", "Séminaire",
    "Geo-searching", "Billards Japonais", "Twister Géant", "Jeu d'équilibre",
    "Atelier Robotique", "Jeux des fléchettes", "Jeux de labyrinthe", "Animation",
    "Camping", "Jeu d'entonnoire", "Jeu d'écrou"
  ];

  // Mapping styling based on pack name since it's hardcoded on the UI side
  const packStyles: Record<string, any> = {
    "SILVER": { emoji: "🥈", color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.25)" },
    "GOLD": { emoji: "🥇", color: "#F5A623", bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.35)" },
    "PLATINUM": { emoji: "💎", color: "#3B82F6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.35)" },
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
          { tier: "SILVER", tagline: "L'essentiel pour s'amuser", price: 150, games_count: 3, badge: "", features: [{ label: "3 jeux de team building", included: true }, { label: "Photographe", included: false }] },
          { tier: "GOLD", tagline: "L'expérience complète", price: 250, games_count: 5, badge: "POPULAIRE", features: [{ label: "5 jeux de team building", included: true }, { label: "Photographe", included: true }] },
          { tier: "PLATINUM", tagline: "Le sur-mesure absolu", price: 400, games_count: 8, badge: "PREMIUM", features: [{ label: "8 jeux de team building", included: true }, { label: "Photographe", included: true }] }
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
    setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, features: p.features.map((f: any, fi: number) => fi === featIdx ? { ...f, label: val } : f) } : p));
  };
  const toggleFeatureIncluded = (packIdx: number, featIdx: number) => {
    setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, features: p.features.map((f: any, fi: number) => fi === featIdx ? { ...f, included: !f.included } : f) } : p));
  };
  const addFeature = (packIdx: number) => {
    setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, features: [...p.features, { label: "Nouvelle fonctionnalité", included: true }] } : p));
  };
  const removeFeature = (packIdx: number, featIdx: number) => {
    setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, features: p.features.filter((_: any, fi: number) => fi !== featIdx) } : p));
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
      toast.success(`Pack ${pack.tier} enregistré avec succès !`);
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
      setNewPackForm({ tier: "", tagline: "", selectedActivities: [], price: 0, games_count: 0, badge: "" });
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
                <label className="block text-xs font-semibold mb-2" style={{ color: "#6B7A99" }}>Types d'activités incluses</label>
                <div className="grid grid-cols-2 gap-1.5 p-3 rounded-lg" style={{ background: "#F0F2F5" }}>
                  {ACTIVITIES_LIST.map(act => {
                    const selected = (pack.description || "").split(" + ").filter(Boolean).includes(act);
                    return (
                      <label key={act} className="flex items-center gap-2 text-xs cursor-pointer rounded-md px-2 py-1.5 transition-colors" style={{ background: selected ? pack.style.color + "25" : "transparent", color: selected ? pack.style.color : "#6B7A99", fontWeight: selected ? 600 : 400 }}>
                        <input type="checkbox" checked={selected} onChange={() => {
                          const current = (pack.description || "").split(" + ").filter(Boolean);
                          const updated = selected ? current.filter((a) => a !== act) : [...current, act];
                          setPackStates(prev => prev.map((p, i) => i === packIdx ? { ...p, description: updated.join(" + ") } : p));
                        }} style={{ accentColor: pack.style.color }} />
                        {act}
                      </label>
                    );
                  })}
                </div>
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
                <input value={newPackForm.tier} onChange={e => setNewPackForm({ ...newPackForm, tier: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} placeholder="Nom..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Prix initial (TND)</label>
                  <input type="number" value={newPackForm.price || ""} onChange={e => setNewPackForm({ ...newPackForm, price: Number(e.target.value) })} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} placeholder="Prix..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Nombre de jeux</label>
                  <input type="number" value={newPackForm.games_count || ""} onChange={e => setNewPackForm({ ...newPackForm, games_count: Number(e.target.value) })} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} placeholder="Jeux..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Slogan / Tagline (courte phrase)</label>
                <input value={newPackForm.tagline} onChange={e => setNewPackForm({ ...newPackForm, tagline: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} placeholder="Slogan..." />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Badge (ex: PREMIUM, optionnel)</label>
                <input value={newPackForm.badge} onChange={e => setNewPackForm({ ...newPackForm, badge: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} placeholder="Badge..." />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "#6B7A99" }}>Types d'activités incluses</label>
                <div className="grid grid-cols-2 gap-1.5 p-3 rounded-lg" style={{ background: "#F0F2F5" }}>
                  {ACTIVITIES_LIST.map(act => {
                    const selected = newPackForm.selectedActivities.includes(act);
                    return (
                      <label key={act} className="flex items-center gap-2 text-xs cursor-pointer rounded-md px-2 py-1.5 transition-colors" style={{ background: selected ? "rgba(245,166,35,0.15)" : "transparent", color: selected ? "#F5A623" : "#6B7A99", fontWeight: selected ? 600 : 400 }}>
                        <input type="checkbox" checked={selected} onChange={() => {
                          const updated = selected
                            ? newPackForm.selectedActivities.filter(a => a !== act)
                            : [...newPackForm.selectedActivities, act];
                          setNewPackForm({ ...newPackForm, selectedActivities: updated });
                        }} style={{ accentColor: "#F5A623" }} />
                        {act}
                      </label>
                    );
                  })}
                </div>
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


function ContentPage() {
  const [tab, setTab] = useState("Hero");
  const [loading, setLoading] = useState(true);
  const [heroTitle, setHeroTitle] = useState("VIVEZ SAUVAGE ET LIBRE");
  const [heroSub, setHeroSub] = useState("STAGE ADRÉNALINE !");
  const [heroCta1Text, setHeroCta1Text] = useState("Réserver maintenant");
  const [heroCta1Url, setHeroCta1Url] = useState("#reservation");
  const [heroCta2Text, setHeroCta2Text] = useState("Voir nos activités");
  const [heroCta2Url, setHeroCta2Url] = useState("#activites");
  const [overlay, setOverlay] = useState(60);

  // About
  const [aboutMission, setAboutMission] = useState("Yakoo Events est une agence événementielle spécialisée dans les activités de plein air, le team building et les aventures en nature.");
  const [aboutVision, setAboutVision] = useState('"Créer des expériences qui transcendent le quotidien et forgent des liens durables."');

  // Footer
  const [footerTagline, setFooterTagline] = useState("Vivez l'aventure, forgez les souvenirs.");
  const [footerPhone, setFooterPhone] = useState("+216 71 790 501");
  const [footerEmail, setFooterEmail] = useState("promoscout.contact@gmail.com");
  const [footerAddress, setFooterAddress] = useState("Avenue Jugurtha, Tunis, Tunisie");
  const [footerFacebook, setFooterFacebook] = useState("facebook.com/yakooevents");
  const [footerInstagram, setFooterInstagram] = useState("instagram.com/yakooevents");
  const [footerYoutube, setFooterYoutube] = useState("youtube.com/@yakooevents");

  // SEO
  const [seoTitle, setSeoTitle] = useState("Yakoo Events — Agence Événementielle Aventure Tunisie");
  const [seoDescription, setSeoDescription] = useState("Vivez des aventures inoubliables avec Yakoo Events. Accrobranche, kayak, paintball, team building et hébergement en Tunisie. Réservez dès maintenant !");

  const tabs = ["Hero", "À propos", "Témoignages", "Footer", "SEO"];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase.from('site_content').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const contentMap = {};
        data.forEach((row: any) => {
          contentMap[row.key_name] = row.content_value;
        });

        if (contentMap['hero_title']) setHeroTitle(contentMap['hero_title']);
        if (contentMap['hero_subtitle']) setHeroSub(contentMap['hero_subtitle']);
        if (contentMap['hero_cta1_text']) setHeroCta1Text(contentMap['hero_cta1_text']);
        if (contentMap['hero_cta1_url']) setHeroCta1Url(contentMap['hero_cta1_url']);
        if (contentMap['hero_cta2_text']) setHeroCta2Text(contentMap['hero_cta2_text']);
        if (contentMap['hero_cta2_url']) setHeroCta2Url(contentMap['hero_cta2_url']);
        if (contentMap['hero_overlay']) setOverlay(Number(contentMap['hero_overlay']));

        if (contentMap['about_mission']) setAboutMission(contentMap['about_mission']);
        if (contentMap['about_vision']) setAboutVision(contentMap['about_vision']);

        if (contentMap['footer_tagline']) setFooterTagline(contentMap['footer_tagline']);
        if (contentMap['footer_phone']) setFooterPhone(contentMap['footer_phone']);
        if (contentMap['footer_email']) setFooterEmail(contentMap['footer_email']);
        if (contentMap['footer_address']) setFooterAddress(contentMap['footer_address']);
        if (contentMap['footer_facebook']) setFooterFacebook(contentMap['footer_facebook']);
        if (contentMap['footer_instagram']) setFooterInstagram(contentMap['footer_instagram']);
        if (contentMap['footer_youtube']) setFooterYoutube(contentMap['footer_youtube']);

        if (contentMap['seo_title']) setSeoTitle(contentMap['seo_title']);
        if (contentMap['seo_description']) setSeoDescription(contentMap['seo_description']);
      }
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKeys = async (keys: Record<string, string>) => {
    try {
      const payloads = Object.entries(keys).map(([key, val]) => ({
        key_name: key,
        content_value: String(val),
        description: "Géré via l'éditeur d'administration"
      }));
      const { error } = await supabase.from('site_content').upsert(payloads, { onConflict: 'key_name' });
      if (error) throw error;
      toast.success("Contenu enregistré avec succès !");
      fetchContent();
    } catch (e: any) {
      toast.error("Erreur lors de l'enregistrement: " + e.message);
    }
  };

  return (
    <div className="space-y-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex gap-1 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ background: tab === t ? "#1B2A4A" : "white", color: tab === t ? "white" : "#6B7A99", boxShadow: tab === t ? "none" : "0 2px 8px rgba(0,0,0,0.06)" }}>{t}</button>
        ))}
      </div>

      {tab === "Hero" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Éditeur Hero</h3>
            <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Titre principal</label><input value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
            <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Sous-titre</label><input value={heroSub} onChange={e => setHeroSub(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>CTA 1 — Texte</label><input value={heroCta1Text} onChange={e => setHeroCta1Text(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
              <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>CTA 1 — URL</label><input value={heroCta1Url} onChange={e => setHeroCta1Url(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
              <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>CTA 2 — Texte</label><input value={heroCta2Text} onChange={e => setHeroCta2Text(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
              <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>CTA 2 — URL</label><input value={heroCta2Url} onChange={e => setHeroCta2Url(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Image de fond</label>
              <div className="rounded-xl border-2 border-dashed p-4 text-center cursor-pointer hover:bg-amber-50 transition-colors" style={{ borderColor: "rgba(245,166,35,0.4)" }} onClick={() => toast.info("Upload disponible en production.")}>
                <Upload size={18} className="mx-auto mb-1" style={{ color: "#F5A623" }} />
                <p className="text-xs" style={{ color: "#6B7A99" }}>Glissez une image ici</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#6B7A99" }}>Opacité overlay : {overlay}%</label>
              <input type="range" min={0} max={80} value={overlay} onChange={e => setOverlay(Number(e.target.value))} className="w-full" style={{ accentColor: "#F5A623" }} />
            </div>
            <button onClick={() => handleSaveKeys({
              hero_title: heroTitle,
              hero_subtitle: heroSub,
              hero_cta1_text: heroCta1Text,
              hero_cta1_url: heroCta1Url,
              hero_cta2_text: heroCta2Text,
              hero_cta2_url: heroCta2Url,
              hero_overlay: String(overlay)
            })}
              className="w-full py-2.5 text-sm font-semibold rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
              Enregistrer les modifications
            </button>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Aperçu mobile</h3>
            <div className="mx-auto w-[260px] h-[520px] rounded-[28px] overflow-hidden relative" style={{ border: "8px solid #1B2A4A", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
              <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=260&h=520&fit=crop&auto=format" alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-5" style={{ background: `rgba(15,28,48,${overlay / 100})` }}>
                <div className="text-lg font-black text-center mb-1 leading-tight" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{heroTitle}</div>
                <div className="text-xs font-bold mb-5" style={{ color: "#F5A623" }}>{heroSub}</div>
                <button className="px-4 py-1.5 rounded-full text-xs font-bold mb-2" style={{ background: "#F5A623", color: "#0F1C30" }}>{heroCta1Text}</button>
                <button className="px-4 py-1.5 rounded-full text-xs font-bold border border-white">{heroCta2Text}</button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === "FAQ" && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Éditeur FAQ</h3>
            <button onClick={() => toast.info("Gérez la FAQ dans l'onglet FAQ autonome.")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
              Aller à la FAQ autonome
            </button>
          </div>
          <p className="text-xs" style={{ color: "#6B7A99" }}>Veuillez utiliser l'onglet FAQ de l'administration pour configurer la FAQ.</p>
        </Card>
      )}

      {tab === "SEO" && (
        <Card className="p-5 max-w-2xl space-y-4">
          <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Paramètres SEO</h3>
          <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Titre de la page (Google)</label><input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Meta description <span style={{ color: seoDescription.length > 160 ? "#EF4444" : "#6B7A99" }}>({seoDescription.length}/160)</span></label>
            <textarea rows={3} value={seoDescription} onChange={e => setSeoDescription(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none" style={{ background: "#F0F2F5", border: seoDescription.length > 160 ? "1.5px solid #EF4444" : "none", color: "#1B2A4A" }} />
          </div>
          <button onClick={() => handleSaveKeys({
            seo_title: seoTitle,
            seo_description: seoDescription
          })}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
            Enregistrer SEO
          </button>
        </Card>
      )}

      {tab === "Footer" && (
        <Card className="p-5 max-w-2xl space-y-4">
          <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Éditeur Footer</h3>
          <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Tagline</label><input value={footerTagline} onChange={e => setFooterTagline(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
          <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Téléphone</label><input value={footerPhone} onChange={e => setFooterPhone(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
          <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Email</label><input value={footerEmail} onChange={e => setFooterEmail(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
          <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Adresse</label><input value={footerAddress} onChange={e => setFooterAddress(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Facebook</label><input value={footerFacebook} onChange={e => setFooterFacebook(e.target.value)} className="w-full px-3 py-2.5 text-xs rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
            <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Instagram</label><input value={footerInstagram} onChange={e => setFooterInstagram(e.target.value)} className="w-full px-3 py-2.5 text-xs rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
            <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>YouTube</label><input value={footerYoutube} onChange={e => setFooterYoutube(e.target.value)} className="w-full px-3 py-2.5 text-xs rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
          </div>
          <button onClick={() => handleSaveKeys({
            footer_tagline: footerTagline,
            footer_phone: footerPhone,
            footer_email: footerEmail,
            footer_address: footerAddress,
            footer_facebook: footerFacebook,
            footer_instagram: footerInstagram,
            footer_youtube: footerYoutube
          })}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
            Enregistrer Footer
          </button>
        </Card>
      )}

      {tab === "À propos" && (
        <Card className="p-5 max-w-2xl space-y-4">
          <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Éditeur À propos</h3>
          <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Mission</label><textarea rows={3} value={aboutMission} onChange={e => setAboutMission(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
          <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7A99" }}>Citation vision</label><textarea rows={2} value={aboutVision} onChange={e => setAboutVision(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
          <button onClick={() => handleSaveKeys({
            about_mission: aboutMission,
            about_vision: aboutVision
          })}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
            Enregistrer
          </button>
        </Card>
      )}

      {tab === "Témoignages" && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Gestion des Témoignages</h3>
            <button onClick={() => toast.info("Formulaire d'ajout disponible dans l'onglet Avis Clients.")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
              <Plus size={14} /> Ajouter
            </button>
          </div>
          <div className="space-y-3">
            {initialReviews.slice(0, 3).map(r => (
              <div key={r.id} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: "#F8F9FB" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: avatarColor(r.name) }}>{initials(r.name)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1"><span className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>{r.name}</span><span className="text-xs" style={{ color: "#6B7A99" }}>{r.job}</span><div className="flex gap-0.5 ml-1">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={11} fill="#F5A623" color="#F5A623" />)}</div></div>
                  <p className="text-xs leading-relaxed truncate" style={{ color: "#6B7A99" }}>{r.review}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50"><Pencil size={12} style={{ color: "#3B82F6" }} /></button>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 size={12} style={{ color: "#EF4444" }} /></button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Reviews Page ──────────────────────────────────────────────────────────────
function ReviewsPage() {
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
      const { data: inserted } = await supabase.from('reviews').insert(initialReviews.map(({ id, ...rest }) => rest)).select();
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

  if (loading) return <div className="text-center py-10">Chargement...</div>;
  return (
    <div className="space-y-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Note moyenne", val: `${avg} ⭐`, color: "#F5A623" },
          { label: "Total avis", val: String(reviews.length), color: "#1B2A4A" },
          { label: "En attente", val: String(pending), color: "#D97706" },
          { label: "Publiés", val: String(published), color: "#16A34A" },
        ].map(s => (
          <Card key={s.label} className="px-5 py-4">
            <div className="text-xl font-bold mb-1" style={{ color: s.color }}>{s.val}</div>
            <div className="text-xs font-medium" style={{ color: "#6B7A99" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#F8F9FB" }}>
                {["Client", "Titre/Métier", "Avis", "Note", "Statut", "Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#6B7A99" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ background: avatarColor(r.name) }}>{initials(r.name)}</div>
                      <span className="text-xs font-medium whitespace-nowrap" style={{ color: "#1B2A4A" }}>{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#6B7A99" }}>{r.job}</td>
                  <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: "#6B7A99" }}>{r.review}</td>
                  <td className="px-4 py-3"><div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill={i < r.rating ? "#F5A623" : "#E8EBF0"} color={i < r.rating ? "#F5A623" : "#E8EBF0"} />)}</div></td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${r.status === "Publié" ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#6B7A99" }}>{r.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {r.status === "En attente" && <button onClick={() => publish(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-green-50" title="Publier"><Check size={13} style={{ color: "#22C55E" }} /></button>}
                      <button onClick={() => setViewItem(r)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50" title="Voir"><Eye size={13} style={{ color: "#3B82F6" }} /></button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50" title="Modifier" onClick={() => toast.info("Éditeur d'avis en cours de développement.")}><Pencil size={13} style={{ color: "#3B82F6" }} /></button>
                      <button onClick={() => setConfirmDelete(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50" title="Supprimer"><Trash2 size={13} style={{ color: "#EF4444" }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {confirmDelete !== null && (
        <ConfirmDialog
          message="Supprimer cet avis client définitivement ?"
          onConfirm={() => deleteReview(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {viewItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewItem(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-base" style={{ color: "#1B2A4A" }}>Avis client</h2>
              <button onClick={() => setViewItem(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={15} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{ background: avatarColor(viewItem.name) }}>{initials(viewItem.name)}</div>
              <div>
                <div className="font-semibold" style={{ color: "#1B2A4A" }}>{viewItem.name}</div>
                <div className="text-sm" style={{ color: "#6B7A99" }}>{viewItem.job}</div>
                <div className="flex gap-0.5 mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill={i < viewItem.rating ? "#F5A623" : "#E8EBF0"} color={i < viewItem.rating ? "#F5A623" : "#E8EBF0"} />)}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#1B2A4A" }}>{viewItem.review}</p>
            <div className="flex items-center justify-between text-xs" style={{ color: "#6B7A99" }}>
              <span>{viewItem.date}</span>
              <span className={`px-2.5 py-1 rounded-full font-medium ${viewItem.status === "Publié" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{viewItem.status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Stats Page ────────────────────────────────────────────────────────────────
function StatsPage() {
  const [period, setPeriod] = useState("Cette année");
  const periods = ["Cette semaine", "Ce mois", "3 mois", "Cette année", "Personnalisé"];
  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex gap-1 flex-wrap">
        {periods.map(p => (
          <button key={p} onClick={() => setPeriod(p)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
            style={{ background: period === p ? "#1B2A4A" : "white", color: period === p ? "white" : "#6B7A99", boxShadow: period === p ? "none" : "0 2px 8px rgba(0,0,0,0.06)" }}>{p}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Réservations dans le temps</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={areaData}>
              <defs><linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F5A623" stopOpacity={0.25} /><stop offset="95%" stopColor="#F5A623" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7A99" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7A99" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid rgba(27,42,74,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="reservations" stroke="#F5A623" strokeWidth={2.5} fill="url(#goldGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Revenus par mois (TND)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7A99" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7A99" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid rgba(27,42,74,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="revenue" name="Revenus" fill="#1B2A4A" radius={[4, 4, 0, 0]}>
                {revenueData.map((_, i) => <Cell key={i} fill={i === 5 || i === 7 ? "#F5A623" : "#1B2A4A"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Répartition par activité</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={3}>
                {donutData.map(d => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "white", border: "1px solid rgba(27,42,74,0.1)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {donutData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: d.color }} /><span style={{ color: "#6B7A99" }}>{d.name}</span></div>
                <span className="font-semibold" style={{ color: "#1B2A4A" }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Jours de forte demande</h3>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <div key={i} className="text-center text-xs py-1 font-semibold" style={{ color: "#6B7A99" }}>{d}</div>)}
            {Array.from({ length: 35 }, (_, i) => {
              const vals = [0, 0.2, 0, 0.4, 0.6, 1, 0.8, 0.2, 0, 0.3, 0.5, 0.7, 1, 0.9, 0.4, 0.1, 0.6, 0.8, 0.3, 0.5, 0.2, 0.9, 1, 0.7, 0.4, 0.1, 0.3, 0.6, 0.8, 0.5, 0.2, 0.4, 0.7, 1, 0.6];
              const v = vals[i] || 0;
              return <div key={i} className="rounded aspect-square" style={{ background: v === 0 ? "#F0F2F5" : `rgba(245,166,35,${v})` }} />;
            })}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs" style={{ color: "#6B7A99" }}>Peu</span>
            {[0.1, 0.3, 0.5, 0.7, 1].map(v => <div key={v} className="w-4 h-4 rounded" style={{ background: `rgba(245,166,35,${v})` }} />)}
            <span className="text-xs" style={{ color: "#6B7A99" }}>Beaucoup</span>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Top 5 activités</h3>
          <div className="space-y-4">
            {barData.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: i === 0 ? "#F5A623" : i === 1 ? "#1B2A4A" : "#9CA3AF", fontSize: 10 }}>{i + 1}</span>
                    <span style={{ color: "#1B2A4A" }}>{item.name}</span>
                  </div>
                  <span className="font-semibold" style={{ color: "#6B7A99" }}>{item.value} rés.</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}>
                  <div className="h-full rounded-full" style={{ width: `${(item.value / 50) * 100}%`, background: i === 0 ? "#F5A623" : "#1B2A4A" }} />
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
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}><div className="h-full rounded-full" style={{ width: `${row.fill}%`, background: row.fill > 80 ? "#22C55E" : "#F5A623" }} /></div>
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
    </div>
  );
}

// ─── Finances Page ────────────────────────────────────────────────────────────
interface Transaction {
  id: string; type: "recette" | "depense"; category: string;
  label: string; amount: number; date: string; status: "Payé" | "En attente" | "Annulé";
  ref?: string;
}

const initialTransactions: Transaction[] = [
  { id: "T-001", type: "recette", category: "Réservation", label: "Réservation Karim Benali — Accrobranche", amount: 2400, date: "15 Jun 2025", status: "Payé", ref: "R-0042" },
  { id: "T-002", type: "recette", category: "Réservation", label: "Réservation Tarek Hamdi — Paintball", amount: 8000, date: "13 Jun 2025", status: "Payé", ref: "R-0040" },
  { id: "T-003", type: "depense", category: "Matériel", label: "Achat équipements paintball", amount: 1200, date: "12 Jun 2025", status: "Payé" },
  { id: "T-004", type: "recette", category: "Réservation", label: "Réservation Rania Cherif — Anniversaire", amount: 3750, date: "10 Jun 2025", status: "En attente", ref: "R-0037" },
  { id: "T-005", type: "depense", category: "Salaires", label: "Salaires moniteurs — Juin 2025", amount: 4500, date: "01 Jun 2025", status: "Payé" },
  { id: "T-006", type: "depense", category: "Entretien", label: "Maintenance tyrolienne", amount: 650, date: "28 Mai 2025", status: "Payé" },
  { id: "T-007", type: "recette", category: "Pack Gold", label: "Pack Gold — Leila Zouari x30", amount: 12000, date: "12 Jun 2025", status: "Annulé", ref: "R-0039" },
  { id: "T-008", type: "depense", category: "Marketing", label: "Publicité Facebook — Juin", amount: 350, date: "01 Jun 2025", status: "Payé" },
  { id: "T-009", type: "recette", category: "Réservation", label: "Réservation Youssef Ben Amor — Formation", amount: 5000, date: "09 Jun 2025", status: "En attente", ref: "R-0036" },
  { id: "T-010", type: "depense", category: "Fournitures", label: "Matériel pédagogique formation", amount: 280, date: "08 Jun 2025", status: "Payé" },
];

const financeMonthly = [
  { month: "Jan", recettes: 18000, depenses: 8200 },
  { month: "Fév", recettes: 22000, depenses: 9100 },
  { month: "Mar", recettes: 31000, depenses: 11400 },
  { month: "Avr", recettes: 26000, depenses: 9800 },
  { month: "Mai", recettes: 38000, depenses: 13200 },
  { month: "Jun", recettes: 44000, depenses: 14600 },
];

function FinancesPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [showAddTx, setShowAddTx] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [txForm, setTxForm] = useState({ type: "recette" as "recette" | "depense", category: "Réservation", label: "", amount: "", status: "Payé" as "Payé" | "En attente" | "Annulé" });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setTransactions(data);
    } else if (!error) {
      // Seed with mock data on first load
      const seeds = initialTransactions.map(({ id, ref, ...rest }) => rest);
      const { data: inserted } = await supabase.from('transactions').insert(seeds).select();
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
  const dynamicFinanceMonthly = Object.values(
    transactions.reduce((acc, tx) => {
      const parts = tx.date ? tx.date.split(" ") : [];
      const month = parts[1];
      if (!month) return acc;
      if (!acc[month]) acc[month] = { month, recettes: 0, depenses: 0 };
      if (tx.status === "Payé") {
        if (tx.type === "recette") acc[month].recettes += Number(tx.amount);
        else if (tx.type === "depense") acc[month].depenses += Number(tx.amount);
      }
      return acc;
    }, {} as Record<string, { month: string; recettes: number; depenses: number }>)
  ).sort((a: any, b: any) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month));

  if (loading) return <div className="flex items-center justify-center py-20 text-sm" style={{ color: "#6B7A99" }}>Chargement des finances...</div>;

  const catColors: Record<string, string> = {
    "Réservation": "#F5A623", "Pack Gold": "#F5A623", "Matériel": "#3B82F6",
    "Salaires": "#8B5CF6", "Entretien": "#14B8A6", "Marketing": "#F59E0B",
    "Fournitures": "#6B7280",
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Revenus encaissés", val: `${totalRecettes.toLocaleString("fr-FR")} TND`, icon: <ArrowUpRight size={20} />, iconBg: "rgba(34,197,94,0.12)", iconColor: "#22C55E", trend: "+8%" },
          { label: "Dépenses totales", val: `${totalDepenses.toLocaleString("fr-FR")} TND`, icon: <ArrowDownLeft size={20} />, iconBg: "rgba(239,68,68,0.1)", iconColor: "#EF4444", trend: "-3%" },
          { label: "Bénéfice net", val: `${benefice.toLocaleString("fr-FR")} TND`, icon: <PiggyBank size={20} />, iconBg: "rgba(245,166,35,0.12)", iconColor: "#F5A623", trend: "+12%" },
          { label: "En attente", val: `${enAttente.toLocaleString("fr-FR")} TND`, icon: <CreditCard size={20} />, iconBg: "rgba(59,130,246,0.1)", iconColor: "#3B82F6", trend: "" },
        ].map(kpi => (
          <Card key={kpi.label} className="p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: kpi.iconBg }}>
                <span style={{ color: kpi.iconColor }}>{kpi.icon}</span>
              </div>
              {kpi.trend && <span className="text-xs font-semibold" style={{ color: kpi.trend.startsWith("+") ? "#22C55E" : "#EF4444" }}>{kpi.trend}</span>}
            </div>
            <div className="text-xl font-bold mb-0.5" style={{ color: "#1B2A4A", fontFamily: "DM Mono, monospace" }}>{kpi.val}</div>
            <div className="text-xs" style={{ color: "#6B7A99" }}>{kpi.label}</div>
          </Card>
        ))}
      </div>

      {/* Revenue vs Expenses chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Revenus vs Dépenses</h3>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: "#22C55E" }} /><span style={{ color: "#6B7A99" }}>Revenus</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: "#EF4444" }} /><span style={{ color: "#6B7A99" }}>Dépenses</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dynamicFinanceMonthly} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7A99" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7A99" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid rgba(27,42,74,0.1)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v.toLocaleString("fr-FR")} TND`]} />
              <Bar dataKey="recettes" name="Revenus" fill="#22C55E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="depenses" name="Dépenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Répartition dépenses</h3>
          <div className="space-y-3">
          {(() => {
            const cats = ["Salaires", "Matériel", "Entretien", "Marketing", "Fournitures", "Autre"];
            const breakdown = cats.map(cat => ({
              cat,
              amount: transactions
                .filter(t => t.type === "depense" && t.category === cat && t.status === "Payé")
                .reduce((s, t) => s + Number(t.amount), 0),
            })).filter(x => x.amount > 0);
            const total = breakdown.reduce((s, x) => s + x.amount, 0) || 1;
            return breakdown.map(item => (
              <div key={item.cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "#1B2A4A" }}>{item.cat}</span>
                  <span className="font-semibold font-mono" style={{ color: "#6B7A99" }}>{item.amount.toLocaleString("fr-FR")} TND</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.round((item.amount / total) * 100)}%`, background: catColors[item.cat] || "#1B2A4A" }} />
                </div>
              </div>
            ));
          })()}
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
            <div className="flex justify-between text-xs font-semibold">
              <span style={{ color: "#1B2A4A" }}>Total dépenses</span>
              <span style={{ color: "#EF4444" }}>{totalDepenses.toLocaleString("fr-FR")} TND</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 flex flex-wrap items-center gap-3 border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
          <h3 className="font-semibold text-sm flex-1" style={{ color: "#1B2A4A" }}>Transactions</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {["Tous", "Recettes", "Dépenses"].map(f => (
              <button key={f} onClick={() => setTypeFilter(f)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                style={{ background: typeFilter === f ? "#1B2A4A" : "#F0F2F5", color: typeFilter === f ? "white" : "#6B7A99" }}>{f}</button>
            ))}
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 text-xs rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
              {["Tous", "Payé", "En attente", "Annulé"].map(s => <option key={s}>{s}</option>)}
            </select>
            <button onClick={() => toast.success("Rapport financier exporté !")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border" style={{ borderColor: "#F5A623", color: "#F5A623" }}>
              <Download size={12} /> Export
            </button>
            <button onClick={() => setShowAddTx(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
              <Plus size={12} /> Ajouter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#F8F9FB" }}>
                {["#", "Type", "Catégorie", "Libellé", "Montant", "Date", "Statut", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: "#6B7A99" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: "#6B7A99" }}>Aucune transaction.</td></tr>
              ) : filtered.map(tx => (
                <tr key={tx.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
                  <td className="px-4 py-3 text-xs font-mono font-medium" style={{ color: "#6B7A99" }}>{tx.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {tx.type === "recette"
                        ? <ArrowUpRight size={13} style={{ color: "#22C55E" }} />
                        : <ArrowDownLeft size={13} style={{ color: "#EF4444" }} />}
                      <span className="text-xs font-medium" style={{ color: tx.type === "recette" ? "#16A34A" : "#DC2626" }}>
                        {tx.type === "recette" ? "Recette" : "Dépense"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${catColors[tx.category] || "#6B7A99"}18`, color: catColors[tx.category] || "#6B7A99" }}>{tx.category}</span>
                  </td>
                  <td className="px-4 py-3 text-xs max-w-xs" style={{ color: "#1B2A4A" }}>
                    <div className="truncate">{tx.label}</div>
                    {tx.ref && <div className="text-xs font-mono mt-0.5" style={{ color: "#B8C0D0" }}>{tx.ref}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono font-bold whitespace-nowrap" style={{ color: tx.type === "recette" ? "#16A34A" : "#DC2626" }}>
                    {tx.type === "recette" ? "+" : "-"}{Number(tx.amount).toLocaleString("fr-FR")} TND
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#6B7A99" }}>{tx.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tx.status === "Payé" ? "bg-green-50 text-green-700 border border-green-200" : tx.status === "En attente" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {tx.status === "En attente" && (
                        <button onClick={() => markPaid(tx.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-green-50" title="Marquer payé"><Check size={13} style={{ color: "#22C55E" }} /></button>
                      )}
                      <button onClick={() => setConfirmDelete(tx.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50" title="Supprimer"><Trash2 size={13} style={{ color: "#EF4444" }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(27,42,74,0.08)", background: "#FAFBFC" }}>
          <div className="flex gap-6">
            <div className="text-xs"><span style={{ color: "#6B7A99" }}>Total recettes filtrées: </span><span className="font-bold font-mono" style={{ color: "#16A34A" }}>+{filtered.filter(t => t.type === "recette").reduce((s, t) => s + Number(t.amount), 0).toLocaleString("fr-FR")} TND</span></div>
            <div className="text-xs"><span style={{ color: "#6B7A99" }}>Total dépenses filtrées: </span><span className="font-bold font-mono" style={{ color: "#DC2626" }}>-{filtered.filter(t => t.type === "depense").reduce((s, t) => s + Number(t.amount), 0).toLocaleString("fr-FR")} TND</span></div>
          </div>
          <span className="text-xs" style={{ color: "#6B7A99" }}>{filtered.length} transaction{filtered.length > 1 ? "s" : ""}</span>
        </div>
      </Card>

      {/* Delete confirm */}
      {confirmDelete && (
        <ConfirmDialog
          message="Supprimer cette transaction définitivement ?"
          onConfirm={() => deleteTx(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Add transaction modal */}
      {showAddTx && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ fontFamily: "Inter, sans-serif" }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddTx(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <h2 className="font-bold text-base" style={{ color: "#1B2A4A" }}>Nouvelle Transaction</h2>
              <button onClick={() => setShowAddTx(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Type toggle */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "#1B2A4A" }}>Type</label>
                <div className="flex gap-2">
                  <button onClick={() => setTxForm(f => ({ ...f, type: "recette" }))}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                    style={{ background: txForm.type === "recette" ? "rgba(34,197,94,0.1)" : "#F0F2F5", color: txForm.type === "recette" ? "#16A34A" : "#6B7A99", border: txForm.type === "recette" ? "2px solid #22C55E" : "2px solid transparent" }}>
                    <ArrowUpRight size={15} /> Recette
                  </button>
                  <button onClick={() => setTxForm(f => ({ ...f, type: "depense" }))}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                    style={{ background: txForm.type === "depense" ? "rgba(239,68,68,0.08)" : "#F0F2F5", color: txForm.type === "depense" ? "#DC2626" : "#6B7A99", border: txForm.type === "depense" ? "2px solid #EF4444" : "2px solid transparent" }}>
                    <ArrowDownLeft size={15} /> Dépense
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Catégorie</label>
                  <select value={txForm.category} onChange={e => setTxForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                    {["Réservation", "Pack Gold", "Matériel", "Salaires", "Entretien", "Marketing", "Fournitures", "Autre"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Statut</label>
                  <select value={txForm.status} onChange={e => setTxForm(f => ({ ...f, status: e.target.value as "Payé" | "En attente" | "Annulé" }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                    {["Payé", "En attente", "Annulé"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Libellé <span style={{ color: "#EF4444" }}>*</span></label>
                <input value={txForm.label} onChange={e => setTxForm(f => ({ ...f, label: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Description de la transaction" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Montant (TND) <span style={{ color: "#EF4444" }}>*</span></label>
                <div className="relative">
                  <input type="number" min={0} value={txForm.amount} onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))} className="w-full pl-3 pr-16 py-2.5 text-sm rounded-lg outline-none" placeholder="0.000" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A", fontFamily: "DM Mono, monospace" }} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: "#6B7A99" }}>TND</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3 justify-end" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <button onClick={() => setShowAddTx(false)} className="px-5 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>Annuler</button>
              <button onClick={handleAddTx} className="px-5 py-2.5 text-sm font-bold rounded-lg text-white flex items-center gap-2" style={{ background: txForm.type === "recette" ? "#22C55E" : "#EF4444" }}>
                <Plus size={14} /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Users Page ───────────────────────────────────────────────────────────────
type UserRole = "Super Admin" | "Admin" | "Éditeur" | "Modérateur" | "Lecteur";
type UserStatus = "Actif" | "Suspendu" | "Inactif";

interface AdminUser {
  id: number; name: string; email: string; phone: string;
  role: UserRole; status: UserStatus; lastLogin: string; createdAt: string; avatar?: string;
}

const roleColors: Record<UserRole, { bg: string; text: string }> = {
  "Super Admin": { bg: "rgba(245,166,35,0.15)", text: "#D97706" },
  "Admin": { bg: "rgba(27,42,74,0.1)", text: "#1B2A4A" },
  "Éditeur": { bg: "rgba(59,130,246,0.1)", text: "#2563EB" },
  "Modérateur": { bg: "rgba(139,92,246,0.1)", text: "#7C3AED" },
  "Lecteur": { bg: "rgba(107,114,128,0.1)", text: "#4B5563" },
};

const initialUsers: AdminUser[] = [
  { id: 1, name: "Admin Yakoo", email: "admin@yakoo.tn", phone: "+216 71 234 567", role: "Super Admin", status: "Actif", lastLogin: "Aujourd'hui, 09:14", createdAt: "01 Jan 2024" },
  { id: 2, name: "Sarra Ben Salah", email: "sarra@yakoo.tn", phone: "+216 55 234 567", role: "Admin", status: "Actif", lastLogin: "Hier, 14:32", createdAt: "15 Mar 2024" },
  { id: 3, name: "Amine Trabelsi", email: "amine@yakoo.tn", phone: "+216 22 987 654", role: "Éditeur", status: "Actif", lastLogin: "12 Jun 2025", createdAt: "20 Avr 2024" },
  { id: 4, name: "Lina Mansouri", email: "lina@yakoo.tn", phone: "+216 98 765 432", role: "Modérateur", status: "Actif", lastLogin: "10 Jun 2025", createdAt: "05 Mai 2024" },
  { id: 5, name: "Khalil Ben Romdhane", email: "khalil@yakoo.tn", phone: "+216 71 543 210", role: "Éditeur", status: "Suspendu", lastLogin: "01 Jun 2025", createdAt: "10 Fév 2024" },
  { id: 6, name: "Yasmine Chaabane", email: "yasmine@yakoo.tn", phone: "+216 29 876 543", role: "Lecteur", status: "Inactif", lastLogin: "22 Mai 2025", createdAt: "18 Jun 2024" },
];

const rolePermissions: Record<UserRole, string[]> = {
  "Super Admin": ["Accès total", "Gestion utilisateurs", "Paramètres système", "Données financières", "Suppression définitive"],
  "Admin": ["Tableau de bord", "Réservations", "Activités", "Packs", "Avis", "FAQ", "Contenu", "Statistiques"],
  "Éditeur": ["Contenu du site", "FAQ", "Activités", "Avis clients"],
  "Modérateur": ["Avis clients", "Réservations (lecture)", "Tableau de bord"],
  "Lecteur": ["Tableau de bord (lecture)", "Statistiques (lecture)"],
};

function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [viewPerms, setViewPerms] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Éditeur" as UserRole, status: "Actif" as UserStatus });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('admin_users').select('*').order('id', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        setUsers(data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || "",
          role: u.role as UserRole,
          status: u.status as UserStatus,
          lastLogin: u.last_login || "Jamais",
          createdAt: new Date(u.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
        })));
      } else {
        setUsers(initialUsers);
      }
    } catch (e: any) {
      console.error(e.message);
      setUsers(initialUsers);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Tous" || u.role === roleFilter;
    const matchStatus = statusFilter === "Tous" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const statusBg: Record<UserStatus, string> = {
    "Actif": "bg-green-50 text-green-700 border border-green-200",
    "Suspendu": "bg-amber-50 text-amber-700 border border-amber-200",
    "Inactif": "bg-gray-100 text-gray-500 border border-gray-200",
  };

  const openEdit = (u: AdminUser) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, phone: u.phone, role: u.role, status: u.status });
    setShowModal(true);
  };
  const openAdd = () => {
    setEditUser(null);
    setForm({ name: "", email: "", phone: "", role: "Éditeur", status: "Actif" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error("Nom et email requis."); return; }
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        status: form.status
      };
      if (editUser) {
        const { error } = await supabase.from('admin_users').update(payload).eq('id', editUser.id);
        if (error) throw error;
        toast.success(`Utilisateur "${form.name}" mis à jour !`);
      } else {
        const { error } = await supabase.from('admin_users').insert([payload]);
        if (error) throw error;
        toast.success(`Utilisateur "${form.name}" créé avec succès !`);
      }
      setShowModal(false);
      fetchUsers();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const toggleStatus = async (id: number) => {
    const u = users.find(x => x.id === id);
    if (!u) return;
    const next: UserStatus = u.status === "Actif" ? "Suspendu" : "Actif";
    try {
      const { error } = await supabase.from('admin_users').update({ status: next }).eq('id', id);
      if (error) throw error;
      toast.success(`${u.name} — statut changé en "${next}"`);
      fetchUsers();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const { error } = await supabase.from('admin_users').delete().eq('id', id);
      if (error) throw error;
      setConfirmDelete(null);
      toast.success("Utilisateur supprimé.");
      fetchUsers();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const actif = users.filter(u => u.status === "Actif").length;
  const admins = users.filter(u => u.role === "Super Admin" || u.role === "Admin").length;
  const suspended = users.filter(u => u.status === "Suspendu").length;

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total utilisateurs", val: users.length, icon: <Users size={20} />, iconBg: "rgba(27,42,74,0.08)", iconColor: "#1B2A4A" },
          { label: "Administrateurs", val: admins, icon: <ShieldCheck size={20} />, iconBg: "rgba(245,166,35,0.12)", iconColor: "#F5A623" },
          { label: "Actifs", val: actif, icon: <UserCheck size={20} />, iconBg: "rgba(34,197,94,0.1)", iconColor: "#22C55E" },
          { label: "Suspendus", val: suspended, icon: <UserX size={20} />, iconBg: "rgba(239,68,68,0.1)", iconColor: "#EF4444" },
        ].map(k => (
          <Card key={k.label} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: k.iconBg }}>
                <span style={{ color: k.iconColor }}>{k.icon}</span>
              </div>
            </div>
            <div className="text-2xl font-bold mb-0.5" style={{ color: "#1B2A4A" }}>{k.val}</div>
            <div className="text-xs" style={{ color: "#6B7A99" }}>{k.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters + add */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7A99" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un utilisateur..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
            {["Tous", "Super Admin", "Admin", "Éditeur", "Modérateur", "Lecteur"].map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
            {["Tous", "Actif", "Suspendu", "Inactif"].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white ml-auto" style={{ background: "#F5A623", color: "#0F1C30" }}>
            <UserPlus size={15} /> Nouvel utilisateur
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#F8F9FB" }}>
                {["Utilisateur", "Email", "Téléphone", "Rôle", "Statut", "Dernière connexion", "Créé le", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: "#6B7A99" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: "#6B7A99" }}>Aucun utilisateur trouvé.</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: avatarColor(u.name) }}>{initials(u.name)}</div>
                      <div>
                        <div className="text-xs font-semibold" style={{ color: "#1B2A4A" }}>{u.name}</div>
                        <div className="text-xs" style={{ color: "#6B7A99" }}>ID #{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#6B7A99" }}>{u.email}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#6B7A99" }}>{u.phone}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: roleColors[u.role].bg, color: roleColors[u.role].text }}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBg[u.status]}`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#6B7A99" }}>{u.lastLogin}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#6B7A99" }}>{u.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewPerms(u)} title="Permissions" className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"><Shield size={13} style={{ color: "#3B82F6" }} /></button>
                      <button onClick={() => openEdit(u)} title="Modifier" className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"><Pencil size={13} style={{ color: "#3B82F6" }} /></button>
                      <button onClick={() => toggleStatus(u.id)} title={u.status === "Actif" ? "Suspendre" : "Activer"}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-amber-50 transition-colors">
                        {u.status === "Actif" ? <ShieldOff size={13} style={{ color: "#F59E0B" }} /> : <ShieldCheck size={13} style={{ color: "#22C55E" }} />}
                      </button>
                      {u.role !== "Super Admin" && (
                        <button onClick={() => setConfirmDelete(u.id)} title="Supprimer" className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"><Trash2 size={13} style={{ color: "#EF4444" }} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Roles legend */}
      <Card className="p-5">
        <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Matrice des rôles et permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {(Object.entries(rolePermissions) as [UserRole, string[]][]).map(([role, perms]) => (
            <div key={role} className="rounded-xl p-4" style={{ background: "#F8F9FB", border: `1px solid ${roleColors[role].bg}` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: roleColors[role].bg, color: roleColors[role].text }}>{role}</span>
              </div>
              <div className="space-y-1.5">
                {perms.map(p => (
                  <div key={p} className="flex items-center gap-1.5">
                    <Check size={10} style={{ color: "#22C55E", flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: "#6B7A99" }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Delete confirm */}
      {confirmDelete !== null && (
        <ConfirmDialog
          message={`Supprimer "${users.find(u => u.id === confirmDelete)?.name}" définitivement ? Cette action est irréversible.`}
          onConfirm={() => deleteUser(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Permissions modal */}
      {viewPerms && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewPerms(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base" style={{ color: "#1B2A4A" }}>Permissions — {viewPerms.name}</h2>
              <button onClick={() => setViewPerms(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={15} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ background: "#F8F9FB" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ background: avatarColor(viewPerms.name) }}>{initials(viewPerms.name)}</div>
              <div>
                <div className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>{viewPerms.name}</div>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: roleColors[viewPerms.role].bg, color: roleColors[viewPerms.role].text }}>{viewPerms.role}</span>
              </div>
            </div>
            <div className="space-y-2">
              {rolePermissions[viewPerms.role].map(p => (
                <div key={p} className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{ background: "rgba(34,197,94,0.05)" }}>
                  <CheckCircle2 size={14} style={{ color: "#22C55E", flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: "#1B2A4A" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ fontFamily: "Inter, sans-serif" }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <div>
                <h2 className="font-bold text-base" style={{ color: "#1B2A4A" }}>{editUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</h2>
                {!editUser && <p className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>Un email d'invitation sera envoyé automatiquement</p>}
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Avatar preview */}
              {form.name && (
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F8F9FB" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: avatarColor(form.name) }}>{initials(form.name)}</div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>{form.name}</div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: roleColors[form.role].bg, color: roleColors[form.role].text }}>{form.role}</span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Nom complet <span style={{ color: "#EF4444" }}>*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Prénom Nom" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Email <span style={{ color: "#EF4444" }}>*</span></label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="utilisateur@yakoo.tn" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Téléphone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="+216 XX XXX XXX" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Statut</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as UserStatus }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                    {["Actif", "Suspendu", "Inactif"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "#1B2A4A" }}>Rôle</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(roleColors) as UserRole[]).filter(r => r !== "Super Admin").map(r => (
                    <button key={r} onClick={() => setForm(f => ({ ...f, role: r }))}
                      className="py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all"
                      style={{ background: form.role === r ? roleColors[r].bg : "#F0F2F5", color: form.role === r ? roleColors[r].text : "#6B7A99", border: form.role === r ? `1.5px solid ${roleColors[r].text}40` : "1.5px solid transparent" }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              {/* Permissions preview */}
              <div className="rounded-xl p-3" style={{ background: "#F8F9FB" }}>
                <div className="text-xs font-semibold mb-2" style={{ color: "#6B7A99" }}>Permissions du rôle sélectionné</div>
                <div className="flex flex-wrap gap-1.5">
                  {rolePermissions[form.role].map(p => (
                    <span key={p} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(27,42,74,0.06)", color: "#1B2A4A" }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3 justify-end" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>Annuler</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm font-bold rounded-lg text-white flex items-center gap-2" style={{ background: "#1B2A4A" }}>
                <Save size={14} /> {editUser ? "Enregistrer" : "Créer l'utilisateur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────
function SettingsPage({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState("Général");
  const settingsTabs = ["Général", "Sécurité", "Notifications", "Apparence", "Intégrations", "Sauvegardes"];

  // Général
  const [siteName, setSiteName] = useState("Yakoo Events");
  const [tagline, setTagline] = useState("Vivez l'aventure, forgez les souvenirs.");
  const [email, setEmail] = useState("contact@yakoo-events.tn");
  const [phone, setPhone] = useState("+216 71 234 567");
  const [address, setAddress] = useState("Route de Bizerte Km 12, Tunis, Tunisie");
  const [timezone, setTimezone] = useState("Africa/Tunis (UTC+1)");
  const [lang, setLang] = useState("Français");

  // Sécurité
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const loginHistory = [
    { ip: "197.30.45.12", location: "Tunis, TN", device: "Chrome / Windows", date: "Aujourd'hui 09:14", status: true },
    { ip: "197.30.45.12", location: "Tunis, TN", device: "Chrome / Windows", date: "Hier 14:32", status: true },
    { ip: "41.231.12.88", location: "Sfax, TN", device: "Safari / iPhone", date: "12 Jun 2025 08:45", status: false },
  ];

  // Notifications
  const [notifs, setNotifs] = useState({
    newReservation: true, cancelledReservation: true, newReview: true,
    reservationReminder: false, weeklyReport: true, smsNewReservation: false,
    smsConfirmation: true, whatsappNotif: false,
  });

  // Apparence
  const [primaryColor, setPrimaryColor] = useState("#1B2A4A");
  const [accentColor, setAccentColor] = useState("#F5A623");
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  // Integrations
  const [integrations, setIntegrations] = useState({
    googleAnalytics: { enabled: true, key: "G-XXXXXXXXXX" },
    whatsapp: { enabled: false, number: "+21671234567" },
    smtp: { enabled: true, host: "smtp.gmail.com", port: "587", user: "contact@yakoo-events.tn" },
    facebook: { enabled: true, pixel: "123456789" },
  });

  // Backups
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFreq, setBackupFreq] = useState("Quotidienne");
  const backupHistory = [
    { date: "15 Jun 2025 02:00", size: "2.4 MB", status: "Succès" },
    { date: "14 Jun 2025 02:00", size: "2.3 MB", status: "Succès" },
    { date: "13 Jun 2025 02:00", size: "2.3 MB", status: "Succès" },
    { date: "12 Jun 2025 02:00", size: "2.1 MB", status: "Échec" },
  ];

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#6B7A99" }}>{children}</h3>
  );

  const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>{label}</label>
      {children}
      {hint && <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>{hint}</p>}
    </div>
  );

  const Toggle = ({ checked, onChange, label, sub }: { checked: boolean; onChange: () => void; label: string; sub?: string }) => (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
      <div>
        <div className="text-sm font-medium" style={{ color: "#1B2A4A" }}>{label}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{sub}</div>}
      </div>
      <button onClick={onChange} className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0" style={{ background: checked ? "#F5A623" : "#E8EBF0" }}>
        <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200" style={{ left: checked ? "calc(100% - 20px)" : 4 }} />
      </button>
    </div>
  );

  return (
    <div className="space-y-4" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Tab nav */}
      <div className="flex gap-1 flex-wrap">
        {settingsTabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ background: tab === t ? "#1B2A4A" : "white", color: tab === t ? "white" : "#6B7A99", boxShadow: tab === t ? "none" : "0 2px 8px rgba(0,0,0,0.06)" }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── GÉNÉRAL ── */}
      {tab === "Général" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-6 space-y-5">
            <SectionTitle>Informations du site</SectionTitle>
            <Field label="Nom du site">
              <input value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
            </Field>
            <Field label="Tagline / Slogan">
              <input value={tagline} onChange={e => setTagline(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
            </Field>
            <Field label="Langue par défaut">
              <select value={lang} onChange={e => setLang(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                {["Français", "Arabe", "Anglais"].map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Fuseau horaire">
              <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                {["Africa/Tunis (UTC+1)", "Europe/Paris (UTC+2)", "UTC (UTC+0)"].map(z => <option key={z}>{z}</option>)}
              </select>
            </Field>
            <button onClick={() => toast.success("Informations générales enregistrées !")}
              className="w-full py-2.5 text-sm font-bold rounded-xl text-white flex items-center justify-center gap-2" style={{ background: "#F5A623", color: "#0F1C30" }}>
              <Save size={15} /> Enregistrer
            </button>
          </Card>

          <Card className="p-6 space-y-5">
            <SectionTitle>Contact & localisation</SectionTitle>
            <Field label="Email de contact">
              <div className="relative">
                <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7A99" }} />
                <input value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              </div>
            </Field>
            <Field label="Téléphone principal">
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7A99" }} />
                <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              </div>
            </Field>
            <Field label="Adresse physique">
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-3" style={{ color: "#6B7A99" }} />
                <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg outline-none resize-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              </div>
            </Field>
            <Field label="Horaires d'ouverture">
              <div className="space-y-2">
                {[["Lun–Ven", "08:00 – 18:00"], ["Samedi", "09:00 – 16:00"], ["Dimanche", "Fermé"]].map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-xs w-16 flex-shrink-0" style={{ color: "#6B7A99" }}>{day}</span>
                    <input defaultValue={hours} className="flex-1 px-3 py-1.5 text-xs rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                  </div>
                ))}
              </div>
            </Field>
            <button onClick={() => toast.success("Coordonnées enregistrées !")}
              className="w-full py-2.5 text-sm font-bold rounded-xl text-white flex items-center justify-center gap-2" style={{ background: "#1B2A4A" }}>
              <Save size={15} /> Enregistrer
            </button>
          </Card>
        </div>
      )}

      {/* ── SÉCURITÉ ── */}
      {tab === "Sécurité" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-5">
            <Card className="p-6 space-y-4">
              <SectionTitle>Changer le mot de passe</SectionTitle>
              {[
                { label: "Mot de passe actuel", val: currentPwd, set: setCurrentPwd, show: showCurrentPwd, toggle: () => setShowCurrentPwd(p => !p) },
                { label: "Nouveau mot de passe", val: newPwd, set: setNewPwd, show: showNewPwd, toggle: () => setShowNewPwd(p => !p) },
                { label: "Confirmer le nouveau mot de passe", val: confirmPwd, set: setConfirmPwd, show: showNewPwd, toggle: () => { } },
              ].map(f => (
                <Field key={f.label} label={f.label}>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7A99" }} />
                    <input type={f.show ? "text" : "password"} value={f.val} onChange={e => f.set(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg outline-none" placeholder="••••••••"
                      style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                    <button type="button" onClick={f.toggle} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {f.show ? <EyeOff size={14} style={{ color: "#9CA3AF" }} /> : <Eye size={14} style={{ color: "#9CA3AF" }} />}
                    </button>
                  </div>
                </Field>
              ))}
              {/* Password strength */}
              {newPwd && (
                <div>
                  <div className="text-xs mb-1.5" style={{ color: "#6B7A99" }}>Force du mot de passe</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: newPwd.length >= i * 3 ? (newPwd.length >= 12 ? "#22C55E" : newPwd.length >= 8 ? "#F5A623" : "#EF4444") : "#E8EBF0" }} />
                    ))}
                  </div>
                  <div className="text-xs mt-1" style={{ color: newPwd.length >= 12 ? "#22C55E" : newPwd.length >= 8 ? "#F5A623" : "#EF4444" }}>
                    {newPwd.length >= 12 ? "Fort" : newPwd.length >= 8 ? "Moyen" : "Faible"}
                  </div>
                </div>
              )}
              <button onClick={() => {
                if (!currentPwd || !newPwd || !confirmPwd) { toast.error("Tous les champs sont requis."); return; }
                if (newPwd !== confirmPwd) { toast.error("Les mots de passe ne correspondent pas."); return; }
                if (newPwd.length < 8) { toast.error("Minimum 8 caractères."); return; }
                toast.success("Mot de passe mis à jour avec succès !");
                setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
              }} className="w-full py-2.5 text-sm font-bold rounded-xl text-white" style={{ background: "#1B2A4A" }}>
                Changer le mot de passe
              </button>
            </Card>

            <Card className="p-6 space-y-3">
              <SectionTitle>Authentification & sessions</SectionTitle>
              <Toggle checked={twoFA} onChange={() => { setTwoFA(p => !p); toast.success(twoFA ? "2FA désactivé." : "2FA activé — vérifiez votre email !"); }}
                label="Authentification à deux facteurs (2FA)" sub="Code SMS envoyé à +216 71 234 567" />
              <div className="py-3 flex items-center justify-between border-b" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: "#1B2A4A" }}>Délai d'expiration de session</div>
                  <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>Déconnexion automatique après inactivité</div>
                </div>
                <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} className="px-3 py-1.5 text-xs rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                  {["15", "30", "60", "120", "480"].map(v => <option key={v} value={v}>{v} min</option>)}
                </select>
              </div>
              <button onClick={() => toast.success("Paramètres de sécurité enregistrés !")}
                className="w-full py-2.5 text-sm font-bold rounded-xl text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
                Enregistrer
              </button>
            </Card>
          </div>

          <Card className="p-6">
            <SectionTitle>Historique des connexions</SectionTitle>
            <div className="space-y-3">
              {loginHistory.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#F8F9FB" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: h.status ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>
                    {h.status ? <CheckCircle2 size={15} style={{ color: "#22C55E" }} /> : <XCircle size={15} style={{ color: "#EF4444" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold" style={{ color: "#1B2A4A" }}>{h.device}</div>
                    <div className="text-xs" style={{ color: "#6B7A99" }}>{h.location} · {h.ip}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{h.date}</div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${h.status ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>{h.status ? "Succès" : "Échec"}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <button onClick={() => toast.warning("Toutes les autres sessions ont été déconnectées.")}
                className="w-full py-2.5 text-sm font-medium rounded-xl border" style={{ borderColor: "#EF4444", color: "#EF4444" }}>
                Déconnecter toutes les sessions
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {tab === "Notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.1)" }}>
                <MailIcon size={16} style={{ color: "#3B82F6" }} />
              </div>
              <SectionTitle>Notifications par email</SectionTitle>
            </div>
            <div className="space-y-1">
              <Toggle checked={notifs.newReservation} onChange={() => setNotifs(n => ({ ...n, newReservation: !n.newReservation }))} label="Nouvelle réservation" sub="Email dès qu'une réservation est soumise" />
              <Toggle checked={notifs.cancelledReservation} onChange={() => setNotifs(n => ({ ...n, cancelledReservation: !n.cancelledReservation }))} label="Réservation annulée" sub="Email lors d'une annulation client" />
              <Toggle checked={notifs.newReview} onChange={() => setNotifs(n => ({ ...n, newReview: !n.newReview }))} label="Nouvel avis client" sub="Email quand un avis est soumis" />
              <Toggle checked={notifs.reservationReminder} onChange={() => setNotifs(n => ({ ...n, reservationReminder: !n.reservationReminder }))} label="Rappels réservations" sub="J-1 avant chaque réservation confirmée" />
              <Toggle checked={notifs.weeklyReport} onChange={() => setNotifs(n => ({ ...n, weeklyReport: !n.weeklyReport }))} label="Rapport hebdomadaire" sub="Résumé envoyé chaque lundi matin" />
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Adresse email de réception</label>
              <input defaultValue="admin@yakoo.tn" className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
            </div>
            <button onClick={() => toast.success("Préférences email enregistrées !")}
              className="mt-4 w-full py-2.5 text-sm font-bold rounded-xl text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
              Enregistrer
            </button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(34,197,94,0.1)" }}>
                <Smartphone size={16} style={{ color: "#22C55E" }} />
              </div>
              <SectionTitle>Notifications SMS & WhatsApp</SectionTitle>
            </div>
            <div className="space-y-1">
              <Toggle checked={notifs.smsNewReservation} onChange={() => setNotifs(n => ({ ...n, smsNewReservation: !n.smsNewReservation }))} label="SMS nouvelle réservation" sub="SMS vers +216 71 234 567" />
              <Toggle checked={notifs.smsConfirmation} onChange={() => setNotifs(n => ({ ...n, smsConfirmation: !n.smsConfirmation }))} label="SMS confirmation client" sub="Envoyé automatiquement au client" />
              <Toggle checked={notifs.whatsappNotif} onChange={() => setNotifs(n => ({ ...n, whatsappNotif: !n.whatsappNotif }))} label="WhatsApp Business" sub="Notifications via WhatsApp API" />
            </div>
            <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)" }}>
              <div className="flex gap-2">
                <Info size={14} style={{ color: "#F5A623", flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
                  Les SMS sont envoyés via le fournisseur configuré dans l'onglet Intégrations. Des frais d'envoi peuvent s'appliquer.
                </p>
              </div>
            </div>
            <button onClick={() => toast.success("Préférences SMS enregistrées !")}
              className="mt-4 w-full py-2.5 text-sm font-bold rounded-xl text-white" style={{ background: "#1B2A4A" }}>
              Enregistrer
            </button>
          </Card>
        </div>
      )}

      {/* ── APPARENCE ── */}
      {tab === "Apparence" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-6 space-y-5">
            <SectionTitle>Couleurs & thème</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Couleur primaire (Navy)", val: primaryColor, set: setPrimaryColor },
                { label: "Couleur accent (Gold)", val: accentColor, set: setAccentColor },
              ].map(c => (
                <Field key={c.label} label={c.label}>
                  <div className="flex items-center gap-2">
                    <input type="color" value={c.val} onChange={e => c.set(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" style={{ padding: 2 }} />
                    <input value={c.val} onChange={e => c.set(e.target.value)} className="flex-1 px-3 py-2 text-sm rounded-lg outline-none font-mono" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                  </div>
                </Field>
              ))}
            </div>
            <div className="space-y-1">
              <Toggle checked={darkMode} onChange={() => setDarkMode(p => !p)} label="Mode sombre" sub="Interface en dark mode" />
              <Toggle checked={compactMode} onChange={() => setCompactMode(p => !p)} label="Mode compact" sub="Réduit les espacements dans les tableaux" />
            </div>
            {/* Preview */}
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: "#6B7A99" }}>Aperçu en temps réel</div>
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(27,42,74,0.1)" }}>
                <div className="px-4 py-3 flex items-center gap-2" style={{ background: primaryColor }}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black" style={{ background: accentColor, color: primaryColor }}>YE</div>
                  <span className="text-white text-xs font-bold">Yakoo Events</span>
                </div>
                <div className="p-3" style={{ background: "#F0F2F5" }}>
                  <div className="flex gap-2 mb-2">
                    <div className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: primaryColor }}>Tableau de bord</div>
                    <div className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "white", color: "#6B7A99" }}>Réservations</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["48 rés.", "22 activ.", "4.7 ★"].map(s => (
                      <div key={s} className="bg-white rounded-lg p-2 text-center">
                        <div className="text-xs font-bold" style={{ color: primaryColor }}>{s}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 py-1.5 px-3 rounded-lg text-xs font-bold text-center" style={{ background: accentColor, color: primaryColor }}>Bouton principal</div>
                </div>
              </div>
            </div>
            <button onClick={() => toast.success("Thème appliqué et enregistré !")}
              className="w-full py-2.5 text-sm font-bold rounded-xl text-white" style={{ background: accentColor, color: primaryColor }}>
              Appliquer le thème
            </button>
          </Card>

          <Card className="p-6 space-y-5">
            <SectionTitle>Logo & médias</SectionTitle>
            {[
              { label: "Logo principal", desc: "Format PNG ou SVG recommandé · 200×60px min", icon: "🏔️" },
              { label: "Logo blanc (sidebar)", desc: "Version blanche sur fond sombre · PNG transparent", icon: "⬜" },
              { label: "Favicon", desc: "Format ICO ou PNG · 32×32px", icon: "⚡" },
            ].map(item => (
              <div key={item.label}>
                <label className="block text-xs font-semibold mb-2" style={{ color: "#1B2A4A" }}>{item.label}</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: "#F0F2F5" }}>{item.icon}</div>
                  <div className="flex-1">
                    <div className="rounded-xl border-2 border-dashed p-3 text-center cursor-pointer hover:bg-amber-50 transition-colors" style={{ borderColor: "rgba(245,166,35,0.3)" }} onClick={() => toast.info("Upload disponible en production.")}>
                      <Upload size={14} className="mx-auto mb-0.5" style={{ color: "#F5A623" }} />
                      <p className="text-xs" style={{ color: "#6B7A99" }}>{item.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => toast.success("Médias enregistrés !")}
              className="w-full py-2.5 text-sm font-bold rounded-xl text-white" style={{ background: "#1B2A4A" }}>
              Enregistrer
            </button>
          </Card>
        </div>
      )}

      {/* ── INTÉGRATIONS ── */}
      {tab === "Intégrations" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[
            {
              key: "smtp", title: "Email SMTP", icon: <MailIcon size={18} />, iconBg: "rgba(59,130,246,0.1)", iconColor: "#3B82F6",
              desc: "Configurez l'envoi d'emails transactionnels",
              fields: [
                { label: "Serveur SMTP", val: integrations.smtp.host, key: "host" },
                { label: "Port", val: integrations.smtp.port, key: "port" },
                { label: "Utilisateur", val: integrations.smtp.user, key: "user" },
              ],
              enabled: integrations.smtp.enabled,
              toggle: () => setIntegrations(p => ({ ...p, smtp: { ...p.smtp, enabled: !p.smtp.enabled } })),
            },
            {
              key: "googleAnalytics", title: "Google Analytics", icon: <BarChart2 size={18} />, iconBg: "rgba(245,166,35,0.12)", iconColor: "#F5A623",
              desc: "Suivez le trafic de votre site web",
              fields: [{ label: "Measurement ID", val: integrations.googleAnalytics.key, key: "key" }],
              enabled: integrations.googleAnalytics.enabled,
              toggle: () => setIntegrations(p => ({ ...p, googleAnalytics: { ...p.googleAnalytics, enabled: !p.googleAnalytics.enabled } })),
            },
            {
              key: "whatsapp", title: "WhatsApp Business", icon: <Smartphone size={18} />, iconBg: "rgba(34,197,94,0.1)", iconColor: "#22C55E",
              desc: "Envoyez des notifications via WhatsApp API",
              fields: [{ label: "Numéro WhatsApp Business", val: integrations.whatsapp.number, key: "number" }],
              enabled: integrations.whatsapp.enabled,
              toggle: () => setIntegrations(p => ({ ...p, whatsapp: { ...p.whatsapp, enabled: !p.whatsapp.enabled } })),
            },
            {
              key: "facebook", title: "Facebook Pixel", icon: <Globe size={18} />, iconBg: "rgba(59,130,246,0.1)", iconColor: "#3B82F6",
              desc: "Tracking des conversions publicitaires Facebook",
              fields: [{ label: "Pixel ID", val: integrations.facebook.pixel, key: "pixel" }],
              enabled: integrations.facebook.enabled,
              toggle: () => setIntegrations(p => ({ ...p, facebook: { ...p.facebook, enabled: !p.facebook.enabled } })),
            },
          ].map(integ => (
            <Card key={integ.key} className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: integ.iconBg }}>
                    <span style={{ color: integ.iconColor }}>{integ.icon}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{integ.title}</div>
                    <div className="text-xs" style={{ color: "#6B7A99" }}>{integ.desc}</div>
                  </div>
                </div>
                <button onClick={integ.toggle} className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0" style={{ background: integ.enabled ? "#22C55E" : "#E8EBF0" }}>
                  <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200" style={{ left: integ.enabled ? "calc(100% - 20px)" : 4 }} />
                </button>
              </div>
              {integ.enabled && (
                <div className="space-y-3 pt-2 border-t" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
                  {integ.fields.map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "#6B7A99" }}>{f.label}</label>
                      <input defaultValue={f.val} className="w-full px-3 py-2 text-sm rounded-lg outline-none font-mono" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                    </div>
                  ))}
                  <button onClick={() => toast.success(`Intégration ${integ.title} enregistrée !`)}
                    className="w-full py-2 text-xs font-bold rounded-lg text-white" style={{ background: "#1B2A4A" }}>
                    Tester et enregistrer
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ── SAUVEGARDES ── */}
      {tab === "Sauvegardes" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-6 space-y-5">
            <SectionTitle>Configuration des sauvegardes</SectionTitle>
            <div className="space-y-1">
              <Toggle checked={autoBackup} onChange={() => setAutoBackup(p => !p)} label="Sauvegarde automatique" sub="Sauvegarde planifiée selon la fréquence choisie" />
            </div>
            <Field label="Fréquence">
              <select value={backupFreq} onChange={e => setBackupFreq(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                {["Quotidienne", "Hebdomadaire", "Mensuelle"].map(f => <option key={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Heure de sauvegarde">
              <input type="time" defaultValue="02:00" className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
            </Field>
            <div className="rounded-xl p-4" style={{ background: "#F8F9FB" }}>
              <div className="text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Prochaine sauvegarde</div>
              <div className="text-sm font-bold" style={{ color: "#F5A623" }}>16 Jun 2025 à 02:00</div>
              <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>Sauvegarde vers le stockage local</div>
            </div>
            <button onClick={() => toast.success("Sauvegarde manuelle lancée ! Cela peut prendre quelques secondes.")}
              className="w-full py-2.5 text-sm font-bold rounded-xl text-white flex items-center justify-center gap-2" style={{ background: "#1B2A4A" }}>
              <HardDrive size={15} /> Lancer une sauvegarde maintenant
            </button>
            <button onClick={() => toast.success("Configuration enregistrée !")}
              className="w-full py-2.5 text-sm font-bold rounded-xl text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
              Enregistrer la configuration
            </button>
          </Card>

          <Card className="p-6">
            <SectionTitle>Historique des sauvegardes</SectionTitle>
            <div className="space-y-3 mb-5">
              {backupHistory.map((b, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F8F9FB" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: b.status === "Succès" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>
                    {b.status === "Succès" ? <CheckCircle2 size={15} style={{ color: "#22C55E" }} /> : <XCircle size={15} style={{ color: "#EF4444" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold" style={{ color: "#1B2A4A" }}>{b.date}</div>
                    <div className="text-xs" style={{ color: "#6B7A99" }}>{b.size}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.status === "Succès" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{b.status}</span>
                    {b.status === "Succès" && (
                      <button onClick={() => toast.success("Téléchargement de la sauvegarde démarré !")} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100">
                        <Download size={13} style={{ color: "#6B7A99" }} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 space-y-2 border" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }}>
              <div className="flex items-center gap-2">
                <AlertCircle size={14} style={{ color: "#EF4444" }} />
                <span className="text-xs font-bold" style={{ color: "#DC2626" }}>Zone dangereuse</span>
              </div>
              <p className="text-xs" style={{ color: "#6B7A99" }}>La restauration écrasera toutes les données actuelles. Cette action est irréversible.</p>
              <button onClick={() => toast.error("Restauration disponible uniquement avec confirmation par email.")}
                className="w-full py-2 text-xs font-bold rounded-lg border" style={{ borderColor: "#EF4444", color: "#EF4444" }}>
                Restaurer depuis une sauvegarde
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Danger zone at bottom */}
      {tab === "Général" && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} style={{ color: "#EF4444" }} />
            <h3 className="text-sm font-bold" style={{ color: "#EF4444" }}>Zone dangereuse</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => toast.error("Cette action nécessite une confirmation par email.")}
              className="px-4 py-2 text-sm font-medium rounded-lg border" style={{ borderColor: "#EF4444", color: "#EF4444" }}>
              Vider le cache
            </button>
            <button onClick={onLogout} className="px-4 py-2 text-sm font-medium rounded-lg text-white" style={{ background: "#EF4444" }}>
              Déconnexion forcée
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Contacts Page ────────────────────────────────────────────────────────────
type ContactType = "Client" | "Fournisseur" | "Partenaire" | "Staff" | "Moniteur";

interface Contact {
  id: number; name: string; email: string; phone: string;
  type: ContactType; company?: string; role?: string;
  address?: string; notes?: string; lastContact?: string;
  tags?: string[]; whatsapp?: string; website?: string;
}

const contactTypeColors: Record<ContactType, { bg: string; text: string }> = {
  "Client": { bg: "rgba(59,130,246,0.1)", text: "#2563EB" },
  "Fournisseur": { bg: "rgba(139,92,246,0.1)", text: "#7C3AED" },
  "Partenaire": { bg: "rgba(245,166,35,0.12)", text: "#D97706" },
  "Staff": { bg: "rgba(34,197,94,0.1)", text: "#16A34A" },
  "Moniteur": { bg: "rgba(20,184,166,0.1)", text: "#0D9488" },
};

const initialContacts: Contact[] = [
  { id: 1, name: "Karim Benali", email: "karim.benali@gmail.com", phone: "+216 22 345 678", type: "Client", company: "TechCorp SA", role: "Directeur RH", lastContact: "15 Jun 2025", tags: ["VIP", "Récurrent"], address: "Av. Habib Bourguiba, Tunis", whatsapp: "+216 22 345 678", notes: "Client fidèle, commande régulièrement des team buildings." },
  { id: 2, name: "Sonia Mrad", email: "sonia.mrad@outlook.com", phone: "+216 55 987 654", type: "Client", lastContact: "14 Jun 2025", tags: ["Nouveau"], address: "Sousse, Tunisie" },
  { id: 3, name: "Mohamed Ferjani", email: "m.ferjani@equipsport.tn", phone: "+216 71 456 789", type: "Fournisseur", company: "EquipSport TN", role: "Commercial", lastContact: "10 Jun 2025", tags: ["Matériels"], website: "equipsport.tn", notes: "Fournisseur principal pour les équipements paintball et accrobranche." },
  { id: 4, name: "Yasmine Gafsi", email: "ygafsi@aventura.tn", phone: "+216 98 654 321", type: "Partenaire", company: "Aventura Voyages", role: "Directrice", lastContact: "08 Jun 2025", tags: ["Tourisme"], website: "aventura.tn", notes: "Partenariat pour les groupes touristiques, commission 10%." },
  { id: 5, name: "Amine Trabelsi", email: "amine.tr@yakoo.tn", phone: "+216 22 987 654", type: "Moniteur", role: "Moniteur Accrobranche", lastContact: "15 Jun 2025", tags: ["Certifié", "Temps plein"], address: "La Marsa, Tunis" },
  { id: 6, name: "Lina Mansouri", email: "lina.m@yakoo.tn", phone: "+216 98 765 432", type: "Staff", role: "Chargée de réservations", lastContact: "15 Jun 2025", tags: ["Admin"] },
  { id: 7, name: "Bilel Azouzi", email: "bilel@outdoorpro.tn", phone: "+216 71 234 987", type: "Fournisseur", company: "OutdoorPro", role: "Gérant", lastContact: "05 Jun 2025", tags: ["Camping", "Matériels"] },
  { id: 8, name: "Rania Ben Amor", email: "rania.ba@gmail.com", phone: "+216 52 789 123", type: "Client", company: "BFI Group", role: "Event Manager", lastContact: "30 Mai 2025", tags: ["Corporate"], notes: "Organise régulièrement des séminaires d'entreprise." },
];

function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const emptyForm: Omit<Contact, "id"> = { name: "", email: "", phone: "", type: "Client", company: "", role: "", address: "", notes: "", lastContact: "", tags: [], whatsapp: "", website: "" };
  const [form, setForm] = useState<Omit<Contact, "id">>(emptyForm);

  const types: (ContactType | "Tous")[] = ["Tous", "Client", "Fournisseur", "Partenaire", "Staff", "Moniteur"];

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase.from('admin_contacts').select('*').order('id', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        setContacts(data.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email || "",
          phone: c.phone || "",
          type: c.type as ContactType,
          company: c.company || "",
          role: c.role || "",
          address: c.address || "",
          notes: c.notes || "",
          lastContact: c.last_contact || "",
          tags: Array.isArray(c.tags) ? c.tags : [],
          whatsapp: c.whatsapp || "",
          website: c.website || ""
        })));
      } else {
        setContacts(initialContacts);
      }
    } catch (e: any) {
      console.error(e.message);
      setContacts(initialContacts);
    } finally {
      setLoading(false);
    }
  };

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.company || "").toLowerCase().includes(q);
    const matchType = typeFilter === "Tous" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c: Contact) => { setEditing(c); setForm({ ...c }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) { toast.error("Nom et téléphone requis."); return; }
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        type: form.type,
        company: form.company,
        role: form.role,
        address: form.address,
        notes: form.notes,
        tags: form.tags || [],
        whatsapp: form.whatsapp,
        website: form.website,
        last_contact: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
      };
      if (editing) {
        const { error } = await supabase.from('admin_contacts').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success(`Contact "${form.name}" mis à jour !`);
      } else {
        const { error } = await supabase.from('admin_contacts').insert([payload]);
        if (error) throw error;
        toast.success(`Contact "${form.name}" ajouté !`);
      }
      setShowModal(false);
      fetchContacts();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('admin_contacts').delete().eq('id', id);
      if (error) throw error;
      if (selected?.id === id) setSelected(null);
      setConfirmDelete(null);
      toast.success("Contact supprimé.");
      fetchContacts();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopiedId(key); setTimeout(() => setCopiedId(null), 1500); });
  };

  const counts = types.slice(1).reduce((acc, t) => ({ ...acc, [t]: contacts.filter(c => c.type === t).length }), {} as Record<string, number>);

  return (
    <div className="space-y-4" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total", val: contacts.length, color: "#1B2A4A", bg: "rgba(27,42,74,0.08)" },
          { label: "Clients", val: counts["Client"] || 0, color: "#2563EB", bg: "rgba(59,130,246,0.1)" },
          { label: "Fournisseurs", val: counts["Fournisseur"] || 0, color: "#7C3AED", bg: "rgba(139,92,246,0.1)" },
          { label: "Partenaires", val: counts["Partenaire"] || 0, color: "#D97706", bg: "rgba(245,166,35,0.12)" },
          { label: "Staff & Moniteurs", val: (counts["Staff"] || 0) + (counts["Moniteur"] || 0), color: "#16A34A", bg: "rgba(34,197,94,0.1)" },
        ].map(k => (
          <Card key={k.label} className="px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0" style={{ background: k.bg, color: k.color }}>{k.val}</div>
            <span className="text-xs font-medium" style={{ color: "#6B7A99" }}>{k.label}</span>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7A99" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un contact..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
          </div>
          <div className="flex gap-1">
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                style={{ background: typeFilter === t ? "#1B2A4A" : "#F0F2F5", color: typeFilter === t ? "white" : "#6B7A99" }}>{t}</button>
            ))}
          </div>
          <div className="flex gap-1 ml-auto">
            {(["grid", "table"] as const).map(v => (
              <button key={v} onClick={() => setView(v)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: view === v ? "#1B2A4A" : "#F0F2F5" }}>
                {v === "grid" ? <Layers size={14} style={{ color: view === v ? "white" : "#6B7A99" }} /> : <ClipboardList size={14} style={{ color: view === v ? "white" : "#6B7A99" }} />}
              </button>
            ))}
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
            <UserPlus size={15} /> Ajouter
          </button>
        </div>
      </Card>

      {/* Content */}
      <div className="flex gap-4">
        {/* Grid / Table */}
        <div className="flex-1 min-w-0">
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(c => (
                <Card key={c.id} className={`p-4 cursor-pointer transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] ${selected?.id === c.id ? "ring-2 ring-amber-400" : ""}`}
                  onClick={() => setSelected(c)}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0" style={{ background: avatarColor(c.name) }}>{initials(c.name)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate" style={{ color: "#1B2A4A" }}>{c.name}</div>
                      {c.role && <div className="text-xs truncate" style={{ color: "#6B7A99" }}>{c.role}</div>}
                      {c.company && <div className="text-xs font-medium truncate" style={{ color: "#F5A623" }}>{c.company}</div>}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0" style={{ background: contactTypeColors[c.type].bg, color: contactTypeColors[c.type].text }}>{c.type}</span>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs" style={{ color: "#6B7A99" }}>
                      <Phone size={11} /><span className="truncate">{c.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "#6B7A99" }}>
                      <AtSign size={11} /><span className="truncate">{c.email}</span>
                    </div>
                    {c.address && <div className="flex items-center gap-2 text-xs" style={{ color: "#6B7A99" }}><MapPin size={11} /><span className="truncate">{c.address}</span></div>}
                  </div>
                  {c.tags && c.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {c.tags.map(tag => <span key={tag} className="px-1.5 py-0.5 rounded text-xs" style={{ background: "#F0F2F5", color: "#6B7A99" }}>{tag}</span>)}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "rgba(27,42,74,0.07)" }}>
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>Dernier contact : {c.lastContact || "—"}</span>
                    <div className="flex gap-1">
                      <button onClick={e => { e.stopPropagation(); openEdit(c); }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50"><Pencil size={12} style={{ color: "#3B82F6" }} /></button>
                      <button onClick={e => { e.stopPropagation(); setConfirmDelete(c.id); }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 size={12} style={{ color: "#EF4444" }} /></button>
                    </div>
                  </div>
                </Card>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-3 flex flex-col items-center justify-center py-20">
                  <Users size={32} className="mb-3" style={{ color: "#B8C0D0" }} />
                  <p className="text-sm" style={{ color: "#6B7A99" }}>Aucun contact trouvé.</p>
                </div>
              )}
            </div>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#F8F9FB" }}>
                      {["Contact", "Type", "Téléphone", "Email", "Entreprise", "Dernier contact", "Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: "#6B7A99" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c => (
                      <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors cursor-pointer" style={{ borderColor: "rgba(27,42,74,0.06)" }} onClick={() => setSelected(c)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: avatarColor(c.name) }}>{initials(c.name)}</div>
                            <div><div className="text-xs font-semibold" style={{ color: "#1B2A4A" }}>{c.name}</div>{c.role && <div className="text-xs" style={{ color: "#6B7A99" }}>{c.role}</div>}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: contactTypeColors[c.type].bg, color: contactTypeColors[c.type].text }}>{c.type}</span></td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#6B7A99" }}>{c.phone}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#6B7A99" }}>{c.email}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#6B7A99" }}>{c.company || "—"}</td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#9CA3AF" }}>{c.lastContact || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={e => { e.stopPropagation(); openEdit(c); }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50"><Pencil size={12} style={{ color: "#3B82F6" }} /></button>
                            <button onClick={e => { e.stopPropagation(); setConfirmDelete(c.id); }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 size={12} style={{ color: "#EF4444" }} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-80 flex-shrink-0">
            <Card className="overflow-hidden sticky top-20">
              {/* Header */}
              <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: "rgba(27,42,74,0.08)", background: "linear-gradient(135deg, #0F1C30, #1B2A4A)" }}>
                <span className="text-sm font-semibold text-white">Fiche contact</span>
                <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}><X size={14} style={{ color: "white" }} /></button>
              </div>
              {/* Avatar + name */}
              <div className="px-5 py-5 text-center border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-3" style={{ background: avatarColor(selected.name) }}>{initials(selected.name)}</div>
                <div className="font-bold text-base" style={{ color: "#1B2A4A" }}>{selected.name}</div>
                {selected.role && <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{selected.role}</div>}
                {selected.company && <div className="text-xs font-semibold mt-1" style={{ color: "#F5A623" }}>{selected.company}</div>}
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mt-2" style={{ background: contactTypeColors[selected.type].bg, color: contactTypeColors[selected.type].text }}>{selected.type}</span>
              </div>
              {/* Contact info */}
              <div className="px-5 py-4 space-y-3 border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
                {[
                  { icon: <Phone size={13} />, label: "Téléphone", val: selected.phone, key: "phone" },
                  ...(selected.whatsapp ? [{ icon: <Smartphone size={13} />, label: "WhatsApp", val: selected.whatsapp, key: "wa" }] : []),
                  { icon: <AtSign size={13} />, label: "Email", val: selected.email, key: "email" },
                  ...(selected.address ? [{ icon: <MapPin size={13} />, label: "Adresse", val: selected.address, key: "addr" }] : []),
                  ...(selected.website ? [{ icon: <Globe size={13} />, label: "Site web", val: selected.website, key: "web" }] : []),
                ].map(row => (
                  <div key={row.key} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded flex items-center justify-center mt-0.5 flex-shrink-0" style={{ color: "#6B7A99" }}>{row.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs mb-0.5" style={{ color: "#9CA3AF" }}>{row.label}</div>
                      <div className="text-xs font-medium truncate" style={{ color: "#1B2A4A" }}>{row.val}</div>
                    </div>
                    <button onClick={() => copyToClipboard(row.val, row.key)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 flex-shrink-0">
                      {copiedId === row.key ? <CheckCheck size={11} style={{ color: "#22C55E" }} /> : <Copy size={11} style={{ color: "#9CA3AF" }} />}
                    </button>
                  </div>
                ))}
              </div>
              {/* Tags */}
              {selected.tags && selected.tags.length > 0 && (
                <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
                  <div className="text-xs font-semibold mb-2" style={{ color: "#9CA3AF" }}>Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "rgba(27,42,74,0.06)", color: "#1B2A4A" }}>{t}</span>)}
                  </div>
                </div>
              )}
              {/* Notes */}
              {selected.notes && (
                <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
                  <div className="text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Notes</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#6B7A99" }}>{selected.notes}</p>
                </div>
              )}
              {/* Actions */}
              <div className="px-5 py-4 flex gap-2">
                <button onClick={() => openEdit(selected)} className="flex-1 py-2 text-xs font-bold rounded-lg text-white" style={{ background: "#1B2A4A" }}>
                  Modifier
                </button>
                <button onClick={() => setConfirmDelete(selected.id)} className="flex-1 py-2 text-xs font-bold rounded-lg border" style={{ borderColor: "#EF4444", color: "#EF4444" }}>
                  Supprimer
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {confirmDelete !== null && (
        <ConfirmDialog
          message={`Supprimer "${contacts.find(c => c.id === confirmDelete)?.name}" de la liste des contacts ?`}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ fontFamily: "Inter, sans-serif" }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="px-6 py-5 border-b flex items-center justify-between sticky top-0 bg-white z-10" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <h2 className="font-bold text-base" style={{ color: "#1B2A4A" }}>{editing ? "Modifier le contact" : "Nouveau contact"}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Type */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "#1B2A4A" }}>Type de contact</label>
                <div className="flex flex-wrap gap-2">
                  {(["Client", "Fournisseur", "Partenaire", "Staff", "Moniteur"] as ContactType[]).map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                      style={{ background: form.type === t ? contactTypeColors[t].bg : "#F0F2F5", color: form.type === t ? contactTypeColors[t].text : "#6B7A99", border: form.type === t ? `1.5px solid ${contactTypeColors[t].text}50` : "1.5px solid transparent" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Nom complet <span style={{ color: "#EF4444" }}>*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Prénom Nom" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Téléphone <span style={{ color: "#EF4444" }}>*</span></label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="+216 XX XXX XXX" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>WhatsApp</label>
                  <input value={form.whatsapp || ""} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="+216 XX XXX XXX" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="email@exemple.com" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Entreprise</label>
                  <input value={form.company || ""} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Nom de l'entreprise" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Rôle / Fonction</label>
                  <input value={form.role || ""} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Ex: Directeur RH" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Adresse</label>
                  <input value={form.address || ""} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Ville, Gouvernorat" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Site web</label>
                  <input value={form.website || ""} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="www.exemple.tn" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Notes</label>
                  <textarea value={form.notes || ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none" placeholder="Informations complémentaires..." style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3 justify-end sticky bottom-0 bg-white" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>Annuler</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm font-bold rounded-lg text-white flex items-center gap-2" style={{ background: "#F5A623", color: "#0F1C30" }}>
                <Save size={14} /> {editing ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Matériels Page ───────────────────────────────────────────────────────────
type MaterielCondition = "Excellent" | "Bon" | "Usagé" | "En réparation";
type MaterielCategory = "Escalade" | "Kayak" | "Paintball" | "Camping" | "Sécurité" | "Animation" | "Formation" | "Tyrolienne";

interface Assignment { person: string; qty: number; since: string; returnDate?: string; }

interface Materiel {
  id: number; name: string; category: MaterielCategory;
  image: string; description: string;
  totalQty: number; availableQty: number;
  assignments: Assignment[];
  rentalPricePerDay: number; purchasePrice?: number;
  condition: MaterielCondition; serialNumber?: string;
  purchaseDate?: string; location?: string;
}

const conditionColors: Record<MaterielCondition, { bg: string; text: string }> = {
  "Excellent": { bg: "rgba(34,197,94,0.1)", text: "#16A34A" },
  "Bon": { bg: "rgba(59,130,246,0.1)", text: "#2563EB" },
  "Usagé": { bg: "rgba(245,166,35,0.12)", text: "#D97706" },
  "En réparation": { bg: "rgba(239,68,68,0.1)", text: "#DC2626" },
};

const catColors: Record<MaterielCategory, string> = {
  "Escalade": "#F5A623", "Kayak": "#3B82F6", "Paintball": "#EF4444",
  "Camping": "#22C55E", "Sécurité": "#1B2A4A", "Animation": "#8B5CF6",
  "Formation": "#14B8A6", "Tyrolienne": "#F59E0B",
};

const initialMateriels: Materiel[] = [
  {
    id: 1, name: "Harnais d'escalade EDELRID", category: "Escalade",
    image: "photo-1522163182402-834f871fd851",
    description: "Harnais confort homologué CE EN 12277, réglage rapide, boucles aluminium anodisé. Idéal accrobranche et escalade en groupe.",
    totalQty: 30, availableQty: 18,
    assignments: [{ person: "Amine Trabelsi", qty: 8, since: "12 Jun 2025", returnDate: "22 Jun 2025" }, { person: "Groupe TechCorp", qty: 4, since: "14 Jun 2025", returnDate: "14 Jun 2025" }],
    rentalPricePerDay: 8, purchasePrice: 120, condition: "Bon",
    serialNumber: "EDL-2024-001", purchaseDate: "Jan 2024", location: "Entrepôt A — Étagère 2",
  },
  {
    id: 2, name: "Casque PETZL Vertex", category: "Sécurité",
    image: "photo-1581291518857-4e27b48ff24e",
    description: "Casque de protection toutes activités vertical et alpin, ventilation réglable, jugulaire 4 points, homologué EN 12492.",
    totalQty: 40, availableQty: 32,
    assignments: [{ person: "Réservation R-0040", qty: 8, since: "10 Jun 2025" }],
    rentalPricePerDay: 5, purchasePrice: 85, condition: "Excellent",
    serialNumber: "PTZ-VERT-2024", purchaseDate: "Fév 2024", location: "Entrepôt A — Étagère 1",
  },
  {
    id: 3, name: "Kayak Gonflable Sea Eagle", category: "Kayak",
    image: "photo-1544551763-46a013bb70d5",
    description: "Kayak 2 places gonflable haute résistance, PVC 1100D, accessoires inclus (pagaies, gilets). Capacité 200 kg.",
    totalQty: 12, availableQty: 7,
    assignments: [{ person: "Club Kayak Bizerte", qty: 3, since: "08 Jun 2025", returnDate: "20 Jun 2025" }, { person: "Groupe école", qty: 2, since: "13 Jun 2025" }],
    rentalPricePerDay: 45, purchasePrice: 380, condition: "Bon",
    purchaseDate: "Mar 2023", location: "Entrepôt B — Zone eau",
  },
  {
    id: 4, name: "Marqueur Paintball Empire Axe", category: "Paintball",
    image: "photo-1593697821252-0c213d7b4f3f",
    description: "Marqueur électropneumatique, régulateur HPA intégré, cadence 15 bps, poignée ergonomique. Précision et fiabilité.",
    totalQty: 25, availableQty: 25,
    assignments: [],
    rentalPricePerDay: 15, purchasePrice: 290, condition: "Excellent",
    serialNumber: "EMP-AXE-BATCH3", purchaseDate: "Nov 2023", location: "Armurerie Paintball",
  },
  {
    id: 5, name: "Tente 6 places Quechua", category: "Camping",
    image: "photo-1478131143081-80f7f84ca84d",
    description: "Tente 2 secondes Easy Fresh & Black, imperméabilité 2000mm, 2 pièces séparées, montage ultra-rapide.",
    totalQty: 15, availableQty: 9,
    assignments: [{ person: "Camp été groupe 1", qty: 6, since: "10 Jun 2025", returnDate: "17 Jun 2025" }],
    rentalPricePerDay: 20, purchasePrice: 180, condition: "Bon",
    purchaseDate: "Avr 2022", location: "Entrepôt B — Zone camping",
  },
  {
    id: 6, name: "Tyrolienne 200m Steel Cable", category: "Tyrolienne",
    image: "photo-1551632811-561732d1e306",
    description: "Câble acier inoxydable 10mm, résistance 1500kg, poulie freinage magnétique, système arrêt progressif automatique.",
    totalQty: 2, availableQty: 2,
    assignments: [],
    rentalPricePerDay: 200, purchasePrice: 3500, condition: "Excellent",
    serialNumber: "TYR-STEEL-2024-001", purchaseDate: "Jan 2024", location: "Installation permanente site A",
  },
  {
    id: 7, name: "Kit Paintball Masque+Gilet", category: "Paintball",
    image: "photo-1581578731548-c64695cc6952",
    description: "Ensemble protection complète: masque double lentille anti-buée, gilet anti-éclaboussures rembourré, taille unique.",
    totalQty: 30, availableQty: 14,
    assignments: [{ person: "Réservation R-0040 — Paintball", qty: 16, since: "13 Jun 2025", returnDate: "13 Jun 2025" }],
    rentalPricePerDay: 12, purchasePrice: 65, condition: "Usagé",
    purchaseDate: "Jan 2022", location: "Armurerie Paintball",
  },
  {
    id: 8, name: "Tableau blanc + Kit animation", category: "Animation",
    image: "photo-1542744173-8e7e53415bb0",
    description: "Tableau blanc magnétique 120×90cm, kit complet de 120 marqueurs, aimants et gomme. Idéal séminaires et team building.",
    totalQty: 5, availableQty: 3,
    assignments: [{ person: "Formation corporate — Juin", qty: 2, since: "15 Jun 2025" }],
    rentalPricePerDay: 25, purchasePrice: 145, condition: "Bon",
    location: "Salle de réunion",
  },
];

function MaterielsPage() {
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
        toast.success(`"${form.name}" mis à jour !`);
      } else {
        const { error } = await supabase.from('materiels').insert([payload]);
        if (error) throw error;
        toast.success(`"${form.name}" ajouté à l'inventaire !`);
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
    if (assignForm.qty > showAssignModal.availableQty) { toast.error(`Seulement ${showAssignModal.availableQty} disponibles.`); return; }
    
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
      toast.success(`${assignForm.qty}× "${showAssignModal.name}" attribué à ${assignForm.person} !`);
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
  };

  return (
    <div className="space-y-4" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total articles", val: totalItems, icon: <Box size={20} />, iconBg: "rgba(27,42,74,0.08)", iconColor: "#1B2A4A" },
          { label: "Disponibles", val: availableItems, icon: <PackageCheck size={20} />, iconBg: "rgba(34,197,94,0.1)", iconColor: "#22C55E" },
          { label: "En location/usage", val: inUse, icon: <Layers size={20} />, iconBg: "rgba(245,166,35,0.12)", iconColor: "#F5A623" },
          { label: "En réparation", val: inRepair, icon: <Wrench size={20} />, iconBg: "rgba(239,68,68,0.1)", iconColor: "#EF4444" },
        ].map(k => (
          <Card key={k.label} className="p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: k.iconBg }}>
                <span style={{ color: k.iconColor }}>{k.icon}</span>
              </div>
            </div>
            <div className="text-2xl font-bold mb-0.5" style={{ color: "#1B2A4A" }}>{k.val}</div>
            <div className="text-xs" style={{ color: "#6B7A99" }}>{k.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7A99" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un matériel..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className="px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors"
                style={{ background: catFilter === c ? "#1B2A4A" : "#F0F2F5", color: catFilter === c ? "white" : "#6B7A99" }}>{c}</button>
            ))}
          </div>
          <select value={condFilter} onChange={e => setCondFilter(e.target.value)} className="px-3 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
            {["Tous", "Excellent", "Bon", "Usagé", "En réparation"].map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg text-white flex-shrink-0" style={{ background: "#F5A623", color: "#0F1C30" }}>
            <Plus size={15} /> Ajouter un matériel
          </button>
        </div>
      </Card>

      {/* Grid + Detail panel */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(m => {
              const pct = Math.round((m.availableQty / m.totalQty) * 100);
              return (
                <Card key={m.id} className={`overflow-hidden cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all ${selected?.id === m.id ? "ring-2 ring-amber-400" : ""}`}
                  onClick={() => setSelected(m)}>
                  {/* Image */}
                  <div className="relative h-40 bg-gray-100">
                    <img src={`https://images.unsplash.com/${m.image}?w=400&h=160&fit=crop&auto=format`} alt={m.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(15,28,48,0.75))" }} />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: catColors[m.category] || "#1B2A4A", color: "white" }}>{m.category}</div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: conditionColors[m.condition].bg, color: conditionColors[m.condition].text, backdropFilter: "blur(4px)" }}>{m.condition}</div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                      <span className="text-white font-bold text-sm leading-tight" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{m.name}</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(245,166,35,0.9)", color: "#0F1C30" }}>{m.rentalPricePerDay} TND/j</span>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="p-4">
                    <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "#6B7A99" }}>{m.description}</p>
                    {/* Availability bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: "#6B7A99" }}>Disponibilité</span>
                        <span className="font-semibold font-mono" style={{ color: pct > 50 ? "#22C55E" : pct > 20 ? "#F5A623" : "#EF4444" }}>{m.availableQty}/{m.totalQty}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F0F2F5" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 50 ? "#22C55E" : pct > 20 ? "#F5A623" : "#EF4444" }} />
                      </div>
                    </div>
                    {/* Assignments count */}
                    {m.assignments.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex -space-x-1.5">
                          {m.assignments.slice(0, 3).map((a, i) => (
                            <div key={i} className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-xs font-bold text-white" style={{ background: avatarColor(a.person), fontSize: 8 }}>{a.person[0]}</div>
                          ))}
                        </div>
                        <span className="text-xs" style={{ color: "#6B7A99" }}>{m.assignments.length} attribution{m.assignments.length > 1 ? "s" : ""}</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-3 border-t" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
                      <button onClick={e => { e.stopPropagation(); setShowAssignModal(m); }} disabled={m.availableQty === 0}
                        className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40"
                        style={{ background: "rgba(245,166,35,0.1)", color: "#D97706" }}>
                        Attribuer
                      </button>
                      <button onClick={e => { e.stopPropagation(); openEdit(m); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-50"><Pencil size={13} style={{ color: "#3B82F6" }} /></button>
                      <button onClick={e => { e.stopPropagation(); setConfirmDelete(m.id); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 size={13} style={{ color: "#EF4444" }} /></button>
                    </div>
                  </div>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-3 flex flex-col items-center justify-center py-20">
                <Box size={32} className="mb-3" style={{ color: "#B8C0D0" }} />
                <p className="text-sm" style={{ color: "#6B7A99" }}>Aucun matériel trouvé.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-80 flex-shrink-0">
            <Card className="overflow-hidden sticky top-20">
              {/* Header image */}
              <div className="relative h-36">
                <img src={`https://images.unsplash.com/${selected.image}?w=320&h=144&fit=crop&auto=format`} alt={selected.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 20%, rgba(15,28,48,0.85))" }} />
                <button onClick={() => setSelected(null)} className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}><X size={14} style={{ color: "white" }} /></button>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white font-bold text-sm leading-tight">{selected.name}</div>
                  <div className="flex gap-1.5 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: catColors[selected.category] || "#1B2A4A", color: "white" }}>{selected.category}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: conditionColors[selected.condition].bg, color: conditionColors[selected.condition].text }}>{selected.condition}</span>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
                {/* Availability */}
                <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "Total", val: selected.totalQty, color: "#1B2A4A" },
                      { label: "Disponibles", val: selected.availableQty, color: "#22C55E" },
                      { label: "En usage", val: selected.totalQty - selected.availableQty, color: "#F5A623" },
                    ].map(s => (
                      <div key={s.label} className="rounded-lg py-2" style={{ background: "#F8F9FB" }}>
                        <div className="text-lg font-bold" style={{ color: s.color }}>{s.val}</div>
                        <div className="text-xs" style={{ color: "#9CA3AF" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
                  <p className="text-xs leading-relaxed" style={{ color: "#6B7A99" }}>{selected.description}</p>
                </div>

                {/* Info grid */}
                <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Prix location", val: `${selected.rentalPricePerDay} TND/j`, color: "#F5A623" },
                      ...(selected.purchasePrice ? [{ label: "Prix achat", val: `${selected.purchasePrice} TND`, color: "#1B2A4A" }] : []),
                      ...(selected.location ? [{ label: "Emplacement", val: selected.location, color: "#1B2A4A" }] : []),
                      ...(selected.serialNumber ? [{ label: "N° série", val: selected.serialNumber, color: "#6B7A99" }] : []),
                      ...(selected.purchaseDate ? [{ label: "Date achat", val: selected.purchaseDate, color: "#6B7A99" }] : []),
                    ].map(r => (
                      <div key={r.label} className="rounded-lg p-2.5" style={{ background: "#F8F9FB" }}>
                        <div className="text-xs mb-0.5" style={{ color: "#9CA3AF" }}>{r.label}</div>
                        <div className="text-xs font-semibold" style={{ color: r.color }}>{r.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignments */}
                <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#6B7A99" }}>Attributions ({selected.assignments.length})</span>
                    <button onClick={() => setShowAssignModal(selected)} disabled={selected.availableQty === 0}
                      className="flex items-center gap-1 text-xs font-semibold disabled:opacity-40" style={{ color: "#F5A623" }}>
                      <Plus size={11} /> Attribuer
                    </button>
                  </div>
                  {selected.assignments.length === 0 ? (
                    <p className="text-xs py-2 text-center" style={{ color: "#9CA3AF" }}>Aucune attribution active</p>
                  ) : selected.assignments.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl mb-2" style={{ background: "#F8F9FB" }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: avatarColor(a.person) }}>{a.person[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: "#1B2A4A" }}>{a.person}</div>
                        <div className="text-xs" style={{ color: "#9CA3AF" }}>{a.qty}× · depuis {a.since}{a.returnDate ? ` · retour ${a.returnDate}` : ""}</div>
                      </div>
                      <button onClick={() => handleReturn(selected.id, i)} className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ background: "rgba(34,197,94,0.1)", color: "#16A34A" }}>Retour</button>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(selected)} className="flex-1 py-2 text-xs font-bold rounded-lg text-white" style={{ background: "#1B2A4A" }}>Modifier</button>
                  <button onClick={() => setConfirmDelete(selected.id)} className="flex-1 py-2 text-xs font-bold rounded-lg border" style={{ borderColor: "#EF4444", color: "#EF4444" }}>Supprimer</button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {confirmDelete !== null && (
        <ConfirmDialog
          message={`Supprimer "${materiels.find(m => m.id === confirmDelete)?.name}" de l'inventaire ?`}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ fontFamily: "Inter, sans-serif" }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAssignModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <div>
                <h2 className="font-bold text-base" style={{ color: "#1B2A4A" }}>Attribuer le matériel</h2>
                <p className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{showAssignModal.name} — {showAssignModal.availableQty} disponibles</p>
              </div>
              <button onClick={() => setShowAssignModal(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F8F9FB" }}>
                <img src={`https://images.unsplash.com/${showAssignModal.image}?w=56&h=56&fit=crop&auto=format`} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{showAssignModal.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{showAssignModal.rentalPricePerDay} TND/jour · {showAssignModal.availableQty} dispo</div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Attribué à <span style={{ color: "#EF4444" }}>*</span></label>
                <input value={assignForm.person} onChange={e => setAssignForm(f => ({ ...f, person: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Nom, groupe ou réservation..." style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Quantité</label>
                  <input type="number" min={1} max={showAssignModal.availableQty} value={assignForm.qty} onChange={e => setAssignForm(f => ({ ...f, qty: Math.min(Number(e.target.value), showAssignModal.availableQty) }))}
                    className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Date de retour prévue</label>
                  <input type="date" value={assignForm.returnDate} onChange={e => setAssignForm(f => ({ ...f, returnDate: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
              </div>
              {/* Cost estimate */}
              {assignForm.returnDate && assignForm.qty > 0 && (
                <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: "#D97706" }}>Estimation du coût</div>
                  <div className="text-sm font-bold font-mono" style={{ color: "#1B2A4A" }}>
                    {(() => {
                      const days = Math.max(1, Math.ceil((new Date(assignForm.returnDate).getTime() - Date.now()) / 86400000));
                      return `${days} jour${days > 1 ? "s" : ""} × ${assignForm.qty} × ${showAssignModal.rentalPricePerDay} TND = ${days * assignForm.qty * showAssignModal.rentalPricePerDay} TND`;
                    })()}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t flex gap-3 justify-end" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <button onClick={() => setShowAssignModal(null)} className="px-5 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>Annuler</button>
              <button onClick={handleAssign} className="px-5 py-2.5 text-sm font-bold rounded-lg text-white flex items-center gap-2" style={{ background: "#F5A623", color: "#0F1C30" }}>
                <Check size={14} /> Confirmer l'attribution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ fontFamily: "Inter, sans-serif" }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="px-6 py-5 border-b flex items-center justify-between sticky top-0 bg-white z-10" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <h2 className="font-bold text-base" style={{ color: "#1B2A4A" }}>{editing ? "Modifier le matériel" : "Nouveau matériel"}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Photo preview */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "#1B2A4A" }}>Photo du matériel</label>
                {form.image && (
                  <div className="h-32 rounded-xl overflow-hidden mb-2 bg-gray-100">
                    <img src={`https://images.unsplash.com/${form.image}?w=500&h=128&fit=crop&auto=format`} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="rounded-xl border-2 border-dashed p-3 text-center cursor-pointer hover:bg-amber-50 transition-colors" style={{ borderColor: "rgba(245,166,35,0.4)" }} onClick={() => toast.info("Upload disponible en production.")}>
                  <Upload size={16} className="mx-auto mb-1" style={{ color: "#F5A623" }} />
                  <p className="text-xs" style={{ color: "#6B7A99" }}>Glissez une photo ou <span style={{ color: "#F5A623" }}>parcourez</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Nom du matériel <span style={{ color: "#EF4444" }}>*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Ex: Harnais EDELRID" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Catégorie</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as MaterielCategory }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                    {(["Escalade", "Kayak", "Paintball", "Camping", "Sécurité", "Animation", "Formation", "Tyrolienne"] as MaterielCategory[]).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>État / Condition</label>
                  <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value as MaterielCondition }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                    {(["Excellent", "Bon", "Usagé", "En réparation"] as MaterielCondition[]).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Quantité totale</label>
                  <input type="number" min={1} value={form.totalQty} onChange={e => { const v = Number(e.target.value); setForm(f => ({ ...f, totalQty: v, availableQty: Math.min(f.availableQty, v) })); }} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none font-mono" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Quantité disponible</label>
                  <input type="number" min={0} max={form.totalQty} value={form.availableQty} onChange={e => setForm(f => ({ ...f, availableQty: Math.min(Number(e.target.value), form.totalQty) }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none font-mono" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Prix de location (TND/jour)</label>
                  <input type="number" min={0} value={form.rentalPricePerDay} onChange={e => setForm(f => ({ ...f, rentalPricePerDay: Number(e.target.value) }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none font-mono" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Prix d&apos;achat (TND)</label>
                  <input type="number" min={0} value={form.purchasePrice || 0} onChange={e => setForm(f => ({ ...f, purchasePrice: Number(e.target.value) }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none font-mono" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>N° de série</label>
                  <input value={form.serialNumber || ""} onChange={e => setForm(f => ({ ...f, serialNumber: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none font-mono" placeholder="Ex: ABC-2024-001" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Date d&apos;achat</label>
                  <input value={form.purchaseDate || ""} onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Ex: Jan 2024" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Emplacement de stockage</label>
                  <input value={form.location || ""} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Ex: Entrepôt A — Étagère 2" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none" placeholder="Caractéristiques, normes, détails techniques..." style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3 justify-end sticky bottom-0 bg-white" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>Annuler</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm font-bold rounded-lg text-white flex items-center gap-2" style={{ background: "#F5A623", color: "#0F1C30" }}>
                <Save size={14} /> {editing ? "Enregistrer" : "Ajouter à l'inventaire"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FAQ Page (standalone) ────────────────────────────────────────────────────
function FAQPage() {
  const [faq, setFaq] = useState<{ id: number; question: string; answer: string; emoji?: string; tag?: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchFaq(); }, []);

  const fetchFaq = async () => {
    const { data } = await supabase.from('faq').select('*').order('display_order', { ascending: true });
    if (data && data.length > 0) setFaq(data.map((f: any) => ({ id: f.id, question: f.question, answer: f.answer, emoji: f.emoji || '❓', tag: f.tag || '' })));
    else setFaq(initialFaq.map(f => ({ ...f, emoji: '❓', tag: '' })));
  };

  const addItem = () => setFaq(prev => [...prev, { id: Date.now(), question: '', answer: '', emoji: '❓', tag: '' }]);

  const deleteItem = async (id: number) => {
    try {
      if (id > 1000000) { setFaq(prev => prev.filter(f => f.id !== id)); return; }
      await supabase.from('faq').delete().eq('id', id);
      setFaq(prev => prev.filter(f => f.id !== id));
      toast.success('Question supprimée.');
    } catch (e: any) { toast.error(e.message); }
  };

  const saveFaq = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < faq.length; i++) {
        const item = faq[i];
        if (!item.question.trim()) continue;
        const payload = { question: item.question, answer: item.answer, emoji: item.emoji || '❓', tag: item.tag || '', display_order: i + 1 };
        if (item.id > 1000000) await supabase.from('faq').insert([payload]);
        else await supabase.from('faq').update(payload).eq('id', item.id);
      }
      toast.success('FAQ enregistrée avec succès !');
      fetchFaq();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  return (
    <Card className="p-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-base" style={{ color: "#1B2A4A" }}>Éditeur FAQ</h3>
          <p className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>Gérez les questions fréquentes affichées sur votre site</p>
        </div>
        <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
          <Plus size={14} /> Ajouter une question
        </button>
      </div>
      <div className="space-y-3 max-w-3xl">
        {faq.map((item, i) => (
          <div key={item.id} className="rounded-xl p-4" style={{ background: "#F8F9FB", border: "1px solid rgba(27,42,74,0.06)" }}>
            <div className="flex items-center gap-3 mb-3">
              <GripVertical size={14} style={{ color: "#B8C0D0" }} className="cursor-grab flex-shrink-0" />
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#1B2A4A", color: "white" }}>Q{i + 1}</span>
              <input value={item.emoji || '❓'} onChange={e => setFaq(prev => prev.map(f => f.id === item.id ? { ...f, emoji: e.target.value } : f))} className="w-10 text-center rounded-lg outline-none" style={{ background: 'transparent', border: 'none', fontSize: 18 }} />
              <button onClick={() => deleteItem(item.id)} className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 size={13} style={{ color: "#EF4444" }} /></button>
            </div>
            <input value={item.question} onChange={e => setFaq(prev => prev.map(f => f.id === item.id ? { ...f, question: e.target.value } : f))}
              className="w-full px-3 py-2 text-sm rounded-lg outline-none mb-2" placeholder="Question..."
              style={{ background: "white", border: "1px solid rgba(27,42,74,0.1)", color: "#1B2A4A" }} />
            <textarea value={item.answer} onChange={e => setFaq(prev => prev.map(f => f.id === item.id ? { ...f, answer: e.target.value } : f))}
              rows={3} className="w-full px-3 py-2 text-sm rounded-lg outline-none resize-none" placeholder="Réponse détaillée..."
              style={{ background: "white", border: "1px solid rgba(27,42,74,0.1)", color: "#1B2A4A" }} />
          </div>
        ))}
      </div>
      {faq.length === 0 && <div className="text-center py-12 text-sm" style={{ color: "#9CA3AF" }}>Aucune question pour le moment.</div>}
      <button onClick={saveFaq} disabled={saving} className="mt-5 px-6 py-2.5 text-sm font-bold rounded-xl text-white flex items-center gap-2" style={{ background: "#F5A623", color: "#0F1C30", opacity: saving ? 0.7 : 1 }}>
        {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer la FAQ
      </button>
    </Card>
  );
}

// ─── Sponsors Page ─────────────────────────────────────────────────────────────
type SponsorTier = "Or" | "Argent" | "Bronze" | "Partenaire";
const sponsorTierColors: Record<SponsorTier, { bg: string; text: string; border: string }> = {
  "Or": { bg: "rgba(245,166,35,0.12)", text: "#D97706", border: "rgba(245,166,35,0.4)" },
  "Argent": { bg: "rgba(107,114,128,0.1)", text: "#4B5563", border: "rgba(107,114,128,0.3)" },
  "Bronze": { bg: "rgba(180,120,60,0.1)", text: "#7C5C3A", border: "rgba(180,120,60,0.3)" },
  "Partenaire": { bg: "rgba(59,130,246,0.1)", text: "#2563EB", border: "rgba(59,130,246,0.3)" },
};
interface Sponsor { id: number; name: string; logo: string; tier: SponsorTier; website: string; description: string; active: boolean; since: string; }
const initialSponsors: Sponsor[] = [
  { id: 1, name: "Tunisie Telecom", logo: "🏢", tier: "Or", website: "tunisietelecom.tn", description: "Sponsor principal et partenaire télécom officiel depuis 2023.", active: true, since: "Jan 2023" },
  { id: 2, name: "BIAT Bank", logo: "🏦", tier: "Or", website: "biat.com.tn", description: "Partenaire financier, accompagne nos événements corporate.", active: true, since: "Mar 2023" },
  { id: 3, name: "OutdoorPro TN", logo: "⛺", tier: "Argent", website: "outdoorpro.tn", description: "Fournisseur officiel d'équipements outdoor.", active: true, since: "Jun 2023" },
  { id: 4, name: "Aventura Voyages", logo: "✈️", tier: "Partenaire", website: "aventura.tn", description: "Partenariat pour l'envoi de groupes touristiques.", active: true, since: "Sep 2023" },
  { id: 5, name: "MediaPro TN", logo: "📸", tier: "Bronze", website: "mediapro.tn", description: "Studio photo et vidéo officiel des événements Yakoo.", active: false, since: "Déc 2023" },
];
function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const emptyForm = { name: '', logo: '🏢', tier: 'Partenaire' as SponsorTier, website: '', description: '', active: true, since: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchSponsors(); }, []);

  const fetchSponsors = async () => {
    const { data } = await supabase.from('sponsors').select('*').order('id', { ascending: true });
    if (data && data.length > 0) setSponsors(data.map((s: any) => ({ id: s.id, name: s.name, logo: s.logo, tier: s.tier as SponsorTier, website: s.website || '', description: s.description || '', active: s.active, since: s.since || '' })));
    else setSponsors(initialSponsors);
  };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (s: Sponsor) => { setEditing(s); setForm({ ...s }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Nom requis.'); return; }
    try {
      const payload = { name: form.name, logo: form.logo, tier: form.tier, website: form.website, description: form.description, active: form.active, since: form.since };
      if (editing) {
        await supabase.from('sponsors').update(payload).eq('id', editing.id);
        toast.success(`Sponsor "${form.name}" mis à jour !`);
      } else {
        await supabase.from('sponsors').insert([payload]);
        toast.success(`Sponsor "${form.name}" ajouté !`);
      }
      setShowModal(false);
      fetchSponsors();
    } catch (e: any) { toast.error(e.message); }
  };

  const toggleActive = async (s: Sponsor) => {
    await supabase.from('sponsors').update({ active: !s.active }).eq('id', s.id);
    fetchSponsors();
  };

  const handleDelete = async (id: number) => {
    await supabase.from('sponsors').delete().eq('id', id);
    setConfirmDelete(null);
    toast.success('Sponsor supprimé.');
    fetchSponsors();
  };

  const tierOrder: SponsorTier[] = ['Or', 'Argent', 'Bronze', 'Partenaire'];
  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {tierOrder.map(tier => {
            const count = sponsors.filter(s => s.tier === tier && s.active).length;
            return (
              <div key={tier} className="px-4 py-2 rounded-xl flex items-center gap-2" style={{ background: sponsorTierColors[tier].bg, border: `1px solid ${sponsorTierColors[tier].border}` }}>
                <span className="text-sm font-bold" style={{ color: sponsorTierColors[tier].text }}>{tier}</span>
                <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ background: sponsorTierColors[tier].text }}>{count}</span>
              </div>
            );
          })}
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
          <Plus size={15} /> Ajouter un sponsor
        </button>
      </div>
      {tierOrder.map(tier => {
        const tierSponsors = sponsors.filter(s => s.tier === tier);
        if (!tierSponsors.length) return null;
        return (
          <div key={tier}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: sponsorTierColors[tier].text }}>
              <div className="h-px flex-1" style={{ background: sponsorTierColors[tier].border }} />
              Niveau {tier}
              <div className="h-px flex-1" style={{ background: sponsorTierColors[tier].border }} />
            </h3>
            <div className={`grid gap-4 ${tier === 'Or' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {tierSponsors.map(s => (
                <Card key={s.id} className={`overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow ${!s.active ? 'opacity-60' : ''}`}
                  style={{ border: `1px solid ${sponsorTierColors[s.tier].border}` }}>
                  <div className="px-5 py-4 flex items-center gap-4" style={{ background: sponsorTierColors[s.tier].bg }}>
                    <div className="text-4xl w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>{s.logo}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base" style={{ color: '#1B2A4A' }}>{s.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#6B7A99' }}>Sponsor depuis {s.since}</div>
                      <a href={`https://${s.website}`} target="_blank" rel="noopener" className="text-xs flex items-center gap-1 mt-1" style={{ color: sponsorTierColors[s.tier].text }}>
                        <ExternalLink size={10} /> {s.website}
                      </a>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: sponsorTierColors[s.tier].bg, color: sponsorTierColors[s.tier].text, border: `1px solid ${sponsorTierColors[s.tier].border}` }}>{s.tier}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs leading-relaxed mb-4" style={{ color: '#6B7A99' }}>{s.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleActive(s)} className="w-10 h-5 rounded-full relative transition-colors" style={{ background: s.active ? '#22C55E' : '#E8EBF0' }}>
                          <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all" style={{ left: s.active ? 'calc(100% - 18px)' : 2 }} />
                        </button>
                        <span className="text-xs font-medium" style={{ color: s.active ? '#16A34A' : '#9CA3AF' }}>{s.active ? 'Actif' : 'Inactif'}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(s)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50"><Pencil size={13} style={{ color: '#3B82F6' }} /></button>
                        <button onClick={() => setConfirmDelete(s.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 size={13} style={{ color: '#EF4444' }} /></button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      {confirmDelete !== null && (
        <ConfirmDialog message={`Supprimer "${sponsors.find(s => s.id === confirmDelete)?.name}" ?`}
          onConfirm={() => handleDelete(confirmDelete!)}
          onCancel={() => setConfirmDelete(null)} />
      )}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: 'rgba(27,42,74,0.08)' }}>
              <h2 className="font-bold text-base" style={{ color: '#1B2A4A' }}>{editing ? 'Modifier le sponsor' : 'Nouveau sponsor'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} style={{ color: '#6B7A99' }} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-semibold mb-1" style={{ color: '#1B2A4A' }}>Emoji logo</label><input value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))} className="w-full px-3 py-2.5 text-2xl text-center rounded-lg outline-none" style={{ background: '#F0F2F5', border: 'none' }} /></div>
                <div className="col-span-2"><label className="block text-xs font-semibold mb-1" style={{ color: '#1B2A4A' }}>Nom <span style={{ color: '#EF4444' }}>*</span></label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: '#F0F2F5', border: 'none', color: '#1B2A4A' }} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold mb-1.5" style={{ color: '#1B2A4A' }}>Niveau</label><select value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value as SponsorTier }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: '#F0F2F5', border: 'none', color: '#1B2A4A' }}>{tierOrder.map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label className="block text-xs font-semibold mb-1.5" style={{ color: '#1B2A4A' }}>Sponsor depuis</label><input value={form.since} onChange={e => setForm(f => ({ ...f, since: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Jan 2024" style={{ background: '#F0F2F5', border: 'none', color: '#1B2A4A' }} /></div>
              </div>
              <div><label className="block text-xs font-semibold mb-1.5" style={{ color: '#1B2A4A' }}>Site web</label><input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="www.exemple.tn" style={{ background: '#F0F2F5', border: 'none', color: '#1B2A4A' }} /></div>
              <div><label className="block text-xs font-semibold mb-1.5" style={{ color: '#1B2A4A' }}>Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none" style={{ background: '#F0F2F5', border: 'none', color: '#1B2A4A' }} /></div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3 justify-end" style={{ borderColor: 'rgba(27,42,74,0.08)' }}>
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium rounded-lg" style={{ background: '#F0F2F5', color: '#1B2A4A' }}>Annuler</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm font-bold rounded-lg text-white" style={{ background: '#F5A623', color: '#0F1C30' }}><Save size={14} className="inline mr-1.5" />{editing ? 'Enregistrer' : 'Ajouter'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Calendar Page ────────────────────────────────────────────────────────────
interface CalEvent { id: number; title: string; date: string; type: "reservation" | "task" | "event" | "reminder"; color: string; time?: string; persons?: number; location?: string; status?: "En attente" | "Confirmé" | "Annulé"; assignedMaterials?: { materialId: number; name: string; qty: number }[]; }
const MONTHS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const DAYS_AR = ["إث", "ثل", "أر", "خم", "جم", "سب", "أح"];
const initialCalEvents: CalEvent[] = [
  { id: 1, title: "Réservation Karim Benali", date: "2025-06-22", type: "reservation", color: "#F5A623", time: "10:00", persons: 12 },
  { id: 2, title: "Réservation Paintball — Groupe", date: "2025-06-20", type: "reservation", color: "#F5A623", time: "09:00", persons: 20 },
  { id: 3, title: "Maintenance Tyrolienne", date: "2025-06-18", type: "task", color: "#EF4444", time: "08:00" },
  { id: 4, title: "Réunion équipe moniteurs", date: "2025-06-19", type: "event", color: "#3B82F6", time: "14:00" },
  { id: 5, title: "Réservation Anniversaire", date: "2025-06-30", type: "reservation", color: "#F5A623", time: "11:00", persons: 15 },
  { id: 6, title: "Formation sécurité", date: "2025-06-25", type: "event", color: "#8B5CF6", time: "09:00" },
  { id: 7, title: "Rappel: Inventaire mensuel", date: "2025-06-28", type: "reminder", color: "#22C55E" },
  { id: 8, title: "Réservation Team Building", date: "2025-07-05", type: "reservation", color: "#F5A623", time: "09:00", persons: 25 },
];
function CalendarPage() {
  const { lang } = useLang();
  const MONTHS = lang === "ar" ? MONTHS_AR : MONTHS_FR;
  const DAYS = lang === "ar" ? DAYS_AR : DAYS_FR;
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", type: "event" as CalEvent["type"], time: "09:00" });
  const [editingEvent, setEditingEvent] = useState<CalEvent | null>(null);
  const [eventLocation, setEventLocation] = useState("");
  const [eventPersons, setEventPersons] = useState(0);
  const [eventStatus, setEventStatus] = useState<"En attente" | "Confirmé" | "Annulé">("Confirmé");
  const [assignedMats, setAssignedMats] = useState<{ materialId: number; name: string; qty: number }[]>([]);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        const formatted: CalEvent[] = data.map((e: any) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          type: e.type as CalEvent["type"],
          color: e.color || "#3B82F6",
          time: e.time || undefined,
          persons: e.persons || undefined,
          location: e.location || undefined,
          status: e.status || undefined,
          assignedMaterials: e.assigned_materials || [],
        }));
        setEvents(formatted);
      } else {
        await seedEvents();
      }
    } catch (err: any) {
      toast.error("Erreur chargement calendrier: " + err.message);
    } finally {
      setLoadingEvents(false);
    }
  };

  const seedEvents = async () => {
    try {
      const payload = initialCalEvents.map(({ id, assignedMaterials, ...rest }) => ({
        ...rest,
        assigned_materials: assignedMaterials || [],
      }));
      const { data, error } = await supabase.from('events').insert(payload).select();
      if (error) throw error;
      if (data) {
        const formatted: CalEvent[] = data.map((e: any) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          type: e.type as CalEvent["type"],
          color: e.color || "#3B82F6",
          time: e.time || undefined,
          persons: e.persons || undefined,
          location: e.location || undefined,
          status: e.status || undefined,
          assignedMaterials: e.assigned_materials || [],
        }));
        setEvents(formatted);
      }
    } catch (err: any) {
      console.warn("Seeding events failed:", err.message);
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
  const getKey = (d: number) => `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const typeColors: Record<CalEvent["type"], string> = { reservation: "#F5A623", task: "#EF4444", event: "#3B82F6", reminder: "#22C55E" };
  const typeLabels = { reservation: lang === "ar" ? "حجز" : "Réservation", task: lang === "ar" ? "مهمة" : "Tâche", event: lang === "ar" ? "حدث" : "Événement", reminder: lang === "ar" ? "تذكير" : "Rappel" };

  const addEvent = async () => {
    if (!newEvent.title || !selectedDay) return;
    const typeColorsMap: Record<CalEvent["type"], string> = { reservation: "#F5A623", task: "#EF4444", event: "#3B82F6", reminder: "#22C55E" };
    const payload: any = {
      title: newEvent.title,
      date: selectedDay,
      type: newEvent.type,
      color: typeColorsMap[newEvent.type],
      time: newEvent.time,
      persons: eventPersons || null,
      location: eventLocation || null,
      status: eventStatus,
      assigned_materials: assignedMats,
    };
    try {
      if (editingEvent) {
        const { error } = await supabase.from('events').update(payload).eq('id', editingEvent.id);
        if (error) throw error;
        toast.success(lang === "ar" ? "تم تحديث الحدث!" : "Événement mis à jour !");
      } else {
        const { error } = await supabase.from('events').insert([payload]);
        if (error) throw error;
        toast.success(lang === "ar" ? "تم إضافة الحدث!" : "Événement ajouté !");
      }
      setShowAdd(false);
      setNewEvent({ title: "", type: "event", time: "09:00" });
      fetchEvents();
    } catch (err: any) {
      toast.error("Erreur: " + err.message);
    }
  };
  const dayEvents = selectedDay ? events.filter(e => e.date === selectedDay) : [];
  return (
    <div className="space-y-4" style={{ fontFamily: lang === "ar" ? "'Noto Sans Arabic', sans-serif" : "Inter, sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Calendar */}
        <Card className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><ChevLeft size={16} style={{ color: "#1B2A4A" }} /></button>
            <h2 className="font-bold text-base" style={{ color: "#1B2A4A" }}>{MONTHS[viewMonth]} {viewYear}</h2>
            <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><ChevRight size={16} style={{ color: "#1B2A4A" }} /></button>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => <div key={d} className="text-center text-xs font-bold py-2" style={{ color: "#6B7A99" }}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const key = getKey(day);
              const dayEvts = events.filter(e => e.date === key);
              const isToday = key === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
              const isSelected = key === selectedDay;
              return (
                <div key={day} onClick={() => setSelectedDay(key)}
                  className="min-h-[72px] rounded-xl p-1.5 cursor-pointer transition-all"
                  style={{ background: isSelected ? "rgba(27,42,74,0.06)" : isToday ? "rgba(245,166,35,0.06)" : "transparent", border: isSelected ? "2px solid #1B2A4A" : isToday ? "2px solid #F5A623" : "2px solid transparent" }}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${isToday ? "text-white" : ""}`}
                    style={{ background: isToday ? "#F5A623" : "transparent", color: isToday ? "#0F1C30" : "#1B2A4A" }}>{day}</div>
                  <div className="space-y-0.5">
                    {dayEvts.slice(0, 2).map(e => (
                      <div key={e.id} className="text-xs px-1.5 py-0.5 rounded font-medium truncate" style={{ background: e.color + "22", color: e.color, fontSize: 9 }}>{e.title}</div>
                    ))}
                    {dayEvts.length > 2 && <div className="text-xs font-bold" style={{ color: "#6B7A99", fontSize: 9 }}>+{dayEvts.length - 2}</div>}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7A99" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />{typeLabels[type as CalEvent["type"]]}
              </div>
            ))}
          </div>
        </Card>
        {/* Day panel */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>
                {selectedDay ? new Date(selectedDay + "T12:00:00").toLocaleDateString(lang === "ar" ? "ar-TN" : "fr-FR", { weekday: "long", day: "numeric", month: "long" }) : (lang === "ar" ? "اختر يومًا" : "Sélectionnez un jour")}
              </h3>
              {selectedDay && <button onClick={openAddModal} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#F5A623" }}><Plus size={13} style={{ color: "#0F1C30" }} /></button>}
            </div>
            {!selectedDay ? (
              <p className="text-xs text-center py-4" style={{ color: "#9CA3AF" }}>{lang === "ar" ? "انقر على يوم لرؤية الأحداث" : "Cliquez sur un jour pour voir les événements"}</p>
            ) : dayEvents.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs mb-3" style={{ color: "#9CA3AF" }}>{lang === "ar" ? "لا توجد أحداث" : "Aucun événement"}</p>
                <button onClick={openAddModal} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "rgba(245,166,35,0.1)", color: "#D97706" }}>
                  {lang === "ar" ? "+ إضافة" : "+ Ajouter"}
                </button>
              </div>
            ) : dayEvents.map(ev => (
              <div key={ev.id} className="flex flex-col gap-2 p-3 rounded-xl mb-2 hover:opacity-95 transition-opacity" style={{ background: ev.color + "12", border: "1px solid " + ev.color + "30" }}>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-6 rounded-full flex-shrink-0 mt-0.5" style={{ background: ev.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: "#1B2A4A" }}>{ev.title}</div>
                    {ev.time && (
                      <div className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: "#6B7A99" }}>
                        <ClockIcon size={10} />{ev.time}
                        {ev.persons ? " · " + ev.persons + " pers." : ""}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEditModal(ev)} className="w-5 h-5 rounded flex items-center justify-center hover:bg-blue-50 text-blue-500">
                      <Pencil size={10} />
                    </button>
                    <button onClick={async () => {
                      try {
                        const { error } = await supabase.from('events').delete().eq('id', ev.id);
                        if (error) throw error;
                        toast.success("Événement supprimé.");
                        fetchEvents();
                      } catch (err: any) {
                        toast.error("Erreur: " + err.message);
                      }
                    }} className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-50 text-red-500">
                      <X size={10} />
                    </button>
                  </div>
                </div>
                
                {/* Event Location */}
                {ev.location && (
                  <div className="text-[10px] font-medium flex items-center gap-1 pl-4" style={{ color: "#6B7A99" }}>
                    <MapPin size={10} /> {ev.location}
                  </div>
                )}
                
                {/* Event Status */}
                {ev.status && (
                  <div className="pl-4">
                    <span className={"text-[9px] font-bold px-1.5 py-0.5 rounded-full " + (
                      ev.status === "Confirmé" ? "bg-green-50 text-green-700 border border-green-200" :
                      ev.status === "En attente" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-red-50 text-red-700 border border-red-200"
                    )}>
                      {ev.status}
                    </span>
                  </div>
                )}

                {/* Assigned Materials */}
                {ev.assignedMaterials && ev.assignedMaterials.length > 0 && (
                  <div className="pl-4 mt-1 border-t pt-1" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "#6B7A99" }}>
                      Matériels assignés:
                    </div>
                    <div className="space-y-0.5">
                      {ev.assignedMaterials.map((m, idx) => (
                        <div key={idx} className="text-[9px] font-semibold flex items-center gap-1" style={{ color: "#1B2A4A" }}>
                          📦 {m.name} ({m.qty})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </Card>
          {/* Stats */}
          <Card className="p-4">
            <h3 className="font-semibold text-xs mb-3" style={{ color: "#6B7A99" }}>CE MOIS</h3>
            {Object.entries(typeColors).map(([type, color]) => {
              const count = events.filter(e => e.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`)).filter(e => e.type === type).length;
              return (
                <div key={type} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: color }} /><span className="text-xs" style={{ color: "#6B7A99" }}>{typeLabels[type as CalEvent["type"]]}</span></div>
                  <span className="text-xs font-bold" style={{ color: "#1B2A4A" }}>{count}</span>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
      {/* Add / Edit event modal */}
      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6" style={{ fontFamily: lang === "ar" ? "'Noto Sans Arabic', sans-serif" : "Inter, sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold" style={{ color: "#1B2A4A" }}>
                {editingEvent ? (lang === "ar" ? "تعديل الحدث" : "Modifier l'événement") : (lang === "ar" ? "إضافة حدث" : "Ajouter un événement")}
              </h2>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={15} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="space-y-3">
              <input value={newEvent.title} onChange={e => setNewEvent(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder={lang === "ar" ? "عنوان الحدث" : "Titre de l'événement"} style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              <select value={newEvent.type} onChange={e => setNewEvent(f => ({ ...f, type: e.target.value as CalEvent["type"] }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                {Object.entries(typeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <input type="time" value={newEvent.time} onChange={e => setNewEvent(f => ({ ...f, time: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              <input value={eventLocation} onChange={e => setEventLocation(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder={lang === "ar" ? "الموقع (اختياري)" : "Lieu (optionnel)"} style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              <input type="number" min={0} value={eventPersons || ""} onChange={e => setEventPersons(Number(e.target.value))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder={lang === "ar" ? "عدد المشاركين" : "Nombre de participants"} style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              <select value={eventStatus} onChange={e => setEventStatus(e.target.value as any)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                <option value="Confirmé">{lang === "ar" ? "مؤكد" : "Confirmé"}</option>
                <option value="En attente">{lang === "ar" ? "قيد الانتظار" : "En attente"}</option>
                <option value="Annulé">{lang === "ar" ? "ملغى" : "Annulé"}</option>
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>{lang === "ar" ? "إلغاء" : "Annuler"}</button>
              <button onClick={addEvent} className="flex-1 py-2.5 text-sm font-bold rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
                {editingEvent ? (lang === "ar" ? "حفظ" : "Enregistrer") : (lang === "ar" ? "إضافة" : "Ajouter")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tasks Page (Kanban) ──────────────────────────────────────────────────────
type TaskStatus = "À faire" | "En cours" | "Terminé" | "Annulé";
type TaskPriority = "Haute" | "Moyenne" | "Basse";
interface Task { id: number; title: string; description?: string; status: TaskStatus; priority: TaskPriority; assignedTo?: string; dueDate?: string; category?: string; createdAt: string; }
const priorityColors: Record<TaskPriority, { bg: string; text: string; dot: string }> = {
  "Haute": { bg: "rgba(239,68,68,0.1)", text: "#DC2626", dot: "#EF4444" },
  "Moyenne": { bg: "rgba(245,166,35,0.12)", text: "#D97706", dot: "#F5A623" },
  "Basse": { bg: "rgba(34,197,94,0.1)", text: "#16A34A", dot: "#22C55E" },
};
const statusStyles: Record<TaskStatus, { bg: string; border: string; header: string }> = {
  "À faire": { bg: "#F8F9FB", border: "rgba(27,42,74,0.1)", header: "#6B7A99" },
  "En cours": { bg: "rgba(59,130,246,0.03)", border: "rgba(59,130,246,0.2)", header: "#2563EB" },
  "Terminé": { bg: "rgba(34,197,94,0.03)", border: "rgba(34,197,94,0.2)", header: "#16A34A" },
  "Annulé": { bg: "rgba(239,68,68,0.03)", border: "rgba(239,68,68,0.2)", header: "#DC2626" },
};
const initialTasks: Task[] = [
  { id: 1, title: "Vérifier équipements accrobranche", description: "Inspection complète des harnais et mousquetons avant saison estivale.", status: "À faire", priority: "Haute", assignedTo: "Amine Trabelsi", dueDate: "18 Jun 2025", category: "Maintenance", createdAt: "10 Jun 2025" },
  { id: 2, title: "Mettre à jour les tarifs été", description: "Réviser les prix des packs pour la haute saison.", status: "En cours", priority: "Moyenne", assignedTo: "Sarra Ben Salah", dueDate: "20 Jun 2025", category: "Gestion", createdAt: "12 Jun 2025" },
  { id: 3, title: "Appeler fournisseur paintball", status: "À faire", priority: "Basse", assignedTo: "Admin Yakoo", dueDate: "25 Jun 2025", category: "Achats", createdAt: "13 Jun 2025" },
  { id: 4, title: "Répondre aux avis clients en attente", status: "En cours", priority: "Haute", assignedTo: "Lina Mansouri", dueDate: "16 Jun 2025", category: "Service client", createdAt: "14 Jun 2025" },
  { id: 5, title: "Mettre à jour photos activités", status: "Terminé", priority: "Moyenne", assignedTo: "Amine Trabelsi", dueDate: "15 Jun 2025", category: "Marketing", createdAt: "08 Jun 2025" },
  { id: 6, title: "Réunion équipe moniteurs", status: "Terminé", priority: "Haute", assignedTo: "Admin Yakoo", dueDate: "14 Jun 2025", category: "RH", createdAt: "07 Jun 2025" },
];
const TASK_COLUMNS: TaskStatus[] = ["À faire", "En cours", "Terminé", "Annulé"];
function TasksPage() {
  const { lang } = useLang();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Task, "id" | "createdAt">>({ title: "", description: "", status: "À faire", priority: "Moyenne", assignedTo: "", dueDate: "", category: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase.from('tasks').select('*').order('id', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        setTasks(data.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || "",
          status: t.status as TaskStatus,
          priority: t.priority as TaskPriority,
          assignedTo: t.assigned_to || "",
          dueDate: t.due_date || "",
          category: t.category || "",
          createdAt: new Date(t.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
        })));
      } else {
        setTasks(initialTasks);
      }
    } catch (e: any) {
      console.error(e.message);
      setTasks(initialTasks);
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (id: number, newStatus: TaskStatus) => {
    try {
      const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      toast.success(lang === "ar" ? "تم تحديث المهمة" : `Tâche déplacée vers "${newStatus}"`);
      fetchTasks();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const addTask = async () => {
    if (!form.title.trim()) { toast.error(lang === "ar" ? "العنوان مطلوب" : "Titre requis."); return; }
    try {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        assigned_to: form.assignedTo,
        due_date: form.dueDate,
        category: form.category
      };
      const { error } = await supabase.from('tasks').insert([payload]);
      if (error) throw error;
      setShowAdd(false);
      toast.success(lang === "ar" ? "تمت إضافة المهمة!" : "Tâche ajoutée !");
      fetchTasks();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      setConfirmDelete(null);
      toast.success("Tâche supprimée.");
      fetchTasks();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const isOverdue = (t: Task) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Terminé" && t.status !== "Annulé";
  const nextStatus: Record<TaskStatus, TaskStatus | null> = { "À faire": "En cours", "En cours": "Terminé", "Terminé": null, "Annulé": null };
  return (
    <div className="space-y-4" style={{ fontFamily: lang === "ar" ? "'Noto Sans Arabic', sans-serif" : "Inter, sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {TASK_COLUMNS.map(col => (
            <div key={col} className="flex items-center gap-1.5 text-xs font-medium">
              <div className="w-2 h-2 rounded-full" style={{ background: col === "À faire" ? "#6B7A99" : col === "En cours" ? "#3B82F6" : col === "Terminé" ? "#22C55E" : "#EF4444" }} />
              <span style={{ color: "#6B7A99" }}>{col} ({tasks.filter(t => t.status === col).length})</span>
            </div>
          ))}
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg text-white" style={{ background: "#1B2A4A" }}>
          <Plus size={15} /> {lang === "ar" ? "مهمة جديدة" : "Nouvelle tâche"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {TASK_COLUMNS.map(col => (
          <div key={col} className="rounded-2xl overflow-hidden" style={{ background: statusStyles[col].bg, border: `1.5px solid ${statusStyles[col].border}` }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1.5px solid ${statusStyles[col].border}` }}>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: statusStyles[col].header }}>{col}</span>
              <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ background: statusStyles[col].header }}>{tasks.filter(t => t.status === col).length}</span>
            </div>
            <div className="p-2 space-y-2 min-h-24">
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task.id} className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow" style={{ border: isOverdue(task) ? "1.5px solid #EF4444" : "1.5px solid rgba(27,42,74,0.06)" }}>
                  {isOverdue(task) && <div className="text-xs font-semibold mb-1.5 flex items-center gap-1" style={{ color: "#EF4444" }}><AlertCircle size={10} />En retard</div>}
                  <div className="text-xs font-semibold mb-1.5 leading-tight" style={{ color: "#1B2A4A" }}>{task.title}</div>
                  {task.description && <p className="text-xs mb-2 line-clamp-2" style={{ color: "#6B7A99" }}>{task.description}</p>}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-medium" style={{ background: priorityColors[task.priority].bg, color: priorityColors[task.priority].text }}>{task.priority}</span>
                    {task.category && <span className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: "rgba(27,42,74,0.06)", color: "#6B7A99" }}>{task.category}</span>}
                  </div>
                  {task.assignedTo && <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: "#6B7A99" }}><div className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ background: avatarColor(task.assignedTo), fontSize: 8 }}>{task.assignedTo[0]}</div>{task.assignedTo}</div>}
                  {task.dueDate && <div className="flex items-center gap-1 text-xs mb-2" style={{ color: isOverdue(task) ? "#EF4444" : "#6B7A99" }}><CalendarDays size={10} />{task.dueDate}</div>}
                  <div className="flex gap-1 mt-2 pt-2 border-t" style={{ borderColor: "rgba(27,42,74,0.06)" }}>
                    {nextStatus[col] && <button onClick={() => moveTask(task.id, nextStatus[col]!)} className="flex-1 py-1 text-xs font-semibold rounded-lg" style={{ background: "rgba(27,42,74,0.06)", color: "#1B2A4A" }}>→ {nextStatus[col]}</button>}
                    <button onClick={() => setConfirmDelete(task.id)} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 size={10} style={{ color: "#EF4444" }} /></button>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === col).length === 0 && (
                <div className="text-center py-6 text-xs" style={{ color: "#9CA3AF" }}>Aucune tâche</div>
              )}
            </div>
          </div>
        ))}
      </div>
      {confirmDelete !== null && <ConfirmDialog message="Supprimer cette tâche ?" onConfirm={() => deleteTask(confirmDelete!)} onCancel={() => setConfirmDelete(null)} />}
      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl p-6" style={{ fontFamily: lang === "ar" ? "'Noto Sans Arabic', sans-serif" : "Inter, sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold" style={{ color: "#1B2A4A" }}>Nouvelle tâche</h2>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={15} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Titre *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
              <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Priorité</label><select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>{["Haute", "Moyenne", "Basse"].map(p => <option key={p}>{p}</option>)}</select></div>
                <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Statut</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>{TASK_COLUMNS.map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Assigné à</label><input value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
                <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Échéance</label><input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
              </div>
              <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Catégorie</label><input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Ex: Marketing, Maintenance..." style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>Annuler</button>
              <button onClick={addTask} className="flex-1 py-2.5 text-sm font-bold rounded-lg text-white" style={{ background: "#1B2A4A" }}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tickets Page ─────────────────────────────────────────────────────────────
type TicketStatus = "Ouvert" | "En cours" | "Résolu" | "Fermé";
type TicketPriority = "Haute" | "Moyenne" | "Basse";
interface SupportTicket { id: string; subject: string; client: string; email: string; category: string; priority: TicketPriority; status: TicketStatus; created: string; updated: string; description: string; assignedTo?: string; messages: { from: string; text: string; time: string; isAdmin: boolean }[]; }
const ticketStatusColors: Record<TicketStatus, string> = { "Ouvert": "bg-red-50 text-red-700 border-red-200", "En cours": "bg-blue-50 text-blue-700 border-blue-200", "Résolu": "bg-green-50 text-green-700 border-green-200", "Fermé": "bg-gray-100 text-gray-500 border-gray-200" };
const initialTickets: SupportTicket[] = [
  { id: "TKT-001", subject: "Problème confirmation réservation R-0041", client: "Sonia Mrad", email: "sonia@email.com", category: "Réservation", priority: "Haute", status: "Ouvert", created: "14 Jun 2025", updated: "14 Jun 2025", description: "Je n'ai pas reçu de confirmation par email pour ma réservation kayak.", assignedTo: "Lina Mansouri", messages: [{ from: "Sonia Mrad", text: "Bonjour, ma réservation R-0041 n'a pas été confirmée.", time: "14 Jun 09:15", isAdmin: false }, { from: "Lina Mansouri", text: "Bonjour Sonia, nous vérifions cela immédiatement.", time: "14 Jun 10:30", isAdmin: true }] },
  { id: "TKT-002", subject: "Demande de remboursement", client: "Leila Zouari", email: "leila@email.com", category: "Paiement", priority: "Haute", status: "En cours", created: "13 Jun 2025", updated: "15 Jun 2025", description: "Suite à l'annulation de ma réservation R-0039, je souhaite être remboursée.", messages: [] },
  { id: "TKT-003", subject: "Question sur les packs disponibles", client: "Youssef Ben Amor", email: "youssef@email.com", category: "Information", priority: "Basse", status: "Résolu", created: "12 Jun 2025", updated: "13 Jun 2025", description: "Quelles activités sont incluses dans le pack Bronze?", assignedTo: "Admin Yakoo", messages: [] },
  { id: "TKT-004", subject: "Site inaccessible sur mobile", client: "Rachid Melliti", email: "rachid@email.com", category: "Technique", priority: "Moyenne", status: "En cours", created: "10 Jun 2025", updated: "12 Jun 2025", description: "Le site ne s'affiche pas correctement sur iPhone Safari.", assignedTo: "Amine Trabelsi", messages: [] },
  { id: "TKT-005", subject: "Modification date réservation", client: "Fatma Ben Youssef", email: "fatma@email.com", category: "Réservation", priority: "Moyenne", status: "Fermé", created: "08 Jun 2025", updated: "10 Jun 2025", description: "Je voudrais changer la date de ma réservation pour la semaine suivante.", messages: [] },
];
function TicketsPage() {
  const { lang } = useLang();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [priorityFilter, setPriorityFilter] = useState("Tous");
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", client: "", email: "", category: "Réservation", priority: "Moyenne" as TicketPriority, description: "" });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        const formatted = data.map((t: any) => ({
          id: t.id,
          subject: t.subject,
          client: t.client,
          email: t.email,
          category: t.category || "Information",
          priority: t.priority as TicketPriority,
          status: t.status as TicketStatus,
          created: new Date(t.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
          updated: new Date(t.updated_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
          description: t.description || "",
          assignedTo: t.assigned_to || "",
          messages: Array.isArray(t.messages) ? t.messages : []
        }));
        setTickets(formatted);
        
        // Keep selected reference in sync
        if (selected) {
          const fresh = formatted.find(x => x.id === selected.id);
          if (fresh) setSelected(fresh);
        }
      } else {
        setTickets(initialTickets);
      }
    } catch (e: any) {
      console.error(e.message);
      setTickets(initialTickets);
    } finally {
      setLoading(false);
    }
  };

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = t.subject.toLowerCase().includes(q) || t.client.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "Tous" || t.status === statusFilter;
    const matchPriority = priorityFilter === "Tous" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const updateStatus = async (id: string, status: TicketStatus) => {
    try {
      const { error } = await supabase.from('support_tickets').update({ status }).eq('id', id);
      if (error) throw error;
      toast.success(`Ticket ${id} — statut : ${status}`);
      fetchTickets();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    const msg = { from: "Admin Yakoo", text: reply, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), isAdmin: true };
    const updatedMessages = [...selected.messages, msg];
    try {
      const { error } = await supabase.from('support_tickets').update({ messages: updatedMessages }).eq('id', selected.id);
      if (error) throw error;
      setReply("");
      toast.success("Réponse envoyée !");
      fetchTickets();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const createTicket = async () => {
    if (!newTicket.subject || !newTicket.client) { toast.error("Sujet et client requis."); return; }
    try {
      const nextId = `TKT-${String(tickets.length + 1).padStart(3, "0")}`;
      const payload = {
        id: nextId,
        subject: newTicket.subject,
        client: newTicket.client,
        email: newTicket.email,
        category: newTicket.category,
        priority: newTicket.priority,
        description: newTicket.description,
        status: "Ouvert",
        messages: []
      };
      const { error } = await supabase.from('support_tickets').insert([payload]);
      if (error) throw error;
      setShowAdd(false);
      toast.success(`Ticket ${nextId} créé !`);
      fetchTickets();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const counts: Record<TicketStatus | "Tous", number> = { "Tous": tickets.length, "Ouvert": tickets.filter(t => t.status === "Ouvert").length, "En cours": tickets.filter(t => t.status === "En cours").length, "Résolu": tickets.filter(t => t.status === "Résolu").length, "Fermé": tickets.filter(t => t.status === "Fermé").length };
  return (
    <div className="space-y-4" style={{ fontFamily: lang === "ar" ? "'Noto Sans Arabic', sans-serif" : "Inter, sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {(["Tous", "Ouvert", "En cours", "Résolu", "Fermé"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="rounded-[10px] px-4 py-3 flex items-center gap-3 text-left transition-all"
            style={{ background: "white", boxShadow: statusFilter === s ? "0 0 0 2px #1B2A4A" : "0 2px 12px rgba(0,0,0,0.08)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base" style={{ background: s === "Ouvert" ? "#FEE2E2" : s === "En cours" ? "#DBEAFE" : s === "Résolu" ? "#DCFCE7" : s === "Fermé" ? "#F3F4F6" : "#E8EBF0", color: s === "Ouvert" ? "#DC2626" : s === "En cours" ? "#2563EB" : s === "Résolu" ? "#16A34A" : s === "Fermé" ? "#6B7280" : "#1B2A4A" }}>{counts[s]}</div>
            <span className="text-xs font-medium" style={{ color: "#6B7A99" }}>{s}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          <Card className="p-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7A99" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un ticket..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              </div>
              <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="px-3 py-2 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                {["Tous", "Haute", "Moyenne", "Basse"].map(p => <option key={p}>{p}</option>)}
              </select>
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg text-white" style={{ background: "#1B2A4A" }}>
                <Plus size={14} /> Nouveau ticket
              </button>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr style={{ background: "#F8F9FB" }}>{["#", "Sujet", "Client", "Catégorie", "Priorité", "Statut", "Mis à jour", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: "#6B7A99" }}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.length === 0 ? <tr><td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: "#6B7A99" }}>Aucun ticket trouvé.</td></tr>
                  : filtered.map(t => (
                    <tr key={t.id} onClick={() => setSelected(t)} className="border-t hover:bg-gray-50 transition-colors cursor-pointer" style={{ borderColor: "rgba(27,42,74,0.06)", background: selected?.id === t.id ? "rgba(245,166,35,0.03)" : undefined }}>
                      <td className="px-4 py-3 text-xs font-mono font-bold" style={{ color: "#6B7A99" }}>{t.id}</td>
                      <td className="px-4 py-3 text-xs font-semibold max-w-xs truncate" style={{ color: "#1B2A4A" }}>{t.subject}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: avatarColor(t.client) }}>{t.client[0]}</div><span className="text-xs whitespace-nowrap" style={{ color: "#1B2A4A" }}>{t.client}</span></div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#6B7A99" }}>{t.category}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: priorityColors[t.priority].bg, color: priorityColors[t.priority].text }}>{t.priority}</span></td>
                      <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${ticketStatusColors[t.status]}`}>{t.status}</span></td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#9CA3AF" }}>{t.updated}</td>
                      <td className="px-4 py-3">
                        <select value={t.status} onChange={e => { e.stopPropagation(); updateStatus(t.id, e.target.value as TicketStatus); }} onClick={e => e.stopPropagation()} className="text-xs px-2 py-1 rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>
                          {(["Ouvert", "En cours", "Résolu", "Fermé"] as TicketStatus[]).map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        </div>
        {selected && (
          <div className="w-80 flex-shrink-0">
            <Card className="overflow-hidden sticky top-20">
              <div className="px-4 py-3 flex items-center justify-between border-b" style={{ background: "linear-gradient(135deg,#0F1C30,#1B2A4A)", borderColor: "rgba(255,255,255,0.1)" }}>
                <div>
                  <div className="text-xs font-mono text-white font-bold">{selected.id}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>{selected.created}</div>
                </div>
                <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}><X size={13} style={{ color: "white" }} /></button>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                <div className="p-4 border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
                  <div className="font-semibold text-sm mb-2" style={{ color: "#1B2A4A" }}>{selected.subject}</div>
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${ticketStatusColors[selected.status]}`}>{selected.status}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: priorityColors[selected.priority].bg, color: priorityColors[selected.priority].text }}>{selected.priority}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "#F0F2F5", color: "#6B7A99" }}>{selected.category}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ background: avatarColor(selected.client) }}>{selected.client[0]}</div>
                    <div><div className="text-xs font-semibold" style={{ color: "#1B2A4A" }}>{selected.client}</div><div className="text-xs" style={{ color: "#6B7A99" }}>{selected.email}</div></div>
                  </div>
                  <p className="text-xs leading-relaxed p-3 rounded-xl" style={{ background: "#F8F9FB", color: "#6B7A99" }}>{selected.description}</p>
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#6B7A99" }}>Conversation ({selected.messages.length})</div>
                  {selected.messages.length === 0 && <p className="text-xs text-center py-4" style={{ color: "#9CA3AF" }}>Aucun message</p>}
                  <div className="space-y-2 mb-3">
                    {selected.messages.map((m, i) => (
                      <div key={i} className={`flex ${m.isAdmin ? "justify-end" : "justify-start"}`}>
                        <div className="max-w-[85%] px-3 py-2 rounded-xl text-xs" style={{ background: m.isAdmin ? "#1B2A4A" : "#F0F2F5", color: m.isAdmin ? "white" : "#1B2A4A" }}>
                          <div className="font-semibold mb-0.5" style={{ fontSize: 10 }}>{m.from}</div>
                          <div>{m.text}</div>
                          <div className="text-xs mt-1 opacity-60">{m.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === "Enter" && sendReply()} placeholder="Répondre..." className="flex-1 px-3 py-2 text-xs rounded-xl outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                    <button onClick={sendReply} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#1B2A4A" }}><Send size={13} style={{ color: "white" }} /></button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl p-6" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="flex items-center justify-between mb-5"><h2 className="font-bold" style={{ color: "#1B2A4A" }}>Nouveau ticket</h2><button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={15} style={{ color: "#6B7A99" }} /></button></div>
            <div className="space-y-3">
              <input value={newTicket.subject} onChange={e => setNewTicket(f => ({ ...f, subject: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Sujet du ticket *" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
              <div className="grid grid-cols-2 gap-3">
                <input value={newTicket.client} onChange={e => setNewTicket(f => ({ ...f, client: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Nom client *" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                <input value={newTicket.email} onChange={e => setNewTicket(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Email" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                <select value={newTicket.category} onChange={e => setNewTicket(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>{["Réservation", "Paiement", "Technique", "Information", "Autre"].map(c => <option key={c}>{c}</option>)}</select>
                <select value={newTicket.priority} onChange={e => setNewTicket(f => ({ ...f, priority: e.target.value as TicketPriority }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>{["Haute", "Moyenne", "Basse"].map(p => <option key={p}>{p}</option>)}</select>
              </div>
              <textarea value={newTicket.description} onChange={e => setNewTicket(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none" placeholder="Description du problème..." style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
            </div>
            <div className="flex gap-3 mt-5"><button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>Annuler</button><button onClick={createTicket} className="flex-1 py-2.5 text-sm font-bold rounded-lg text-white" style={{ background: "#1B2A4A" }}>Créer</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Loyalty Page ─────────────────────────────────────────────────────────────
type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum";
interface LoyaltyClient { id: number; name: string; email: string; phone: string; points: number; totalSpent: number; reservations: number; joined: string; lastActivity: string; }
const loyaltyTierDef = (pts: number): LoyaltyTier => pts >= 2000 ? "Platinum" : pts >= 1000 ? "Gold" : pts >= 500 ? "Silver" : "Bronze";
const loyaltyTierColors: Record<LoyaltyTier, { bg: string; text: string; border: string; icon: string }> = {
  "Bronze": { bg: "rgba(180,120,60,0.1)", text: "#7C5C3A", border: "rgba(180,120,60,0.3)", icon: "🥉" },
  "Silver": { bg: "rgba(107,114,128,0.1)", text: "#4B5563", border: "rgba(107,114,128,0.3)", icon: "🥈" },
  "Gold": { bg: "rgba(245,166,35,0.12)", text: "#D97706", border: "rgba(245,166,35,0.4)", icon: "🥇" },
  "Platinum": { bg: "rgba(99,102,241,0.1)", text: "#4F46E5", border: "rgba(99,102,241,0.3)", icon: "💎" },
};
const TIER_THRESHOLDS = [{ tier: "Bronze", min: 0, max: 499 }, { tier: "Silver", min: 500, max: 999 }, { tier: "Gold", min: 1000, max: 1999 }, { tier: "Platinum", min: 2000, max: Infinity }];
const rewards = [
  { id: 1, name: "Réduction 10%", points: 100, icon: "🏷️", desc: "10% sur votre prochaine réservation" },
  { id: 2, name: "Activité offerte", points: 500, icon: "🎯", desc: "1 activité gratuite de votre choix" },
  { id: 3, name: "Pack Silver offert", points: 1000, icon: "🎁", desc: "Pack Silver complet pour un groupe" },
  { id: 4, name: "Weekend Aventure", points: 2000, icon: "⛺", desc: "Weekend camping aventure pour 2" },
];
const initialLoyaltyClients: LoyaltyClient[] = [
  { id: 1, name: "Karim Benali", email: "karim@gmail.com", phone: "+216 22 345 678", points: 1240, totalSpent: 12400, reservations: 8, joined: "Jan 2024", lastActivity: "15 Jun 2025" },
  { id: 2, name: "Sami Bourguiba", email: "sami@techcorp.tn", phone: "+216 55 234 567", points: 2650, totalSpent: 26500, reservations: 14, joined: "Mar 2023", lastActivity: "10 Jun 2025" },
  { id: 3, name: "Rania Ben Amor", email: "rania@bfi.tn", phone: "+216 52 789 123", points: 890, totalSpent: 8900, reservations: 5, joined: "Jun 2024", lastActivity: "30 Mai 2025" },
  { id: 4, name: "Tarek Hamdi", email: "tarek@email.com", phone: "+216 98 123 456", points: 340, totalSpent: 3400, reservations: 2, joined: "Nov 2024", lastActivity: "20 Jun 2025" },
  { id: 5, name: "Lina Mansouri", email: "lina@email.com", phone: "+216 98 765 432", points: 1580, totalSpent: 15800, reservations: 11, joined: "Feb 2024", lastActivity: "12 Jun 2025" },
];
function LoyaltyPage() {
  const { lang } = useLang();
  const [clients, setClients] = useState<LoyaltyClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<LoyaltyClient | null>(null);
  const [showAddPoints, setShowAddPoints] = useState<LoyaltyClient | null>(null);
  const [showRedeem, setShowRedeem] = useState<LoyaltyClient | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState("");
  const [pointsReason, setPointsReason] = useState("Réservation");

  useEffect(() => {
    fetchLoyaltyClients();
  }, []);

  const fetchLoyaltyClients = async () => {
    try {
      const { data, error } = await supabase.from('loyalty_clients').select('*').order('points', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        const formatted = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone || "",
          points: c.points,
          totalSpent: Number(c.total_spent || 0),
          reservations: c.reservations || 0,
          joined: c.joined || "",
          lastActivity: c.last_activity || ""
        }));
        setClients(formatted);
        if (selected) {
          const fresh = formatted.find(x => x.id === selected.id);
          if (fresh) setSelected(fresh);
        }
      } else {
        setClients(initialLoyaltyClients);
      }
    } catch (e: any) {
      console.error(e.message);
      setClients(initialLoyaltyClients);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (client: LoyaltyClient) => {
    const pts = Number(pointsToAdd);
    if (!pts || pts <= 0) { toast.error("Nombre de points invalide."); return; }
    try {
      const nextPoints = client.points + pts;
      const { error } = await supabase.from('loyalty_clients').update({ points: nextPoints, last_activity: "Points ajoutés: " + pointsReason }).eq('id', client.id);
      if (error) throw error;
      setShowAddPoints(null); 
      setPointsToAdd(""); 
      toast.success(`+${pts} points ajoutés à ${client.name} !`);
      fetchLoyaltyClients();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const redeemPoints = async (client: LoyaltyClient, reward: typeof rewards[0]) => {
    if (client.points < reward.points) { toast.error(`Pas assez de points. Il manque ${reward.points - client.points} pts.`); return; }
    try {
      const nextPoints = client.points - reward.points;
      const { error } = await supabase.from('loyalty_clients').update({ points: nextPoints, last_activity: "Récompense: " + reward.name }).eq('id', client.id);
      if (error) throw error;
      setShowRedeem(null); 
      toast.success(`"${reward.name}" échangé pour ${client.name} !`);
      fetchLoyaltyClients();
    } catch (e: any) {
      toast.error(e.message);
    }
  };
  const totalPoints = clients.reduce((s, c) => s + c.points, 0);
  const platinumCount = clients.filter(c => loyaltyTierDef(c.points) === "Platinum").length;
  const goldCount = clients.filter(c => loyaltyTierDef(c.points) === "Gold").length;
  return (
    <div className="space-y-5" style={{ fontFamily: lang === "ar" ? "'Noto Sans Arabic', sans-serif" : "Inter, sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Membres actifs", val: clients.length, icon: <Users size={20} />, bg: "rgba(27,42,74,0.08)", c: "#1B2A4A" },
          { label: "Points en circulation", val: totalPoints.toLocaleString("fr-FR"), icon: <Coins size={20} />, bg: "rgba(245,166,35,0.12)", c: "#F5A623" },
          { label: "Membres Platinum", val: platinumCount, icon: <Crown size={20} />, bg: "rgba(99,102,241,0.1)", c: "#4F46E5" },
          { label: "Membres Gold", val: goldCount, icon: <Award size={20} />, bg: "rgba(245,166,35,0.12)", c: "#D97706" },
        ].map(k => (
          <Card key={k.label} className="p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: k.bg }}><span style={{ color: k.c }}>{k.icon}</span></div>
            <div className="text-2xl font-bold mb-0.5" style={{ color: "#1B2A4A" }}>{k.val}</div>
            <div className="text-xs" style={{ color: "#6B7A99" }}>{k.label}</div>
          </Card>
        ))}
      </div>
      {/* Tiers guide */}
      <Card className="p-5">
        <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Niveaux de fidélité</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TIER_THRESHOLDS.map(({ tier, min, max }) => {
            const t = tier as LoyaltyTier; const c = loyaltyTierColors[t];
            return (
              <div key={tier} className="rounded-xl p-4 text-center" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="font-bold text-sm mb-1" style={{ color: c.text }}>{tier}</div>
                <div className="text-xs" style={{ color: "#6B7A99" }}>{min === 0 ? "0" : min.toLocaleString()}–{max === Infinity ? "∞" : max.toLocaleString()} pts</div>
                <div className="mt-2 text-xs font-semibold" style={{ color: c.text }}>{clients.filter(c => loyaltyTierDef(c.points) === tier).length} membres</div>
              </div>
            );
          })}
        </div>
      </Card>
      {/* Clients list + detail */}
      <div className="flex gap-4">
        <Card className="flex-1 overflow-hidden">
          <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
            <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Membres du programme</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ background: "#F8F9FB" }}>{["Client", "Niveau", "Points", "Dépenses totales", "Réservations", "Dernière activité", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: "#6B7A99" }}>{h}</th>)}</tr></thead>
              <tbody>
                {clients.sort((a, b) => b.points - a.points).map(c => {
                  const tier = loyaltyTierDef(c.points); const tc = loyaltyTierColors[tier];
                  return (
                    <tr key={c.id} onClick={() => setSelected(c)} className="border-t hover:bg-gray-50 transition-colors cursor-pointer" style={{ borderColor: "rgba(27,42,74,0.06)", background: selected?.id === c.id ? "rgba(245,166,35,0.03)" : undefined }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: avatarColor(c.name) }}>{initials(c.name)}</div><div><div className="text-xs font-semibold" style={{ color: "#1B2A4A" }}>{c.name}</div><div className="text-xs" style={{ color: "#6B7A99" }}>{c.email}</div></div></div>
                      </td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1.5"><span className="text-base">{tc.icon}</span><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: tc.bg, color: tc.text }}>{tier}</span></div></td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-bold font-mono" style={{ color: "#F5A623" }}>{c.points.toLocaleString("fr-FR")}</div>
                        <div className="w-full h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: "#F0F2F5" }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (c.points / 2000) * 100)}%`, background: tc.text }} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono font-semibold" style={{ color: "#1B2A4A" }}>{c.totalSpent.toLocaleString("fr-FR")} TND</td>
                      <td className="px-4 py-3 text-xs font-bold text-center" style={{ color: "#1B2A4A" }}>{c.reservations}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#6B7A99" }}>{c.lastActivity}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={e => { e.stopPropagation(); setShowAddPoints(c); }} className="px-2 py-1 text-xs font-semibold rounded-lg" style={{ background: "rgba(245,166,35,0.1)", color: "#D97706" }}>+ Points</button>
                          <button onClick={e => { e.stopPropagation(); setShowRedeem(c); }} className="px-2 py-1 text-xs font-semibold rounded-lg" style={{ background: "rgba(99,102,241,0.1)", color: "#4F46E5" }}>Échanger</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        {/* Rewards catalog */}
        <div className="w-64 flex-shrink-0 space-y-3">
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3" style={{ color: "#1B2A4A" }}>Catalogue récompenses</h3>
            {rewards.map(r => (
              <div key={r.id} className="p-3 rounded-xl mb-2" style={{ background: "#F8F9FB", border: "1px solid rgba(27,42,74,0.06)" }}>
                <div className="flex items-start gap-2">
                  <span className="text-xl flex-shrink-0">{r.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold" style={{ color: "#1B2A4A" }}>{r.name}</div>
                    <div className="text-xs leading-tight mt-0.5" style={{ color: "#6B7A99" }}>{r.desc}</div>
                    <div className="text-xs font-bold mt-1.5 flex items-center gap-1" style={{ color: "#F5A623" }}>
                      <Coins size={10} />{r.points.toLocaleString("fr-FR")} pts
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
      {/* Add points modal */}
      {showAddPoints && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddPoints(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="flex items-center justify-between mb-5"><h2 className="font-bold" style={{ color: "#1B2A4A" }}>Ajouter des points</h2><button onClick={() => setShowAddPoints(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={15} style={{ color: "#6B7A99" }} /></button></div>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ background: "#F8F9FB" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: avatarColor(showAddPoints.name) }}>{initials(showAddPoints.name)}</div>
              <div><div className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{showAddPoints.name}</div><div className="text-xs" style={{ color: "#F5A623" }}>{showAddPoints.points.toLocaleString("fr-FR")} pts actuels</div></div>
            </div>
            <div className="space-y-3">
              <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Points à ajouter</label><input type="number" min={1} value={pointsToAdd} onChange={e => setPointsToAdd(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none font-mono" placeholder="Ex: 100" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
              <div><label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Raison</label><select value={pointsReason} onChange={e => setPointsReason(e.target.value)} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }}>{["Réservation", "Parrainage", "Anniversaire", "Promotion", "Manuel"].map(r => <option key={r}>{r}</option>)}</select></div>
              {pointsToAdd && <div className="px-3 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "rgba(245,166,35,0.1)", color: "#D97706" }}>Nouveau solde : {(showAddPoints.points + Number(pointsToAdd)).toLocaleString("fr-FR")} pts → {loyaltyTierDef(showAddPoints.points + Number(pointsToAdd))}</div>}
            </div>
            <div className="flex gap-3 mt-5"><button onClick={() => setShowAddPoints(null)} className="flex-1 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>Annuler</button><button onClick={() => addPoints(showAddPoints)} className="flex-1 py-2.5 text-sm font-bold rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>Ajouter</button></div>
          </div>
        </div>
      )}
      {/* Redeem modal */}
      {showRedeem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowRedeem(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="flex items-center justify-between mb-5"><h2 className="font-bold" style={{ color: "#1B2A4A" }}>Échanger des points</h2><button onClick={() => setShowRedeem(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={15} style={{ color: "#6B7A99" }} /></button></div>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ background: "#F8F9FB" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: avatarColor(showRedeem.name) }}>{initials(showRedeem.name)}</div>
              <div><div className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{showRedeem.name}</div><div className="text-xs font-mono" style={{ color: "#F5A623" }}>{showRedeem.points.toLocaleString("fr-FR")} pts disponibles</div></div>
            </div>
            <div className="space-y-2">
              {rewards.map(r => {
                const canRedeem = showRedeem.points >= r.points;
                return (
                  <button key={r.id} onClick={() => redeemPoints(showRedeem, r)} disabled={!canRedeem}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all disabled:opacity-40"
                    style={{ background: canRedeem ? "rgba(245,166,35,0.06)" : "#F8F9FB", border: canRedeem ? "1.5px solid rgba(245,166,35,0.3)" : "1.5px solid rgba(27,42,74,0.06)" }}>
                    <span className="text-2xl">{r.icon}</span>
                    <div className="flex-1 min-w-0"><div className="text-xs font-bold" style={{ color: "#1B2A4A" }}>{r.name}</div><div className="text-xs" style={{ color: "#6B7A99" }}>{r.desc}</div></div>
                    <div className="text-xs font-bold font-mono flex-shrink-0" style={{ color: canRedeem ? "#D97706" : "#9CA3AF" }}>{r.points.toLocaleString("fr-FR")} pts</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Services Page ────────────────────────────────────────────────────────────
interface Service { id: number; name: string; icon: string; category: string; description: string; priceFrom: number; priceTo?: number; duration: string; minGroup: number; maxGroup?: number; active: boolean; tags: string[]; }
const initialServices: Service[] = [
  { id: 1, name: "Accrobranche & Escalade", icon: "🌲", category: "Aventure", description: "Parcours acrobatiques certifiés CE dans un cadre naturel. Moniteurs diplômés, équipements fournis, niveaux débutant à expert.", priceFrom: 25, priceTo: 45, duration: "2h–4h", minGroup: 5, maxGroup: 40, active: true, tags: ["Famille", "Enfants", "Adrénaline"] },
  { id: 2, name: "Kayak & Sports Nautiques", icon: "🚣", category: "Aventure", description: "Descente en kayak solo et double, canoë, activités nautiques encadrées. Gilets et pagaies fournis.", priceFrom: 35, priceTo: 60, duration: "2h–Journée", minGroup: 4, active: true, tags: ["Eau", "Nature"] },
  { id: 3, name: "Paintball Combat", icon: "🎯", category: "Combat & Jeux", description: "Terrain de paintball professionnel homologué. Masques, gilets et billes inclus. Scenarios variés.", priceFrom: 40, priceTo: 80, duration: "2h–4h", minGroup: 8, maxGroup: 30, active: true, tags: ["Groupe", "Fun", "Combat"] },
  { id: 4, name: "Team Building Corporate", icon: "🤝", category: "Entreprise", description: "Activités de cohésion d'équipe sur-mesure pour entreprises. Devis personnalisé selon vos objectifs RH.", priceFrom: 150, duration: "Journée complète", minGroup: 15, maxGroup: 100, active: true, tags: ["RH", "Corporate", "Sur-mesure"] },
  { id: 5, name: "Tyrolienne & Zip-line", icon: "🪂", category: "Aventure", description: "Glissade sur câble à 200m de hauteur avec vue panoramique. Système de freinage magnétique automatique.", priceFrom: 30, priceTo: 45, duration: "1h–2h", minGroup: 3, maxGroup: 25, active: true, tags: ["Sensations", "Altitude"] },
  { id: 6, name: "Hébergement & Camping", icon: "⛺", category: "Hébergement", description: "Nuitées en tentes équipées ou bungalows. Repas inclus, feu de camp, animations nocturnes.", priceFrom: 80, priceTo: 150, duration: "1–3 nuits", minGroup: 4, active: true, tags: ["Nuit", "Nature", "Famille"] },
  { id: 7, name: "Anniversaires & Célébrations", icon: "🎂", category: "Événements", description: "Packages anniversaire clé en main : activités, décoration, gâteau, animation. Formules enfants et adultes.", priceFrom: 45, priceTo: 120, duration: "3h–5h", minGroup: 10, maxGroup: 50, active: true, tags: ["Fête", "Famille", "Sur-mesure"] },
  { id: 8, name: "Formation & Séminaires", icon: "📚", category: "Entreprise", description: "Salles de formation équipées, espaces outdoor pour ateliers pratiques. Hébergement disponible.", priceFrom: 200, duration: "1–3 jours", minGroup: 10, active: false, tags: ["Formation", "Corporate"] },
];
function ServicesPage() {
  const { lang } = useLang();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const emptyForm: Omit<Service, "id"> = { name: "", icon: "🎯", category: "Aventure", description: "", priceFrom: 0, priceTo: undefined, duration: "", minGroup: 1, maxGroup: undefined, active: true, tags: [] };
  const [form, setForm] = useState(emptyForm);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        setServices(data.map((s: any) => ({
          id: s.id,
          name: s.name,
          icon: s.icon || "🎯",
          category: s.category || "Aventure",
          description: s.description || "",
          priceFrom: Number(s.price_from || 0),
          priceTo: s.price_to ? Number(s.price_to) : undefined,
          duration: s.duration || "",
          minGroup: s.min_group || 1,
          maxGroup: s.max_group ? Number(s.max_group) : undefined,
          active: s.active,
          tags: Array.isArray(s.tags) ? s.tags : []
        })));
      } else {
        setServices(initialServices);
      }
    } catch (e: any) {
      console.error(e.message);
      setServices(initialServices);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Nom requis."); return; }
    try {
      const payload = {
        name: form.name,
        icon: form.icon,
        category: form.category,
        description: form.description,
        price_from: form.priceFrom,
        price_to: form.priceTo || null,
        duration: form.duration,
        min_group: form.minGroup,
        max_group: form.maxGroup || null,
        active: form.active,
        tags: form.tags || []
      };
      if (editing) {
        const { error } = await supabase.from('services').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success(`Service "${form.name}" mis à jour !`);
      } else {
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;
        toast.success(`Service "${form.name}" ajouté !`);
      }
      setShowModal(false);
      fetchServices();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const toggleActive = async (s: Service) => {
    try {
      const { error } = await supabase.from('services').update({ active: !s.active }).eq('id', s.id);
      if (error) throw error;
      fetchServices();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      setConfirmDelete(null);
      toast.success("Service supprimé.");
      fetchServices();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const addTag = () => { if (tagInput.trim() && !form.tags.includes(tagInput.trim())) { setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(""); } };
  const cats = ["Tous", ...Array.from(new Set(services.map(s => s.category)))];
  const filtered = catFilter === "Tous" ? services : services.filter(s => s.category === catFilter);
  const openAdd = () => { setEditing(null); setForm(emptyForm); setTagInput(""); setShowModal(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm({ ...s }); setTagInput(""); setShowModal(true); };

  return (
    <div className="space-y-4" style={{ fontFamily: lang === "ar" ? "'Noto Sans Arabic', sans-serif" : "Inter, sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 flex-wrap">{cats.map(c => <button key={c} onClick={() => setCatFilter(c)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors" style={{ background: catFilter === c ? "#1B2A4A" : "white", color: catFilter === c ? "white" : "#6B7A99", boxShadow: catFilter === c ? "none" : "0 2px 8px rgba(0,0,0,0.06)" }}>{c}</button>)}</div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}><Plus size={15} /> Ajouter un service</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(s => (
          <Card key={s.id} className={`overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow ${!s.active ? "opacity-60" : ""}`}>
            <div className="px-5 py-4" style={{ background: "linear-gradient(135deg, rgba(27,42,74,0.04), rgba(245,166,35,0.04))", borderBottom: "1px solid rgba(27,42,74,0.06)" }}>
              <div className="flex items-start justify-between mb-2">
                <div className="text-3xl">{s.icon}</div>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(27,42,74,0.06)", color: "#6B7A99" }}>{s.category}</span>
              </div>
              <h4 className="font-bold text-sm" style={{ color: "#1B2A4A" }}>{s.name}</h4>
            </div>
            <div className="p-4">
              <p className="text-xs leading-relaxed line-clamp-3 mb-3" style={{ color: "#6B7A99" }}>{s.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg p-2 text-center" style={{ background: "#F8F9FB" }}>
                  <div className="text-xs font-bold" style={{ color: "#F5A623" }}>{s.priceFrom}{s.priceTo ? `–${s.priceTo}` : "+"} TND</div>
                  <div className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>/ pers.</div>
                </div>
                <div className="rounded-lg p-2 text-center" style={{ background: "#F8F9FB" }}>
                  <div className="text-xs font-bold" style={{ color: "#1B2A4A" }}>{s.duration}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Durée</div>
                </div>
              </div>
              <div className="text-xs mb-3" style={{ color: "#6B7A99" }}>
                Groupe : {s.minGroup}{s.maxGroup ? `–${s.maxGroup}` : "+"} pers.
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {s.tags.map(tag => <span key={tag} className="px-1.5 py-0.5 rounded text-xs" style={{ background: "#F0F2F5", color: "#6B7A99" }}>{tag}</span>)}
              </div>
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
                <button onClick={() => toggleActive(s)} className="w-9 h-5 rounded-full relative transition-colors" style={{ background: s.active ? "#22C55E" : "#E8EBF0" }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all" style={{ left: s.active ? "calc(100% - 18px)" : 2 }} />
                </button>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50"><Pencil size={12} style={{ color: "#3B82F6" }} /></button>
                  <button onClick={() => setConfirmDelete(s.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 size={12} style={{ color: "#EF4444" }} /></button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {confirmDelete !== null && <ConfirmDialog message={`Supprimer "${services.find(s => s.id === confirmDelete)?.name}" ?`} onConfirm={() => handleDelete(confirmDelete!)} onCancel={() => setConfirmDelete(null)} />}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="px-6 py-5 border-b flex items-center justify-between sticky top-0 bg-white z-10" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <h2 className="font-bold text-base" style={{ color: "#1B2A4A" }}>{editing ? "Modifier le service" : "Nouveau service"}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} style={{ color: "#6B7A99" }} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Icône</label><input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="w-full px-2 py-2.5 text-2xl text-center rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none" }} /></div>
                <div className="col-span-3"><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Nom *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Catégorie</label><input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
                <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Durée</label><input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" placeholder="Ex: 2h–4h" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
                <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Prix de (TND)</label><input type="number" value={form.priceFrom} onChange={e => setForm(f => ({ ...f, priceFrom: Number(e.target.value) }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none font-mono" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
                <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Prix à (TND)</label><input type="number" value={form.priceTo || ""} onChange={e => setForm(f => ({ ...f, priceTo: e.target.value ? Number(e.target.value) : undefined }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none font-mono" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
                <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Groupe min.</label><input type="number" value={form.minGroup} onChange={e => setForm(f => ({ ...f, minGroup: Number(e.target.value) }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
                <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Groupe max.</label><input type="number" value={form.maxGroup || ""} onChange={e => setForm(f => ({ ...f, maxGroup: e.target.value ? Number(e.target.value) : undefined }))} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
              </div>
              <div><label className="block text-xs font-semibold mb-1" style={{ color: "#1B2A4A" }}>Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 text-sm rounded-lg outline-none resize-none" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1B2A4A" }}>Tags</label>
                <div className="flex gap-2 mb-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag()} className="flex-1 px-3 py-2 text-sm rounded-lg outline-none" placeholder="Ajouter un tag..." style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} />
                  <button onClick={addTag} className="px-3 py-2 text-xs font-bold rounded-lg text-white" style={{ background: "#1B2A4A" }}>+</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map(t => <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>{t}<button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}><X size={9} /></button></span>)}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3 justify-end sticky bottom-0 bg-white" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium rounded-lg" style={{ background: "#F0F2F5", color: "#1B2A4A" }}>Annuler</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm font-bold rounded-lg text-white" style={{ background: "#F5A623", color: "#0F1C30" }}><Save size={14} className="inline mr-1.5" />{editing ? "Enregistrer" : "Ajouter"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Social Media Page ────────────────────────────────────────────────────────
function SocialPage() {
  const { lang } = useLang();
  const [igToken, setIgToken] = useState("");
  const [fbPageId, setFbPageId] = useState("");
  const [fbToken, setFbToken] = useState("");
  const [autoPost, setAutoPost] = useState(true);
  const [postOnReservation, setPostOnReservation] = useState(false);
  const [syncReviews, setSyncReviews] = useState(true);
  const [connected, setConnected] = useState({ ig: false, fb: false });

  useEffect(() => {
    fetchSocialSettings();
  }, []);

  const fetchSocialSettings = async () => {
    try {
      const { data, error } = await supabase.from('social_settings').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const ig = data.find((s: any) => s.platform === 'instagram');
        const fb = data.find((s: any) => s.platform === 'facebook');
        if (ig) {
          setIgToken(ig.token || "");
          setConnected(c => ({ ...c, ig: ig.enabled }));
          setAutoPost(ig.auto_post);
        }
        if (fb) {
          setFbPageId(fb.page_id || "");
          setFbToken(fb.token || "");
          setConnected(c => ({ ...c, fb: fb.enabled }));
        }
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const saveSettings = async (platform: string, token: string, pageId: string, enabled: boolean, autoPostVal?: boolean) => {
    try {
      const payload = {
        platform,
        token,
        page_id: pageId,
        enabled,
        auto_post: autoPostVal !== undefined ? autoPostVal : autoPost
      };
      const { error } = await supabase.from('social_settings').upsert([payload], { onConflict: 'platform' });
      if (error) throw error;
      toast.success("Paramètres mis à jour !");
      fetchSocialSettings();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const mockIgPosts = [
    { id: 1, img: "photo-1504280390367-361c6d9f38f4", likes: 142, comments: 18, caption: "Une journée incroyable d'accrobranche ! 🌲 #YakooEvents" },
    { id: 2, img: "photo-1544551763-46a013bb70d5", likes: 98, comments: 12, caption: "Kayak sous le soleil de Tunisie 🚣 #Aventure" },
    { id: 3, img: "photo-1581578731548-c64695cc6952", likes: 203, comments: 31, caption: "Team building paintball avec TechCorp 🎯 #Corporate" },
    { id: 4, img: "photo-1542744173-8e7e53415bb0", likes: 87, comments: 9, caption: "Séminaire en plein air pour BFI Group 🤝" },
    { id: 5, img: "photo-1551632811-561732d1e306", likes: 174, comments: 24, caption: "Tyrolienne 200m — sensations garanties! 🪂" },
    { id: 6, img: "photo-1478131143081-80f7f84ca84d", likes: 115, comments: 16, caption: "Camping étoilé, soirée inoubliable ⛺✨" },
  ];
  const fbStats = { followers: 4820, likes: 4650, posts: 312, reach: 18400, checkins: 234 };
  const igStats = { followers: 6740, following: 412, posts: 287, avgLikes: 134, reach: 22100 };
  const isAr = lang === "ar";
  return (
    <div className="space-y-5" style={{ fontFamily: isAr ? "'Noto Sans Arabic', sans-serif" : "Inter, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      {/* Connection status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Instagram */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20"><Instagram size={22} style={{ color: "white" }} /></div>
            <div className="flex-1"><div className="font-bold text-white">Instagram Business</div><div className="text-xs mt-0.5 text-white/70">@yakooevents</div></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: connected.ig ? "#22C55E" : "#EF4444" }} />
              <span className="text-xs font-semibold text-white">{connected.ig ? "Connecté" : "Déconnecté"}</span>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[["Abonnés", igStats.followers.toLocaleString("fr-FR")], ["Publications", igStats.posts], ["Portée moy.", igStats.reach.toLocaleString("fr-FR")]].map(([l, v]) => (
                <div key={l} className="text-center rounded-xl py-3" style={{ background: "#F8F9FB" }}>
                  <div className="text-base font-bold" style={{ color: "#1B2A4A" }}>{v}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div><label className="block text-xs font-semibold mb-1" style={{ color: "#6B7A99" }}>Access Token</label><input value={igToken} onChange={e => setIgToken(e.target.value)} type="password" className="w-full px-3 py-2 text-sm rounded-lg outline-none font-mono" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
            </div>
            <button onClick={() => saveSettings("instagram", igToken, "", true)}
              className="mt-4 w-full py-2.5 text-sm font-bold rounded-xl text-white" style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}>
              {connected.ig ? "Reconnecter" : "Connecter Instagram"}
            </button>
          </div>
        </Card>
        {/* Facebook */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: "#1877F2" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20"><Facebook size={22} style={{ color: "white" }} /></div>
            <div className="flex-1"><div className="font-bold text-white">Facebook Page</div><div className="text-xs mt-0.5 text-white/70">Yakoo Events</div></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: connected.fb ? "#22C55E" : "#EF4444" }} />
              <span className="text-xs font-semibold text-white">{connected.fb ? "Connecté" : "Déconnecté"}</span>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[["Abonnés", fbStats.followers.toLocaleString("fr-FR")], ["J'aime", fbStats.likes.toLocaleString("fr-FR")], ["Check-ins", fbStats.checkins]].map(([l, v]) => (
                <div key={l} className="text-center rounded-xl py-3" style={{ background: "#F8F9FB" }}>
                  <div className="text-base font-bold" style={{ color: "#1B2A4A" }}>{v}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div><label className="block text-xs font-semibold mb-1" style={{ color: "#6B7A99" }}>Page ID</label><input value={fbPageId} onChange={e => setFbPageId(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg outline-none font-mono" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
              <div><label className="block text-xs font-semibold mb-1" style={{ color: "#6B7A99" }}>Access Token</label><input value={fbToken} onChange={e => setFbToken(e.target.value)} type="password" className="w-full px-3 py-2 text-sm rounded-lg outline-none font-mono" style={{ background: "#F0F2F5", border: "none", color: "#1B2A4A" }} /></div>
            </div>
            <button onClick={() => saveSettings("facebook", fbToken, fbPageId, true)}
              className="mt-4 w-full py-2.5 text-sm font-bold rounded-xl text-white" style={{ background: "#1877F2" }}>
              {connected.fb ? "Reconnecter" : "Connecter Facebook"}
            </button>
          </div>
        </Card>
      </div>

      {/* Automation */}
      <Card className="p-5">
        <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Automatisation & Synchronisation</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { label: "Publication automatique", sub: "Publier les nouvelles activités sur FB & IG", val: autoPost, set: setAutoPost },
            { label: "Post sur réservation confirmée", sub: "Partager automatiquement chaque booking", val: postOnReservation, set: setPostOnReservation },
            { label: "Synchroniser les avis", sub: "Importer les avis Facebook vers Yakoo", val: syncReviews, set: setSyncReviews },
          ].map(item => (
            <div key={item.label} className="flex items-start justify-between p-4 rounded-xl" style={{ background: "#F8F9FB", border: "1px solid rgba(27,42,74,0.06)" }}>
              <div className="flex-1 min-w-0 pr-3">
                <div className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>{item.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "#6B7A99" }}>{item.sub}</div>
              </div>
              <button onClick={() => item.set(p => !p)} className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0 mt-0.5" style={{ background: item.val ? "#F5A623" : "#E8EBF0" }}>
                <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200" style={{ left: item.val ? "calc(100% - 20px)" : 4 }} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => {
          saveSettings("instagram", igToken, "", connected.ig, autoPost);
          saveSettings("facebook", fbToken, fbPageId, connected.fb);
        }} className="mt-4 px-5 py-2.5 text-sm font-bold rounded-xl text-white" style={{ background: "#F5A623", color: "#0F1C30" }}>
          Enregistrer la configuration
        </button>
      </Card>

      {/* Instagram feed preview */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Instagram size={18} style={{ color: "#E1306C" }} />
            <h3 className="font-semibold text-sm" style={{ color: "#1B2A4A" }}>Aperçu flux Instagram</h3>
          </div>
          <a href="https://instagram.com/yakooevents" target="_blank" rel="noopener" className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#E1306C" }}>
            Voir le profil <ExternalLink size={11} />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {mockIgPosts.map(post => (
            <div key={post.id} className="relative group rounded-xl overflow-hidden cursor-pointer" style={{ aspectRatio: "1" }}>
              <img src={`https://images.unsplash.com/${post.img}?w=200&h=200&fit=crop&auto=format`} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <div className="flex items-center gap-1 text-white text-xs"><Heart size={12} fill="white" />{post.likes}</div>
                <div className="flex items-center gap-1 text-white text-xs"><MessageCircle size={12} />{post.comments}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: "#6B7A99" }}>
          <div className="w-2 h-2 rounded-full" style={{ background: "#22C55E" }} />
          Flux synchronisé · Dernière mise à jour : il y a 2 heures
        </div>
      </Card>

      {/* Post composer */}
      <Card className="p-5">
        <h3 className="font-semibold text-sm mb-4" style={{ color: "#1B2A4A" }}>Composer une publication</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <textarea rows={4} placeholder="Rédigez votre publication..." className="w-full px-4 py-3 text-sm rounded-xl outline-none resize-none" style={{ background: "#F8F9FB", border: "1.5px solid rgba(27,42,74,0.1)", color: "#1B2A4A" }} />
            <div className="flex gap-2 flex-wrap">
              {["#YakooEvents", "#Aventure", "#TeamBuilding", "#Tunisie"].map(tag => (
                <button key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "#F0F2F5", color: "#6B7A99" }}>{tag}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked style={{ accentColor: "#1877F2" }} /><Facebook size={14} style={{ color: "#1877F2" }} /><span className="text-xs" style={{ color: "#1B2A4A" }}>Facebook</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked style={{ accentColor: "#E1306C" }} /><Instagram size={14} style={{ color: "#E1306C" }} /><span className="text-xs" style={{ color: "#1B2A4A" }}>Instagram</span></label>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toast.success("Publication envoyée sur Facebook & Instagram !")} className="flex-1 py-2.5 text-sm font-bold rounded-xl text-white flex items-center justify-center gap-2" style={{ background: "#1B2A4A" }}><Send size={14} /> Publier maintenant</button>
              <button onClick={() => toast.info("Publication programmée pour demain à 10h00 !")} className="flex-1 py-2.5 text-sm font-bold rounded-xl border flex items-center justify-center gap-2" style={{ borderColor: "#1B2A4A", color: "#1B2A4A" }}><ClockIcon size={14} /> Programmer</button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background: "#F8F9FB", border: "1px solid rgba(27,42,74,0.08)" }}>
            <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ borderColor: "rgba(27,42,74,0.08)" }}>
              <div className="w-5 h-5 rounded-full" style={{ background: "#1877F2" }} />
              <span className="text-xs font-bold" style={{ color: "#1B2A4A" }}>Aperçu Facebook</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "#F5A623", color: "#0F1C30" }}>YE</div>
                <div><div className="text-xs font-bold" style={{ color: "#1B2A4A" }}>Yakoo Events</div><div className="text-xs" style={{ color: "#6B7A99" }}>À l'instant · 🌍</div></div>
              </div>
              <div className="text-xs mb-3" style={{ color: "#1B2A4A" }}>Votre texte apparaîtra ici avec les hashtags et l'image sélectionnée.</div>
              <div className="rounded-xl overflow-hidden h-32 bg-gray-100">
                <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=128&fit=crop&auto=format" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t text-xs" style={{ borderColor: "rgba(27,42,74,0.08)", color: "#6B7A99" }}>
                <span className="flex items-center gap-1"><ThumbsUp size={11} /> J'aime</span>
                <span className="flex items-center gap-1"><MessageCircle size={11} /> Commenter</span>
                <span className="flex items-center gap-1"><Share2 size={11} /> Partager</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(245,166,35,0.1)" }}>
        <AlertCircle size={28} style={{ color: "#F5A623" }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: "#1B2A4A" }}>{title}</h3>
      <p className="text-sm text-center max-w-xs" style={{ color: "#6B7A99" }}>Cette section est en cours de développement.</p>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
function AppInner() {
  const { lang } = useLang();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    toast.success(`Réservation confirmée !`, { icon: <CheckCircle2 size={16} color="#22C55E" /> });
  };
  const cancelReservation = async (id: string) => {
    await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "Annulée" } : r));
    toast.warning(`Réservation annulée.`);
  };
  const deleteReservation = async (id: string) => {
    await supabase.from('reservations').delete().eq('id', id);
    setReservations(prev => prev.filter(r => r.id !== id));
    toast.success(`Réservation supprimée.`, { icon: <XCircle size={16} color="#EF4444" /> });
  };
  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    const dbStatus = status === "Confirmée" ? 'confirmed' : status === "Annulée" ? 'cancelled' : 'pending';
    await supabase.from('reservations').update({ status: dbStatus }).eq('id', id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Statut mis à jour : ${status}`);
  };
  const addReservation = (r: Reservation) => {
    setReservations(prev => [r, ...prev]);
  };

  if (!isLoggedIn) {
    return (
      <>
        <Toaster position="bottom-right" richColors />
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      </>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage reservations={reservations} onNavigate={setPage} onConfirm={confirmReservation} onDelete={deleteReservation} />;
      case "reservations": return <ReservationsPage reservations={reservations} onConfirm={confirmReservation} onCancel={cancelReservation} onDelete={deleteReservation} onUpdateStatus={updateReservationStatus} onAdd={addReservation} />;
      case "finances": return <FinancesPage />;
      case "activities": return <ActivitiesPage />;
      case "packs": return <PacksPage />;
      case "reviews": return <ReviewsPage />;
      case "faq": return <FAQPage />;
      case "content": return <ContentPage />;
      case "sponsors": return <SponsorsPage />;
      case "calendar": return <CalendarPage />;
      case "tasks": return <TasksPage />;
      case "tickets": return <TicketsPage />;
      case "loyalty": return <LoyaltyPage />;
      case "services": return <ServicesPage />;
      case "social": return <SocialPage />;
      case "stats": return <StatsPage />;
      case "users": return <UsersPage />;
      case "settings": return <SettingsPage onLogout={handleLogout} />;
      case "contacts": return <ContactsPage />;
      case "materiel": return <MaterielsPage />;
      default: return <PlaceholderPage title={pageTitles[page]} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F0F2F5", fontFamily: lang === "ar" ? "'Noto Sans Arabic', sans-serif" : "Inter, sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <Toaster position={lang === "ar" ? "bottom-left" : "bottom-right"} richColors />
      <Sidebar activePage={page} onNavigate={setPage} onLogout={handleLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={lang === "ar" ? "lg:mr-[260px] mr-0" : "lg:ml-[260px] ml-0"}>
        <Header page={page} onNavigate={setPage} onLogout={handleLogout} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-6">{renderPage()}</main>
      </div>
    </div>
  );
}

export default function Admin() {
  const [lang, setLang] = useState<Lang>("fr");
  const tr = (text: string) => lang === "ar" ? (AR[text] ?? text) : text;
  return (
    <LanguageContext.Provider value={{ lang, setLang, tr }}>
      <AppInner />
    </LanguageContext.Provider>
  );
}
