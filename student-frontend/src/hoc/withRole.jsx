import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const withRole = (WrappedComponent, allowedRoles) => {
  //WrappedComponent : where you need to show conditionally
  return (props) => {
    const { user } = useContext(AuthContext);//get the current user
    //get roles,if allowedRoles is array let it be else if string turn to lowercase and get role
    //roles like admin,teacher etc
    const roles = Array.isArray(allowedRoles)
      ? allowedRoles.map(r => r.toLowerCase())
      : [allowedRoles.toLowerCase()];
    
    const userRole = user?.role?.toLowerCase();//get the user's role

    if (user && roles.includes(userRole)) {//if user exist and role in allowed roles then pass props
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withRole;
