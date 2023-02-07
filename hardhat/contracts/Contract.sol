// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


//the mapping has a fixed address and contains all the CorporateAccount contracts that are deployed

contract Mapping {
    address[] public Contracts;
    function addAccount(address _contract) external {
        Contracts.push(_contract);
    }
    function checkAccount() external view returns(address[] memory){
        return Contracts;
    }
}

interface MappingContract {
        function addAccount(address _contract) external;
    }

contract CorporateAccount {
    address public owner;
    uint public required;//required number of approvals to approve
    uint deployDate;

//data structure for managers.
    address[] public managers; //managers are the one who add/delete employee, and approve large transactions
    mapping(address=>bool) isManager;
    
//data structure for employees
    string[] public roleNames;
    mapping(string=>uint) public roleBudget;
    mapping(string=>bool) public roleActive;
    
    
    struct Employee{
        uint id;//employee id; employee id can also point to a specific employee in employess array
        string name;
        uint roleId;
        address myManager;
        uint spent;// amount already spent within the month
        uint totalSpent;// amount already spent in the past
        bool active;//active or inactive
        uint lastRefresh;// timestamp to refresh budget each month
    }
    mapping (address=>Employee) public EmployeeProfile;//each employee have one role
    address[] public Employees;
//function for external infomation
   function myRole() external view returns(string memory){
        if(owner==msg.sender){
            return "owner";
        } else if(isManager[msg.sender]){
            return "manager";
        } else if(isEmployee(msg.sender)){
            return 'employee';
        } else {
            return "na";
        }
    }

    function getManagers() external view returns(address[] memory){
        return(managers);
    }

    function getEmployees() external view returns(address[] memory){
        return(Employees);
    }

    function getMerchants() external view returns(address[] memory){
        return(Merchants);
    }

    function getRoles() external view returns(string[] memory){
        return roleNames;
    }

    function getTransactions() external view returns(Transaction[] memory){
        return Transactions;
    }
    function withdraw() external onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }


//data structure for whitelsted merchants
    struct Merchant{
        uint id;
        string name;//merchant name
        bool active;//active or inactive
    }
    mapping (address=>Merchant) public MerchantProfile;//each employee have one role
    address[] public Merchants;
//data structure for large amount transactions
    enum Status{INITIATED,APPROVED,DISAPPROVED,EXECUTED }
    struct Transaction {
            address employee;//from employee
            address merchants;//to merchants
            uint256 value;
            Status txStatus;//active or inactive
        }
    
    Transaction[] public Transactions;
    
    
//constructor defines owner, managers, required confirm
    constructor(address[] memory _mgrs,address _mappingContract) {
        require(_mgrs.length > 0);
        owner=msg.sender;
        managers = _mgrs;
        for(uint i=0;i<_mgrs.length;i++){
            isManager[_mgrs[i]]=true;
        }
        MappingContract(_mappingContract).addAccount(address(this));//add the Account contract address to mapping contract
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyManager() {
        require(isManager[msg.sender]);
        _;
    }

    modifier onlyEmployee() {
        require(isManager[msg.sender]||EmployeeProfile[msg.sender].active); //either a manager or a employee can initiate
        _;
    }

    function changeOwner(address _newowner) external onlyOwner{
            owner=_newowner;
        }

    receive() external payable {}
    fallback() external payable {}


//functions to manage roles and budget for different roles, only Owner can do these
    

    function addRole(string memory _role, uint _budget) public onlyOwner{
        roleNames.push(_role);
        roleBudget[_role]=_budget;
        roleActive[_role]=true;
    }

    function addRoles(string[] memory _roles, uint _budget) external onlyOwner{
        for(uint i=0;i<_roles.length;i++){
            addRole(_roles[i],_budget);
        }
    }

    function changeBudget(string memory _role, uint _amt) external onlyOwner{
        roleBudget[_role] = _amt;
    }

    function deactiveRole(string memory _role) onlyOwner public {
        roleActive[_role]=false;
    }
  

    function roleName(uint roleId) public view returns(string memory){
        return roleNames[roleId];
    }

// functions to manage merchants
    function isMerchant(address _employee) internal view returns(bool){
        for(uint i=0;i<Merchants.length;i++){
            if(Merchants[i]==_employee){
                return true;
            }
        }
        return false;
    }
    

    function addMerchant(string memory  _name, address _merchant) external onlyOwner{
        require(!isMerchant(_merchant),"Merchant already exist");
        uint merchantId=Merchants.length;
        Merchants.push(_merchant);
        MerchantProfile[_merchant]=Merchant(merchantId,_name,true);
    }

    function activeMerchant(address _merchant) external onlyOwner{
        MerchantProfile[_merchant].active=!MerchantProfile[_merchant].active; //if originally active, this deactive. vise-verse.
    }


//functions to manage employee
    function isEmployee(address _employee) public view returns(bool){
        for(uint i=0;i<Employees.length;i++){
            if(Employees[i]==_employee){
                return true;
            }
        }
        return false;
    }

    function isMymanager(address _employee, address _manager) internal view returns(bool){
        if(EmployeeProfile[_employee].myManager==_manager){
            return true;
        }else{
            return false;
        }
    }

 
    
  

    function addEmployee(address _employee,string memory _name, uint _roleId) public onlyManager{
        require(roleActive[roleNames[_roleId]],"role does not exist");
        require(!isEmployee(_employee),"employee already exist");
        uint employeeId=Employees.length;
        Employees.push(_employee);
        uint deploytime = block.timestamp;
        EmployeeProfile[_employee]=Employee(employeeId,_name,_roleId,msg.sender,0,0,true,deploytime);
    }

    function addEmployees(address[] memory _employees, string[] memory _names, uint _roleId) public onlyManager { //add employees in batch
        require(_employees.length==_names.length);
        for(uint i=0;i<_employees.length;i++){
            addEmployee(_employees[i],_names[i],_roleId);
        }
    }

    function activeEmployee(address _employee) onlyManager public { //change active status
        require(isEmployee(_employee),"employee does not exist");
        require(isMymanager(_employee,msg.sender),"you are not manager of the employee");
        EmployeeProfile[_employee].active=!EmployeeProfile[_employee].active; //if originally active, this deactive. vise-verse.
    }

    function changeRole(address _employee, uint _newRole) onlyManager public {
        require(isEmployee(_employee),"employee does not exist");
        require(_newRole<=roleNames.length,"role does not exist");
        require(isMymanager(_employee,msg.sender),"you are not manager of the employee");
        EmployeeProfile[_employee].roleId=_newRole;
    }

    function changeManager(address _employee, address _manager) onlyManager public {
        require(isEmployee(_employee),"employee does not exist");
        require(isManager[_manager],"manager does not exist");
        require(isMymanager(_employee,msg.sender),"you are not manager of the employee");
        EmployeeProfile[_employee].myManager=_manager;
    }



//functions to manage transaction, only employee can operate
    function updateSpent(address _employee) internal {
        require(isEmployee(_employee),"not employee");
        uint currentTime=block.timestamp;
        uint lastRefersh=EmployeeProfile[_employee].lastRefresh;
        if(currentTime>lastRefersh+30 days){
            EmployeeProfile[_employee].totalSpent+=EmployeeProfile[_employee].spent;//add the last spent to total spent amount
            EmployeeProfile[_employee].spent=0;//set the current spent=0
            for(uint i=30;i<100000;i+=30){
                if(lastRefersh+i*1 days>currentTime){
                    EmployeeProfile[_employee].lastRefresh=lastRefersh+(i-1)*1 days;// refersh the "last refersh to the latest month"
                }
            }
        }

    }

    


    function submitTransaction(address _merchant, uint _value) onlyEmployee public {
        require(EmployeeProfile[msg.sender].active,"not active employee");
        require(address(this).balance>=_value,"not enought balance");
        require(isMerchant(_merchant),"Merchant does not exist");
        updateSpent(msg.sender);//refersh spent amount for the employee;
        uint myRoleId=EmployeeProfile[msg.sender].roleId;
        uint myBudget =roleBudget[roleNames[myRoleId]];
        uint mySpent =EmployeeProfile[msg.sender].spent;
        uint myCredit = myBudget-mySpent;
        if(_value<=myCredit){  //if it is small amount then transaction are conducted directly, or it will be added to the tx pool for approval
            payable(_merchant).transfer(_value);
        }else{
            addLargeTx(msg.sender,_merchant,_value);
        }
    }

     


//functions for Large tx confirm and execution
    function addLargeTx(address _employee,address _merchant,  uint _value) internal {
            Transactions.push(Transaction(_employee,_merchant,_value,Status.INITIATED));
    }   


    function approveLargeTx(uint _id) onlyManager public {
        address employee=Transactions[_id].employee;
        require(isMymanager(employee,msg.sender),"not employee's manager"); //only employee's manager can approve
        Transactions[_id].txStatus=Status.APPROVED;
        executeLargeTx(_id);
    }

    function disApproveLargeTx(uint _id) onlyManager public {
        address employee=Transactions[_id].employee;
        require(isMymanager(employee,msg.sender),"not employee's manager"); //only employee's manager can approve
        Transactions[_id].txStatus=Status.DISAPPROVED;
        
    }

    function executeLargeTx(uint _id) internal{
        require(Transactions[_id].txStatus==Status.APPROVED,"transaction not approved");
        address merchant=Transactions[_id].merchants;
        uint value=Transactions[_id].value;
        payable(merchant).transfer(value);
        Transactions[_id].txStatus=Status.EXECUTED;
    }


//to do: need a time-related function to reset spent of each employee

}