const fs = require('fs');

const data = fs.readFileSync('demo_r_pjanaggr3.tsv').toString();
const lines = data.split('\n');
const header = lines.shift().split("\t").map(h => parseInt(h.trim()));

const NUTS = {};

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0) continue;
    const fields = line.split("\t").map(h => h.trim());
    const [unit, sex, age, geo] = fields[0].split(',');
    if (!NUTS[geo]) NUTS[geo] = { population: {} };
    if (!NUTS[geo].population[age]) NUTS[geo].population[age] = {};
    if (!NUTS[geo].population[age][sex]) NUTS[geo].population[age][sex] = {};
    let years = NUTS[geo].population[age][sex];
    for (let j = 1; j < fields.length; j++) {
        const num = parseInt(fields[j]);
        if (isNaN(num) || num === 0) continue;
        years[header[j]] = num;
        if (!years.latest) years.latest = num;
    }
}

fs.writeFileSync('NUTS.ts', `export const NUTS = ${JSON.stringify(NUTS)};`);