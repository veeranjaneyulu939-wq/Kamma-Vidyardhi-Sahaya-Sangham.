const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.get('SELECT content FROM pages WHERE page_name = ?', ['home'], (err, row) => {
  if (err || !row) {
    console.error("Home page not found");
    return;
  }
  
  const content = JSON.parse(row.content);
  
  // Add the management committee as 'profiles'
  content.profiles = [
    { 
      role: "Honorary President", 
      name: "శ్రీ కొండబోలు బసవ పున్నయ్య గారు", 
      bio: "ప్రముఖ వైద్యులు, విద్యాదాత. నాగార్జున ఎడ్యుకేషనల్ సొసైటీకి వ్యవస్థాపక సభ్యులు మరియు ప్రస్తుత అధ్యక్షులు.",
      image: ""
    },
    { 
      role: "President", 
      name: "శ్రీ మండలపు బంగారు బాబు గారు", 
      bio: "కమ్మ విద్యార్థి సహాయ సంఘం అధ్యక్షులుగా బాధ్యతలు నిర్వహిస్తున్నారు. విద్యార్థుల అభివృద్ధి కోసం విశేష కృషి చేస్తున్నారు.",
      image: ""
    },
    { 
      role: "Secretary", 
      name: "డా. కొండబోలు కృష్ణ ప్రసాద్", 
      bio: "38 సంవత్సరాలు అనేది నిజంగా ఒక సుదీర్ఘ ప్రయాణం. విద్యా రంగంలో లాభాపేక్షలేని సేవా దృక్పథంతో ఎంతో మంచి సేవలను అందిస్తూ వస్తున్నందుకు KLP కుటుంబంగా మేము ఎంతో సంతోషంగా ఉన్నాము...",
      image: ""
    }
  ];

  db.run('UPDATE pages SET content = ? WHERE page_name = ?', [JSON.stringify(content), 'home'], (err) => {
    if (err) console.error(err);
    else console.log('Home page updated with profiles successfully.');
  });
});
