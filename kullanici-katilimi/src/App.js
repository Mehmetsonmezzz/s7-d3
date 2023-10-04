import "./App.css";
import Form from "./compenents/Form";
import { useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const addUser = (user) => {
    setUsers([...users, user]);
  };

  return (
    <>
      <div>Users</div>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.first_name} {user.email}
          </li>
        ))}
      </ul>
      <div>Form</div>
      <Form addUser={addUser} />
    </>
  );
}

export default App;
