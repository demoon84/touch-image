<template>
  <div class="console">
    <div class="console__info" v-if="showInfo">
      <span class="console__info-title">InProgress :</span>
      <span class="console__info-num">{{ count }}</span>

      <span class="console__info-divider">/</span>

      <span class="console__info-title">Done :</span>
      <span class="console__info-num">{{ done }}</span>

      <span class="console__info-divider">/</span>

      <span class="console__info-title">Converted Size :</span>
      <span class="console__info-num">
        {{ prettyBytes(beforeSize) }}

      <el-icon style="vertical-align: -3px; font-size:15px">
        <Right />
      </el-icon>

      {{ prettyBytes(afterSize) }}

        <template v-if="afterSize!==0">
        ({{ optimizePercent }}%)
        </template>
      </span>
    </div>

    <div class="console__list">
      <console-item v-for="(item) in list"
                    :key="item.uniqueId"

                    :from-size="item.from.size"
                    :to-size="item.to.size"

                    :from-path="item.from.path"
                    :to-path="item.to.path"

                    :status="item.status" />
    </div>
  </div>
</template>

<script setup>
import {reduce} from 'lodash-es';
import prettyBytes from 'pretty-bytes';
import {computed} from 'vue';
import ConsoleItem from '@/components/console-item.vue';

const props = defineProps(['list', 'count', 'done']);

const beforeSize = computed(() => {
  return reduce(props.list, (size, item) => {
    return size + +item.from.size;
  }, 0);
});

const showInfo = computed(() => {
  return props.list.length > 0;
});

const afterSize = computed(() => {
  return reduce(props.list, (size, item) => {
    return size + +item.to.size;
  }, 0);
});

const optimizePercent = computed(() => {
  const origin = beforeSize.value < 1000 ? (beforeSize.value / 1000).toFixed(1) : Math.round(beforeSize.value / 1000);
  return Math.round((origin - (afterSize.value / 1000).toFixed(1)) / origin * 100) * -1;
});
</script>

<style lang="scss">
.console {
  border: 1px solid #444444;
  padding: 40px 10px 10px 15px;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 12px;
  position: absolute;
  top: 504px;
  bottom: 20px;
  left: 20px;
  right: 20px;
  color: #a7a7a7;
}

.console__list {
  height: 100%;
  padding: 0 5px;
  overflow: auto;

  &::-webkit-scrollbar-track {
    background-color: #2c2c2c;
  }

  &::-webkit-scrollbar {
    width: 3px;
    background-color: #aaa;
  }

  &::-webkit-scrollbar-thumb {
    background: #444444;
    border-radius: 2px;
  }
}

.console__progress {
  position: absolute;
  top: 10px;
  left: 20px;
  right: 20px;
}

.console__info {
  position: absolute;
  top: 15px;
  right: 18px;
  left: 30px;
  line-height: 18px;
  white-space: nowrap;

  .el-progress {
    margin-bottom: 10px;
  }
}

.console__info-num {
  width: 40px;
  display: inline-block;
}

.console__info-title {
  display: inline-block;
  margin-right: 4px;
  color: #ffffff;
}

.console__info-divider {
  margin: 0 30px 0 0;
}
</style>
