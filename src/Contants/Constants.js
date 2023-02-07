const mapping=require('./Mapping.json')
const account=require('./CorporateAccount.json')


export const Mapping_CONTRACT_ADDRESS = "0x54Bff1cBb6a735Bb164ce53fd4F297E0EC894324"
export const Account_CONTRACT_ADDRESS = "0x0db39724859FB8E2F6dEbC2701D01d655a0b75F2"
export const Mapping_abi=mapping.abi
export const CONTRACT_ABI=account.abi
export const CONTRACT_code=account.bytecode