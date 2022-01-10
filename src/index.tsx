import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Modal from 'react-modal';

ReactDOM.render(<App />, document.getElementById('root'));
Modal.setAppElement('#root');
