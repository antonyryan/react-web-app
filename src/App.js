import React from 'react';
import { Router, Route } from 'react-router-dom';

import { IntlProvider } from "react-intl";

import Container from '@material-ui/core/Container';

import { history } from './redux/store'
import Login from 'pages/login';

import en from 'localization/en.json'
import es from 'localization/es.json'
import fr from 'localization/fr.json'
import './App.css'


const languages = { en, es, fr };

function App() {
  return (
    <IntlProvider locale='en' messages={languages['en']}>
      <Container className='App'>
        <Router history={history}>
          <Route path='/' exact component={Login} />
        </Router>
      </Container>
    </IntlProvider>
  );
}

export default App;