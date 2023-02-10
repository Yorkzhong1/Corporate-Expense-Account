Corporate Expense Manager

demo website: https://corporate-expense-account.vercel.app/

Introduction video: https://raw.githubusercontent.com/Yorkzhong1/Corporate-Expense-Account/master/Introduction-Long.mp4



This is an app that help corporate to manage their employee expenses. The backend are on blockchain so it is transparent.

Problem:
Managing employee expenses is troublesome and often can cost much, especially for small companies, who need to hire a dedicated accountant to manage that.

Solution:
Using blockchain technology, companies can manage their employee expenses automatically. It also adds transparency as all the transactions can be found in blockchain, this will simplify management as well as auditing, thus overall it reduces company cost.

Design:
The company account contract is a wallet contract with below functions:

three basic roles: owner, manager, employee;

 - Owner can deploy a contract for the company, and add roles, whitelist merchants and managers,set monthly spending budget for different role;
 - Managers can add their employee, change employees, and approve employee submitted transaction which is over their monthly budget;
 - employee can submit transactions, if the amount is less than their monthly budget, they can proceed directly. If it is over, then the transactions needs to be approved by manager.

Technical details:
 - a smart contract is used to save all the data and logics, basically working as a back-end server
 - a React front-end is created for all the functions.





