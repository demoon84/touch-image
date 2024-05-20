<template>
  <div id="optimize" class="optimize">
    <optimize-option-list />

    <drop-files @update="handleStartConvert"
                @drop="handleStartDrop" />

    <console-progress :isProgressing="isProgressing"
                      :percentage="percentage" />

    <console :list="convertList"
             :count="count"
             :done="done" />
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import OptimizeOptionList from '@/pages/optimize/optimize-option-list.vue';
import DropFiles from '@/components/drop-files.vue';
import Console from '@/components/console.vue';
import ConsoleProgress from '@/components/console-progress.vue';
import {findIndex, forEach, chunk, map} from 'lodash-es';

const convertList = ref([]);
const count = ref(0);
const done = ref(0);
const isProgressing = ref(false);

const percentage = computed(() => {
  return Math.ceil(done.value / convertList.value.length * 100) || 0;
});

const requestConvert = async (convertItem) => {
  const result = await window.optimizeAPI.optimize(JSON.stringify({
    path: convertItem.path,
    subPath: convertItem.subPath,
    uniqId: convertItem.uniqId
  }));

  return {
    result,
    uniqId: convertItem.uniqId
  };
};

const convert = async (convertTarget) => {
  const {result, uniqId} = await requestConvert(convertTarget);

  count.value = count.value - 1;
  done.value = done.value + 1;

  const index = findIndex(convertList.value, (o) => o.uniqId === uniqId);

  convertList.value[index].status = 'done';
  convertList.value[index].to.path = result.to.path;
  convertList.value[index].to.size = result.to.size;

  if (count.value <= 0) {
    setTimeout(() => {
      isProgressing.value = false;
    }, 500);
  }
};

const handleStartConvert = (fileList) => {
  isProgressing.value = true;

  forEach(fileList, ({file, name, subPath}) => {
    const uniqId = name.split('.')[0] + Math.random().toString(36).slice(2, 9);

    convertList.value.push({
      from: {
        path: file.path,
        size: file.size
      },
      to: {
        path: '',
        size: ''
      },
      path: file.path,
      subPath,
      uniqId,
      status: 'ing'
    });

    count.value = count.value + 1;
  });

  const runUnit = 10000;

  const convertUnitList = chunk(convertList.value, runUnit);

  const runConvert = async (i) => {
    const promises = map(convertUnitList[i], (target) => {
      return convert(target);
    });

    await Promise.all(promises);

    if (i >= convertUnitList.length) {
      return;
    }

    runConvert(i + 1);
  };

  runConvert(0);
};

const handleStartDrop = () => {
  convertList.value = [];
  done.value = 0;
};
</script>

<style lang="scss">
.optimize {
  height: 100%;
}
</style>
