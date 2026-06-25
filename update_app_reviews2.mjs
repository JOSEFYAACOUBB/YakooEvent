import fs from 'fs';

let content = fs.readFileSync('src/app/App.tsx', 'utf-8');
const lines = content.split('\n');

let start = -1;
let end = -1;
let marqueeIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function Testimonials() {')) {
    start = i;
  }
  if (start !== -1 && lines[i].includes('const EXTENDED_TESTIMONIALS = [')) {
    end = i;
  }
  if (start !== -1 && lines[i].includes('const MARQUEE_ITEMS = [')) {
    marqueeIdx = i;
    break;
  }
}

if (start !== -1 && end !== -1 && marqueeIdx !== -1) {
  const newSetup = `function Testimonials() {
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

  // We replace from start to end
  lines.splice(start, end - start + 1, ...newSetup.split('\n'));
  
  // Now we need to find MARQUEE_ITEMS again because indices shifted
  let newMarqueeIdx = -1;
  for (let i = start; i < lines.length; i++) {
    if (lines[i].includes('const MARQUEE_ITEMS = [')) {
      newMarqueeIdx = i;
      break;
    }
  }

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

  // The original has a line before: // Double the array for seamless infinite scrolling
  if (lines[newMarqueeIdx - 1].includes('Double the array')) {
    lines.splice(newMarqueeIdx - 1, 2, ...newMarquee.split('\n'));
  } else {
    lines.splice(newMarqueeIdx, 1, ...newMarquee.split('\n'));
  }

  content = lines.join('\n');
  fs.writeFileSync('src/app/App.tsx', content);
  console.log("Replaced Testimonials successfully!");
} else {
  console.log("Could not find markers", start, end, marqueeIdx);
}
