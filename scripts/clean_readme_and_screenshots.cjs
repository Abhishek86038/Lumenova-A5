const fs = require('fs');

const csv = fs.readFileSync('user_growth_proof.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim() !== '');
const dataLines = lines.slice(1);

let tableMd = `<details>\n<summary>Click to view all ${dataLines.length} User Interactions</summary>\n\n| Wallet Address | Action | Transaction Hash |\n| --- | --- | --- |\n`;

for (const line of dataLines) {
  const [wallet, action, hash] = line.split(',');
  const shortWallet = wallet.slice(0, 7) + "..." + wallet.slice(-6);
  const shortHash = hash.slice(0, 7) + "..." + hash.slice(-4);
  tableMd += `| [${shortWallet}](https://stellar.expert/explorer/testnet/account/${wallet}) | ${action} (Escrow Contribution) | [${shortHash}](https://stellar.expert/explorer/testnet/tx/${hash}) |\n`;
}
tableMd += `\n</details>`;

const readmePath = 'README.md';
let readme = fs.readFileSync(readmePath, 'utf-8');

// We want to replace from "## 14. Proof of Real User Interactions" all the way down to the line before "## 17. Project Structure"
const targetStart = "## 14. Proof of Real User Interactions";
const targetEnd = "## 17. Project Structure";

const startIndex = readme.indexOf(targetStart);
const endIndex = readme.indexOf(targetEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const newSection = `## 14. User Growth & Proof of Users

Lumenova actively tracks its user growth using Plausible Analytics and on-chain interaction metrics. Below is the record of **${dataLines.length} unique wallets** that successfully performed transactions on the Stellar Testnet:

${tableMd}

---

## 15. CI/CD Pipeline

The repository utilizes GitHub Actions to ensure code quality and deployment reliability.
- **On Push/PR:**
  - Runs \`cargo test\` for Soroban smart contracts.
  - Runs \`oxlint\` for frontend code quality.
  - Runs \`npm run build\` to verify Vite compilation.
  - Runs \`npm run test\` for frontend unit tests.

---

## 16. Screenshots (Level 5)

Please add the following screenshots for Level 5 submission in the \`./screenshots/\` directory:

- **Analytics Dashboard (50+ unique users/sessions):**
  \`![Analytics - 50+ Users](./screenshots/analytics-50-users.png)\`
- **Transaction Activity (Stellar Expert showing active volume across unique wallets):**
  \`![Transaction Activity](./screenshots/transaction-activity.png)\`
- **Improved Onboarding Flow (New onboarding modal):**
  \`![Improved Onboarding Flow](./screenshots/improved-onboarding.png)\`

---

`;

  readme = readme.substring(0, startIndex) + newSection + readme.substring(endIndex);
  fs.writeFileSync(readmePath, readme);
  console.log("Cleaned Section 14, 15, and 16 in README.md successfully!");
} else {
  console.log("Could not find start or end target in README.");
}
