import React from 'react';
import AudioTips from './plugins/audiotips';
import SearchSpace from './modules/search/index';
import CollectionSpace from './modules/collection/index';
import { videoAuto } from './plugins/bg';
import { docHidden, visibilityCge } from './plugins/constant';

import './Newtab.scss';

const workflow: any = new AudioTips();
let doc: any = document;
document.addEventListener(
  visibilityCge,
  () => {
    if (doc[docHidden]) {
      document.title = '(╯‵□′)╯︵┻━┻';
    } else {
      document.title = '欢迎回来';
      workflow.constructor.speechInteraction('meetAgain');
      setTimeout(() => {
        document.title = '新标签页';
      }, 3e3);
    }
  },
  false
);
window.addEventListener('resize', videoAuto);

videoAuto()

window.onload = () => {
  workflow.constructor.speechInteraction();
  workflow.constructor.speechInteraction('OnTimeAlarm');
};

const Newtab = () => {
  return (
    <div className="App">
      <SearchSpace />
      <CollectionSpace />
    </div>
  );
};

export default Newtab;
