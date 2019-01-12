import React from "react";
import { Modal, Card, Button, Row, Col } from "antd";
import { subscribe, unsubscribe } from "../client/ws";
import { SessionConsumer } from "../client/components/SessionProvider";
import PrivatePage from "../client/components/PrivatePage";
import AuctionForm from "../client/components/AuctionForm";
import AuctionsTable from "../client/components/AuctionsTable";
import {
  postAuction,
  patchAuction,
  getAuctions,
  postAuctionStart
} from "../client/api";

class MyAuctions extends React.Component {
  state = {
    modalOpen: false,
    selectedAuction: null,
    auctions: [],
    loaded: false,
    loading: false
  };

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

  loadAuctions = query => {
    getAuctions(query).then(({ auctions }) => {
      this.setState({
        auctions,
        loaded: true,
        loading: false
      });
    });
  };

  handleSubmitAuction = (token, cb) => auction => {
    (auction.id ? patchAuction : postAuction)({ token, auction })
      .then(this.handleCancelAuction)
      .then(cb);
  };

  handleEditAuction = auction => {
    this.setState({
      modalOpen: true,
      selectedAuction: auction
    });
  };

  handleStartAuction = (token, cb) => auction => {
    postAuctionStart({ auction, token }).then(cb);
  };

  handleCancelAuction = () => {
    this.setState({
      modalOpen: false,
      selectedAuction: null
    });
  };

  render() {
    const {
      auctions,
      loaded,
      loading,
      selectedAuction,
      modalOpen
    } = this.state;

    return (
      <PrivatePage>
        <SessionConsumer>
          {({ state }) => {
            const refresh = () => this.loadAuctions({ userId: state.uid });
            const handleStartAuction = this.handleStartAuction(
              state.token,
              refresh
            );
            const handleSubmitAuction = this.handleSubmitAuction(
              state.token,
              refresh
            );

            if (!loaded && !loading) {
              refresh();
            }

            return (
              <React.Fragment>
                <div style={{ textAlign: "right", padding: '1em 0' }}>
                  <Button
                    onClick={() => this.handleEditAuction()}
                    type="primary"
                  >
                    Add
                  </Button>
                </div>

                <Card>
                  <AuctionsTable
                    auctions={auctions}
                    loading={loading}
                    onStart={handleStartAuction}
                    onEdit={this.handleEditAuction}
                  />
                </Card>

                <Modal
                  visible={modalOpen}
                  onCancel={this.handleCancelAuction}
                  footer={null}
                >
                  <AuctionForm
                    key={selectedAuction}
                    auction={selectedAuction}
                    onSubmit={handleSubmitAuction}
                  />
                </Modal>
              </React.Fragment>
            );
          }}
        </SessionConsumer>
      </PrivatePage>
    );
  }
}

export default MyAuctions;
