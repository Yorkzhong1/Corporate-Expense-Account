const mapping=require('./Mapping.json')
const account=require('./CorporateAccount.json')


export const Mapping_CONTRACT_ADDRESS = "0x9Bf2EEd1245157C3C00D9958E1Fbd4DEFFBCb8AC"
export const Account_CONTRACT_ADDRESS = "0x41a368954cff8B671B8DAa21cD722b0e470caE0B"
export const Mapping_abi=mapping.abi
export const CONTRACT_ABI=account.abi
export const CONTRACT_code=account.bytecode