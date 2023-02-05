const mapping=require('./Mapping.json')
const account=require('./CorporateAccount.json')


export const Mapping_CONTRACT_ADDRESS = "0x54Bff1cBb6a735Bb164ce53fd4F297E0EC894324"
export const Account_CONTRACT_ADDRESS = "0x5CB711E422f040a361AA0b0Bcf9706a9F247036D"
export const Mapping_abi=mapping.abi
export const CONTRACT_ABI=account.abi
export const CONTRACT_code=account.bytecode