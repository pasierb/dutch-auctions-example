import React from "react";
import { Table, Button, Tag } from "antd";
import { SessionConsumer } from "./SessionProvider";

const statusColor = {
  pending: "blue",
  active: "green",
  sold: "gold",
  expired: "red"
};

const AuctionsTable = props => {
  const { auctions, uid, onEdit, onStart, ...rest } = props;

  return (
    <SessionConsumer>
      {({ state }) => (
        <Table
          {...rest}
          dataSource={auctions}
          pagination={false}
          rowKey={a => a.id}
        >
          <Table.Column key="name" dataIndex="name" title="Name" />
          <Table.Column
            key="status"
            dataIndex="status"
            title="Status"
            render={status => <Tag color={statusColor[status]}>{status}</Tag>}
          />
          <Table.Column
            key="startPrice"
            dataIndex="startPrice"
            title="Start price"
          />
          <Table.Column
            key="currentPrice"
            dataIndex="currentPrice"
            title="Current price"
          />
          <Table.Column
            key="buyer"
            dataIndex="buyer"
            title="Buyer"
            render={buyer => buyer && buyer.username}
          />
          <Table.Column
            key="actions"
            render={(_, auction) => {
              if (state.uid !== auction.userId) {
                return null;
              }

              const { status } = auction;
              const canEdit = status === "pending" || status === "expired";

              return (
                <React.Fragment>
                  {canEdit && onEdit && (
                    <Button onClick={() => onEdit(auction)}>edit</Button>
                  )}
                  {canEdit && onStart && (
                    <Button onClick={() => onStart(auction)}>start</Button>
                  )}
                </React.Fragment>
              );
            }}
          />
        </Table>
      )}
    </SessionConsumer>
  );
};

export default AuctionsTable;
