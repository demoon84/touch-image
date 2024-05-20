<template>
  <div :class="[
          'console-item',
          `console-item--${status}`
        ]">
    <el-icon class="console-item__loading" v-if="status ==='ing'">
      <Loading />
    </el-icon>

    <el-icon class="console-item__complete" v-else>
      <Check />
    </el-icon>

    <div class="console-item__info">
      <span class="console-item__info-label">From :</span>
      {{ fromPath }} ({{ beforeSize }})
    </div>

    <div class="console-item__info" v-if="status !=='ing'">
      <span class="console-item__info-label">To :</span>
      {{ toPath }} ({{ afterSize }})
    </div>

    <div class="console-item__info" v-if="status !=='ing'">
      <span class="console-item__info-label">Size :</span>
      {{ beforeSize }}
      <el-icon style="vertical-align: -3px; font-size:15px">
        <Right />
      </el-icon>
      {{ afterSize }}

      ({{ percent }}%)
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import prettyBytes from 'pretty-bytes';

const props = defineProps([
  'fromPath',
  'fromSize',
  'toPath',
  'toSize',
  'status'
]);

const beforeSize = computed(() => {
  return prettyBytes(props.fromSize || 0);
});
const afterSize = computed(() => {
  return prettyBytes(props.toSize || 0);
});

const percent = computed(() => {
  const origin = props.fromSize < 1000 ? (props.fromSize / 1000).toFixed(1) : Math.round(props.fromSize / 1000);
  return Math.round((origin - (props.toSize / 1000).toFixed(1)) / origin * 100) * -1;
});
</script>

<style lang="scss">
.console-item {
  position: relative;
  padding: 10px 10px 10px 0;
  margin-bottom: 5px;
  border-radius: 5px;
  background: #383838;
  color: #a7a7a7;
}

.console-item__info {
  margin: 4px 0;
  padding-left: 74px;
  position: relative;
  word-break: break-all;
}

.console-item__info-label {
  width: 70px;
  display: inline-block;
  text-align: right;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 0;
}

.console-item--ing {
  opacity: .5;
}

.console-item__loading,
.console-item__complete {
  position: absolute !important;
  top: 13px;
  left: 10px;
}
</style>
