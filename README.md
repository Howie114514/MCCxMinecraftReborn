## MCC X Minecraft Reborn Project

![GitHub License](https://img.shields.io/github/license/Howie114514/MCCxMinecraftReborn)
![GitHub Repo stars](https://img.shields.io/github/stars/Howie114514/MCCxMinecraftReborn)

还原 MCC 活动服务器的项目，致力于打造怀旧版地图。

[推荐搭配使用这个视频里的地图使用本行为包](https://www.bilibili.com/video/BV1r7iwedEZe/)
<br>
[Levilamina 服务器推荐配合本插件使用](https://github.com/Howie114514/MCCxMinecraftReborn-llplugin)

---

### 计划(8/12)

##### 游戏

- [x] 主城及其功能
- [x] 时之沙
- [x] 王牌竞速
- [x] 熔毁（待完善）
- [ ] 网格跑者

##### 功能

- [x] 食物
- [x] 装扮
- [x] 金币
- [ ] 谜题（部分）
- [ ] 玩具（部分）
- [ ] NPC 对话（部分）

##### 技术性

- [x] Levilamina 插件（适配网络功能，使时之沙物品能够正确消失）

---

### 命令：

npx just-scripts mctemplate - 导出世界模板<br><br>
npx local-deploy - 本地部署（要在游戏中使用，请在.env 文件中修改为"BedrockUWP"）<br><br>
fixServerUI.ps1 - 修复@minecraft/server-ui 中自带 node_modules 文件夹导致的不兼容问题
