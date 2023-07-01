import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookie from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    showError: false,
    ErrorMessage: '',
  }

  loginSuccessMethod = jwtToken => {
    Cookie.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  loginFailureMethod = ErrorMsg => {
    this.setState({
      showError: true,
      ErrorMessage: ErrorMsg,
    })
  }

  submitUserDetails = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username: usernameInput, password: passwordInput}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const responseData = await response.json()
    console.log(responseData)
    this.setState({
      usernameInput: '',
      passwordInput: '',
    })
    if (response.ok) {
      this.loginSuccessMethod(responseData.jwt_token)
    } else {
      this.loginFailureMethod(responseData.error_msg)
    }
  }

  listenUserName = event => {
    this.setState({usernameInput: event.target.value})
  }

  renderUserNameInput = () => {
    const {usernameInput} = this.state
    return (
      <>
        <label className="label" htmlFor="userName">
          USERNAME
        </label>
        <input
          id="userName"
          className="user-name-input"
          placeholder="Username"
          type="text"
          onChange={this.listenUserName}
          value={usernameInput}
        />
      </>
    )
  }

  listenUserPassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  onClickEnter = () => this.submitUserDetails()

  renderUserPassword = () => {
    const {passwordInput} = this.state
    return (
      <>
        <label className="label" htmlFor="userPassword">
          PASSWORD
        </label>
        <input
          id="userPassword"
          className="user-name-input"
          placeholder="Password"
          type="password"
          onChange={this.listenUserPassword}
          value={passwordInput}
          onKeyDown={this.onClickEnter}
        />
      </>
    )
  }

  render() {
    const {showError, ErrorMessage} = this.state
    const token = Cookie.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.submitUserDetails}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
            alt="website logo"
            className="website-logo"
          />
          <div className="input-container">{this.renderUserNameInput()}</div>
          <div className="input-container">{this.renderUserPassword()}</div>
          <button className="button" type="submit">
            Login
          </button>
          {showError && <p className="Error-Msg">*{ErrorMessage}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
