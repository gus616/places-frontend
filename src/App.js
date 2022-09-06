import React, { Suspense } from 'react';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';


const Users = React.lazy(()=> import('./user/pages/Users'));
const NewPlace = React.lazy(()=> import('./places/pages/NewPlace'));
const UsersPlaces = React.lazy(()=> import('./places/pages/UsersPlaces'));
const UpdatePlace = React.lazy(()=> import('./places/pages/UpdatePlace'));
const Auth = React.lazy(()=> import('./user/pages/Auth'));

const App = () => {  
 const {token, login, logout, userId} = useAuth();
  let routes;

  if(token) {
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
  <AuthContext.Provider value={{isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout}}>
    <Router>
      <MainNavigation />
      <main>
        <Suspense fallback={<div className="center"><LoadingSpinner /></div>}>{routes}</Suspense>
      </main>
    </Router>;
  </AuthContext.Provider>
  )
}

export default App;
