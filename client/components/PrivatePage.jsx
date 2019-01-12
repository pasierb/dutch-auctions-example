import React from "react";
import { SessionConsumer } from "./SessionProvider";
import LoginForm from "./LoginForm";

const PrivatePage = props => (
  <SessionConsumer>
    {({ state, actions }) =>
      state.uid ? props.children : <LoginForm onSubmit={actions.handleSubmit} />
    }
  </SessionConsumer>
);

export default PrivatePage;
