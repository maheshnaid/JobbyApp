import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import AllJobs from './components/AllJobs'
import JobItemRoute from './components/JobItemRoute'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={AllJobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemRoute} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" component={NotFound} />
  </Switch>
)

export default App
