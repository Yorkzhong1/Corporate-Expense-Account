This is an app that help corporate to manage their employee expenses. The backend are on blockchain so it is transparent.

Employee Expense Manager
2023/02/01 -by Lanli


The problem:
Managing employee expenses is troublesome and often can cost much, especially for small companies, who need to hire a dedicated accountant to manage that.

The solution:
Using blockchain technology, companies can manage their employee expenses automatically. It also adds transparency as all the transactions can be found in blockchain, this will simplify management as well as auditing, thus overall it reduces company cost.

The design:

1/ core function:
The company account contract is a multi-sig wallet with below functions:
Manager can deploy a contract for the company.
For managers, functions include:
Add and delete employee(name and wallet address), employee can have different types (for example, sales, customer service)
Set and change employee budget for each month


For spending over the monthly budget, can have approval process
Can add or change approvers and approval rules(for example, 2 out of 4 can approve)
For employee, functions include:
Spend money within their monthly budget
If need to spend money above their monthly budget, can submit transaction and get approved
	2/ the contract is upgradable to implement new functions in the future

	3/ additional function:
Employee: historical of their spending, and budget left for the month
Manager:
Overall company historical spending and  balance let
Employee’s historical spending
Withdraw fund: can specify amount to be withdraw. 

	4/ Future function (not included in this version):
Add whitelisted merchants that can spend money(future function, not included in the demo)
Can spend all ERC 20 token
Manager can use existing fund to save in lending protocol to generate interest




