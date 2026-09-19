# Qualtrics 问卷配置

将 campus-sound-notes-survey.txt 导入一个空白 Survey。该文件采用 Qualtrics 官方 Advanced TXT 格式；导入后还需在编辑器设置验证与样式，不能只凭题目中的 Required 当作强制校验。

1. Welcome 简短介绍之后，三个 block 分别作为地点与时间、声音与活动、可选背景与同意页面。启用返回按钮、进度条；最后一个 block 的 Next Button Text 为 Submit observation。
2. place/date/time/source/disturbance/activity/consent 启用 Force response。location_detail 使用 Custom validation：place 的 Other public place Is Not Selected，或 location_detail Is Not Empty。date 使用内置 YYYY/MM/DD 日期验证；time 使用 Custom validation 的 Matches Regex：`^([01][0-9]|2[0-3]):[0-5][0-9]$`。note 最大 500 字符；其余背景问题可跳过。数据准备脚本把日期斜线归一化为 ISO 日期，也兼容旧的 YYYY-MM-DD。
3. 问题 export tags 保持 place/location_detail/date/time/source/disturbance/activity/nature/weather/note/consent。CSV 导出选文本标签，不选数字 recode values。
4. 开放 anonymous link，不增加学校登录验证；开启 Anonymize responses。检查问卷可嵌入和手机布局。不得为了美观移除学校强制品牌元素。
5. 在 Look & Feel 使用暖白 #F7F7F0、正文 #19382E、主按钮 #245B49、16px 正文。实际选项由学校授权主题能力决定。
6. 提交后的 End of Survey message：Thanks for listening. Your response has been recorded. The map is updated periodically. GitHub Pages 激活后再添加已验证的 Explore 链接。
7. Publish 后复制 anonymous link 到 public/site-config.json 的 qualtricsUrl。使用无登录浏览器完成一次明确标为 QA 的提交，核对 Data & Analysis 已保存；QA 不进入公开地图。

官方说明：https://www.qualtrics.com/support/survey-platform/survey-module/survey-tools/import-and-export-surveys/

不要在网站源码或 GitHub 保存原始问卷响应、账户邮件、IP、ResponseID、API token。private-data/ 目录被忽略。

## 2026-09-19 配置与验收

问卷已发布：https://nus.syd1.qualtrics.com/jfe/form/SV_ezjIxiya419iZsa

已验证无需账户填写、强制回答、无效日期/时间拦截、Other 地点条件校验、前后返回保留选项、自然声音/天气留空、500 字符输入上限、同意项校验、实际成功回执和后台 1 条已记录的 QA。QA 标注为应用测试，不得发布为观察证据。匿名化已启用，问卷不要求登录或密码。

当前 Chrome 自动化下载 CSV 被浏览器阻止，尚未完成真实导出文件的端到端导入核验。需要从 Data & Analysis → Export & Import → Manage Previous Downloads 下载已生成的 CSV。选择 Export labels、Download all fields，保留空值；不要启用内部 ID 标题。原始文件放在 private-data/。
