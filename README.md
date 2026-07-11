# 🌌 Lumenova-A5

### Trustless Crowdfunding and Milestone-Based Reward Badges on Stellar Soroban
*A production-ready decentralized crowdfunding suite built for Level 4 (Green Belt) of the Stellar Builder Challenge.*

[![CI/CD Pipeline](https://github.com/Abhishek86038/Lumenova3.1/actions/workflows/ci.yml/badge.svg)](https://github.com/Abhishek86038/Lumenova3.1/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 1. Title & Tagline

**Lumenova-L4: Escrow-Driven Crowdfunding on Stellar**
*Don't just trust the creator—trust the smart contract. Milestone-gated funding secured by the community.*

---

## 2. Overview

Lumenova-L4 evolves traditional crowdfunding into a fully decentralized, milestone-based Escrow system on the Stellar network using Soroban smart contracts. 

In standard crowdfunding (like Kickstarter or GoFundMe), backers trust creators to deliver on their promises once fully funded. Often, this trust is broken, leading to delayed or abandoned projects and lost funds. Lumenova Escrow solves this:
- Funds are **locked in a Soroban smart contract escrow** instead of being instantly released.
- Projects are divided into **4 core milestones** (25%, 50%, 75%, 100%).
- Creators must submit **cryptographic proof** of progress (e.g., IPFS hash or URL) to unlock the next tranche of funds.
- Donors **vote** to approve or reject the submitted proof. Voting power is weighted by their cumulative donation amount.
- If a milestone is approved, 25% of the funds are released. If rejected, donors can **claim a refund** for the remaining balance.

This creates a high-trust environment: creators get incremental funding to build, and donors maintain control over their unspent capital if the project goes off track. This project represents the evolution from the Level 1-3 baseline into a robust, production-ready MVP.

---

## 3. Problem Statement & Why Stellar

### The Problem
Crowdfunding platforms suffer from a significant "trust deficit." Billions of dollars have been raised globally, but up to 9% of Kickstarter projects fail to deliver rewards, and even more deliver late or drastically under-scope. Donors bear 100% of the risk once the campaign goal is met.

### The Solution
A trustless escrow system where community consensus controls capital deployment.

### Why Stellar?
Stellar's fast transaction speeds and negligible fees make micro-donations and community voting economically viable. Soroban smart contracts allow us to write complex, secure escrow and weighted-voting logic natively in Rust without the high gas costs of other Layer-1 networks.

---

## 4. Architecture

### Frontend (React + Vite)
- The user interface provides real-time interaction with the Stellar Testnet. 
- It tracks wallet state (Freighter), parses on-chain data into human-readable milestones, and securely builds transactions for donations and voting.
- Built using React, TailwindCSS, and `@stellar/freighter-api`.

### Smart Contracts (Soroban/Rust)
1. **Crowdfunding Escrow Contract (`crowdfunding`)**:
   - Holds the XLM capital securely.
   - Manages the `Milestone` structural state (tracking approval/rejection votes).
   - Dynamically calculates vote weight based on donor history.
2. **Rewards Badge Contract (`rewards_badge`)**:
   - A secondary non-transferable token contract initialized alongside the campaign.
   - Mints customized soulbound badges ("Spark", "Glow", "Supernova") dynamically based on the total cumulative donation tier.

### Data Flow
1. **Donor** deposits XLM -> `CrowdfundingContract` (held in Escrow) -> Donor receives minted `RewardBadge`.
2. **Creator** submits proof -> `CrowdfundingContract` updates Milestone state to `ProofSubmitted`.
3. **Donors** submit votes -> `CrowdfundingContract` tallies weighted votes.
4. If approved -> Anyone triggers `release_milestone_funds` -> 25% XLM sent to Creator.
5. If rejected -> Donors trigger `refund` -> Unspent proportional XLM returned to Donors.

---

## 5. Features

- **Milestone Dashboard**: Real-time visualization of 4 distinct project milestones (Locked, Reached, ProofSubmitted, Released, Rejected).
- **Escrow Funding**: Secure native token lock-up that prevents creator rug-pulls.
- **Weighted Community Voting**: Donors can approve or reject proofs, with votes weighted perfectly to their financial skin-in-the-game.
- **Dynamic Refund Mechanism**: Automated withdrawal of unspent funds for rejected milestones.
- **Real-Time On-chain Updates**: Live event feed tracking donations and milestone actions.
- **Analytics & Monitoring**: Plausible Analytics integration for user interaction tracking and Sentry for error capturing.
- **Onboarding & Feedback**: Interactive "How it Works" modal for new users and an integrated feedback widget for continuous improvement.
- **Glassmorphic UI**: Premium, mobile-responsive, star-themed design tailored for the Stellar ecosystem.

---

## 6. Tech Stack

- **Smart Contracts**: Rust, Soroban SDK `v22.0.11`
- **Frontend Framework**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4, Vanilla CSS
- **Stellar Integration**: `@stellar/stellar-sdk` v16, `@stellar/freighter-api` v6
- **Testing**: Cargo test (Rust), Vitest/JSDOM (Frontend)
- **Monitoring/Analytics**: `@sentry/react`, Plausible Analytics (Mock wrappers integrated)
- **Linting**: Oxlint

---

## 7. Smart Contracts

### Crowdfunding Escrow Contract
**Deployed Contract ID:** `<CROWDFUNDING_ESCROW_CONTRACT_ID>`
- `initialize(campaign_owner, goal_amount, token, badge_contract)`: Sets up the campaign.
- `donate(donor, amount)`: Transfers XLM to the contract and mints the appropriate tier badge.
- `submit_milestone_proof(milestone_id, proof_hash)`: Creator submits proof when the goal threshold is met.
- `vote_on_milestone(donor, milestone_id, approve)`: Casts a weighted vote.
- `release_milestone_funds(milestone_id)`: Disburses 25% of the goal to the creator.
- `refund(donor, milestone_id)`: Refunds the donor their remaining unspent capital if a milestone fails.

### Rewards Badge Contract
**Deployed Contract ID:** `CAAP5TGGZGLFXYGJY2H2O637FREG4EXE2PXI3A3Y4D6ST74QMI4YBD6C`
- `initialize(admin, name, symbol)`: Sets up the soulbound token.
- `mint(to, amount)`: Mints non-transferable representation of contribution.
- `balance(id)`: Returns the badge balance/tier.

---

## 8. Live Demo & Video

- **Live Demo URL:** [Lumenova-A4 Live Website](https://lumenova-a4.vercel.app/)
- **Demo Video Link:** [Watch the Video on YouTube](https://youtu.be/iOSuQ9mYY2o)
- **Sample Transaction Hash:** `<SAMPLE_TX_HASH>`

---

## 9. Prerequisites & Setup & Installation

### Prerequisites
1. **Rust & Soroban CLI**:
   ```bash
   rustup target add wasm32-unknown-unknown
   cargo install --locked stellar-cli --features opt
   ```
2. **Node.js**: v18+
3. **Freighter Wallet**: Browser extension installed and connected to Stellar Testnet.

### Installation
1. Clone the repository:
   ```bash
   git clone <REPO_URL>
   cd Lumenova-A4
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Build the smart contracts (optional, already compiled):
   ```bash
   cd contracts/crowdfunding
   cargo build --target wasm32-unknown-unknown --release
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

---

## 10. How to Use

1. **Connect Wallet:** Click "Connect Wallet" in the top right to link your Freighter wallet (Testnet).
2. **Donate:** Use the Quick-Select (10, 50, 200, 500) or enter a custom amount to donate XLM. Sign the transaction in Freighter. Your funds are now in Escrow and you've minted a Reward Badge.
3. **View Milestones:** Scroll down to the Milestone Dashboard. As funding hits 25%, 50%, etc., milestones will change from "Locked" to "Reached".
4. **Submit Proof (Creator Only):** The campaign owner inputs an IPFS hash or URL into the "Submit Proof" field for a reached milestone.
5. **Vote on Proof (Donors Only):** Once proof is submitted, donors click "Approve" or "Reject". 
6. **Release Funds:** If the milestone is approved, click "Release Funds" to disburse the XLM to the creator.
7. **Refund:** If the milestone is rejected, donors can click "Claim Refund" to recover their unspent contribution.

---

## 11. Running Tests

### Smart Contract Tests (Rust)
Validates the entire escrow workflow: donations, weighted voting math, successful releases, and proportional refunds.
```bash
cd contracts/crowdfunding
cargo test
```

### Frontend Tests (Vitest)
Validates UI component rendering and utility math.
```bash
npm run test
```

---

## 12. Analytics & Monitoring

- **Analytics (Plausible):** Wrapped in `src/services/analytics.ts`. Tracks key metrics like `page_view`, `donate`, `submit_feedback`, `milestone_approve`, and `milestone_reject` to help optimize the funnel without invading user privacy.
- **Monitoring (Sentry):** Wrapped in `src/services/monitoring.ts` and integrated via `ErrorBoundary.tsx`. Captures unhandled frontend exceptions and logs transaction preparation failures automatically to the Sentry dashboard for rapid debugging.
- **Analytics Dashboard Link:** `<ANALYTICS_DASHBOARD_LINK>`

---

## 13. User Onboarding & Feedback Summary

### Onboarding Flow
First-time visitors are greeted with the `OnboardingModal` which succinctly explains the concept of "Escrow Smart Contracts" and "Milestone Voting". It guides them to install Freighter and use the Friendbot to obtain Testnet XLM.

### Feedback Loop
Users can click the persistent "Feedback" widget to leave a 1-5 star rating and comment, seamlessly tracked via our Analytics wrapper.

**Feedback Summary from Beta Testing:**

We collected real feedback from our beta users. Here is the list of user responses:

### 1. Collected Beta Feedback (Raw Data)

| Name | Email | Wallet Address | Suggestion / Feedback |
| --- | --- | --- | --- |
| Suhani singh | suhanisingh7127@gmail.com | [GCXTLD...KSQUMP](https://stellar.expert/explorer/testnet/account/GCXTLDSQT6TBAGHQJL262C3LJ3D5I44QLCDK7QLTYZFAHAUET2KSQUMP) | Add a copy to clipboard button next to the wallet address and contract ID so users can easily copy them |
| Sonali kumari | sonalikumari73664@gmail.com | [GAKY3B...GFNRZO](https://stellar.expert/explorer/testnet/account/GAKY3BODJOT624DGB3LGFIYCI4JDIXI725S5MOW7WGP4VLAPJPGFNRZO) | Add toast notifications that show a success message on every donate vote and wallet connect action |
| Mohit sharma | mohitsh72788@gmail.com | [GBGCLC...XOEPAX](https://stellar.expert/explorer/testnet/account/GBGCLCI2Q62TUDALIEH46EE4VHBMDABHULP2CZWHBL2XKWA644XOEPAX) | Add a dark light mode toggle button so users can choose their preferred theme |
| Saurabh Shukla | Shau76Shukla@gmail.com | [GDKYQW...N4NGYC](https://stellar.expert/explorer/testnet/account/GDKYQWOPBORJIT6GC6C2HBQ5CZ3MZP6Z4Q5RTW23LZ2XXZIZTLN4NGYC) | Turn the Friendbot link into a helper button that opens a new tab and makes getting testnet XLM easier |
| Rohan Rai | rohan809raj@gmail.com | [GBASGI...4P5465](https://stellar.expert/explorer/testnet/account/GBASGIHKXN7QQEOJ3GOWDBEADTWBRE727L4TOW7V2KHUFFM7VV4P5465) | Add a scroll to top button that appears when the page is scrolled down and takes the user back up |
| Rahul Trivedi | Rahultrivedi72004@gmail.com | [GAABAM...SE7Y4L](https://stellar.expert/explorer/testnet/account/GAABAMFRDAQ6I3P5NA2YQBLMQXDHXWIMBXGVJJ7CL5UPNTHY3DSE7Y4L) | Set a favicon and browser tab title with the Lumenova name and logo for a professional touch |
| Nikhil Sharma | nikhikshar5638@gmail.com | [GBIGS5...JLMYSE](https://stellar.expert/explorer/testnet/account/GBIGS5ARWZDPCCSEIDVZCVZHYRD2PEJXVNNIKOWDAYOSBZ6JHDJLMYSE) | Add a share campaign button that copies the link or lets users share directly on WhatsApp or Twitter |
| Bhumi Kumari | bhumikumari764353@gmail.com | [GBLRPI...RDBLUF](https://stellar.expert/explorer/testnet/account/GBLRPI5EABIWGWRKZXSUQCIZZLBD6HELN4GTBUBD7VSM5Q3E2BRDBLUF) | Add a small emoji or icon where it says No donations yet so the empty state looks visually better |

### 2. Implementation & Commit ID Mapping

| Name | Wallet Address | Suggestion / Feedback | Commit ID |
| --- | --- | --- | --- |
| Suhani singh | [GCXTLD...KSQUMP](https://stellar.expert/explorer/testnet/account/GCXTLDSQT6TBAGHQJL262C3LJ3D5I44QLCDK7QLTYZFAHAUET2KSQUMP) | Add a copy to clipboard button next to the wallet address and contract ID so users can easily copy them | [`bbb3395`](https://github.com/Abhishek86038/Lumenova-A5/commit/bbb3395d2a680ed337a59654dc93b650af18476f) |
| Sonali kumari | [GAKY3B...GFNRZO](https://stellar.expert/explorer/testnet/account/GAKY3BODJOT624DGB3LGFIYCI4JDIXI725S5MOW7WGP4VLAPJPGFNRZO) | Add toast notifications that show a success message on every donate vote and wallet connect action | [`bbb3395`](https://github.com/Abhishek86038/Lumenova-A5/commit/bbb3395d2a680ed337a59654dc93b650af18476f) |
| Mohit sharma | [GBGCLC...XOEPAX](https://stellar.expert/explorer/testnet/account/GBGCLCI2Q62TUDALIEH46EE4VHBMDABHULP2CZWHBL2XKWA644XOEPAX) | Add a dark light mode toggle button so users can choose their preferred theme | [`36abf85`](https://github.com/Abhishek86038/Lumenova-A5/commit/36abf85c3550307c00f542988ae16ecd1712f4ea) |
| Saurabh Shukla | [GDKYQW...N4NGYC](https://stellar.expert/explorer/testnet/account/GDKYQWOPBORJIT6GC6C2HBQ5CZ3MZP6Z4Q5RTW23LZ2XXZIZTLN4NGYC) | Turn the Friendbot link into a helper button that opens a new tab and makes getting testnet XLM easier | [`fd74c38`](https://github.com/Abhishek86038/Lumenova-A5/commit/fd74c3819cedeab99e50b3130a52f2fe66761589) |
| Rohan Rai | [GBASGI...4P5465](https://stellar.expert/explorer/testnet/account/GBASGIHKXN7QQEOJ3GOWDBEADTWBRE727L4TOW7V2KHUFFM7VV4P5465) | Add a scroll to top button that appears when the page is scrolled down and takes the user back up | [`1ec10e1`](https://github.com/Abhishek86038/Lumenova-A5/commit/1ec10e1c655ac7a7cc4e3cda51a1fb451768d2cb) |
| Rahul Trivedi | [GAABAM...SE7Y4L](https://stellar.expert/explorer/testnet/account/GAABAMFRDAQ6I3P5NA2YQBLMQXDHXWIMBXGVJJ7CL5UPNTHY3DSE7Y4L) | Set a favicon and browser tab title with the Lumenova name and logo for a professional touch | [`c60383c`](https://github.com/Abhishek86038/Lumenova-A5/commit/c60383c1cf763f250637471bccf1ec7a7275086e) |
| Nikhil Sharma | [GBIGS5...JLMYSE](https://stellar.expert/explorer/testnet/account/GBIGS5ARWZDPCCSEIDVZCVZHYRD2PEJXVNNIKOWDAYOSBZ6JHDJLMYSE) | Add a share campaign button that copies the link or lets users share directly on WhatsApp or Twitter | [`41e4da5`](https://github.com/Abhishek86038/Lumenova-A5/commit/41e4da5aa5cc2d6dfb4d15fd175142352f539374) |
| Bhumi Kumari | [GBLRPI...RDBLUF](https://stellar.expert/explorer/testnet/account/GBLRPI5EABIWGWRKZXSUQCIZZLBD6HELN4GTBUBD7VSM5Q3E2BRDBLUF) | Add a small emoji or icon where it says No donations yet so the empty state looks visually better | [`710b820`](https://github.com/Abhishek86038/Lumenova-A5/commit/710b82088cec0b28f17960661cc9d13956baa8a0) |


---

## 14. User Growth & Proof of Users

Lumenova actively tracks its user growth using Plausible Analytics and on-chain interaction metrics. Below is the record of **87 unique wallets** that successfully performed transactions on the Stellar Testnet:

<details>
<summary>Click to view all 87 User Interactions</summary>

| Wallet Address | Action | Transaction Hash |
| --- | --- | --- |
| [GC6ORDI...MP4XON](https://stellar.expert/explorer/testnet/account/GC6ORDIYLSICV5YMDV3KMFXUMRZCEXZ3TUEB3TXC4TBKRRD2EBMP4XON) | Donate 36 XLM (Escrow Contribution) | [6ddfeb9...f60a](https://stellar.expert/explorer/testnet/tx/6ddfeb9fe7a9041bb6466f962ecb11eb1ccb18ba7f48781f2260a8609622f60a) |
| [GAXZOVC...Q5DEXJ](https://stellar.expert/explorer/testnet/account/GAXZOVCFXTPAZSKFG5MTNITMO5QZ4HYFOF4Y6DLXJFYYC5TXSXQ5DEXJ) | Donate 20 XLM (Escrow Contribution) | [c4728e0...3a2b](https://stellar.expert/explorer/testnet/tx/c4728e002d03206042b765bdc27320d0a8f5dc2c1ff5781c639ffdfc8cab3a2b) |
| [GCXTLDS...KSQUMP](https://stellar.expert/explorer/testnet/account/GCXTLDSQT6TBAGHQJL262C3LJ3D5I44QLCDK7QLTYZFAHAUET2KSQUMP) | Donate 19 XLM (Escrow Contribution) | [f509547...7065](https://stellar.expert/explorer/testnet/tx/f5095471b936a54b3fe452df8587e7944abeb72e7e90e983715d5955fc267065) |
| [GAKY3BO...GFNRZO](https://stellar.expert/explorer/testnet/account/GAKY3BODJOT624DGB3LGFIYCI4JDIXI725S5MOW7WGP4VLAPJPGFNRZO) | Donate 26 XLM (Escrow Contribution) | [5553b86...4773](https://stellar.expert/explorer/testnet/tx/5553b866ebddd5e3b60fe16e3e45c953c5fa5cb144a568276d8206a530074773) |
| [GBGCLCI...XOEPAX](https://stellar.expert/explorer/testnet/account/GBGCLCI2Q62TUDALIEH46EE4VHBMDABHULP2CZWHBL2XKWA644XOEPAX) | Donate 27 XLM (Escrow Contribution) | [3f3a672...b182](https://stellar.expert/explorer/testnet/tx/3f3a6726908a8707d9743e4b74cd4499b92e661d1bca39be2adf3f0cb5c2b182) |
| [GB4SIN3...ZSZCPE](https://stellar.expert/explorer/testnet/account/GB4SIN3WG52YC2Q6CBF7CJB4GE5ZLZB7EKCPYQXARB2JZ5OJ3XZSZCPE) | Donate 16 XLM (Escrow Contribution) | [82beae7...45ef](https://stellar.expert/explorer/testnet/tx/82beae76854fba022143551c23fac8214f9a10d8680ff299171dc8af4b0745ef) |
| [GBLRPI5...RDBLUF](https://stellar.expert/explorer/testnet/account/GBLRPI5EABIWGWRKZXSUQCIZZLBD6HELN4GTBUBD7VSM5Q3E2BRDBLUF) | Donate 27 XLM (Escrow Contribution) | [863e046...b8ad](https://stellar.expert/explorer/testnet/tx/863e0461618ad22fd76212b839785a4e682835ee403b1dd28fc0d6a88703b8ad) |
| [GBIGS5A...JLMYSE](https://stellar.expert/explorer/testnet/account/GBIGS5ARWZDPCCSEIDVZCVZHYRD2PEJXVNNIKOWDAYOSBZ6JHDJLMYSE) | Donate 35 XLM (Escrow Contribution) | [8d85459...e70e](https://stellar.expert/explorer/testnet/tx/8d85459968ff7c695cc1ba9ff2561b2a4e2ac4e3523a35b7c6024c4de6cee70e) |
| [GAABAMF...SE7Y4L](https://stellar.expert/explorer/testnet/account/GAABAMFRDAQ6I3P5NA2YQBLMQXDHXWIMBXGVJJ7CL5UPNTHY3DSE7Y4L) | Donate 13 XLM (Escrow Contribution) | [e1dbf93...c56b](https://stellar.expert/explorer/testnet/tx/e1dbf936518beb67b9ac4510a7d83397e466a4f099d42548dafb60d8471dc56b) |
| [GBASGIH...4P5465](https://stellar.expert/explorer/testnet/account/GBASGIHKXN7QQEOJ3GOWDBEADTWBRE727L4TOW7V2KHUFFM7VV4P5465) | Donate 23 XLM (Escrow Contribution) | [31eadc4...e591](https://stellar.expert/explorer/testnet/tx/31eadc4f4c35215ed6833a2114a2283180bfa0b565ad877cab690af67ef0e591) |
| [GDKYQWO...N4NGYC](https://stellar.expert/explorer/testnet/account/GDKYQWOPBORJIT6GC6C2HBQ5CZ3MZP6Z4Q5RTW23LZ2XXZIZTLN4NGYC) | Donate 25 XLM (Escrow Contribution) | [05138c2...4d40](https://stellar.expert/explorer/testnet/tx/05138c2f10d29390a551c30aa97639d17a2a767cdb89d83b0f8c11521cf04d40) |
| [GBHSYPO...T7WDG4](https://stellar.expert/explorer/testnet/account/GBHSYPOZYSYJUZHXYPH3URWBLU62MGRW6SEB4GEDUDTIF5VGKTT7WDG4) | Donate 42 XLM (Escrow Contribution) | [ad45f63...8646](https://stellar.expert/explorer/testnet/tx/ad45f63230012bbbdabbe47ae22782cd38279a912add935c9013ef5d2cf18646) |
| [GAD4NL7...USGLS4](https://stellar.expert/explorer/testnet/account/GAD4NL7DJRA43NKPMWJ5GCAWQLWQVV6ZWHJWZDDT6WWHHNRVL6USGLS4) | Donate 37 XLM (Escrow Contribution) | [c36dbdc...29ea](https://stellar.expert/explorer/testnet/tx/c36dbdca7fe18680b457fb0c9549be01693a99962108fc39b6a6db861f9229ea) |
| [GDBFKNZ...LR3PZH](https://stellar.expert/explorer/testnet/account/GDBFKNZGWEVR75S25RJU7QPI2JQRRLCKNOKMSH7KKB64CFPUJZLR3PZH) | Donate 47 XLM (Escrow Contribution) | [e2f14ed...a5a6](https://stellar.expert/explorer/testnet/tx/e2f14ed7f14ba9ee1ac39b6ff8454edcb54d0be1949a4aedd246c6c7f34ea5a6) |
| [GANO7LT...ITCY7Y](https://stellar.expert/explorer/testnet/account/GANO7LTN5LON2YC4VWGDZCGX6NDEGXUXOBXVHESEDM3QHXE5KBITCY7Y) | Donate 43 XLM (Escrow Contribution) | [4ec3191...349e](https://stellar.expert/explorer/testnet/tx/4ec3191ce9f7a3b3ba5d84ad69d850e186b6d47d3ccbb82245a9b87d2f38349e) |
| [GB2OQZQ...5YNXNU](https://stellar.expert/explorer/testnet/account/GB2OQZQ3I2ISNKL3ODUSBB5LXTDDUHMLOZMZEB75EQJJZ75XGA5YNXNU) | Donate 18 XLM (Escrow Contribution) | [c9546d5...6ae2](https://stellar.expert/explorer/testnet/tx/c9546d5de79bb7d38dd05b67801889d5e5f2824a7378a2c31938486a61566ae2) |
| [GADZR6Y...TYVCFS](https://stellar.expert/explorer/testnet/account/GADZR6YZLGJZ5ELDORIBB7FRORS36JQUJEPPG4VAMQH6LGRXCZTYVCFS) | Donate 42 XLM (Escrow Contribution) | [025426a...3f4f](https://stellar.expert/explorer/testnet/tx/025426aa2f809b10f07aa874dca47efea876a00082f1090eb7fef29d7a733f4f) |
| [GDN3NNE...7WR5K2](https://stellar.expert/explorer/testnet/account/GDN3NNEOH36LMFZXVAWDXKILBKT5BKXSGB7IKUYDN6TL7UT2LP7WR5K2) | Donate 22 XLM (Escrow Contribution) | [26fdf5a...112b](https://stellar.expert/explorer/testnet/tx/26fdf5ac8331704a76c1895bceacd53a9d7056d86c40b03d65337063243c112b) |
| [GCHFEB5...VADIOC](https://stellar.expert/explorer/testnet/account/GCHFEB5U3XYNFRMY5YUJ5H42W4SOMR64ICJIUOPKTQ7DR5WPITVADIOC) | Donate 20 XLM (Escrow Contribution) | [0090647...e381](https://stellar.expert/explorer/testnet/tx/00906471aa4391e22def1d030be7acc87e4c355d753b0b0e6271860f1059e381) |
| [GCKDHCY...LNESBQ](https://stellar.expert/explorer/testnet/account/GCKDHCYP6URU7ZLKDFGHDSMUUPSWNDADZCKFGUSKYIGACWWEK4LNESBQ) | Donate 48 XLM (Escrow Contribution) | [604d62d...d608](https://stellar.expert/explorer/testnet/tx/604d62d8022f59d938a2ae11920ace15ab4fc9beb5e64331dafa8a50d8e6d608) |
| [GBZXQSM...ROUH3B](https://stellar.expert/explorer/testnet/account/GBZXQSMRTKMPNSNUJMYEKN2KMD67JOWYVOUZWLZ3LCFFAKFY2YROUH3B) | Donate 25 XLM (Escrow Contribution) | [3006418...6de5](https://stellar.expert/explorer/testnet/tx/300641826f26f28bdfcc147a952ddda45bf70c5f4a92a03c4e3dabe97bc76de5) |
| [GAZXKQE...AS6XEW](https://stellar.expert/explorer/testnet/account/GAZXKQE4SLIQPGSJHDMOOBJA4HOZWDYG57S3FDNV25LGFMPC3MAS6XEW) | Donate 17 XLM (Escrow Contribution) | [fd86174...6fe2](https://stellar.expert/explorer/testnet/tx/fd8617454cc72f89dd07ffd0a95374a553d4857330f36ec8d3c9045e286b6fe2) |
| [GD5CGZD...LRXSUN](https://stellar.expert/explorer/testnet/account/GD5CGZDKPE64MXLTPRATICGGSA5D4OZQUSTUORROXO2IDUFKO5LRXSUN) | Donate 26 XLM (Escrow Contribution) | [d4f20b7...f3bd](https://stellar.expert/explorer/testnet/tx/d4f20b73feaeae81bdc73aee8fd68ffee0c454973596b8254759da8d5ae8f3bd) |
| [GDKY23T...QAO3EY](https://stellar.expert/explorer/testnet/account/GDKY23TWFG3UO2GJCTZNBEBLZI5J24IXMTB2MDS3XGYAMCEAOIQAO3EY) | Donate 31 XLM (Escrow Contribution) | [924f2ad...ef03](https://stellar.expert/explorer/testnet/tx/924f2adfb083b9880f75b47824e2e3a0bc4ec12352a4ec8a96c3852b6febef03) |
| [GBW5PKX...D4TZDS](https://stellar.expert/explorer/testnet/account/GBW5PKX2VWX75Z3PANVL5OUUVYNEF5VHGGUZJSG63YNO473262D4TZDS) | Donate 22 XLM (Escrow Contribution) | [4b6d54b...4539](https://stellar.expert/explorer/testnet/tx/4b6d54b173e62049f80dbe9ad590c2b12a793762b0ef11e18a8e9107332d4539) |
| [GBOV7PM...I7R4EC](https://stellar.expert/explorer/testnet/account/GBOV7PMRGNUSWS6LBD37CS5JOPMLS7YE33DE2KY2YBZERF22TAI7R4EC) | Donate 39 XLM (Escrow Contribution) | [28bdcde...9bd4](https://stellar.expert/explorer/testnet/tx/28bdcded9349d43593b7649dadab7767a98426c75ec58d981891d08fec249bd4) |
| [GAKJDOX...34YKXP](https://stellar.expert/explorer/testnet/account/GAKJDOXESWXTUGUSBTGPR6OGJ7QWZTGIQ3DP46W4U4QP4GCKBZ34YKXP) | Donate 41 XLM (Escrow Contribution) | [aad30c8...41a2](https://stellar.expert/explorer/testnet/tx/aad30c86ad31d8175be5a6a59ef1c024a2369a3da27abce73a95f2ff9c4f41a2) |
| [GADPVNX...WJBNGX](https://stellar.expert/explorer/testnet/account/GADPVNXR6Q6SBOCG7D6O4TJLXAA3WEPKLYZJSX2EBFMPAI4WH2WJBNGX) | Donate 23 XLM (Escrow Contribution) | [2502852...e5d4](https://stellar.expert/explorer/testnet/tx/25028528f75411441a242855a668268c30d56d20873ddaad23668599ec8fe5d4) |
| [GCWJLTC...VTGRKX](https://stellar.expert/explorer/testnet/account/GCWJLTCVQWT5UHBSNK7WS3SUSSCWDV324HB6Y2SB4TWSX5DQWUVTGRKX) | Donate 30 XLM (Escrow Contribution) | [01b15a7...1190](https://stellar.expert/explorer/testnet/tx/01b15a75fbc527d2039f6346ceadf81050bbd0a9c7a7e150f9df0051beba1190) |
| [GBIPFBO...ETMD4I](https://stellar.expert/explorer/testnet/account/GBIPFBOEALDFTU3IVS2J2NUMTZ3O5KBHRVQUXK2PQP7GJ43E4IETMD4I) | Donate 14 XLM (Escrow Contribution) | [a024798...2038](https://stellar.expert/explorer/testnet/tx/a024798cee0ee497152cd86f06cc78e9bdb33cf4313eae59a20aaa18b2bc2038) |
| [GAZSXGY...7AYXTV](https://stellar.expert/explorer/testnet/account/GAZSXGYVQKQWS5R2P77PQVLWKEKGI7UKB7CX2SLPZHATIZPCUC7AYXTV) | Donate 44 XLM (Escrow Contribution) | [0fa6aa2...8651](https://stellar.expert/explorer/testnet/tx/0fa6aa2ec9e7b26e795d96ccb942fbc7e7fa1ef4c02c18229703694972b78651) |
| [GCPDSLP...C4LA7H](https://stellar.expert/explorer/testnet/account/GCPDSLP4NWRDVLGE6XWNL5W33HMTAHQEGJTAE5RZ75R5OPSQVQC4LA7H) | Donate 29 XLM (Escrow Contribution) | [e5c1e2b...67d7](https://stellar.expert/explorer/testnet/tx/e5c1e2b96b3b035c6d253265fd7e150816b57c6247fc90cefa64bab6a04d67d7) |
| [GBXNCLY...DR655Q](https://stellar.expert/explorer/testnet/account/GBXNCLYBXEGK6TQPUTSXWTUQ6N3W76M7QWRPGLQPTYHOO4F3R3DR655Q) | Donate 12 XLM (Escrow Contribution) | [2c3f96e...1cda](https://stellar.expert/explorer/testnet/tx/2c3f96ec885319739bbe6dadead3ba8940e9884906c41c310271019b11371cda) |
| [GATN5ZP...F2ADGN](https://stellar.expert/explorer/testnet/account/GATN5ZP4D4PZ7COOXYO2TAXMPLWDPRDHLFURB76WSNFZJVBP3RF2ADGN) | Donate 30 XLM (Escrow Contribution) | [db2de81...fc60](https://stellar.expert/explorer/testnet/tx/db2de81cccdef4dbc8106f1481c2b5320c35670ad653eb1c0bef8e349e1ffc60) |
| [GACTIC6...7RQQRM](https://stellar.expert/explorer/testnet/account/GACTIC6ANNAWKGUT6XL5JHOP63ITCYDH2H7QNDDG4GOSR5ZYUY7RQQRM) | Donate 45 XLM (Escrow Contribution) | [db1377c...2e60](https://stellar.expert/explorer/testnet/tx/db1377c2969444d767a3a40000f66ba606fdadbd22f3655c30f299a85d342e60) |
| [GBHF6XS...GEW76E](https://stellar.expert/explorer/testnet/account/GBHF6XSSFMZ7UN5EQRI5VTRREQVYX6DK2WHXQZFKMLKWJHY7WVGEW76E) | Donate 15 XLM (Escrow Contribution) | [7451528...e59f](https://stellar.expert/explorer/testnet/tx/7451528070932302b79e036db47dd055fa5d12366b2b1d21cde9bd4dbd4fe59f) |
| [GD2LDFF...XCRCB2](https://stellar.expert/explorer/testnet/account/GD2LDFFSELHATGD7PB6ZSPSDNER27FM44TD2ZHILANAAGIJENWXCRCB2) | Donate 48 XLM (Escrow Contribution) | [e6d1b9e...f9e9](https://stellar.expert/explorer/testnet/tx/e6d1b9ec2f7a39392c2ff06ee185f26a70e699f66ccac7748d72beb10f44f9e9) |
| [GCIVQNK...UPF3KS](https://stellar.expert/explorer/testnet/account/GCIVQNKGTEEKFJXYILPPVFEZNDVHK5LFK2ARY3S4MY3DSVF6J6UPF3KS) | Donate 17 XLM (Escrow Contribution) | [e8cd255...5334](https://stellar.expert/explorer/testnet/tx/e8cd25593d637d268039eb44307a48978f2cdb3fa823214cf3e617f5637f5334) |
| [GDZG45B...WV6SBP](https://stellar.expert/explorer/testnet/account/GDZG45BPY5S3QKM3UY7XL3CJLHI5KC2PRU4ZTCNHBT5I7JLNYCWV6SBP) | Donate 32 XLM (Escrow Contribution) | [048831c...f86c](https://stellar.expert/explorer/testnet/tx/048831ce1d2af34ab45de48829bf736415d2e9825e4b5a7ef20606218aeef86c) |
| [GAB7YJC...ORBKA5](https://stellar.expert/explorer/testnet/account/GAB7YJCUVWT5GIONMUKDN3572CHFGOCF4CGOA7E77K6SOX3MVVORBKA5) | Donate 40 XLM (Escrow Contribution) | [8ca567b...5b0f](https://stellar.expert/explorer/testnet/tx/8ca567b69edc64cc636ab2e594daa89487ae329678b19edc34cee3dab23c5b0f) |
| [GBVIVDC...67MQAB](https://stellar.expert/explorer/testnet/account/GBVIVDCGBBKYN53NY73T7GUVLRP4CVGNIGR3R3MHR65QADTOCB67MQAB) | Donate 39 XLM (Escrow Contribution) | [e03cf18...a265](https://stellar.expert/explorer/testnet/tx/e03cf1808ed0520179386c391b860f69ce73aca52692fe1805c2ae40721ba265) |
| [GDVQMU3...CZ3LL2](https://stellar.expert/explorer/testnet/account/GDVQMU3KKSNT7N56JQUXOJ2PYJBQMHFWIJRO2DEDFDTAJ4ATMHCZ3LL2) | Donate 30 XLM (Escrow Contribution) | [726f225...4a32](https://stellar.expert/explorer/testnet/tx/726f22517994694c9c5375599798a5c30e923bdaddb8ce364ce8d3c41ed14a32) |
| [GBRXEFU...AASYNA](https://stellar.expert/explorer/testnet/account/GBRXEFUKYC3XONABAEP6CUGAJI3QYI7VYSZV3DGD4NGJP2HRGJAASYNA) | Donate 36 XLM (Escrow Contribution) | [9676bc2...504b](https://stellar.expert/explorer/testnet/tx/9676bc277dbdd479e0c36161ce61b99b5ad0760e54ad29d261c6faa68d09504b) |
| [GBFJHG5...HVAQAB](https://stellar.expert/explorer/testnet/account/GBFJHG5WOWRVIYVPJ3OU3DCUR2IJENXULKSKLRT35IBOZBHZOBHVAQAB) | Donate 47 XLM (Escrow Contribution) | [0087fd4...63eb](https://stellar.expert/explorer/testnet/tx/0087fd40b84603403b59858ca1538021a48659ca6017d2a2b84f86f0fb2f63eb) |
| [GBWDOTC...K2CDQQ](https://stellar.expert/explorer/testnet/account/GBWDOTCAPJNDTZNVHJNIAZC2Z7M2RZRL3BD5GIYMT6F2JW3Y33K2CDQQ) | Donate 39 XLM (Escrow Contribution) | [e62eb5f...ca23](https://stellar.expert/explorer/testnet/tx/e62eb5fc4986b15dce21f36c82a4a0ce6627c0050ceeb42ac87da37651e4ca23) |
| [GDCEBHW...KTF7OB](https://stellar.expert/explorer/testnet/account/GDCEBHWXXCQWTTAASKCB47CDCOBDLMZ6BTFG36PDWQ522SZZO7KTF7OB) | Donate 41 XLM (Escrow Contribution) | [9e42dbd...13b4](https://stellar.expert/explorer/testnet/tx/9e42dbd4f5320760a10a4fbfe727de61595a6b1add952d0665ff86b54ee313b4) |
| [GBSZOBB...WMH4GU](https://stellar.expert/explorer/testnet/account/GBSZOBBKZOUCHBFGOUPKYG2EBRAPFMMU7SJPENNIAAWMENCFKFWMH4GU) | Donate 40 XLM (Escrow Contribution) | [007c075...9955](https://stellar.expert/explorer/testnet/tx/007c075e0d27f12e3b0d1d5534022428ea3d1a7150c19b6034ae49ffb31a9955) |
| [GDERBZP...OOA25O](https://stellar.expert/explorer/testnet/account/GDERBZPBXY2FQOHEOMQ5HQSVTISYYTXKF74PXYMVZ2VPSPXQB4OOA25O) | Donate 22 XLM (Escrow Contribution) | [226abf0...9cf3](https://stellar.expert/explorer/testnet/tx/226abf0a6a028b71dc9a4ba7bd6ab8b75781f90a508568c8cc765e5f93499cf3) |
| [GBBDOFF...ANU3I6](https://stellar.expert/explorer/testnet/account/GBBDOFF5QIRW7LYHABJJMX57EOTEQDG3W3M53HSXRC2TUY73BEANU3I6) | Donate 36 XLM (Escrow Contribution) | [43af9a5...4764](https://stellar.expert/explorer/testnet/tx/43af9a599940ed3bae6086ddab5d9221ac752f8f323f2a2737fa26f40a844764) |
| [GAU4L7X...Z3BN4T](https://stellar.expert/explorer/testnet/account/GAU4L7X5JSTPJDXDRXDIH6JIELWOBCI7CJK2JIM7WTTNV7QKISZ3BN4T) | Donate 13 XLM (Escrow Contribution) | [58461f9...f9d2](https://stellar.expert/explorer/testnet/tx/58461f97978be17ddeb1de7e107c41ed63a63fead31229d85bcfb5d858edf9d2) |
| [GAJLD3Z...2V3LOP](https://stellar.expert/explorer/testnet/account/GAJLD3Z7WUWQFGDX6CBJVOSXRW5HZKEHUJFWBKLOUAD6ORUY532V3LOP) | Donate 46 XLM (Escrow Contribution) | [21df4d6...881c](https://stellar.expert/explorer/testnet/tx/21df4d6b0f1a93264a25984c06cbe154aa134d6c53e7d15bb714e7a07057881c) |
| [GASFA7X...OBYQH7](https://stellar.expert/explorer/testnet/account/GASFA7XIFL3PFPYC3EBACUBUTPPIEBXBJO2QJPH72HNSKZ34AJOBYQH7) | Donate 16 XLM (Escrow Contribution) | [ccb4d82...3deb](https://stellar.expert/explorer/testnet/tx/ccb4d829327d87bdab51b159339d029403cb2d62ba070eff9dae8a7f2e673deb) |
| [GBXXP5W...2T6YSX](https://stellar.expert/explorer/testnet/account/GBXXP5WSCDBSAJUGJBAP4I75WJOLHH7QXSFPO7PI3E5PDRZP4O2T6YSX) | Donate 11 XLM (Escrow Contribution) | [5be81a1...c20e](https://stellar.expert/explorer/testnet/tx/5be81a1e6090fe98d65a6b57b3e3b9405f7a7a9b87e859fa65698f79b28fc20e) |
| [GC6M5QP...SJS7SJ](https://stellar.expert/explorer/testnet/account/GC6M5QPXLUKYYABOR3TDXG7PE27GU6WGFPRVRKH5AEOJCTFPOCSJS7SJ) | Donate 28 XLM (Escrow Contribution) | [066523c...9d05](https://stellar.expert/explorer/testnet/tx/066523c199cafee33d9d2aca73efddac46d77f2dc05ad91cdf4be84bcc3d9d05) |
| [GAOD2GO...YLZWSH](https://stellar.expert/explorer/testnet/account/GAOD2GOSHEQHBHJIM4XAJX3N2CCH7XDL4GYMB7ZS5PRGZ7SAG5YLZWSH) | Donate 45 XLM (Escrow Contribution) | [7f497cc...50f6](https://stellar.expert/explorer/testnet/tx/7f497cc1686dcf84931574bb554cc8c03807125145d0e33465a54058b99d50f6) |
| [GAAYGVR...VQRM3B](https://stellar.expert/explorer/testnet/account/GAAYGVR3OSWSCFIIND5U7CFQZL4GI5IEUK7JA5GIGWJOD2SG7TVQRM3B) | Donate 45 XLM (Escrow Contribution) | [602301e...aaf2](https://stellar.expert/explorer/testnet/tx/602301ec7d848e6deb8dda71de92dadcc9fd29e4d6311eaf86f53127807daaf2) |
| [GA23I4I...PHCFSU](https://stellar.expert/explorer/testnet/account/GA23I4IZEDD5Q2GGVCULBY666NCGZWO4WCIQEHJCNHDWO5L27SPHCFSU) | Donate 37 XLM (Escrow Contribution) | [6167521...e895](https://stellar.expert/explorer/testnet/tx/61675217fc4b1dfbb309f6edfe99c95f43f1a860743feb9f06f00ecbcde6e895) |
| [GA2IHJ2...K42REV](https://stellar.expert/explorer/testnet/account/GA2IHJ2PAWADCOKD577JT2W3HVOA4PBOMLNOHIKAJ56DF73V6EK42REV) | Donate 41 XLM (Escrow Contribution) | [df00da8...e75c](https://stellar.expert/explorer/testnet/tx/df00da886dadb8f964faa4b3895d010ad52d13815cacb8aaccb09f2eb00ae75c) |
| [GBWDN3I...HBRGZQ](https://stellar.expert/explorer/testnet/account/GBWDN3ID3RG77RAEYK2V46PBNSU6WIJX54C3KGEBCWZYWFTZWWHBRGZQ) | Donate 32 XLM (Escrow Contribution) | [3a53927...8b02](https://stellar.expert/explorer/testnet/tx/3a53927b526eb584e89b55b42ad202d9f6a21a9437e52ce2e32dde03d7438b02) |
| [GBL6TAW...O4IOAU](https://stellar.expert/explorer/testnet/account/GBL6TAWTIXZ3ZT2YZ4I7JPCB4QNTPAG7JXMSQMNSOIAJCC3X6CO4IOAU) | Donate 43 XLM (Escrow Contribution) | [be904f0...abf7](https://stellar.expert/explorer/testnet/tx/be904f0ea639ff1360c2f70305cace1229665674a1501c0658bdc1137162abf7) |
| [GDXSH2H...U6TWK7](https://stellar.expert/explorer/testnet/account/GDXSH2HAOXMI33AM4DHN3QZLWYNCXFSG4IR5YKE4X27KLJMYCVU6TWK7) | Donate 33 XLM (Escrow Contribution) | [3ebde88...6003](https://stellar.expert/explorer/testnet/tx/3ebde88e78b7e8adbb844f071cfe9d5e96ce740462e856cdcc8a7a6d8f996003) |
| [GDBAQYB...HDJ44B](https://stellar.expert/explorer/testnet/account/GDBAQYBTI7VLMNL7T2CNLB5YA5FGZNAOJH7NRMND3DSF6WKBPKHDJ44B) | Donate 34 XLM (Escrow Contribution) | [04391da...ef14](https://stellar.expert/explorer/testnet/tx/04391da9f70f838c0529ea1446cab3cf3fa0de87c6b6268df89af6ad48dbef14) |
| [GBQVGOO...RC2J7X](https://stellar.expert/explorer/testnet/account/GBQVGOOVPP4NSH3M2RKQ3IR3K367WRJAQ42TJSCHMMXRQTPZJKRC2J7X) | Donate 21 XLM (Escrow Contribution) | [77109b3...40fe](https://stellar.expert/explorer/testnet/tx/77109b338a81f7f2090e17ec925ab36e898058c387415972b73798938f7440fe) |
| [GBYUYMI...ALPN7A](https://stellar.expert/explorer/testnet/account/GBYUYMI5ZLV2AARBSXXHQY6I3VGH32WAROXGQZWJNPEUKOINUDALPN7A) | Donate 37 XLM (Escrow Contribution) | [8a1dc13...6f96](https://stellar.expert/explorer/testnet/tx/8a1dc1309c0e197b05f6a79e1aa53f2f7f6f823e681728977f612823833b6f96) |
| [GCZOWON...HP5KCE](https://stellar.expert/explorer/testnet/account/GCZOWONLUH53VYPU6LNHNGGRNN6SSC5TYJTSL6ZLPOT7YQ3K2IHP5KCE) | Donate 24 XLM (Escrow Contribution) | [3ddfc81...7f79](https://stellar.expert/explorer/testnet/tx/3ddfc81db3885e5aebe7812cab43ab9935d0f7e4614bdb2b96367c49f00b7f79) |
| [GCZQANB...ZMQXIZ](https://stellar.expert/explorer/testnet/account/GCZQANB4Y7MZMXVLX4EYYNDXWR52Y46JAIV2CDSHXIYMAAWDT5ZMQXIZ) | Donate 21 XLM (Escrow Contribution) | [9876059...253a](https://stellar.expert/explorer/testnet/tx/987605926791b62ba57451ad8d0edafe394fd77cd20f32ac0baab72c06ca253a) |
| [GB7U6LY...NB2UHC](https://stellar.expert/explorer/testnet/account/GB7U6LYLM2P6AHNVLYJ5BPP443I4M2BFXPYJSNPUCWZQYG32ZMNB2UHC) | Donate 48 XLM (Escrow Contribution) | [074f805...4aed](https://stellar.expert/explorer/testnet/tx/074f805fc41752f230a0dc072cc83e73fb4f55089c74af4a714670b085ee4aed) |
| [GBCCQDH...EW5FHB](https://stellar.expert/explorer/testnet/account/GBCCQDHPVRRLNDRRQABYOUV6RSQVXFFZRYUJ2KGPW474H6TTMCEW5FHB) | Donate 27 XLM (Escrow Contribution) | [b6796a4...850a](https://stellar.expert/explorer/testnet/tx/b6796a4d83b914affc3495c1bfec69198ee1e9d4ef0723c942699d8f1a06850a) |
| [GC6FBPI...2BULTW](https://stellar.expert/explorer/testnet/account/GC6FBPIF6P7VNYN52BZJBYTBLCE7HP3IVEOH76FH374LTWUUMQ2BULTW) | Donate 23 XLM (Escrow Contribution) | [b98ecd5...70e3](https://stellar.expert/explorer/testnet/tx/b98ecd52b7d9f524cc017c3b79acb15613f0fffe3a12ce76fcf2482e6e6070e3) |
| [GBYFAR7...NJHXYF](https://stellar.expert/explorer/testnet/account/GBYFAR77VIXXILYMBFCXYJ4J2IHOEKTCVOPEWWZ2ZZ2VZH5EGLNJHXYF) | Donate 38 XLM (Escrow Contribution) | [11d19b0...b5bf](https://stellar.expert/explorer/testnet/tx/11d19b04c03ae17dfe291c065c4c2e026bccc8afef1e2449f7d50a322282b5bf) |
| [GA5NPTL...UE6WID](https://stellar.expert/explorer/testnet/account/GA5NPTL5BTURJCUK2COUGEKBOT5PNG3X4GXFAKZVMWVN55PTMRUE6WID) | Donate 33 XLM (Escrow Contribution) | [bc2bd12...5f44](https://stellar.expert/explorer/testnet/tx/bc2bd121477376cd0c927c4d324e33f1e25c1ef6e8fa8de8061a27f2abeb5f44) |
| [GCT3OVC...7MNDSD](https://stellar.expert/explorer/testnet/account/GCT3OVCN2GMFZH2LCYM6KRBPDMAJHXCNIDP73OSITG7C3FWYMM7MNDSD) | Donate 35 XLM (Escrow Contribution) | [781fc71...da9f](https://stellar.expert/explorer/testnet/tx/781fc71a6cb57ee29873c6bf8c29e1d77439d5d0a13e5f1f5c3a4a1e5b39da9f) |
| [GDGRG5P...GWFHRL](https://stellar.expert/explorer/testnet/account/GDGRG5PAE5RGDBC5OPVDXJCQPKKSLPOGA5WTWRETMVPNKHXJI7GWFHRL) | Donate 30 XLM (Escrow Contribution) | [013c3d2...d803](https://stellar.expert/explorer/testnet/tx/013c3d28a44146fb7f55f657217a4492b2b61759ab808f6b94fde7813a73d803) |
| [GDUMAPC...CNYMKG](https://stellar.expert/explorer/testnet/account/GDUMAPCKJN3SDIJNIYRD4RWWV7HYMLW4VWXTB7BHP7HXE6RVW6CNYMKG) | Donate 44 XLM (Escrow Contribution) | [0388c34...66e1](https://stellar.expert/explorer/testnet/tx/0388c345780fed3595d917f99b6bd8f28887e1f88e1a0f857b0816d5774166e1) |
| [GA2DMLM...Q742TH](https://stellar.expert/explorer/testnet/account/GA2DMLMT7C2DN2O34ZRMRSTZ6IP6GUEFX2WT5NADKDCY3HVZNKQ742TH) | Donate 33 XLM (Escrow Contribution) | [148b434...ea09](https://stellar.expert/explorer/testnet/tx/148b43494c32ac23ea42a4b2d8a0a167f9b6ffc7a0bd548e90f363b64daaea09) |
| [GAWHR6C...NPXO32](https://stellar.expert/explorer/testnet/account/GAWHR6CDSPVCK4DEV34S3FAYYT7R6GEOGV2ILMMGGQ4ILT3C6ANPXO32) | Donate 45 XLM (Escrow Contribution) | [c59f882...68d5](https://stellar.expert/explorer/testnet/tx/c59f882f9fd4711386bc6be64c79a2b8b269234b3e1a590cbda2272e003a68d5) |
| [GB7FD6O...3YEYGC](https://stellar.expert/explorer/testnet/account/GB7FD6OUK3IUEIXDYYGMPI2DGNO5ETUSCFYJGOGXTT7QVU2B7J3YEYGC) | Donate 17 XLM (Escrow Contribution) | [56c9cbb...d080](https://stellar.expert/explorer/testnet/tx/56c9cbb3dcecd6fe87cab7b8db16601d71ca5333ed737dc5d29551cb05f9d080) |
| [GCF5DSH...DHETK7](https://stellar.expert/explorer/testnet/account/GCF5DSHGXQA7BMPALJM4A2IA4AA4G6WY5AJX7WRQ7ZE24BU5MVDHETK7) | Donate 42 XLM (Escrow Contribution) | [283b67f...1dbc](https://stellar.expert/explorer/testnet/tx/283b67f450a82bbd7ac4af49088326761b695ba97cb13070447495fee2db1dbc) |
| [GDFGUA5...4BA6R3](https://stellar.expert/explorer/testnet/account/GDFGUA5QUEQBDNGZSPA5VCCMCUDWFNRQ7DRMTIJQXUGS5ANKBL4BA6R3) | Donate 33 XLM (Escrow Contribution) | [e4fe98d...706d](https://stellar.expert/explorer/testnet/tx/e4fe98ddd6bf9ec65c52afa38f41cb65bc6a291105c7d34ac369a6137d0a706d) |
| [GB5YDHC...TPQ6NI](https://stellar.expert/explorer/testnet/account/GB5YDHC3C7OJIBETR7DWJ3UMW3G7WWM4XWZBQMCMLEU5W46M5PTPQ6NI) | Donate 33 XLM (Escrow Contribution) | [7eaa52a...f4d4](https://stellar.expert/explorer/testnet/tx/7eaa52a416d2f2ce634e60e3347dfeff0a16990efd6f694b41206015f628f4d4) |
| [GDJZ6SB...IGKSNC](https://stellar.expert/explorer/testnet/account/GDJZ6SB7E3VZYGKUAGILJ6EJ6Z3OUPGRGSJORSWPUXHN6JIJFNIGKSNC) | Donate 41 XLM (Escrow Contribution) | [b7ce89f...be21](https://stellar.expert/explorer/testnet/tx/b7ce89f3277e6512f192b57d35ccf77a97edc758a5ac62c461a7e20264babe21) |
| [GDIAP27...L57SYW](https://stellar.expert/explorer/testnet/account/GDIAP27EIEBYSD76DXBGCRNWPGHAEXW5LL3KWMMHHHF627SGILL57SYW) | Donate 16 XLM (Escrow Contribution) | [552e1ad...ebef](https://stellar.expert/explorer/testnet/tx/552e1ad5a91d2ddf93cd8039aa0893768f239536bd7bbf64386df26701beebef) |
| [GCANVOI...QORNBK](https://stellar.expert/explorer/testnet/account/GCANVOICZ7NEP724IKKEGPDBVXHHAOGI3GZOFTSFZCPIMKMZPUQORNBK) | Donate 18 XLM (Escrow Contribution) | [f0d34df...8024](https://stellar.expert/explorer/testnet/tx/f0d34dfd54bda1302e62806d118b7d10f8cf7ba18facf39237018cf4963e8024) |
| [GDC2BFM...SGIAYE](https://stellar.expert/explorer/testnet/account/GDC2BFMPTOCE2T7GRTKDGYG5UIUNKF2FBJNTWATVRCJ25WBG2LSGIAYE) | Donate 30 XLM (Escrow Contribution) | [7136478...1d33](https://stellar.expert/explorer/testnet/tx/7136478ee9174a3e7d08852acf0056c092d58a01ca0502b51fab68b98ca01d33) |
| [GC5FVAI...7RXTW3](https://stellar.expert/explorer/testnet/account/GC5FVAI7RHVGPTPJHMG5NLRA7KKJVTVPYHZXR2V5MFUCRQKSKN7RXTW3) | Donate 29 XLM (Escrow Contribution) | [3b59ea7...89a8](https://stellar.expert/explorer/testnet/tx/3b59ea7341f9e77745ba4c0773f157629ab6e00d905d1741ff732291a7b189a8) |
| [GCBNDST...XXFN6R](https://stellar.expert/explorer/testnet/account/GCBNDSTX4W7ILLTFFOZRCYKNSM2PYYIQXMPY5MXFNTZJ3FHMLPXXFN6R) | Donate 21 XLM (Escrow Contribution) | [1f247e3...d5a3](https://stellar.expert/explorer/testnet/tx/1f247e3888f3e9d6ecce412af962fc39423ba9c773d40e070d80762f14b1d5a3) |
| [GD2733F...UCRW5C](https://stellar.expert/explorer/testnet/account/GD2733FGFDAMUMXLC72BKTE5SD64EM2HGFRJM6OOCFYIDHKXK2UCRW5C) | Donate 13 XLM (Escrow Contribution) | [14c3d47...51e0](https://stellar.expert/explorer/testnet/tx/14c3d472fbd5329ff75857e3bc71c5149248c24bd3271450c328fdb4dddf51e0) |

</details>

---

## 15. User Data Collection & Excel Export

To build a robust pipeline for future Mainnet launch and marketing, user details including Wallet Address, Email, Name, Rating, and Comments are actively collected via our in-app feedback widget powered by a Google Form integration.

- **Google Form Link:** [Lumenova Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLScvfle5MlnZAbLOeaP6W7vX33h0hTYXVwyyJQWPmuBhTgftqQ/viewform?pli=1&pli=1)
- **Google Sheet Link (Exported Data):** [Lumenova Feedback Sheets Data](https://docs.google.com/spreadsheets/d/1ZDsFvUHNoKn2T-9BPVVMjSmlpU2ciXB8jStX7FzXY3Q/edit?usp=sharing)
- *Note: Exported responses are also available as a CSV/XLSX (`user_growth_proof.csv`) in this repository for review.*

---

## 16. CI/CD Pipeline

The repository utilizes GitHub Actions to ensure code quality and deployment reliability.
- **On Push/PR:**
  - Runs `cargo test` for Soroban smart contracts.
  - Runs `oxlint` for frontend code quality.
  - Runs `npm run build` to verify Vite compilation.
  - Runs `npm run test` for frontend unit tests.

---

## 17. Screenshots (Level 5)

Please add the following screenshots for Level 5 submission in the `./screenshots/` directory:

- **Analytics Dashboard (50+ unique users/sessions):**
  `![Analytics - 50+ Users](./screenshots/analytics-50-users.png)`
- **Transaction Activity (Stellar Expert showing active volume across unique wallets):**
  `![Transaction Activity](./screenshots/transaction-activity.png)`
- **Improved Onboarding Flow (New onboarding modal):**
  `![Improved Onboarding Flow](./screenshots/improved-onboarding.png)`

---

## 18. Project Structure

```text
Lumenova-A5/
├── contracts/
│   ├── crowdfunding/
│   │   ├── src/
│   │   │   ├── lib.rs          # Escrow & Milestone logic
│   │   │   └── test.rs         # Comprehensive Rust tests
│   │   └── Cargo.toml
│   └── rewards_badge/          # Non-transferable Token contract
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.tsx   # Sentry Integration
│   │   ├── FeedbackForm.tsx    # User Feedback Widget
│   │   ├── MilestoneDashboard.tsx # Escrow UI 
│   │   └── OnboardingModal.tsx # How-It-Works modal
│   ├── services/
│   │   ├── analytics.ts        # Plausible wrapper
│   │   └── monitoring.ts       # Sentry wrapper
│   ├── App.tsx                 # Main application logic
│   ├── stellar.ts              # Stellar RPC & Freighter integrations
│   ├── main.tsx                # React entry point
│   └── index.css               # Tailwind & Custom styling
├── package.json
└── vite.config.ts
```

---

## 19. Error Handling Implemented

1. **Smart Contract Validations:** Strict checks (e.g., preventing voting on locked milestones, preventing creators from voting, double-spend prevention on refunds).
2. **Frontend Error Boundaries:** React `ErrorBoundary` gracefully catches runtime crashes, logs to Sentry, and displays a user-friendly recovery UI instead of a blank white screen.
3. **Transaction Simulation Parsing:** Soroban RPC simulations are carefully parsed. If simulation fails, human-readable error messages (e.g., "Insufficient balance", "Milestone not reached") are bubbled up to the user instead of cryptic XDR blobs.
4. **Wallet State Handling:** Fallbacks for when Freighter is locked, not installed, or on the wrong network.

---

## 20. Known Limitations / Mainnet Roadmap

- **Smart Contract Audits:** The contract utilizes advanced map-based states for milestones which should undergo professional auditing before managing Mainnet funds.
- **Oracle Integration:** Future versions should integrate decentralized oracles to automatically verify off-chain progress (e.g., GitHub commits, social media traction) rather than relying solely on creator-submitted URLs.
- **Tiered Milestone Percentages:** Currently hardcoded to 25% tranches. Future versions will allow campaign creators to customize tranche sizes (e.g., 10%, 40%, 50%) during contract initialization.
- **Governance Automation:** Implement automated delegation for users who do not wish to actively vote on every milestone.

---

## 21. License

This project is licensed under the [MIT License](LICENSE).
