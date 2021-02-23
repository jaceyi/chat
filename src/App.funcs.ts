import { uploadFile } from '@/services/uploadFile';
import { ImageBlockType } from 'chatUtils/blockRendererFn/components/Image';
import { FileBlockType } from 'chatUtils/blockRendererFn/components/File';

const fileEntityMap = [ImageBlockType, FileBlockType];

// 加载本次发送消息内的图片
export const loadFileForEntityMap = async entityMap => {
  interface Req {
    key: string;
    req: Promise<string>;
  }

  const fileReqs: Req[] = [];
  for (const key in entityMap) {
    if (!entityMap.hasOwnProperty(key)) continue;
    const entity = entityMap[key];
    if (fileEntityMap.includes(entity.type)) {
      fileReqs.push({
        key,
        req: uploadFile(entity.data)
      });
    }
  }
  const fileUrlList = await Promise.allSettled(fileReqs.map(item => item.req));
  for (let i = 0; i < fileUrlList.length; i++) {
    const item = fileUrlList[i];
    const activeEntity = fileReqs[i];
    if (item.status === 'fulfilled') {
      entityMap[activeEntity.key].data.src = item.value;
    } else {
      entityMap[activeEntity.key].data.src = '';
    }
  }

  await new Promise(resolve => {
    let allCount = 0;
    let resolveCount = 0;

    const loaded = () => {
      resolveCount++;
      if (resolveCount === allCount) {
        resolve();
      }
    };

    for (const key in entityMap) {
      // 先加载图片 在插入到页面
      if (!entityMap.hasOwnProperty(key)) continue;
      const entity = entityMap[key];
      if (entity.type === ImageBlockType) {
        allCount++;
        const img = new Image();
        img.src = entity.data.src;
        img.onload = loaded;
      }
      // 其他文件类型不预览不需要预先加载
    }

    if (!allCount) resolve();
  });

  return entityMap;
};
