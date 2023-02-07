
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

      async function Spend(){
        try{

          
          let add = document.getElementById('merchant').value;
          let ETHValue = document.getElementById('spentValue').value;
          let value = ethers.utils.parseUnits(ETHValue, "ether");
          
          const signer = await getProviderOrSigner(true);
          const address = await signer.getAddress();
          const AccountContract = new Contract(Account_CONTRACT_ADDRESS, CONTRACT_ABI, signer); 
        
          console.log('Spending',add)
          const tx=await AccountContract.submitTransaction(add,value)
          
          
          document.getElementById('merchant').value=''
          document.getElementById('spentValue').value=''
          
          
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
                                    
                                    <span class="input-group-text" id="basic-addon1">Merchant</span>
                                    <input type="text" class="form-control" placeholder="0x..." id="merchant" aria-label="Username" aria-describedby="basic-addon1"/>
                                    <span class="input-group-text" id="basic-addon1">Value</span>
                                    <input type="text" class="form-control" placeholder="" id="spentValue" aria-label="Username" aria-describedby="basic-addon1"/>
                                    <button  onClick={Spend}>Spend</button>
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