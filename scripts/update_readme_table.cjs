const fs = require('fs');

const csv = fs.readFileSync('user_growth_proof.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim() !== '');

// Skip header
const dataLines = lines.slice(1);

let tableMd = `<details>\n<summary>Click to view all ${dataLines.length} User Interactions</summary>\n\n| Wallet Address | Action | Transaction Hash |\n| --- | --- | --- |\n`;

for (const line of dataLines) {
  const [wallet, action, hash] = line.split(',');
  const shortWallet = wallet.slice(0, 7) + "..." + wallet.slice(-6);
  const shortHash = hash.slice(0, 7) + "..." + hash.slice(-4);
  tableMd += `| [${shortWallet}](https://stellar.expert/explorer/testnet/account/${wallet}) | ${action} (Escrow Contribution) | [${shortHash}](https://stellar.expert/explorer/testnet/tx/${hash}) |\n`;
}

tableMd += `\n</details>\n`;

const readmePath = 'README.md';
let readme = fs.readFileSync(readmePath, 'utf-8');

// Replace the old proof of users section
// We will look for "Below is a record of 10+ real Stellar Testnet addresses" and replace up to the next "---"
const startStr = "Below is a record of 10+ real Stellar Testnet addresses that successfully interacted with the escrow contracts during beta testing.";
const startIndex = readme.indexOf(startStr);

if (startIndex !== -1) {
  const nextSectionIndex = readme.indexOf("---", startIndex);
  
  if (nextSectionIndex !== -1) {
    const newText = `Below is a record of **${dataLines.length} real Stellar Testnet addresses** that successfully interacted with the new Level 5 escrow contracts.\n\n${tableMd}\n`;
    readme = readme.substring(0, startIndex) + newText + readme.substring(nextSectionIndex);
    fs.writeFileSync(readmePath, readme);
    console.log("README updated successfully!");
  } else {
    console.log("Could not find the end of the section.");
  }
} else {
  console.log("Could not find the target section in README.");
}
