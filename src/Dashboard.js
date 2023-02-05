import { formatEther,utils } from "ethers/lib/utils";
import Web3Modal from "web3modal";
import { useInsertionEffect, useState, useRef,useEffect } from 'react';
import { ethers, Wallet, Contract, providers } from 'ethers';
import {createAccount} from './Owner.js'

import {
    Mapping_abi,
    Mapping_CONTRACT_ADDRESS,
    CONTRACT_ABI,
    CONTRACT_code,

  } from "./Contants/Constants";



export function Dashboard(prop){
    const web3ModalRef = useRef();  
    const [managers,setManagers]=useState([]); 
    const [employees,setEmployees]=useState([]); 
    const [merchants,setMerchants]=useState([]); 
    const [contracts,setContracts]=useState([]); 
    const [myContract,setMyContracts]=useState(""); 
    const [myRole,setMyRole]=useState('na');  
    const [walletConnected, setWalletConnected] = useState(false);
//basic functions
    const getProviderOrSigner = async (needSigner = false) => {
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);
    
        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 1337) {
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

//functions for dashboard
      const getContracts = async () => {
        try {
          // We need a Signer here since this is a 'write' transaction.
          const signer = await getProviderOrSigner(true);
          // Create a new instance of the Contract with a Signer, which allows
          // update methods
          
          const address = await signer.getAddress();
          const mappingContract = new Contract(Mapping_CONTRACT_ADDRESS, Mapping_abi, signer);
          // call the presaleMint from the contract, only whitelisted addresses would be able to mint
          // console.log('getContract...')
          const tx = await mappingContract.checkAccount();
          
        //   setLoading(true);
          // wait for the transaction to get mined
          // console.log('line 70',tx)
          setContracts(tx)
        } catch (err) {
          console.error(err);
        }
      };

      const getMyContract = async () => {
        try {          
          
          const signer = await getProviderOrSigner(true);
          const address = await signer.getAddress();
          for(let i=0;i<contracts.length;i++){
            const AccountContract = new Contract(contracts[i], CONTRACT_ABI, signer); 
            const tx1=await AccountContract.myRole()//get my role
            if(tx1!='na'){
              setMyRole(tx1)
              setMyContracts(contracts[i])
              console.log('mycontract',contracts[i])                
            }

          }
        } catch (err) {
          console.error(err);
        }
      };

      const getContractInfo=async()=>{
        try{
          const signer = await getProviderOrSigner(true);
          const address = await signer.getAddress();
          const AccountContract = new Contract(myContract, CONTRACT_ABI, signer); 
          const mgrs=await AccountContract.getManagers()//get all managers
          const employees=await AccountContract.getEmployee()//get all employees
          const merchants=await AccountContract.getMerchants()//get all merchants
          setManagers(mgrs)
          setEmployees(employees)
          setMerchants(merchants)
         
        }catch(err){
            console.log(err)
        }
      }

      useEffect(() => {
        if (!walletConnected) {
          web3ModalRef.current = new Web3Modal({
            network: "goerli",
            providerOptions: {},
            disableInjectedProvider: false,
          });
    
          connectWallet().then(() => {
        //    console.log('connecting...')
          });
        }
        getContracts();
        getMyContract()
        getContractInfo()
      }, []);
    
    return(
        <div className="text-start">
            <div class="row">
                <div class="col-sm-3 mb-3 mb-sm-0">
                    <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">My Contract</h5>
                        <p class="card-text">Contract address:<b id="myConctract">{myContract}</b></p>
                        <p class="card-text">My role:<b>{myRole}</b></p>
                        
                    </div>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Managers</h5>
                        <p class="card-text">{<ul>
                                {managers.map((mgr)=>{
                                return(<li>{mgr}</li>)
                                })}
                                </ul>}:</p>   
                    </div>
                    </div>
                </div>

                <div class="col-sm-3">
                    <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Employees</h5>
                        <p class="card-text">{<ul>
                                {employees.map((mgr)=>{
                                return(<li>{mgr}</li>)
                                })}
                                </ul>}</p>   
                    </div>
                    </div>
                </div>

                <div class="col-sm-3">
                    <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Merchants</h5>
                        <p class="card-text">{<ul>
                                {merchants.map((mgr)=>{
                                return(<li>{mgr}</li>)
                                })}
                                </ul>}</p>   
                    </div>
                    </div>
                </div>
                </div>
            {(prop.role=='owner')?(''):('')}
        </div>
    )
}

