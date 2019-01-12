import React from "react";
import Link from "next/link";
import { Layout, Menu, Button } from "antd";
import { SessionConsumer } from "./SessionProvider";

import "./Header.css";

const Header = props => {
  return (
    <SessionConsumer>
      {({ state, actions }) => (
        <Layout.Header className="da-header">
          <div>
            <Menu mode="horizontal" theme="dark" style={{ lineHeight: "64px" }}>
              <Menu.Item>
                <Link href="/">
                  <a>Active auctions</a>
                </Link>
              </Menu.Item>
              {state.uid && (
                <Menu.Item>
                  <Link href="/myAuctions">
                    <a>My auctions</a>
                  </Link>
                </Menu.Item>
              )}
            </Menu>
          </div>
          <div>
            {!state.uid ? (
              <Button onClick={actions.signIn} ghost>
                Sign in
              </Button>
            ) : (
              <Button onClick={actions.signOut} ghost>
                Sign out
              </Button>
            )}
          </div>
        </Layout.Header>
      )}
    </SessionConsumer>
  );
};

export default Header;
