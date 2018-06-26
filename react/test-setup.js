import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { JSDOM } from 'jsdom'

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')

global.window = jsdom.window
global.document = window.document
global.__RUNTIME__ = {
  pages: {
    'store/search': '/path',
  },
}

Enzyme.configure({ adapter: new Adapter() })

window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {},
    }
  }
