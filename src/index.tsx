import 'react-alert-confirm/lib/style.css';
import '@/base.scss';
import './utils/firebase';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import AlertConfirm from 'react-alert-confirm';
import App from './App';

AlertConfirm.config({
  lang: 'zh'
});

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<App />);
