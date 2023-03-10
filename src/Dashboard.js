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
    Account_CONTRACT_ADDRESS,

  } from "./Contants/Constants";



export function Dashboard(prop){
    const web3ModalRef = useRef();  
    const [isOwner,setIsOwner]=useState(''); 
    
    const [managers,setManagers]=useState([]); 
    const [roles,setRoles]=useState([]); 
    const [employees,setEmployees]=useState([]); 
    const [merchants,setMerchants]=useState([]); 
    const [contracts,setContracts]=useState([]); 
    const [walletConnected, setWalletConnected] = useState(false);
    const [myContract,setMyContracts]=useState(""); 

//manager data
    const [isManager,setIsManager]=useState('no'); 
    const [myEmployee,setMyEmployee]=useState([]); 
    const [transaction,setTransaction]=useState(''); 


//employee related states
    const [isEmployee,setIsEmployee]=useState('no'); 
    const [myBudget,setMyBudget]=useState(); 
    const [mySpent,setMySpent]=useState();    
    const [myRole,setMyRole]=useState('na');  
    

//basic functions
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
          // console.log('getContracts',tx)
          setContracts(tx)
          
        } catch (err) {
          console.error(err);
        }
      };

      const getMyContract = async () => {
        try {          
          // console.log(contracts)
          const signer = await getProviderOrSigner(true);
          const address = await signer.getAddress();
          for(let i=0;i<contracts.length;i++){
            const AccountContract = new Contract(contracts[i], CONTRACT_ABI, signer); 
            const tx1=await AccountContract.myRole()//get my role
            if(tx1!='na'){
              setMyContracts(Account_CONTRACT_ADDRESS)
              // console.log('mycontract',contracts[i])                
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
          
          const AccountContract = new Contract(Account_CONTRACT_ADDRESS, CONTRACT_ABI, signer); 
          const mgrs=await AccountContract.getManagers()//get all managers
          const isEmployee=await AccountContract.isEmployee(address)//get all managers
          setIsEmployee(isEmployee)
          const employees=await AccountContract.getEmployees()//get all employees
          const roles=await AccountContract.getRoles()//get all employees
          const owner=await AccountContract.owner()//get owner
          
          const tx=await AccountContract.getTransactions()//get transactions
          console.log(tx)
          let Transactions=[]
          for(let i=0;i<tx.length;i++){
            let tx_from=tx[i][0]
            let tx_to=tx[i][1]
            let tx_value=ethers.utils.formatEther(tx[i][2])
            let tx_status=tx[i][3]==0?('submited'):(tx[i][3]==1?('approved'):(tx[i][3]==2?('disapproved'):('executed')))
            let newTx=`From: ${tx_from},To: ${tx_to}, Value: ${tx_value},Status: ,${tx_status}`
            Transactions.push(newTx)
          }
          setTransaction(Transactions)
          
          // console.log(tx_from,tx_to,tx_value,tx_status)
        //   struct Transaction {
        //     address employee;//from employee
        //     address merchants;//to merchants
        //     uint256 value;
        //     Status txStatus;//active or inactive
        // }
          

          
          const merchants=await AccountContract.getMerchants()//get all merchants
          
          
          const myProfile=await AccountContract.EmployeeProfile(address)//my profile
          
          // console.log(myProfile[2].toNumber())
          
          const myRole=await AccountContract.roleNames(myProfile[2].toNumber())//get all employees
          
          const myBudget=await AccountContract.roleBudget(myRole).then(ethers.utils.formatEther)
          const mySpent=ethers.utils.formatEther(myProfile[4])
          
          
          if(address==owner){setIsOwner('yes')
          }else{setIsOwner('No')}

          
          for(let i=0;i<mgrs.length;i++){
            if(mgrs[i]==address){setIsManager('yes')}
          }

          let myEmployee = []

          for(let i=0;i<employees.length;i++){
            
            let Profile=await AccountContract.EmployeeProfile(employees[i])//get all employee profile
         
            let Role=await AccountContract.roleNames(Profile[2])//get all employees
            let Budget=await AccountContract.roleBudget(myRole).then(ethers.utils.formatEther)
            let Spend=ethers.utils.formatEther(Profile[5])
           
            
            if(Profile[3]==address){
              let Employee=`Name: ${Profile[1]} Role: ${Role} Active: ${Profile[4]} Budget ${Budget} Spent: ${Profile[5]}`
              myEmployee.push(Employee)
            }
          }
          setMyEmployee(myEmployee)
          setRoles(roles)
          setManagers(mgrs)
          setEmployees(employees)
          setMerchants(merchants)
//Employee Dashboard data
          if(isEmployee){
          setMyRole(myRole)
          setMyBudget(myBudget)
          setMySpent(mySpent)
          }

          

         
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
            {prop.role=='owner'?(
                          <div class="row">
                          <button class="btn btn-info" type="button" onClick={()=>{
                                    getContracts()
                                    getMyContract()
                                    getContractInfo()
                                  }}><h5>Dashboard - click to refersh</h5></button>    
                                 
                                
                            <div class="col-sm-2 mb-3 mb-sm-0">
                                
                                <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">My Contract</h5>
                                    <p class="card-text">Contract address:<b id="myConctract">{myContract}</b></p>
                                    
                                    <p class="card-text">is Owner:<b>{isOwner}</b></p>
                                    
                                </div>
                                </div>
                            </div>
                            <div class="col-sm-2">
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
            
                            <div class="col-sm-2">
                                <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Roles</h5>
                                    <p class="card-text">{<ul>
                                            {roles.map((mgr)=>{
                                            return(<li>{mgr}</li>)
                                            })}
                                            </ul>}</p>   
                                </div>
                                </div>
                            </div>
            
                            
            
                            <div class="col-sm-2">
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
            
                            <div class="col-sm-4">
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
                            
                        </div>
            ):(
              prop.role=='manager'?(
                
                <div className="row">
                  <button class="btn btn-info" type="button" onClick={()=>{
                                    getContracts()
                                    getMyContract()
                                    getContractInfo()
                                  }}><h5>Dashboard - click to refersh</h5>
                    </button>  
                  <div class="col-sm-4">
                  <div class="card">
                      <div class="card-body">
                          <h5 class="card-title">Manager Profile</h5>
                             <p class="card-text">Is Manager: <b id="myRole">{isManager}</b></p>
                                      
                      </div>
                  </div>
                  </div>
                  <div class="col-sm-4">
                  <div class="card">
                      <div class="card-body">
                          <h5 class="card-title">My Employees</h5>
                             <p class="card-text">{<ul>
                                            {myEmployee.map((mgr)=>{
                                            return(<li>{mgr}</li>)
                                            })}
                                            </ul>}</p>
                                      
                      </div>
                  </div>
                  </div>
                  <div class="col-sm-4">
                  <div class="card">
                      <div class="card-body">
                          <h5 class="card-title">Transactions</h5>
                             <p class="card-text">{<ul>
                                            {transaction}
                                            </ul>}</p>
                                      
                      </div>
                  </div>
                  </div>


                </div>

              ):(
                prop.role=='employee'?(
                  <div  className="row">
                    <button class="btn btn-info" type="button" onClick={()=>{
                                    getContracts()
                                    getMyContract()
                                    getContractInfo()
                                  }}><h5>Dashboard - click to refersh</h5>
                    </button>  
                    <div class="col-sm-4 mb-3 mb-sm-0">
                                
                                <div class="card">
                                  <div class="card-body">
                                      <h5 class="card-title">My Profile</h5>
                                      <p class="card-text">My Role:<b id="myRole">{myRole}</b></p>
                                      <p class="card-text">My Budget:<b>{myBudget} ETH</b></p>
                                      <p class="card-text">My Spent:<b>{mySpent} ETH</b></p>
                                      <p class="card-text">isEmployee:<b>{isEmployee?('Yes'):("No")}</b></p>

                                      
                                  </div>
                                </div>
                    </div>
                    <div class="col-sm-4 mb-3 mb-sm-0">
                                
                                <div class="card">
                                  <div class="card-body">
                                      <h5 class="card-title">Merchants</h5>
                                      <p class="card-text"><b>{<ul>
                                            {merchants.map((mgr)=>{
                                            return(<li>{mgr}</li>)
                                            })}
                                            </ul>}</b></p>
                                      
                                      
                                  </div>
                                </div>
                    </div>
                    <div class="col-sm-4 mb-3 mb-sm-0">
                                
                                <div class="card">
                                  <div class="card-body">
                                      <h5 class="card-title">Transaction</h5>
                                      <p class="card-text"><b>{transaction}</b></p>
                                      
                                      
                                  </div>
                                </div>
                    </div>
                                 
                       
                    
                  </div>


                ):('')
              )
            )}

            
        </div>
    )
}

