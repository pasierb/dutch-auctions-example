import React from "react";
import { Modal } from "antd";
import { authenticate, verifySession } from "../api";
import LoginForm from "./LoginForm";

const STORAGE_KEY = "session";
const SessionContext = React.createContext({});

class SessionProvider extends React.Component {
  state = {
    username: undefined,
    uid: undefined,
    token: undefined,
    modalOpen: false
  };

  componentDidMount() {
    this.restoreSession();
  }

  restoreSession() {
    if (typeof localStorage === "object") {
      const rawSession = localStorage.getItem(STORAGE_KEY);

      if (rawSession) {
        try {
          const session = JSON.parse(rawSession);

          verifySession(session.token).then(res => {
            if (res.ok) {
              this.setState(session);
            } else {
              this.signOut();
            }
          });
        } catch (e) {}
      }
    }
  }

  signIn = () => {
    this.setState({ modalOpen: true });
  };

  signOut = () => {
    this.setState(
      {
        token: null,
        username: null,
        uid: null
      },
      () => {
        localStorage.removeItem(STORAGE_KEY);
      }
    );
  };

  ensureSignedIn = cb => (...args) => {
    const { uid } = this.state;

    if (uid) {
      cb(...args);
    } else {
      this.signIn();
    }
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  handleSubmit = ({ username }) => {
    authenticate(username).then(session => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      this.setState({
        modalOpen: false,
        ...session
      });
    });
  };

  render() {
    return (
      <SessionContext.Provider
        value={{
          state: this.state,
          actions: {
            handleSubmit: this.handleSubmit,
            signIn: this.signIn,
            signOut: this.signOut,
            ensureSignedIn: this.ensureSignedIn
          }
        }}
      >
        {this.props.children}

        <Modal
          title="Sign in"
          visible={this.state.modalOpen}
          onCancel={this.closeModal}
          footer={null}
          closable
        >
          <LoginForm onSubmit={this.handleSubmit} />
        </Modal>
      </SessionContext.Provider>
    );
  }
}

const SessionConsumer = SessionContext.Consumer;

export { SessionConsumer };
export default SessionProvider;
