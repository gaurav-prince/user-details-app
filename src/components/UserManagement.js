import React, { useState, useEffect } from "react";
import UsersTab from "./UsersTab";
import AddUser from "./AddUser";
import { AiOutlineEye } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { TiDeleteOutline } from "react-icons/ti";
import DeleteUser from "./DeleteUser";

const UserManagement = () => {
  const [data, setData] = useState([]);
  const [userModal, setUserModal] = useState(false);
  const [userButton, setUserButton] = useState('Add User');
  const [userDetails, setUserDetails] = useState({});
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  let deleteComponent = deleteStatus?<DeleteUser/>:null;

  const fetchApi = async () => {
    try {
      let dataFetch = await fetch("http://localhost:3000/viewUsers")
      let json = await dataFetch.json();
      return { success: true, data: json };
      // .then((response) => await response.json())
      // .then((userdata) => {
      //   console.log(userdata);
      //   setData(userdata);
      // })
      // .catch((error) => {
      //   // handle the error
      // });
    }
    catch (error) {
      console.log(error);
      return { success: false };
    }
  };

  useEffect(() => {
    (async () => {
      setUserLoaded(false);
      let res = await fetchApi();
      if (res.success) {
        console.log('res data', res.data);
        setData(res.data);
        setUserLoaded(true);
      }
    })();
  }, []);

  const createUser = (props) => {
    console.log('userModal Init:', props);
    setUserDetails(props);
    setUserModal(!userModal);
    if (userButton == 'Add User') {
      setUserButton('Back');
    }
    else {
      setUserButton('Add User');
    }
    console.log('userModal set:', userModal);
    // getComponent();
  };
  let getComponent= () => {
    console.log('userDetails in getComponents', userDetails);
    if (userModal) {  // show the modal if state showModal is true
      return <AddUser key={userDetails} />;
    }
    else {
      return (
      <div className="container">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <td>id</td>
            <td>Name</td>
            <td>Email</td>
            <td>Customer</td>
            <td>Roles</td>
            <td>Trial User</td>
          </tr>
        </thead>
        <tbody>{listElement}</tbody>
      </table></div>);
    }
  }

  let showDelete = (user) => {
    console.log('userDetails in getComponents', user);
    // setDeleteStatus(!deleteStatus);
    fetch("http://localhost:3000/deleteUser/" + user.id, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
      .then(function (res) {
        console.log(res);
        setDeleteStatus(!deleteStatus);
        fetchApi();
      })
      .catch(function (res) {
        console.log(res);
      });
    
  }
  var listElement = data.userData
    ? data.userData.map((user) => {
        return (
          <tr key={user.id}>
          <td className="item">{user.id}</td>
            <td className="item">{user.name}</td>
            <td className="item">{user.email}</td>
            <td className="item">{user.customer}</td>
            <td className="item">{user.roles.toString()}</td>
            <td className="item">{user.isTrial}</td>
            <td className="item"><AiOutlineEye/> <BsPencilSquare onClick={() => createUser(user)}/> <TiDeleteOutline onClick={() => showDelete(user)}/>
            </td>
          </tr>
        );
      })
    : null;

  return (
    <div className="user-manage">
      <UsersTab />
      <br/>
      <div className="btn-group">
      <button className="btn btn-outline-secondary" onClick={createUser} label="Action">{userButton}</button>
      </div>
      <div>
        {userLoaded ? (
          <div>
            {getComponent()}
          </div>
        ) : (
          <p>No user found, please try again</p>
        )}
      </div>
      
      {deleteComponent}
    </div>
  );
};

export default UserManagement;
