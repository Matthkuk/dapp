import { ethers } from "ethers";
import React, { useState, useEffect } from 'react';
import { contractAddress, abi } from "./constants";

function App() {
  let signer = null;
  let provider;
  let contract;

  const connectWallet = async () => {
    if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults")
        provider = ethers.getDefaultProvider()
    } else {
        provider = new ethers.BrowserProvider(window.ethereum)
        signer = await provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
    }
    await provider.send("eth_requestAccounts", []);
    console.log('Sent connection request')
  }

  useEffect(() => {
    connectWallet().catch(console.error);
    getBalance().catch(console.error);
  })


  const [depositValue, setDepositValue] = useState('');
  const [balance, setBalance] = useState('');

  const handleDepositChange = (e) => {
    setDepositValue(e.target.value);
  }

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!signer) {
      console.error("Signer is not available");
      return;
    }
    console.log(signer, contract.runner)
    const ethValue = ethers.parseEther(depositValue)
    const depositEth = await contract.deposit({value: ethValue});
    await depositEth.wait();
    console.log(depositValue);
    getBalance();
  }

  const getBalance = async () => {
    const balance = await provider.getBalance(contractAddress);
    const balanceFormatted = ethers.formatEther(balance);
    setBalance(balanceFormatted);
  }

  return (
    <div className="container">
      <div className="container text-center">
        <div className="row mt-5">
          <div className="col">
            <h3>Fund Raiser Contract</h3>
            <h3>Contract Balance: {balance}</h3>
            <button type="button" className="btn btn-primary" onClick={connectWallet}>Switch Wallets</button>
          </div>
          <div className="col">
            <form onSubmit={handleDepositSubmit}>
              <div className="mb-3">
                <label className="form-label">Deposit</label>
                <input type="number" className="form-control" id="deposit" placeholder="0" value={depositValue} onChange={handleDepositChange} />
              </div>
              <button type="submit" className="btn btn-primary">Deposit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
