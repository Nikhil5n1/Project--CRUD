import React from 'react';
import ReactDOM from 'react-dom/client';

import "./index.css";

import App from './App.jsx';
import DisplayEntities from "./components/DisplayEntities.jsx";
import EntityForm from './components/EntityForm.jsx';
import DataForm from './components/DataForm.jsx';

import { RouterProvider, createBrowserRouter, Route, createRoutesFromElements } from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={ <App /> }>
      <Route path="displayEntities" element={ <DisplayEntities /> } />
      <Route path="entityForm" element={ <EntityForm /> } />
      <Route path="dataForm" element={ <DataForm /> } />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = { router } />
  </React.StrictMode>,
);