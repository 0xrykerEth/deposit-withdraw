import { ethers } from "./ethers.js";
import { abi, contractAddress } from "./constants.js";

const connect = document.querySelector(".connect");
const getwithdraw = document.querySelector(".withdraw");
const fund = document.querySelector(".fund");
const address = document.querySelector(".addy");
const balance = document.querySelector(".balance");
const user = document.querySelector(".user");
const bal = document.querySelector(".bal");
connect.onclick = connects;
fund.onclick = funds;
balance.onclick = getBalance;
getwithdraw.onclick = getWithdraw;
user.onclick = userBalance;

async function connects() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Metamask detected");
    document.querySelector(".connect").innerHTML = "Connected!";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    address.innerHTML = accounts;
  } else {
    document.querySelector(".connect").innerHTML = "Please install MetaMask";
  }
}

async function funds() {
  const ethAmount = document.querySelector(".inpu").value;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); // Use getSigner() method
    const contract = new ethers.Contract(contractAddress, abi, signer); // Fix contract creation
    try {
      const transactionResponse = await contract.deposit({
        value: ethers.utils.parseEther(ethAmount.toString()), // Fix parseEther function
      });
      await listenForTransaction(transactionResponse, provider);
      console.log("!Banak you little bitch");
    } catch (error) {
      console.log(error);
    }
  }
}

async function listenForTransaction(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);

  try {
    const transactionReceipt = await provider.waitForTransaction(
      transactionResponse.hash,
      1
    );

    console.log(
      `Completed with ${transactionReceipt.confirmations} confirmations`
    );
  } catch (error) {
    console.log(error);
  }
}

async function getBalance() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const balance = await provider.getBalance(contractAddress);
  console.log(ethers.utils.formatEther(balance));
  bal.innerHTML = balance;
}

async function userBalance() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const addresses = await ethereum.request({ method: "eth_accounts" });
  if (addresses.length > 0) {
    const address = addresses[0]; // Assuming you want to get balance for the first address
    const balanceWei = await provider.getBalance(address);
    const balanceEth = ethers.utils.formatEther(balanceWei);
    console.log(`Balance of ${address}: ${balanceEth} ETH`);
  } else {
    console.log("No addresses available");
  }
}

async function getWithdraw() {
  const withdrawAmt = document.querySelector(".with").value;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.withdraw(withdrawAmt);
      await listenForTransaction(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
