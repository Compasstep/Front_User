import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import "@fontsource/anton/400.css";
import "@fontsource/quicksand/400.css";
import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/black-han-sans/400.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
