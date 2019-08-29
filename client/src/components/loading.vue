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
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
    </div>
  </div>
</template>
<style scoped>
.box_loader {
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
}
</style>
<script>
export default {}
</script>
