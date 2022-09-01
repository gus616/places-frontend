import React, { useState, useCallback} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UsersPlaces from './places/pages/UsersPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';

const App = () => {  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId ] = useState(null);

  const login = useCallback((uid)=> {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(()=> {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if(isLoggedIn) {
    routes = (
      <Routes>
         <Route path="/" element={<Users/>}/>
          <Route path="/:userId/places" element={<UsersPlaces/>}/>        
          <Route path="/places/new" element={<NewPlace/>}/>
          <Route path="/places/:placeId" element={<UpdatePlace/>}/>
          <Route path="*" element={<Navigate to="/"/>}/>      
      </Routes>

      );
  } else {
    routes = (
      <Routes>
         <Route path="/" element={<Users/>}/>
         <Route path="/auth" element={<Auth />}/>
         <Route path="/:userId/places" element={<UsersPlaces/>}/>  
         <Route path="/places/:placeId" element={<UpdatePlace/>}/>
         <Route path="*" element={<Navigate to="/auth"/>}/>   
      </Routes>);
  }

  return (
  <AuthContext.Provider value={{isLoggedIn: isLoggedIn, userId: userId, login: login, logout: logout}}>
    <Router>
      <MainNavigation />
      <main>
        {routes}
      </main>
    </Router>;
  </AuthContext.Provider>
  )
}

export default App;
