
import { formatEther } from "ethers/lib/utils";
import Web3Modal from "web3modal";
import { useInsertionEffect, useState, useRef,useEffect } from 'react';
import { ethers, Wallet, Contract, providers } from 'ethers';


import {
    Mapping_abi,
    Mapping_CONTRACT_ADDRESS,
    CONTRACT_ABI,
    CONTRACT_code,
  } from "./Contants/Constants";



function Owner(prop){
    const web3ModalRef = useRef();  
    const [managers,setManagers]=useState([]); 
    const [roles,setRoles]=useState([]); 
    const [budget,setBudget]=useState([]); 
    const [walletConnected,setWalletConnected]=useState([]); 
    // const [myContract,setMyContracts]=useState(''); 
    


    const connectWallet = async () => {
        try {
          await getProviderOrSigner();
          setWalletConnected(true);
        } catch (error) {
          console.error(error);
        }
      };

    useEffect(() => {
        if (!prop.walletConnected) {
          web3ModalRef.current = new Web3Modal({
            network: "goerli",
            providerOptions: {},
            disableInjectedProvider: false,
          });
    
          connectWallet().then(() => {
            setWalletConnected(true)
           console.log('connecting...')
          });
        }
      }, []);

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
//function to deploy corporate account contrcat
    async function addManager() {
        try {
  
          let newmanager = document.getElementById('managerWallet').value;
          let reg = /^0x[a-fA-F0-9]{40}$/;
          let repeat = managers.indexOf(newmanager) > -1;
          if (reg.test(newmanager) && !repeat) {
            setManagers([...managers, newmanager]);
          } else {
            alert('incorrect address format or repeat address');
          }
          document.getElementById('managerWallet').value = "";
          document.getElementById('managerWallet').placeholder = "0x...";
        } catch (err) {
          console.error(err);
        }
      }

    


      const deploytContract = async () => {
        try {
          const signer = await getProviderOrSigner(true);
          const Contract = new ethers.ContractFactory(CONTRACT_ABI,CONTRACT_code,signer);
          const contract = await Contract.deploy(managers,Mapping_CONTRACT_ADDRESS);
          await contract.deployed();
          console.log(contract.address)
          document.getElementById('notice').innerHTML=`<h3>My Corporate Contract address is ${contract.address}</h3>`
         
        } catch (err) {
          console.error(err);
        }
      };

      async function addRole() {
        try {
  
          let newrole = document.getElementById('newrole').value;
          setBudget(document.getElementById('budget').value)
          let repeat = roles.indexOf(newrole) > -1;
          if (!repeat) {
            setRoles([...roles, newrole]);
          } else {
            alert('repeat role names');
          }
          document.getElementById('newrole').value = "";
          document.getElementById('newrole').placeholder = "0x...";
        } catch (err) {
          console.error(err);
        }
      }

      async function deployRoles(){
        try{
          let ADD='0x5f96b7f30f47D26971A31A8b853661132fff4e0B'
          console.log('myContract',prop.myContract)
          // console.log('contract address',myConctract)
          const signer = await getProviderOrSigner(true);
          const address = await signer.getAddress();
          const AccountContract = new Contract(ADD, CONTRACT_ABI, signer); 
          // const mgrs=await AccountContract.getManagers()//get all managers
          // console.log('deploying roles...')
          const tx=await AccountContract.addRoles(roles,budget)//set roles in batch
          tx.wait();
          document.getElementById('notice2').innerHTML=`<h4>Roles added</h4>`
          
        }catch(err){
          console.log(err)
        }
      }
    
    return(
        <div>
            {prop.ownerFunction==1?(//account creation
                <div>
                    {prop.walletConnected ? (
                        <div>
                            <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon1">@</span>
                                    <input type="text" class="form-control" placeholder="0x..." id="managerWallet" aria-label="Username" aria-describedby="basic-addon1"/>
                                    <button  onClick={addManager}>Add Manager</button>
                            </div>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary" type="button" onClick={deploytContract}>Creat Corporate Account</button>
                            </div>

                            <div id="notice">
                                Manager Wallets {managers.length}:
                                <ul>
                                {managers.map((mgr)=>{
                                return(<li>{mgr}</li>)
                                })}
                                </ul>
                            </div>
                            

                          
                        </div>

                    ) : (
                        <button onClick={connectWallet}>
                        Connect your wallet
                        </button>
                    )}



                </div>
                
                ):(prop.ownerFunction==2?(
                  <div>
                            <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon1">Role Name</span>
                                    <input type="text" class="form-control" placeholder="" id="newrole" aria-label="Username" aria-describedby="basic-addon1"/>
                                    <span class="input-group-text" id="basic-addon1">Role Budget</span>
                                    <input type="text" class="form-control" placeholder="0" id="budget" aria-label="Username" aria-describedby="basic-addon1"/>
                                    <button  onClick={addRole}>Add Role</button>
                            </div>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary" type="button" onClick={deployRoles}>Deploy Roles</button>
                            </div>

                            <div id="notice2">
                                Manager Wallets {roles.length}:
                                <ul>
                                {roles.map((role)=>{
                                return(<li>{role}</li>)
                                })}
                                </ul>
                            </div>



                  </div>



                ):(''))}
        </div>
    )
}

export default Owner;