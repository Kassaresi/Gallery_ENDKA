import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import CertificateNFT from "./CertificateNFT.json"; // ABI контракта

const CONTRACT_ADDRESS = "0x7a14Dd40d420853A1E4f4E72cE2f6E6C4E1256b6"; // твой контракт

function App() {
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    async function init() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateNFT.abi, signer);
      setProvider(provider);
      setContract(contract);

      const total = await contract.nextTokenId();
      const temp = [];
      for (let i = 0; i < total; i++) {
        const uri = await contract.tokenURI(i);
        const data = await fetch(uri).then(res => res.json());
        temp.push(data);
      }
      setNfts(temp);
    }
    init();
  }, []);

  return (
    <div>
      <h1>NFT Certificates</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {nfts.map((nft, i) => (
          <div key={i} style={{ border: "1px solid black", margin: 10, padding: 10 }}>
            <img src={nft.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")} alt="" width={150} />
            <p>Name: {nft.name}</p>
            <p>Program: {nft.program}</p>
            <p>Grade: {nft.grade}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
