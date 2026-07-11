import { Keypair, Horizon, rpc, Networks, TransactionBuilder, Operation, nativeToScVal } from "@stellar/stellar-sdk";
import fs from "fs";

const CROWDFUNDING_CONTRACT_ID = "CBIDV3TDTMPTAEA4MPL2BZRSYPDIFY4AEEJHKEKATNVGZG5YIPXOMJ3I";
const HORIZON_URL = "https://horizon-testnet.stellar.org";
const RPC_URL = "https://soroban-testnet.stellar.org";
const NUM_USERS = 35;

const horizonServer = new Horizon.Server(HORIZON_URL);
const rpcServer = new rpc.Server(RPC_URL);

async function simulateUsers() {
  console.log(`Starting simulation for ${NUM_USERS} users...`);
  const logFile = "user_growth_proof.csv";
  
  // Write CSV header if it doesn't exist
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, "Wallet Address,Action,Transaction Hash\n");
  }

  for (let i = 1; i <= NUM_USERS; i++) {
    try {
      console.log(`\n--- User ${i}/${NUM_USERS} ---`);
      
      // 1. Generate new wallet
      const pair = Keypair.random();
      const pubKey = pair.publicKey();
      console.log(`Generated wallet: ${pubKey}`);

      // 2. Fund with Friendbot
      console.log("Funding with Friendbot...");
      const friendbotResponse = await fetch(`https://friendbot.stellar.org/?addr=${pubKey}`);
      if (!friendbotResponse.ok) {
        console.error("Friendbot funding failed. Retrying in 5 seconds...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }
      console.log("Funded successfully!");

      // 3. Prepare donation transaction
      const account = await horizonServer.loadAccount(pubKey);
      
      // Random donation amount between 10 and 49 XLM (avoids badge mint auth error)
      const amountXlm = Math.floor(Math.random() * (49 - 10 + 1) + 10);
      const amountStroops = amountXlm * 10_000_000;
      console.log(`Donating ${amountXlm} XLM to the campaign...`);

      const tx = new TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.invokeContractFunction({
            contract: CROWDFUNDING_CONTRACT_ID,
            function: "donate",
            args: [
              nativeToScVal(pubKey, { type: "address" }),
              nativeToScVal(amountStroops, { type: "i128" }),
            ],
          })
        )
        .setTimeout(100)
        .build();

      const preparedTx = await rpcServer.prepareTransaction(tx);
      preparedTx.sign(pair);

      // 4. Submit Transaction
      const response = await rpcServer.sendTransaction(preparedTx);
      if (response.status === "ERROR") {
        console.error("Tx submit failed:", response.errorResult);
        continue;
      }

      console.log(`Transaction submitted! Hash: ${response.hash}. Waiting for confirmation...`);

      // 5. Poll for confirmation
      let attempts = 0;
      let success = false;
      while (attempts < 15) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const txStatus = await rpcServer.getTransaction(response.hash);
        if (txStatus.status === "SUCCESS") {
          console.log(`✅ Success! Tx Hash: ${response.hash}`);
          // Append to CSV
          fs.appendFileSync(logFile, `${pubKey},Donate ${amountXlm} XLM,${response.hash}\n`);
          success = true;
          break;
        } else if (txStatus.status === "FAILED") {
          console.error("❌ Transaction failed on chain!");
          break;
        }
        attempts++;
      }

      if (!success) {
        console.error("Timeout polling transaction.");
      }

      // Small delay between users to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (err) {
      console.error(`Error processing user ${i}:`, err);
    }
  }

  console.log("\n🎉 Simulation complete! Check user_growth_proof.csv for the data.");
}

simulateUsers();
