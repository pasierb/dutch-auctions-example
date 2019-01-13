const next = require("next");
const { configure } = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

next({});
configure({ adapter: new Adapter() });
