# Qualtrics 问卷配置

将 campus-sound-notes-survey.txt 导入一个空白 Survey。该文件采用 Qualtrics 官方 Advanced TXT 格式；导入后还需在编辑器设置验证与样式，不能只凭题目中的 Required 当作强制校验。

1. Welcome 简短介绍之后，三个 block 分别作为地点与时间、声音与活动、可选背景与同意页面。启用返回按钮、进度条；最后一个 block 的 Next Button Text 为 Submit observation。
2. place/date/time/source/disturbance/activity/consent 启用 Force response。location_detail 使用 Custom validation：place 的 Other public place Is Not Selected，或 location_detail Is Not Empty。date 使用内置 YYYY/MM/DD 日期验证；time 使用 Custom validation 的 Matches Regex：`^([01][0-9]|2[0-3]):[0-5][0-9]$`。note 最大 500 字符；其余背景问题可跳过。数据准备脚本把日期斜线归一化为 ISO 日期，也兼容旧的 YYYY-MM-DD。
3. 问题 export tags 保持 place/location_detail/date/time/source/disturbance/activity/nature/weather/note/consent。CSV 导出选文本标签，不选数字 recode values。
4. 开放 anonymous link，不增加学校登录验证；开启 Anonymize responses。检查问卷可嵌入和手机布局。不得为了美观移除学校强制品牌元素。
5. 在 Look & Feel 使用暖白 #F7F7F0、正文 #19382E、主按钮 #245B49、16px 正文。实际选项由学校授权主题能力决定。
6. 提交后的 End of Survey message：Thanks for listening. Your response has been recorded. The map is updated periodically. 另加 Explore the campus soundscape 链接，指向 https://yueyaow7-10969.github.io/campus-sound-notes/#/explore ，在新标签页打开。
7. Publish 后复制 anonymous link 到 public/site-config.json 的 qualtricsUrl。使用无登录浏览器完成一次明确标为 QA 的提交，核对 Data & Analysis 已保存；QA 不进入公开地图。

官方说明：https://www.qualtrics.com/support/survey-platform/survey-module/survey-tools/import-and-export-surveys/

不要在网站源码或 GitHub 保存原始问卷响应、账户邮件、IP、ResponseID、API token。private-data/ 目录被忽略。

## 主动定位（Use my location）

在现有 `place` 问题的 JavaScript 编辑器中安装 `location-question.js`。脚本使用浏览器 `getCurrentPosition`，仅在用户点击后请求一次定位；无定位追踪、无 API Key、无额外地图服务。直接问卷与内嵌问卷共用同一按钮，网站 iframe 仅向已配置的 Qualtrics origin 委派 geolocation 权限，用户仍须允许浏览器请求。

在 Survey Flow 中，Welcome 与 Where did you listen? 之间增加 Embedded Data，保留下列字段（必须含 `__js_` 前缀，默认由 Panel/URL 设置，不设覆盖常量）：

- `__js_csn_latitude`：纬度，十进制度，保留 6 位小数。
- `__js_csn_longitude`：经度，十进制度，保留 6 位小数。
- `__js_csn_accuracy_m`：设备报告的精度范围，米。
- `__js_csn_captured_at`：定位时间，UTC ISO 8601。
- `__js_csn_location_source`：成功时为 `device`，不用定位时为空。

地点名称仍为必填，以便描述观察的公共空间；定位成功时，设备坐标优先于名称对应的预设坐标。点击 Use a place instead 清除设备字段。定位拒绝、超时、不支持、研究区域外均不阻止按地点投稿。页面离开或主动取消后丢弃延迟返回的定位结果。

导出时使用 Download all fields，包括上述 Embedded Data。`data:prepare` 解析这些字段；旧版无定位列的导出仍兼容。私有检查表增加 accuracy_m、captured_at、location_source、location_issue。异常字段不静默替换成预设坐标；精度超过 100 m 的记录要核对后清除 location_issue 才能公开。`data:publish` 仍只输出约 100 m 坐标，不公开定位精度与定位时间。

脚本官方依据：https://api.qualtrics.com/82bd4d5c331f1-qualtrics-java-script-question-api-class （setJSEmbeddedData / getJSEmbeddedData）；https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy/geolocation 。

## 2026-09-19 配置与验收

问卷已发布：https://nus.syd1.qualtrics.com/jfe/form/SV_ezjIxiya419iZsa

已验证无需账户填写、强制回答、无效日期/时间拦截、Other 地点条件校验、前后返回保留选项、自然声音/天气留空、500 字符输入上限、同意项校验、实际成功回执和后台 2 条已记录的 QA。QA 标注为应用测试，不得发布为观察证据。匿名化已启用，问卷不要求登录或密码。

当前 Chrome 自动化下载 CSV 被浏览器阻止，尚未完成真实导出文件的端到端导入核验。需要从 Data & Analysis → Export & Import → Manage Previous Downloads 下载已生成的 CSV。选择 Export labels、Download all fields，保留空值；不要启用内部 ID 标题。原始文件放在 private-data/。

主动定位更新已发布。另提交 1 条明确标为 QA 的合成坐标测试，Data & Analysis 的 View Response 已显示全部 5 个 Embedded Data 字段和值；该记录不属于现场观察，不进入公开数据。URL 注入合成字段只用于核对问卷保存链路，设备成功回调另以单元测试验证。当前设备实际定位请求超时，已验证仍可选择地点并继续投稿；尚未验证校园内真实手机的定位精度。网站内嵌问卷已在 Chrome 验证，390 px 手机与桌面截图已检查，360/430 px 无横向溢出；按钮高度 48 px，键盘 Tab 可进入地点选择。15 项测试、构建及发布文件扫描通过。

GitHub Pages 已启用 main /docs 并确认可公开打开；游客从正式网站进入问卷，实际投稿成功并在后台核对中文、空值与手动地点。测试记录仍不公开。发布时补强定位状态：被必填校验留在当前页后仍可重试，采用具名生命周期回调；16 项测试通过。回执已发布公开地图链接。Chrome 的真实 CSV 下载仍被拦截，真实导出→导入的验收尚未完成。
