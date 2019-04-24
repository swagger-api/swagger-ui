import React from "react";

export default class UsernamePassword extends React.Component {
  state = {
    errorMessage: "",
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
        .then(
          json => {
            try {
              if (json.error) {
                this.setState({ errorMessage: json.error.description });
              } else {
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
                this.setState({ errorMessage: "" });
              }
            } catch (error) {
              console.log(error);
              this.setState({ errorMessage: "An error has occurred!" });
            }
          },
          error => {
            console.log(error);
            this.setState({ errorMessage: "An error has occurred!" });
          }
        );
    }
  };

  render() {
    const {
      errorMessage,
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
            The authentication scheme consists in performing a POST to the Login
            URI with the provided credentials (username and password). If the
            requests succeeds, the returned userToken must be sent in the
            Authorization header for all requests.
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
        {errorMessage !== "" ? (
          <div
            style={{
              color: "red",
              fontSize: "12px",
              paddingTop: "5px"
            }}
          >
            {errorMessage}
          </div>
        ) : null}
      </div>
    );
  }
}
