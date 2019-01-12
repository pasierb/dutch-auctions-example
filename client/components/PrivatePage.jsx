import React from "react";
import { Card, Row, Col } from "antd";
import { SessionConsumer } from "./SessionProvider";
import LoginForm from "./LoginForm";

const PrivatePage = props => (
  <SessionConsumer>
    {({ state, actions }) =>
      state.uid ? (
        props.children
      ) : (
        <Row justify="center" type="flex">
          <Col xs={20} sm={16} md={12} lg={10} xl={8}>
            <Card>
              <LoginForm onSubmit={actions.handleSubmit} />
            </Card>
          </Col>
        </Row>
      )
    }
  </SessionConsumer>
);

export default PrivatePage;
