import { shallow, mount } from "enzyme";
import AuctionListItem from "./AuctionListItem";
import SessionProvider from "./SessionProvider";
import { Button } from "antd";

describe("AuctionListItem", () => {
  let auction;

  beforeEach(() => {
    auction = {
      id: "123",
      status: "active",
      currentPrice: 150,
      userId: "321"
    };
  });

  it("renders without crashing", () => {
    shallow(<AuctionListItem auction={auction} />);
  });

  it("renders bid button", () => {
    const wrapper = mount(
      <SessionProvider>
        <AuctionListItem auction={auction} />
      </SessionProvider>
    );
    const button = wrapper.find(Button);

    expect(button.text()).toEqual(auction.currentPrice + "");
    expect(button.prop("disabled")).toBeFalsy();
  });

  it("renders expired button", () => {
    auction.status = 'expired';

    const wrapper = mount(
      <SessionProvider>
        <AuctionListItem auction={auction} />
      </SessionProvider>
    );
    const button = wrapper.find(Button);

    expect(button.text()).toEqual("Expired");
    expect(button.prop("disabled")).toBeTruthy();
  });

  it("renders sold button", () => {
    auction.status = 'sold';

    const wrapper = mount(
      <SessionProvider>
        <AuctionListItem auction={auction} />
      </SessionProvider>
    );
    const button = wrapper.find(Button);

    expect(button.text()).toEqual("Sold");
    expect(button.prop("disabled")).toBeTruthy();
  });
});
