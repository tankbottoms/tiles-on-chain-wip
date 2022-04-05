import fs from 'fs';
import path from 'path';

function getPath(file: string) {
    return path.join(__dirname, `./crawl-me/`, file);
}

const addresses = new Set<string>();

async function main() {
    const files = fs.readdirSync(getPath('.'));
    const data: any = {};
    for (const file of files) {
        const fileData = fs.readFileSync(getPath(file), 'utf8').toString();
        const _addresses = (fileData.match(/0x[0-9a-fA-F]{40,40}[^0-9a-fA-F]/g) || []).map(a => a.slice(0, 42));
        for (const address of _addresses) {
            addresses.add(address);
        }
    }
    const list = Array.from(addresses).map((address) => ({
        address,
        earnings: '0x1',
        reasons: 'unknown',
    }));
    fs.writeFileSync(getPath('../merkle-input.json'), JSON.stringify(list, null, '  '));
}

main();
