import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.scss';
import {
    BrowserRouter, Routes, Route, NavLink, useParams,
} from 'react-router-dom';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './reducers';

import App from './components/app';

// this creates the store with the reducers
const store = configureStore({
    reducer: rootReducer,
});

const root = createRoot(document.getElementById('main'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>,
);
