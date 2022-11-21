import React from 'react';
import { render } from 'react-dom';

import Newtab from './Newtab';
import './index.scss';

render(<Newtab />, window.document.querySelector('#app-container'));
const randomVal = Math.random()
render(<video
  src={randomVal > 0.75 ? "../../../public/media/video/AL-yearV.mp4" : Math.random() > 0.25 ?  "../../../public/media/video/AL-lj.mp4" : "../../../public/media/video/bg.1080p.vp8.vorbis.webm"}
  autoPlay
  loop
></video>, window.document.querySelector('#bg-video'));

if (module.hot) module.hot.accept();
