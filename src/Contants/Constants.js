const mapping=require('./Mapping.json')
const account=require('./CorporateAccount.json')


export const Mapping_CONTRACT_ADDRESS = "0xA15C0428186bc72b6230e2D555c5e6639716987C"
export const Account_CONTRACT_ADDRESS = "0x9A3155931aF5dD02f372E94d4e811A0891F0D4E4"
export const Mapping_abi=mapping.abi
export const CONTRACT_ABI=account.abi
export const CONTRACT_code=account.bytecode