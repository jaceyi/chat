import 'react-alert-confirm/lib/style.css';
import '@/base.scss';
import './utils/firebase';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AlertConfirm from 'react-alert-confirm';
import App from './App';

AlertConfirm.config({
  lang: 'zh'
});

ReactDOM.render(<App />, document.getElementById('root'));
