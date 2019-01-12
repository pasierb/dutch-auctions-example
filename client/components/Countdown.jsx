import React from "react";

class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: props.date.getTime() - Date.now()
    };
  }

  componentDidMount() {
    const { date } = this.props;

    this.handle = setInterval(() => {
      this.setState({
        distance: date.getTime() - Date.now()
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.handle);
  }

  render() {
    const { distance } = this.state;
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return (
      <span>
        {minutes}m {seconds}s
      </span>
    );
  }
}

export default Countdown;
