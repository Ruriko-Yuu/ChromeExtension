import React from 'react';
import DevModeSpace from './modules/devmode/index'
// import logo from '../../assets/img/logo.svg';
// import Greetings from '../../containers/Greetings/Greetings';
import './Popup.scss';

const Popup = () => {
  return (
    <div className="App ruriko">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <DevModeSpace />
      </header>
    </div>
  );
};

export default Popup;

