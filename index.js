import { ethers } from "./ethers-5-6.js";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./constants.js";

const btnConnect = document.getElementById("btnConnect");
const btnFund = document.getElementById("btnFund");
const btnBalance = document.getElementById("btnBalance");
const btnWithdraw = document.getElementById("btnWithdraw");

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("btnConnect").innerHTML = "Connected to metamask";
    console.log("Connected!");
  } else {
    console.log("No metamask present");
    document.getElementById("btnConnect").innerHTML = "Please install metamask";
  }
}

async function balance() {
  if (typeof window.ethereum != undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(CONTRACT_ADDRESS);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withdraw() {
  if (typeof window.ethereum != undefined) {
    console.log("Withdrawing..");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    try {
      const txRes = await contract.withdraw();
      await listenForTransactionMine(txRes, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  if (typeof window.ethereum !== "undefined") {
    console.log(`Funding with ${ethAmount}`);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    try {
      const txRes = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(txRes, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(txRes, provider) {
  console.log(`Mining ${txRes.hash}...`);
  //finish listening!
  return new Promise((resolve, reject) => {
    provider.once(txRes.hash, (txReceipt) => {
      console.log(`Completed with ${txReceipt.confirmations} confirmations`);
      resolve();
    });
  });
}

btnConnect.onclick = connect;
btnFund.onclick = fund;
btnBalance.onclick = balance;
btnWithdraw.onclick = withdraw;
