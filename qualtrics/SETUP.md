# Qualtrics 问卷配置

将 campus-sound-notes-survey.txt 导入一个空白 Survey。该文件采用 Qualtrics 官方 Advanced TXT 格式；导入后还需在编辑器设置验证与样式，不能只凭题目中的 Required 当作强制校验。

1. 三个 block 分别作为地点与时间、声音与活动、可选背景与同意页面。启用返回按钮、进度条。
2. place/date/time/source/disturbance/activity/consent 启用 Force response。location_detail 在选择 Other public place 时必填。date 使用 YYYY-MM-DD 日期验证；time 使用 24 小时 HH:MM 验证。note 最大 500 字符；其余背景问题可跳过。
3. 问题 export tags 保持 place/location_detail/date/time/source/disturbance/activity/nature/weather/note/consent。CSV 导出选文本标签，不选数字 recode values。
4. 开放 anonymous link，不增加学校登录验证；开启 Anonymize responses。检查问卷可嵌入和手机布局。不得为了美观移除学校强制品牌元素。
5. 在 Look & Feel 使用暖白 #F7F7F0、正文 #19382E、主按钮 #245B49、16px 正文。实际选项由学校授权主题能力决定。
6. 提交后的 End of Survey message：Thanks for listening. Your response has been recorded. The map is updated periodically. 添加实际 GitHub Pages Explore 链接。
7. Publish 后复制 anonymous link 到 public/site-config.json 的 qualtricsUrl。使用无登录浏览器完成一次明确标为 QA 的提交，核对 Data & Analysis 已保存；QA 不进入公开地图。

官方说明：https://www.qualtrics.com/support/survey-platform/survey-module/survey-tools/import-and-export-surveys/

不要在网站源码或 GitHub 保存原始问卷响应、账户邮件、IP、ResponseID、API token。private-data/ 目录被忽略。
