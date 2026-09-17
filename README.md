# Omarchy Clock CN

基于 Omarchy 内置 `omarchy.clock` 克隆并维护的个人日历插件，插件 ID 为 `evan.clock`。

## 功能

- 保留 Omarchy Clock 的任务栏时间、月历、周数和年度进度功能
- 显示中国法定节假日与调休上班日
- 法定休假显示“休”，调休上班显示“班”
- 普通周六、周日也显示“休”，调休上班规则优先
- 当前月历的六周网格会显示相邻月份的节假日
- 跨年网格会按需加载相邻年份数据
- 鼠标悬停任意日期时显示对应的农历日期（1900–2100，本地换算、无需联网）
- 内置 2026 年节假日数据，离线时仍可使用

在线节假日数据来自 [NateScarlet/holiday-cn](https://github.com/NateScarlet/holiday-cn)，其记录来源于国务院发布的节假日安排通知。

## 安装

```bash
git clone git@github.com:xujianfei9527/omarchy-clock-cn.git \
  ~/.config/omarchy/plugins/evan.clock
omarchy-shell shell rescanPlugins
```

然后在 `~/.config/omarchy/shell.json` 的任务栏布局中使用 `evan.clock`。本人的 Omarchy 配置仓库已经通过 chezmoi 自动完成安装和布局配置。

## 更新

```bash
git -C ~/.config/omarchy/plugins/evan.clock pull --ff-only
omarchy restart shell
```

## 开发与验证

直接修改 `~/.config/omarchy/plugins/evan.clock/` 下的文件即可，Omarchy Shell 通常会自动热重载。提交前运行：

```bash
node --test ~/.config/omarchy/plugins/evan.clock/tests/*.test.js
omarchy plugin validate ~/.config/omarchy/plugins/evan.clock
```

修改后按语义化版本更新 `manifest.json`：修复增加补丁版本，新增兼容功能增加次版本，不兼容修改增加主版本。

## 对比 Omarchy 上游

Omarchy 更新后，可以比较内置插件和当前版本：

```bash
git diff --no-index \
  /usr/share/omarchy/shell/plugins/panels/clock \
  ~/.config/omarchy/plugins/evan.clock
```

确认需要的变化后手动合并，避免覆盖中国节假日相关功能。

## 来源说明

初始代码来自 Omarchy 内置 `omarchy.clock`，此仓库维护的是个人定制版本。Omarchy 系统文件始终保持只读，所有修改只位于用户插件目录。
