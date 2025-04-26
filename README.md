## MCC X Minecraft Reborn Project

![GitHub License](https://img.shields.io/github/license/Howie114514/MCCxMinecraftReborn)
![GitHub package.json version](https://img.shields.io/github/package-json/v/Howie114514/MCCxMinecraftReborn)
![GitHub last commit](https://img.shields.io/github/last-commit/Howie114514/MCCxMinecraftReborn)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Howie114514/MCCxMinecraftReborn/build.yml)
![GitHub Repo stars](https://img.shields.io/github/stars/Howie114514/MCCxMinecraftReborn?style=flat)

还原 MCC 活动服务器的项目，致力于打造怀旧版地图。

[本地图修改自视频中的地图](https://www.bilibili.com/video/BV1r7iwedEZe/)
<br>

> [!IMPORTANT]
> [Levilamina 服务器推荐配合本插件使用](https://github.com/Howie114514/MCCxMinecraftReborn-llplugin)（不完善且可能不适配新版本，待重构）

---

### 计划(8/12)

##### ✅ 游戏

- [x] 主城及其功能
- [x] 时之沙
- [x] 王牌竞速
- [x] 熔毁（待完善）
- [x] 网格跑者

##### ⚠️ 功能

- [x] 食物
- [x] 装扮
- [x] 金币
- [ ] 谜题（部分）
- [ ] 玩具（部分）
- [ ] NPC 对话（部分）

##### ⚠️ 技术性

- [ ] Levilamina 插件（待重构）

---

### 命令：

> [!WARNING]
> 注：`@minecraft/math` 与一切测试版`@minecraft/server` 不兼容，使用任何修改 npm 包的命令请加上--force 选项<br><br>

npm run release- 导出<br><br>
npm run sync - 同步世界文件<br><br>
rm .\\node_modules\\@minecraft\\server-ui\\node_modules\\ -Recurse - 移除 server-ui 中的 node_modules 文件，防止版本不兼容
