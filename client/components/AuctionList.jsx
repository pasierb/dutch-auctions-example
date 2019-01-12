import React from "react";
import AuctionListItem from "./AuctionListItem";
import { List } from "antd";
import { SessionConsumer } from "./SessionProvider";

const AuctionList = props => {
  const { auctions, onBid } = props;

  return (
    <SessionConsumer>
      {({ state, actions }) => (
        <List
          dataSource={auctions}
          renderItem={auction => (
            <AuctionListItem
              onBid={actions.ensureSignedIn(onBid)}
              auction={auction}
            />
          )}
        />
      )}
    </SessionConsumer>
  );
};

export default AuctionList;
