import { shallow } from "enzyme";
import Countdown from "./Countdown";

describe("Countdown", () => {
  it("renders minutes and seconds", () => {
    const date = new Date(Date.now() + 195003); // 3m 15s
    const wrapper = shallow(<Countdown date={date} />);

    expect(wrapper.text()).toEqual("3m 15s");
  });

  it('render 0m 0s if past date', () => {
    const date = new Date(Date.now() - 10000); // 3m 15s
    const wrapper = shallow(<Countdown date={date} />);

    expect(wrapper.text()).toEqual("0m 0s");
  })
});
