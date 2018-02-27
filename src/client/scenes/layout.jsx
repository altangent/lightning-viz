import React from 'react';
import { Route } from 'react-router-dom';
import { GraphScene } from './graph/graph-scene';

export class Layout extends React.Component {
  render() {
    return (
      <div className="layout">
        <div className="container-fluid">
          <Route path="/" component={GraphScene} />
        </div>
      </div>
    );
  }
}
