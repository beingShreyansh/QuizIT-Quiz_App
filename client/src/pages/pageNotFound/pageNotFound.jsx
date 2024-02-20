import React from 'react';
import { Link } from 'react-router-dom';

import './PageNotFound.css';

function NoPage() {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>404</h1>
          <h2>Page not found</h2>
        </div>
        <Link to="/">
          <button className="btn">Homepage</button>
        </Link>
      </div>
    </div>
  );
}

export default NoPage;