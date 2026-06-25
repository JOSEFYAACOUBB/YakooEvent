import fs from 'fs';

let content = fs.readFileSync('src/app/App.tsx', 'utf-8');

const oldModalSubmit = `onClick={() => canSubmit && setDone(true)}`;
const newModalSubmit = `onClick={async () => {
                    if (canSubmit) {
                      await supabase.from('reviews').insert({
                        name: rName,
                        job: rActivity || 'Client',
                        review: rText,
                        rating: rStars,
                        status: 'En attente',
                        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                      });
                      setDone(true);
                    }
                  }}`;

if (content.includes(oldModalSubmit)) {
  content = content.replace(oldModalSubmit, newModalSubmit);
  fs.writeFileSync('src/app/App.tsx', content);
  console.log("Updated ReviewModal submission logic in App.tsx");
} else {
  console.log("Could not find ReviewModal submission logic in App.tsx");
}
