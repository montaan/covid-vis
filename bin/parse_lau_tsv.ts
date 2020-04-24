const fs = require('fs');

const data = fs.readFileSync('EU-28-LAU-2019-NUTS-2016.tsv').toString();
const lines = data.split('\n');

const LAU = {};

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0 || /^NUTS 3 CODE/.test(line)) continue;
    const fields = line.split("\t").map(h => h.trim());
    const NUTS3code = fields[0];
    const code = fields[1];
    const name = fields[2].replace(/"/g, '');
    const latinName = (fields[3] || name).replace(/"/g, '');
    const population = parseInt(fields[5]);
    if (isNaN(population)) continue;
    const laus = (LAU[NUTS3code] = LAU[NUTS3code] || {});
    laus[code] = { name, latinName, population };
}

fs.writeFileSync('LAUbyNUTS3.json', JSON.stringify(LAU));