import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // Fixed import path (it should be 'react-router-dom')
import { Provider } from 'react-redux'; // Import the Provider
import store from './redux/store.js'; // Adjust the import path of your Redux store

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* Wrap your App with the Provider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
