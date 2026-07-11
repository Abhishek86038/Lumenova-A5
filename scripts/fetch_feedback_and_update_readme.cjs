const fs = require('fs');

async function main() {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/1ZDsFvUHNoKn2T-9BPVVMjSmlpU2ciXB8jStX7FzXY3Q/export?format=csv';
  console.log("Fetching feedback data from Google Sheets...");
  
  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }
    
    const csvData = await response.text();
    console.log("Successfully fetched CSV data!");
    
    // Save to local file just in case
    fs.writeFileSync('feedback_data.csv', csvData);

    const lines = csvData.split('\n').filter(l => l.trim() !== '');
    if (lines.length <= 1) {
      console.log("No feedback data found in the sheet (only header or empty).");
      return;
    }

    // Google Sheets CSV format usually starts with headers like:
    // Timestamp, Name, Email, Wallet Address, Rating, Suggestions/Feedback...
    // Let's check headers using parseCsvLine helper
    const headers = parseCsvLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));
    console.log("Detected Headers:", headers);

    // Let's find indexes of Name, Email, Wallet, and Suggestions/Feedback
    // Since index can vary, let's search for keywords:
    let nameIdx = -1;
    let emailIdx = -1;
    let walletIdx = -1;
    let feedbackIdx = -1;

    for (let i = 0; i < headers.length; i++) {
      const h = headers[i].toLowerCase();
      if (h.includes('name?')) nameIdx = i;
      else if (h.includes('email address')) emailIdx = i;
      else if (h.includes('wallet address')) walletIdx = i;
      else if (h.includes('added or improved?')) feedbackIdx = i;
    }

    // Fallbacks if not found
    if (nameIdx === -1) nameIdx = 1; // default second col
    if (emailIdx === -1) emailIdx = 2; // default third col
    if (walletIdx === -1) walletIdx = 3; // default fourth col
    if (feedbackIdx === -1) feedbackIdx = headers.length - 1; // default last col

    console.log(`Mapping indexes -> Name: ${nameIdx}, Email: ${emailIdx}, Wallet: ${walletIdx}, Feedback: ${feedbackIdx}`);

    let tableMd = `| Name | Email | Wallet Address | Suggestion / Feedback |\n| --- | --- | --- | --- |\n`;

    // Helper to parse CSV row correctly handling quotes
    function parseCsvLine(line) {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    }

    const dataLines = lines.slice(1);
    let count = 0;
    
    for (const line of dataLines) {
      const cols = parseCsvLine(line);
      if (cols.length < Math.max(nameIdx, emailIdx, walletIdx, feedbackIdx)) continue;
      
      const name = (cols[nameIdx] || 'Anonymous').replace(/^"|"$/g, '').trim();
      const email = (cols[emailIdx] || 'N/A').replace(/^"|"$/g, '').trim();
      const wallet = (cols[walletIdx] || 'N/A').replace(/^"|"$/g, '').trim();
      let feedback = (cols[feedbackIdx] || 'N/A').replace(/^"|"$/g, '').trim();
      
      // Clean up newlines in feedback
      feedback = feedback.replace(/\r?\n|\r/g, " ");

      const shortWallet = wallet.length > 15 ? (wallet.slice(0, 6) + '...' + wallet.slice(-6)) : wallet;

      tableMd += `| ${name} | ${email} | [${shortWallet}](https://stellar.expert/explorer/testnet/account/${wallet}) | ${feedback} |\n`;
      count++;
    }

    // Now inject this into README.md under Section 13 (User Onboarding & Feedback Summary)
    const readmePath = 'README.md';
    let readme = fs.readFileSync(readmePath, 'utf-8');

    const targetStart = "**Feedback Summary from Beta Testing:**";
    const targetStartIndex = readme.indexOf(targetStart);

    if (targetStartIndex !== -1) {
      const targetRegex = /\r?\n---\r?\n\r?\n## 14. User Growth/;
      const match = readme.substring(targetStartIndex).match(targetRegex);
      if (match) {
        const nextSeparatorIndex = targetStartIndex + match.index;
        const replacementText = `**Feedback Summary from Beta Testing:**\n\nWe collected real feedback from our beta users. Here is the list of user responses:\n\n${tableMd}\n`;
        readme = readme.substring(0, targetStartIndex) + replacementText + readme.substring(nextSeparatorIndex);
        fs.writeFileSync(readmePath, readme);
        console.log(`Successfully added ${count} feedback rows to README.md!`);
      } else {
        console.log("Could not find the end separator after feedback summary.");
      }
    } else {
      console.log("Could not find the feedback summary start token in README.");
    }

  } catch (error) {
    console.error("Error fetching/updating feedback:", error);
  }
}

main();
