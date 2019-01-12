import React from "react";
import App, { Container } from "next/app";
import { Layout } from "antd";

import SessionProvider from "../client/components/SessionProvider";
import Header from "../client/components/Header";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <SessionProvider>
        <Container>
          <Layout style={{ minHeight: '100vh' }}>
            <Header />
            <Layout.Content style={{ padding: '1em' }}>
              <Component {...pageProps} />
            </Layout.Content>
            <Layout.Footer>
              Dutch auctions app
            </Layout.Footer>
          </Layout>
        </Container>
      </SessionProvider>
    );
  }
}

export default MyApp;
