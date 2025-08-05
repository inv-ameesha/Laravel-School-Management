import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();//authcontext declared used to store authentication data

export const AuthProvider = ({ children }) => {//to wrap the entire app,it gives access to the authcontext to all its children
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');//user is obtained from localstorage
    return savedUser ? JSON.parse(savedUser) : null;//if user exist its parsed to json
    //bcz on saving an object its saved as string...so on retrieving it back the json must be parsed from string
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  useEffect(() => {
    if (user) {//once the user logged in the user is set to local storage
      localStorage.setItem('user', JSON.stringify(user));
    } else {//else its removed
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);
  
  // Simple logout function to clear auth state (NO hooks here!)
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    //user, setUser, token, setToken, logout : make all these available to all the children
    <AuthContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
