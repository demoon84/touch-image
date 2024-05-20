<template>
  <div id="webp" class="webp">
    <webp-option-list />

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
import {ref, computed} from 'vue';
import WebpOptionList from '@/pages/webp/webp-option-list.vue';
import DropFiles from '@/components/drop-files.vue';
import Console from '@/components/console.vue';
import ConsoleProgress from '@/components/console-progress.vue';
import {forEach, chunk, map, findIndex} from 'lodash-es';

const convertList = ref([]);
const count = ref(0);
const done = ref(0);
const isProgressing = ref(false);

const animatedConvertList = ref([]);

const percentage = computed(() => {
  return Math.ceil(done.value / convertList.value.length * 100) || 0;
});

const requestConvert = async (convertItem) => {
  const result = await window.webpAPI.webp(JSON.stringify({
    name: convertItem.from.name,
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
    window.webpAPI.animatedWebp(JSON.stringify(animatedConvertList.value));

    setTimeout(() => {
      isProgressing.value = false;
    }, 500);
  }
};

const handleStartConvert = (fileList, folderList) => {
  isProgressing.value = true;

  animatedConvertList.value = folderList;

  forEach(fileList, ({file, name, subPath}) => {
    const uniqId = name.split('.')[0] + Math.random().toString(36).slice(2, 9);

    convertList.value.push({
      from: {
        name: file.name,
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
.webp {
  height: 100%;
}
</style>
