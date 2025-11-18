import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import App from './App';

const router = createBrowserRouter(
    [
        {
            path: '/*',          // App 내부의 Routes를 그대로 사용
            element: <App />,
        },
    ],
    {
        basename: '/user',
    }
);

// [수정됨]
// 아래 3줄의 GSI 관련 코드를 삭제했습니다.
// const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// window.__GSI_CLIENT_ID = CLIENT_ID;
// console.log('[GSI] client_id =', CLIENT_ID);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    />
  </React.StrictMode>
);