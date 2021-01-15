import 'react-alert-confirm/dist/index.css';
import 'rc-tooltip/assets/bootstrap_white.css';
import '@/base.less';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

const config = require('./config.json');

console.log(`version: ${config.version}`);

ReactDOM.render(<App />, document.getElementById('root'));
