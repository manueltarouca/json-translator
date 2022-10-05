import fs from 'fs';
import translate from 'translate';
import * as file from '../data/data.json' assert { type: 'json'};

const data = file.default;
const TARGET_LANGUAGE = process.argv[2] || 'pt';

const mergeObject = (a, b) => {
  return Object.assign(a, b);
}

const translateLog = async (item) => {
  if (typeof (item) === 'string') {
    const translatedItem = await translate(item, TARGET_LANGUAGE);
    console.log(`Translated:\n${item}\ninto:\n${translatedItem}\n---`)
    return translatedItem;
  } else {
    const newKeys = Object.keys(item);
    const xpto = newKeys.map(async (newKey) => {
      const translatedItem = await translateLog(item[newKey]);
      if (translatedItem) {
        const newObj = {};
        newObj[newKey] = translatedItem
        return newObj;
      }
    });
    let responses = await Promise.all(xpto);
    return responses.reduce(mergeObject);
  }
}

async function main() {
  const result = await translateLog(data);
  fs.writeFileSync(`./data/translated-${TARGET_LANGUAGE}.json`, JSON.stringify(result, null, 2), { encoding: 'utf-8' });
}

main()