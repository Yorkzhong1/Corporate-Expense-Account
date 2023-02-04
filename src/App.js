import logo from './logo.svg';
import './App.css';

function App() {

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">Dashboard</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Account Management
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Account Creation</a></li>
                  <li><a className="dropdown-item" href="#">Manage Managers</a></li>
                  <li><a className="dropdown-item" href="#">Manage Roles</a></li>
                  <li><a className="dropdown-item" href="#">Manage Merchants</a></li>
                  
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Manager
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Manage Employee</a></li>
                  <li><a className="dropdown-item" href="#">Approve Transactions</a></li>
                  
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Employee</a>
              </li>

              
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
          
        </div>
      </nav>
    </div>
  );
}

export default App;
