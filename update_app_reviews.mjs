import fs from 'fs';

let content = fs.readFileSync('src/app/App.tsx', 'utf-8');

const oldTestimonialsStart = `function Testimonials() {
  const [reviewOpen, setReviewOpen] = useState(false);

  const EXTENDED_TESTIMONIALS = [`;

const newTestimonials = `function Testimonials() {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [dbReviews, setDbReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase.from('reviews').select('*').eq('status', 'Publié');
      if (data && data.length > 0) {
        setDbReviews(data);
      }
    };
    fetchReviews();
  }, []);

  const EXTENDED_TESTIMONIALS = [`;

if (content.includes(oldTestimonialsStart)) {
  content = content.replace(oldTestimonialsStart, newTestimonials);
}

const oldMarquee = `  // Double the array for seamless infinite scrolling
  const MARQUEE_ITEMS = [...EXTENDED_TESTIMONIALS, ...EXTENDED_TESTIMONIALS];`;

const newMarquee = `  const formatReviews = (reviews: any[]) => {
    return reviews.map((r, i) => ({
      name: r.name,
      role: r.job || "Client",
      company: "",
      activity: "Yakoo Events",
      stars: r.rating || 5,
      text: r.review,
      img: \`https://images.unsplash.com/photo-\${1500000000000 + (r.name.length * 1000)}?w=120&h=120&fit=crop&auto=format\`,
      color: ["#22c55e", "#38bdf8", "#fb7185", "#f97316", "#3b82f6"][i % 5],
    }));
  };

  const currentReviews = dbReviews.length > 0 ? formatReviews(dbReviews) : EXTENDED_TESTIMONIALS;

  // Double the array for seamless infinite scrolling
  const MARQUEE_ITEMS = [...currentReviews, ...currentReviews];`;

if (content.includes(oldMarquee)) {
  content = content.replace(oldMarquee, newMarquee);
}

// In the ReviewModal, we should ideally post to DB, but that's already in the ReviewModal logic?
// Let's check if the modal has a submit handler.
// Search for handleReviewSubmit

fs.writeFileSync('src/app/App.tsx', content);
console.log("Updated Testimonials component in App.tsx");
