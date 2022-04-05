const options = {
    ethPrice: 3000,
    daiPrice: 1,
};

const communities = {
    type: 'MANY',
    tiles_snapshot: {
        type: 'CSV',
        file: './tiles.csv',
        field: 'Address',
        earnings: '0x1',
        reasons: 'tiles_community',
    },

    // snapshot: {
    //   type: 'CSV',
    //   file: '../ledger.csv',
    //   field: 'sender',
    //   earnings: async (tx: any, opts: typeof options) => {
    //     if (tx.coin === 'ETH') {
    //       return `0x${Number(utils.formatEther(BigNumber.from(tx.value).mul(opts.ethPrice))).toString(16)}`; // Convert to USD
    //     }
    //     if (tx.coin === 'DAI') {
    //       return `0x${Number(utils.formatEther(BigNumber.from(tx.value).mul(opts.daiPrice))).toString(16)}`; // Convert to USD
    //     }
    //   },
    //   reasons: 'contributed',
    // },
    // openlaw_developers: {
    //   type: "ARRAY",
    //   file: "../example-data/openlaw-developers.ts",
    //   export: "OPENLAW_DEVELOPERS",
    //   earnings: "0x100",
    //   reasons: "openlaw_developers",
    // },
    // openlaw_dao_members: {
    //   type: "ARRAY",
    //   file: "../example-data/dao-participation.ts",
    //   export: "DAO_PARTICIPANTS",
    //   earnings: "0x200",
    //   reasons: "openlaw_dao_members",
    // },
    // dao_participation: {
    //   type: "ARRAY",
    //   file: "../example-data/openlaw-developers.ts",
    //   export: "OPENLAW_DEVELOPERS",
    //   earnings: "0x100",
    //   reasons: "dao_participation",
    // },
    // juicebox_dao_members: {
    //   type: "CSV",
    //   file: "../example-data/juicebox-dao-members.csv",
    //   field: "Wallet address",
    //   earnings: "0x400",
    //   reasons: "juicebox_dao_members",
    // },
    // freerossdao_contributors: {
    //   type: "CSV",
    //   file: "../example-data/freerossdao-contributors.csv",
    //   field: "sender",
    //   earnings: "0x500",
    //   reasons: "freerossdao_contributors",
    // },
    // endowment_contributors: {
    //   type: "CSV",
    //   file: "../example-data/endowment-contributors.csv",
    //   field: "sender",
    //   earnings: "0x600",
    //   reasons: "endowment_contributors",
    // },
    // ens_community: {
    //   type: "STRANGE_JSON",
    //   file: "../example-data/ens-community.json",
    //   field: "owner",
    //   earnings: "0x700",
    //   reasons: "ens_community",
    // },
};

import { BigNumber, utils } from 'ethers';
import { promises as fs } from 'fs';
import path from 'path';

async function parse(struct: Record<string, any>, state: Record<string, any>[] = []) {
    if (typeof struct.type !== 'string') return;
    if (struct.type === 'MANY') {
        for (const key of Object.keys(struct)) {
            if (key === 'type') continue;
            const _struct = struct[key];
            if (_struct?.type && _struct?.file) {
                await parse(_struct, state);
            }
        }
    } else if (struct.type === 'ARRAY') {
        const module = await import(struct.file);
        if (Array.isArray(module[struct.export])) {
            for (const entry of module[struct.export]) {
                if (typeof entry === 'string') {
                    const earnings =
                        typeof struct.earnings === 'function' ? await struct.earnings(entry, options) : struct.earnings;
                    state.push({
                        address: entry,
                        earnings,
                        reasons: struct.reasons,
                    });
                }
            }
        } else {
            throw Error(`${struct.export} not exported by ${struct.file}`);
        }
    } else if (struct.type === 'CSV') {
        const fileBuffer = await fs.readFile(path.join(__dirname, struct.file));
        const file = fileBuffer?.toString();
        const lines = file.split('\n').filter((line) => line.trim());
        const columns = lines[0]?.split(',');
        for (const line of lines.slice(1)) {
            const values = line.split(',');
            const obj = {} as Record<string, any>;
            for (const [index, column] of Object.entries(columns)) {
                obj[column] = values[Number(index)];
            }
            const earnings =
                typeof struct.earnings === 'function' ? await struct.earnings(obj, options) : struct.earnings;
            state.push({
                address: obj[struct.field],
                earnings,
                reasons: struct.reasons,
            });
        }
    } else if (struct.type === 'STRANGE_JSON') {
        const fileBuffer = await fs.readFile(path.join(__dirname, struct.file));
        const file = fileBuffer?.toString();
        const lines = file.split('\n');
        const entries = [] as Record<string, any>[];
        let stack = [] as string[];
        for (const line of lines) {
            if (stack.length === 0 && line.trim() === '{') {
                stack.push(line);
            } else if (stack.length !== 0 && line.trim() === '}') {
                stack.push(line);
                const json = JSON.parse(stack.join('\n'));
                const earnings =
                    typeof struct.earnings === 'function' ? await struct.earnings(json, options) : struct.earnings;
                state.push({
                    address: json[struct.field],
                    earnings,
                    reasons: struct.reasons,
                });
                stack = [];
            } else if (stack.length) {
                stack.push(line);
            }
        }
    }
    return state as { address: string; earnings: string; reasons: string }[];
}

parse(communities)
    .then((state) => {
        if (typeof state !== 'undefined') {
            const result = {} as Record<string, Record<string, string>>;
            for (let { address, earnings, reasons } of state) {
                address = address.toLowerCase();
                if (typeof result[address] === 'undefined') {
                    result[address] = { earnings: `0x${Number(earnings).toString(16)}`, reasons };
                } else {
                    result[address] = {
                        earnings: `0x${Math.trunc(Number(result[address].earnings) + Number(earnings)).toString(16)}`,
                        reasons:
                            result[address].reasons.indexOf(reasons) > -1
                                ? result[address].reasons
                                : `${result[address].reasons},${reasons}`,
                    };
                }
            }
            const newFormat = Object.entries(result).map(([address, data]) => ({
                address,
                ...data,
            }));
            const outfile = path.join(__dirname, './merkle-input.json');
            fs.writeFile(outfile, JSON.stringify(newFormat, null, '  '));
            console.log(`Output: ${outfile}`);
        }
    })
    .catch((error) => {
        console.error(`Error:`, error?.message);
    });
