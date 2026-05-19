const Database = require('better-sqlite3');
const db = new Database('data/carthage.db');
console.log("Challenges:");
console.log(db.prepare("SELECT COUNT(*) FROM battle_challenges").get());
console.log("Sessions:");
console.log(db.prepare("SELECT COUNT(*) FROM sessions").get());
