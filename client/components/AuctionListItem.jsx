import React from "react";
import List from "antd/lib/list";
import Button from "antd/lib/button";
import { SessionConsumer } from "./SessionProvider";
import Countdown from "./Countdown";

const AuctionListItem = props => {
  const { auction, onBid } = props;

  return (
    <SessionConsumer>
      {({ state }) => {
        const buttons = [];

        const handleClick = () => onBid(auction);

        switch (auction.status) {
          case "active": {
            const isOwner = state.uid && state.uid === auction.userId;
            buttons.push(
              <Button
                onClick={handleClick}
                type="primary"
                title={isOwner && "Can not bid on your own auction"}
                disabled={isOwner}
              >
                {auction.currentPrice}
              </Button>
            );
            break;
          }
          case "pending": {
            buttons.push(<Button disabled>Pending</Button>);
            break;
          }
          case "expired": {
            buttons.push(<Button disabled>Expired</Button>);
            break;
          }
          case "sold": {
            buttons.push(<Button disabled>Sold</Button>);
            break;
          }
        }

        return (
          <List.Item actions={buttons}>
            <List.Item.Meta title={auction.name} />
            <div>
              {auction.status === "active" && (
                <Countdown date={new Date(auction.willExpireAt)} />
              )}
            </div>
          </List.Item>
        );
      }}
    </SessionConsumer>
  );
};

export default AuctionListItem;
