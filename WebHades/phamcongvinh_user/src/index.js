import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './output.css';
import Store from './redux/Store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <Provider store={Store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>

);
