
import { formatEther } from "ethers/lib/utils";
import Web3Modal from "web3modal";
import { useInsertionEffect, useState, useRef,useEffect } from 'react';
import { ethers, Wallet, Contract, providers } from 'ethers';


import {
    Mapping_abi,
    Mapping_CONTRACT_ADDRESS,
    CONTRACT_ABI,
    CONTRACT_code,
    Account_CONTRACT_ADDRESS,
  } from "./Contants/Constants";



function Manager(prop){
    const web3ModalRef = useRef();  
    const [managers,setManagers]=useState([]); 
    const [roles,setRoles]=useState([]); 
    const [budget,setBudget]=useState([]); 
    const [walletConnected,setWalletConnected]=useState([]); 
    // const [myContract,setMyContracts]=useState(''); 
    // const ADD='0xDfBA87BcB20cF01D6DF40077f42826674a08124C'   //address of corporate account contract, in future need to update to automatic

    
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
          web3ModalRef.current = new Web3Modal({
            network: "goerli",
            providerOptions: {},
            disableInjectedProvider: false,
          })
      
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

      async function addEmployee(){
        try{

          
          let add = document.getElementById('employeeAddress').value;
          let name = document.getElementById('employeeName').value;
          
          let roleId = Number(document.getElementById('employeeRoleId').value)
          
          // console.log('myContract',prop.myContract)
          // console.log('contract address',myConctract)
          const signer = await getProviderOrSigner(true);
          const address = await signer.getAddress();
          const AccountContract = new Contract(Account_CONTRACT_ADDRESS, CONTRACT_ABI, signer); 
          // const mgrs=await AccountContract.getManagers()//get all managers
          console.log('add Employee... to',Account_CONTRACT_ADDRESS)
          const tx=await AccountContract.addEmployee(address,name,roleId)
          
          
          document.getElementById('employeeName').value=''
          document.getElementById('employeeAddress').value=''
          document.getElementById('employeeRoleId').value=''
          
          // console.log(tx)
          // tx.wait();
          // document.getElementById('notice2').innerHTML=`<h4>Roles added</h4>`
          
        }catch(err){
          console.log(err)
        }
      }

  
    
    return(
        <div>
            {prop.mgrFunction==1?(//account creation
                <div>
                    {prop.walletConnected ? (
                        <div>
                            <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon1">Name</span>
                                    <input type="text" class="form-control" placeholder="" id="employeeName" aria-label="Username" aria-describedby="basic-addon1"/>
                                    <span class="input-group-text" id="basic-addon1">Address</span>
                                    <input type="text" class="form-control" placeholder="0x..." id="employeeAddress" aria-label="Username" aria-describedby="basic-addon1"/>
                                    <span class="input-group-text" id="basic-addon1">RoleId</span>
                                    <input type="text" class="form-control" placeholder="" id="employeeRoleId" aria-label="Username" aria-describedby="basic-addon1"/>
                                    <button  onClick={addEmployee}>Add Employee</button>
                            </div>                  
                        </div>

                    ) : (
                        <button onClick={connectWallet}>
                        Connect your wallet
                        </button>
                    )}



                </div>
                
                ):(prop.mgrFunction==2?(
                  "2-under Construction"



                ):(prop.mgrFunction==3?(
                  "3-under Construction"):(
                    prop.mgrFunction==4?(
                      <div>4-Under Construction
    
    
    
    
                      </div>):(
                        prop.mgrFunction==5?(
                          <div>5 - Under Construction
    
                          </div>):(prop.mgrFunction==6?(
                          <div>6-Under Construction
    
                          </div>):(""))


                      )


                  )
                
                
                
                
                ))}
        </div>
    )
}

export default Manager;