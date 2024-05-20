<template>
  <div :class="[
          'drop-files',
          {'drop-files--dragover' : dragging }
       ]"
       @dragover.prevent="handleDragging(true)"
       @dragenter.prevent="handleDragging(true)"
       @dragleave.prevent="handleDragging(false)"
       @dragend.prevent="handleDragging(false)"
       @drop.prevent="handleDrop"
       v-loading="isProgress">

    <div class="drop-files__tit">
      <el-icon class="drop-files__icon">
        <UploadFilled />
      </el-icon>
      <p>Drop files or folder here</p>
    </div>
  </div>
</template>

<script setup>
import {forEach, remove} from 'lodash-es';
import {ref} from 'vue';

const dragging = ref(false);

const isProgress = ref(false);

const fileList = ref([]);

const folderList = ref([]);

const findCount = ref(0);

const emit = defineEmits(['update', 'drop']);

const addFile = (file, subPath) => {
  if (!(/\.(png|jpg)$/.test(file.name))) {
    findCount.value--;
    return;
  }

  fileList.value.push({
    file,
    subPath,
    name: file.name
  });

  findCount.value--;

  if (findCount.value === 0) finish();
};

const readEntriesAsync = (reader) => {
  return new Promise((resolve, reject) => {
    reader.readEntries(entries => {
      resolve(entries);
    }, error => reject(error));
  });
};

const enumerateDirectoryWithManyFiles = async (directoryEntry) => {
  const reader = directoryEntry.createReader();
  let resultEntries = [];

  const read = async function() {
    const entries = await readEntriesAsync(reader);

    if (entries.length > 0) {
      resultEntries = resultEntries.concat(entries);
      await read();
    }
  };

  await read();

  return resultEntries;
};

const readFolder = async (entry) => {
  const entries = await enumerateDirectoryWithManyFiles(entry);

  remove(entries, entry => entry.name === 'Thumbs.db');

  findCount.value = findCount.value + entries.length;

  forEach(entries, (item) => {
    if (item.isFile) {
      item.file((file) => {
        addFile(file, item.fullPath.replace(`/${file.name}`, ''));
      });
    }

    if (item.isDirectory) {
      folderList.value.push(item.fullPath);
      readFolder(item);
    }
  });

  findCount.value--;
};

const finish = () => {
  emit('update', fileList.value, folderList.value);

  isProgress.value = false;
  fileList.value = [];
  folderList.value = [];
  findCount.value = 0;
};

const findFiles = (items) => {
    forEach(items, (item) => {
    const entry = item.webkitGetAsEntry();

    if (entry.isFile) {
      addFile(item.getAsFile());
    }

    if (entry.isDirectory) {
      folderList.value.push(entry.fullPath);
      readFolder(entry);
    }
  });
};

const handleDrop = (e) => {
  if (isProgress.value) return;
  dragging.value = false;

  emit('drop');

  const items = e.dataTransfer.items;

  findCount.value = items.length;

  if (items.length < 1) return;

  isProgress.value = true;

  findFiles(items);
};

const handleDragging = (value) => {
  dragging.value = value;
};
</script>

<style lang="scss">
.drop-files {
  text-align: center;
  height: 200px;
  border: 1px dashed #444444;
  overflow: hidden;
  color: #606266;
  font-size: 14px;
  border-radius: 5px;
  background: #383838;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-files--dragover {
  opacity: .8;
}

.drop-files__tit {
  color: #fff;
  width: 100%;
  text-align: center;
}

.drop-files__icon {
  font-size: 40px !important;
}
</style>
