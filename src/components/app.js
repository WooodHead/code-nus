import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Home from '../routes/home';
import Projects from '../routes/projects';
import Users from '../routes/users';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = (e) => {
    this.currentUrl = e.url;
  };

  render(props, state) {
    return (
      <div id="app">
        <Header />
        <main>
          <Router onChange={this.handleRoute}>
            <Home path="/" />
            <Projects path="/projects/" projects={state.projects} />
            <Users path="/users/" users={state.users} />
          </Router>
        </main>
      </div>
    );
  }
}
