import fs from 'fs';

let content = fs.readFileSync('src/app/App.tsx', 'utf-8');

// The original Reservation code looks something like:
/*
  const handleSubmit = () => setSubmitted(true);
*/
const newSubmitCode = `
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { error } = await supabase.from('reservations').insert({
      activity_name: activity,
      group_size: people,
      reservation_date: date,
      contact_name: name,
      contact_phone: phone,
      notes: message,
      status: 'pending'
    });
    
    setIsSubmitting(false);
    
    if (!error) {
      setSubmitted(true);
    } else {
      alert("Erreur lors de l'envoi de la réservation: " + error.message);
    }
  };
`;

content = content.replace(
  'const handleSubmit = () => setSubmitted(true);',
  newSubmitCode
);

// We need to update the onClick of the Submit button from disabled={!canNext.every(Boolean)} to also check isSubmitting
content = content.replace(
  'disabled={!canNext.every(Boolean)}',
  'disabled={!canNext.every(Boolean) || isSubmitting}'
);
content = content.replace(
  'Valider ma réservation',
  '{isSubmitting ? "Envoi en cours..." : "Valider ma réservation"}'
);

fs.writeFileSync('src/app/App.tsx', content);
