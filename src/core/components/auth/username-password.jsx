import React from "react";

export default class UsernamePassword extends React.Component {
  state = {
    username: "admin",
    updateUsername: e => {
      this.setState({
        username: e.target.value
      });
    },
    password: "seventh",
    updatePassword: e => {
      this.setState({
        password: e.target.value
      });
    },
    login: () => {
      fetch("/api/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: document.getElementById("login-username").value,
          password: document.getElementById("login-password").value
        })
      })
        .then(response => response.json())
        .then(json => {
          document.getElementById("input-key").value = `bearer ${
            json.login.userToken
          }`;
          let { authActions } = this.props;
          authActions.authorize({
            jwt: {
              name: "jwt",
              schema: {
                type: "apiKey",
                description:
                  'Authentication JWT. <br> Sample: bearer "userToken" <br> Get userToken in api POST /login. <p>',
                in: "header",
                name: "Authorization"
              },
              value: document.getElementById("input-key").value
            }
          });
        });
    }
  };

  render() {
    const {
      login,
      username,
      updateUsername,
      password,
      updatePassword
    } = this.state;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px 20px"
        }}
      >
        <h4>Username and Password</h4>
        <div className="markdown">
          <p>
            This authentication mode will perform a POST for the api with the
            login information (username and password), if it succeeds in
            executing the request successfully, it will collocate in the input
            jwt below the token.
          </p>
        </div>
        <div
          className="wrapper"
          style={{
            padding: "0px"
          }}
        >
          <label>Username:</label>
          <section>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={updateUsername}
            />
          </section>
        </div>
        <div
          className="wrapper"
          style={{
            padding: "0px"
          }}
        >
          <label>Password:</label>
          <section>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={updatePassword}
            />
          </section>
        </div>
        <div
          className="wrapper"
          style={{
            padding: "0px"
          }}
        >
          <button
            type="button"
            className="btn modal-btn auth authorize button"
            onClick={login}
          >
            Login
          </button>
        </div>
      </div>
    );
  }
}
