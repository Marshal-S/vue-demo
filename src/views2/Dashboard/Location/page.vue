<template>
  <div class="w-full h-full flex flex-col">
    <div>我是location页面：实际上做了一个摩天轮效果</div>
    <div class="w-[800px] h-[600px] flex justify-center items-center">
      <div id="circle_bkg" class="rounded-full border-[1px] border-red-500">
        <div class="item-view">
          <div class="img bg-amber-200" />
        </div>
        <div class="item-view">
          <div class="img bg-amber-700" />
        </div>
        <div class="item-view">
          <div class="img bg-green-400" />
        </div>
        <div class="item-view">
          <div class="img bg-blue-400" />
        </div>
        <div class="item-view">
          <div class="img bg-cyan-500" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
$parentSize: 400px;
$n: 5;
$degPer: calc(360deg / 5);

#circle_bkg {
  animation: circleFrame 20s linear infinite;
  width: $parentSize;
  height: $parentSize;
  position: relative;
}

.item-view {
  position: absolute;
  width: 20%;
  height: 20%;
  left: 40%;
  top: -10%;
  //围绕外部一个点旋转变换
  transform-origin: center $parentSize * 0.6;

  //循环处理节点情况
  @for $i from 1 through $n {
    &:nth-child(#{$i}) {
      $deg: $degPer * ($i - 1);
      transform: rotateZ($deg);
      .img {
        transform: 0;
        --initialDeg: #{-$deg};
        transform: rotateZ(-$deg); //为了保证水平放置，里面的 img 需要反转同样角度
        animation: selfFrame 20s linear infinite;
      }
    }
  }
}

.img {
  width: 100%;
  height: 100%;
}

@keyframes circleFrame {
  to {
    transform: rotateZ(360deg);
  }
}

@keyframes selfFrame {
  to {
    transform: rotateZ(calc(-360deg + var(--initialDeg)));
  }
}
</style>
