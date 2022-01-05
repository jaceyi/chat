# Chat

[在线地址](https://chat.jaceyi.com/)

基于 Draft-js 实现的富文本输入框，如果有需要自己开发富文本框的同学，可以看看源码，个人感觉还是值得借鉴的。一些关键地方有注释，有不懂的地方可以提 Issue 问我。

> 理论上支持所有富文本框可以支持的内容，扩展性强。现在对于行内元素、块级元素、行内样式、事件队列等底层共用逻辑全都支持上了，虽然表面上功能挺少，如果要加一个标题、代码块、视频、表格乃至多人共同编辑都能很快实现。

## 开发

```shell
yarn
yarn start
yarn build
```

本地预览，先参考 [Firebase CLI](https://firebase.google.com/docs/cli?authuser=0#install_the_firebase_cli) 并安装。

```shell
# 初始化
firebase init emulators

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
