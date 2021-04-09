# Chat

基于 Draft-js 实现的富文本输入框。

## 开发

```shell
yarn
yarn start
yarn build
```

本地预览，先参考 [Firebase CLI](https://firebase.google.com/docs/cli?authuser=0#install_the_firebase_cli) 并安装。

```shell
firebase emulators:start
```

## Tip

控制台输入 `signOut()` 登出

## todo

- [x] 常用字符格式快捷键 (Ctrl+B、Ctrl+I、Ctrl+U、...)
- [x] 插入链接（网址识别、Ctrl+L 进行选中文字转链接或者直接插入链接）
- [x] 表情（支持表情选择及其他 90%的 Emoji 转换）
- [x] 上传文件（图片支持直接预览）
- [x] 粘贴图片（Chrome 仅支持 PNG 图片，还会将部分可识别的文件转为 PNG 图片）
- [x] @提及
- [ ] ...
