import React from "react";
import { Card } from "antd";
import { subscribe, unsubscribe } from "../client/ws";
import { getAuctions, postAuctionBid } from "../client/api";
import AuctionList from "../client/components/AuctionList";
import { SessionConsumer } from "../client/components/SessionProvider";

class RunningAuctions extends React.Component {
  static async getInitialProps() {
    const { auctions } = await getAuctions({ status: "active" });

    return { auctions };
  }

  constructor(props) {
    super(props);

    this.state = {
      auctions: props.auctions || []
    };
  }

  componentDidMount() {
    subscribe(this.handleMessage);
  }

  componentWillUnmount() {
    unsubscribe(this.handleMessage);
  }

  handleMessage = ({ payload }) => {
    this.setState(state => {
      const { auctions } = state;
      const index = auctions.findIndex(a => a.id === payload.id);
      let newAuctions;

      if (index < 0) {
        newAuctions = [...auctions, payload];
      } else {
        newAuctions = [
          ...auctions.slice(0, index),
          payload,
          ...auctions.slice(index + 1, auctions.length)
        ];
      }

      return Object.assign({}, state, { auctions: newAuctions });
    });
  };

  handleBid = token => auction => {
    postAuctionBid({ token, auction });
  };

  render() {
    return (
      <SessionConsumer>
        {({ state }) => (
          <Card title="Active auctions">
            <AuctionList
              auctions={this.state.auctions}
              onBid={this.handleBid(state.token)}
            />
          </Card>
        )}
      </SessionConsumer>
    );
  }
}

export default RunningAuctions;
