/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
<template>
  <div class="box_loader">
    <!-- <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
    </div>-->
    <div class="spinner">
      <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle
          class="length"
          fill="none"
          stroke-width="8"
          stroke-linecap="round"
          cx="33"
          cy="33"
          r="28"
        />
      </svg>
      <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28" />
      </svg>
      <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28" />
      </svg>
      <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle fill="none" stroke-width="8" stroke-linecap="round" cx="33" cy="33" r="28" />
      </svg>
    </div>
  </div>
</template>
<style scoped>
/* .box_loader {
  width: 100%;
  position: absolute;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.87);
  top: 0px;
  left: 0px;
  bottom: 0px;
}
.spinner {
  margin: auto;
  width: 60px;
  height: 46px;
  text-align: center;
  font-size: 10px;
  position: relative;
  top: 40%;
  display: block;
}

.spinner > div {
  background-color: #333;
  height: 100%;
  width: 4px;
  border-radius: 4px;
  margin: 0px 2px;
  display: inline-block;
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}
.spinner .rect1 {
  background: #3498db;
}
.spinner .rect2 {
  background: #800080;
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  background: #20b5ac;
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.spinner .rect4 {
  background: #f4a900;
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
} */
*,
*:before,
*:after {
  box-sizing: border-box;
  position: relative;
}

svg {
  display: block;
  margin: 0;
  padding: 0;
}
.box_loader {
  width: 100%;
  position: absolute;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.87);
  top: 0px;
  left: 0px;
  bottom: 0px;
  text-align: center;
}

.spinner {
  width: 33px;
  height: 36px;
  -webkit-animation: contanim 2s linear infinite;
  animation: contanim 2s linear infinite;
  display: inline-block;
  position: relative;
  top: 40%;
}

svg {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
}
svg:nth-child(1) circle {
  stroke: #84ebbd;
  stroke-dasharray: 1, 300;
  stroke-dashoffset: 0;
  -webkit-animation: strokeanim 3s calc(0.2s * (1)) ease infinite;
  animation: strokeanim 3s calc(0.2s * (1)) ease infinite;
  -webkit-transform-origin: center center;
  transform-origin: center center;
}
svg:nth-child(2) circle {
  stroke: #67b2e7;
  stroke-dasharray: 1, 300;
  stroke-dashoffset: 0;
  -webkit-animation: strokeanim 3s calc(0.2s * (2)) ease infinite;
  animation: strokeanim 3s calc(0.2s * (2)) ease infinite;
  -webkit-transform-origin: center center;
  transform-origin: center center;
}
svg:nth-child(3) circle {
  stroke: #f7a800;
  stroke-dasharray: 1, 300;
  stroke-dashoffset: 0;
  -webkit-animation: strokeanim 3s calc(0.2s * (3)) ease infinite;
  animation: strokeanim 3s calc(0.2s * (3)) ease infinite;
  -webkit-transform-origin: center center;
  transform-origin: center center;
}
svg:nth-child(4) circle {
  stroke:#0997a6;
  stroke-dasharray: 1, 300;
  stroke-dashoffset: 0;
  -webkit-animation: strokeanim 3s calc(0.2s * (4)) ease infinite;
  animation: strokeanim 3s calc(0.2s * (4)) ease infinite;
  -webkit-transform-origin: center center;
  transform-origin: center center;
}

@-webkit-keyframes strokeanim {
  0% {
    stroke-dasharray: 1, 300;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 120, 300;
    stroke-dashoffset: -58.548324585;
  }
  100% {
    stroke-dasharray: 120, 300;
    stroke-dashoffset: -175.6449737549;
  }
}

@keyframes strokeanim {
  0% {
    stroke-dasharray: 1, 300;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 120, 300;
    stroke-dashoffset: -58.548324585;
  }
  100% {
    stroke-dasharray: 120, 300;
    stroke-dashoffset: -175.6449737549;
  }
}
@-webkit-keyframes contanim {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes contanim {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
<script>
export default {}
</script>
