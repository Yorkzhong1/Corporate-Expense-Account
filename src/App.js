
import { formatEther } from "ethers/lib/utils";
import Web3Modal from "web3modal";
import { useInsertionEffect, useState, useRef,useEffect } from 'react';
import { ethers, Wallet, Contract, providers } from 'ethers';
import Owner from './Owner.js'
import Manager from './Manager.js'
import Employee from './Employee.js'
import './App.css';
import {Dashboard} from './Dashboard';


function App() {

  const [role, setRole] = useState("owner");
  const [walletConnected, setWalletConnected] = useState(false);
  const [ownerFunction, setOwnerFunction] = useState(0);
  const [mgrFunction, setMgrFunction] = useState(0);
  const [employeeFunction, setEmployeeFunction] = useState(0);
  const [myContract, setMyContract] = useState('');
  const web3ModalRef = useRef('false');    

  function selectRole(){
    setRole(document.getElementById('role').value)
    // console.log(role)
  }

  
  const getProviderOrSigner = async (needSigner = false) => {
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);
    
        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 5) {
          window.alert("Please switch to the Goerli network!");
          throw new Error("Please switch to the Goerli network");
        }
    
        if (needSigner) {
          const signer = web3Provider.getSigner();
          return signer;
        }
        
        return web3Provider;
      };

  const connectWallet = async () => {
        try {
          await getProviderOrSigner();
          setWalletConnected(true);
        } catch (error) {
          console.error(error);
        }
      };

  useEffect(() => {
        if (!walletConnected) {
          web3ModalRef.current = new Web3Modal({
            network: "goerli",
            providerOptions: {},
            disableInjectedProvider: false,
          });
    
          connectWallet().then(() => {
           console.log('connecting...')
          });
        }
      }, []);

  return (
    <div className="container overflow-hidden text-center">
      <div className="row g-2">
        <div className="col-2">
          <div className="p-3 mt-5 bg-dark text-white" id="menue">
            <h5>Select Your Role</h5>
            <select id="role" onChange={selectRole} className="form-select form-select-lg mb-3 text-center" aria-label=".form-select-lg example">
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div className="p-3 mt-5 bg-dark text-white" id="menue"><h5>Menue</h5>
          {role=='owner'? (
              <div className="d-grid gap-2">
                <button type="button" className="btn btn-light mt-3" onClick={()=>{setOwnerFunction(1)}} >Account Creation</button>
                <button type="button" className="btn btn-light mt-3" onClick={()=>{setOwnerFunction(2)}}>Roles</button>
                <button type="button" className="btn btn-light mt-3" onClick={()=>{setOwnerFunction(3)}}>Budgets</button>
                <button type="button" className="btn btn-light mt-3" onClick={()=>{setOwnerFunction(4)}}>Merchants</button>
                <button type="button" className="btn btn-light mt-3" onClick={()=>{setOwnerFunction(5)}}>Change Owner</button>
                <button type="button" className="btn btn-light mt-3" onClick={()=>{setOwnerFunction(6)}}>Withdraw Fund</button>
              </div>
              ) : (<div>
                {role=="manager"?(
                  <div className="d-grid gap-2">
                    <button type="button" className="btn btn-light mt-3" onClick={()=>{setMgrFunction(1)}} >Add Employee</button>
                    <button type="button" className="btn btn-light mt-3" onClick={()=>{setMgrFunction(2)}}>Change Employee Role</button>
                    <button type="button" className="btn btn-light mt-3" onClick={()=>{setMgrFunction(3)}}>DeActive Employee</button>
                    <button type="button" className="btn btn-light mt-3" onClick={()=>{setMgrFunction(4)}}>Change Manager</button>
                    <button type="button" className="btn btn-light mt-3" onClick={()=>{setMgrFunction(5)}}>Approve Transactions</button>
                    <button type="button" className="btn btn-light mt-3" onClick={()=>{setMgrFunction(6)}}>DisApprove Transactions</button>
                  </div>
                  ):(
                    <div className="d-grid gap-2">
                    <button type="button" className="btn btn-light mt-3" onClick={()=>{setEmployeeFunction(1)}}>Submit Transaction</button>

                  </div>)}
              </div>)
            }
          </div>
        </div>

    
        <div className="col-10">
          <div className="p-3 mt-5 bg-info" id="dashboard">
          <Dashboard role={role} myContract={myContract} setMyContract={setMyContract}/>
          </div>
          <div className="p-3 mt-2 bg-light" id="display">
            {role=='owner'?(<Owner ownerFunction={ownerFunction} walletConnected={walletConnected} />):(
              role=='manager'?(<Manager mgrFunction={mgrFunction} walletConnected={walletConnected} />):(
                role=='employee'?(<Employee mgrFunction={employeeFunction} walletConnected={walletConnected} />):(
                  '')))}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
