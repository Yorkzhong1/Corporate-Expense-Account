Corporate Expense Manager

This is an app that help corporate to manage their employee expenses. The backend are on blockchain so it is transparent.

The problem:
Managing employee expenses is troublesome and often can cost much, especially for small companies, who need to hire a dedicated accountant to manage that.

The solution:
Using blockchain technology, companies can manage their employee expenses automatically. It also adds transparency as all the transactions can be found in blockchain, this will simplify management as well as auditing, thus overall it reduces company cost.

The design:
The company account contract is a wallet contract with below functions:

three basic roles: owner, manager, employee;

 - Owner can deploy a contract for the company, and add roles, whitelist merchants and managers,set monthly spending budget for different role;
 - Managers can add their employee, change employees, and approve employee submitted transaction which is over their monthly budget;
 - employee can submit transactions, if the amount is less than their monthly budget, they can proceed directly. If it is over, then the transactions needs to be approved by manager.






