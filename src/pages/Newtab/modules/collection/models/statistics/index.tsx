import React, { useState, useEffect, useRef } from 'react';
import AzurlaneChart from '../demo/azurlaneChart/index';
import './index.scss';

class StatisticsSpace extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loadOver: false,
    };
  }
  render() {
    return (
      <div className="statistics-space">
        <div className={this.state.loadOver ? 'content over' : 'content'}>
          <i
            className="close"
            onClick={() => {
              this.setState({ loadOver: false }, () => {
                setTimeout(() => {
                  this.props.removeCollectionActive();
                }, 46e1);
              });
            }}
          >
            ✖
          </i>
          <AzurlaneChart />
        </div>
      </div>
    );
  }
  componentDidMount() {
    console.log(this);
    setTimeout(() => {
      this.setState({ loadOver: true });
    });
  }
}
export default StatisticsSpace;
