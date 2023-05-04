import './App.css';
import {useState,useEffect} from "react";
import dectectProvider from "@metamask/detect-provider"
import Web3 from "web3";
import fund from "./contracts/Funder.json"

function App() {

  const [webApi,setWebApi]=useState({web3:null,provider:null,contract:null});
  const [account,setAccount]=useState(null);
  const [conBalance,setConBalance]=useState(null);
  const [accBalance,setAccBalance]=useState(null);
  const [reload,setReload]=useState(false);

  const doReload=()=>setReload(!reload);


  useEffect(()=>{
  const first=async()=>{
    const provider=await dectectProvider();
    if(provider){
      await provider.request({method:"eth_requestAccounts"});
    }else{
      console.log("metamask is not connected");
    }
    const web3=await new Web3(provider);
    const abi=fund.abi;
    const networkId=await web3.eth.net.getId();
    const add=fund.networks[networkId].address;
    // console.log(add);
    const contract=await new web3.eth.Contract(abi,add);
    setWebApi({web3,provider,contract});
  }
  first();
},[])
useEffect(()=>{
  const loadAccount=async()=>{
    const {web3}=webApi;
    const accounts=await web3.eth.getAccounts();
    //console.log(accounts);
    setAccount(accounts[0])
  }
  webApi.web3 && loadAccount();
},[webApi.web3])

useEffect(()=>{
  const getBalance=async()=>{
    const {web3,contract}=webApi;
    const add=await contract["_address"]
    const bal=await web3.eth.getBalance(add);
    setConBalance(await web3.utils.fromWei(bal,"ether"));
  }
  webApi.contract && getBalance();
},[webApi.contract,reload])

useEffect(()=>{
  const getBalance=async()=>{
    const {web3,contract}=webApi;
    const bal=await web3.eth.getBalance(account)
    setAccBalance(await web3.utils.fromWei(bal,"ether"))
  }
  account && getBalance();
},[account,reload])

  const transfer=async(event)=>{
    console.log(event);
    const {web3,contract}=webApi;
    const bal=await web3.utils.toWei("2","ether");
    await contract.methods.transfer().send({from:account,value:bal});
    doReload();
  }
  const withdraw=async()=>{
    const {web3,contract}=webApi;
    const bal=await web3.utils.toWei("2","ether");
    await contract.methods.withdraw(bal).send({from:account});
    doReload();
  }


  return (
    <div>
      <div className="card text-center">
        <div className="card-body">
          <h5 className="card-title">Balance: {conBalance} ETH </h5>
          <p className="card-text">
            Account : {account}
            <br />
            Bal: {accBalance} ETH
          </p>
           {/* <button
            type="button"
            className="btn btn-success" onClick={async()=>{
              const accounts=await window.ethereum.request({method:"eth_requestAccounts"});
              // console.log(accounts);
            }}>
            Connect to metamask
          </button>  */}

            <div className="input-group mb-3">
              <button type="button" className="btn btn-success " onClick={transfer} >
            Transfer
          </button>
            </div>

          &nbsp;
          {/* <input type="number" class="form-control" id="exampleInputPassword1"></input>
          <button type="button" className="btn btn-success " onClick={transfer} >
            Transfer
          </button> */}
          &nbsp;
          {/* <button type="button" className="btn btn-primary " onClick={withdraw}>
            Withdraw
          </button> */}
          <div className="input-group mb-3">
              <button type="button" className="btn btn-primary " onClick={withdraw}>
            Withdraw
          </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
