/**
 * Toy JS SDK 类型声明（面向创作者）
 *
 * 用法：把本文件放进你的 Toy 项目（如 `types/toy.d.ts`），TypeScript 会自动加载，
 * 无需 import 即可获得 `window.toy` 的类型检查与补全。
 *
 * 前置：页面 `<head>` 中引入
 *   <script src="//s1.hdslb.com/bfs/seed/toy/app/sdk/toy-sdk.js"></script>
 * 加载后 SDK 把实例挂到全局 `window.toy`，所有方法返回 Promise。
 *
 * 通用约定：
 * - 所有方法抛出的 Error，message 统一带 `[ToySDK]` 前缀。
 * - 数据类能力（用户 / 作者 / 视频互动）不抛错时通过 `status` 字段表达结果，
 *   需要先判断 `status === 'ok'` 再读 `data` / `items`。
 * - 云存储与排行榜失败时 Promise reject，需要 try/catch。
 */

declare namespace ToySDK {
  // ---------------------------------------------------------------------------
  // 页面跳转
  // ---------------------------------------------------------------------------

  /** 站内跳转的目标页面类型。 */
  type NavigateType = 'video' | 'space' | 'search' | 'opus' | 'tribee' | 'toy'

  interface NavigateReq {
    /** 目标页面类型。 */
    type: NavigateType
    /**
     * 资源标识，随 `type` 变化：
     * - video: BV 号，如 `BV1Hh411S7Ys`
     * - space: 用户 mid
     * - search: 搜索关键词（SDK 内部会做 URL 编码）
     * - opus: 图文 / 动态 id
     * - tribee: 小站 id
     * - toy: toy id
     */
    id: string
    /** 额外查询参数，拼接到目标 URL 上透传给目标页面。 */
    extra?: Record<string, string>
  }

  // ---------------------------------------------------------------------------
  // 保存图片
  // ---------------------------------------------------------------------------

  /** `url` 与 `base64Data` 二选一，两者都不传则由客户端返回错误。 */
  interface SaveImageReq {
    /** 网络图片地址。 */
    url?: string
    /** base64 图片数据。 */
    base64Data?: string
    /** 申请相册权限时展示给用户的提示文案。 */
    hintMsg?: string
  }

  interface SaveImageResp {
    /** 保存后的本地文件路径，由客户端返回。 */
    localPath: string
  }

  // ---------------------------------------------------------------------------
  // 分享与二维码
  // ---------------------------------------------------------------------------

  interface ShareReq {
    /**
     * 相对当前 Toy 页面根（`/toy/<slug>/`）的路径，可带 query，如 `result.html?score=100`。
     *
     * 完整分享链接由平台生成，Toy 不能自行指定完整 URL。路径只能落在当前 Toy 内：
     * 传绝对 URL 或用 `../` 越界到其他 Toy / 外域会抛 `invalid_param`。
     */
    path: string
  }

  interface QrCodeReq {
    /**
     * 相对当前 Toy 页面根（`/toy/<slug>/`）的路径，可带 query。
     * 不传（或传空串）时指向当前 Toy 首页 `index.html`。
     *
     * 传了则与 `ShareReq.path` 同一约定：二维码内容由平台生成，
     * Toy 不能自行指定完整 URL；传绝对 URL 或用 `../` 越界到其他 Toy / 外域会抛 `invalid_param`。
     */
    path?: string
    /** 二维码边长（像素），取值区间 `[80, 1024]` 的整数。不传默认 `320`，越界或非整数抛 `invalid_param`。 */
    size?: number
  }

  interface QrCodeResp {
    /** PNG 图片的完整 data URL（`data:image/png;base64,...`），可直接赋给 `img.src`。 */
    base64: string
    /** 二维码实际编码的完整链接，由平台生成。 */
    url: string
  }

  // ---------------------------------------------------------------------------
  // 用户信息
  // ---------------------------------------------------------------------------

  interface UserProfileResp {
    /** 头像地址，SDK 已统一归一化为 https 与 p0 CDN 域名。 */
    avatar: string
    /** 昵称。 */
    nickname: string
    /** 当前登录用户在当前 Toy 内的稳定假名标识，不是鉴权凭证；功能未启用时可能不返回。 */
    toyOpenId?: string
  }

  // ---------------------------------------------------------------------------
  // 数据类能力的状态枚举
  // ---------------------------------------------------------------------------

  /**
   * 数据类能力的整体状态。
   * - `ok`: 成功
   * - `partial`: 批量请求部分成功，逐项状态见各 item 的 `status`
   * - `unauthorized`: 未登录
   * - `denied`: 用户拒绝了数据使用确认
   * - `unsupported`: 当前环境不支持（如外部手机浏览器，SDK 会引导打开 B站 App）
   * - `toy_context_unavailable`: 拿不到当前 toy 上下文
   * - `author_mismatch`: 请求的资源不属于当前 Toy 作者（视频既非其投稿，也未以联合投稿身份参与创作）
   * - `video_not_found`: 视频不存在
   * - `video_invisible`: 视频对当前用户不可见
   * - `unavailable`: 依赖服务不可用
   * - `invalid_argument`: 参数非法
   */
  type ToyDataStatus =
    | 'ok'
    | 'partial'
    | 'unauthorized'
    | 'denied'
    | 'unsupported'
    | 'toy_context_unavailable'
    | 'author_mismatch'
    | 'video_not_found'
    | 'video_invisible'
    | 'unavailable'
    | 'invalid_argument'

  /** 批量结果中单项的状态：与 `ToyDataStatus` 相同，但不会是 `partial`。 */
  type ToyItemStatus = Exclude<ToyDataStatus, 'partial'>

  // ---------------------------------------------------------------------------
  // 作者资料
  // ---------------------------------------------------------------------------

  /** 作者认证信息。`role` / `type` 为后端数字枚举，SDK 未定义其取值含义。 */
  interface AuthorCertification {
    role: number
    title: string
    description: string
    type: number
  }

  /** 充电聚合信息。 */
  interface ChargingSummary {
    /** 充电人数。 */
    count: number
    display?: {
      show: boolean
      text?: string
    }
  }

  /** 粉丝勋章配置。 */
  interface FanMedalConfig {
    /** 勋章名称。 */
    name: string
    /** 是否已开启粉丝勋章。 */
    enabled: boolean
    /** 各等级的亲密度区间；最高等级无上限时 `maxIntimacy` 缺省。 */
    levels: Array<{
      level: number
      minIntimacy: number
      maxIntimacy?: number
    }>
  }

  interface AuthorProfile {
    nickname: string
    avatar: string
    /** 个性签名。 */
    sign: string
    /** 未认证时缺省。 */
    certification?: AuthorCertification
    /** 关注数。 */
    following: number
    /** 粉丝数。 */
    follower: number
    /** 稿件数。 */
    archiveCount: number
    /** 未开通充电时缺省。 */
    charging?: ChargingSummary
    /** 未配置粉丝勋章时缺省。 */
    fanMedal?: FanMedalConfig
    /** 生日，时间戳；未公开时缺省。 */
    birthday?: number
  }

  interface AuthorProfileResp {
    status: ToyDataStatus
    /** `status` 非 `ok` 时缺省。 */
    data?: AuthorProfile
  }

  // ---------------------------------------------------------------------------
  // 作者视频
  // ---------------------------------------------------------------------------

  /** 视频引用：每项只能传 `aid` 或 `bvid` 之一，同时传或都不传会本地抛错。 */
  type AuthorVideoRef =
    | { aid: number; bvid?: never }
    | { bvid: string; aid?: never }

  interface AuthorVideosReq {
    /** 1–50 项；SDK 会按 aid/bvid 去重并保留首次出现顺序。 */
    videos: AuthorVideoRef[]
  }

  interface AuthorVideo {
    aid: number
    bvid: string
    title: string
    /** 封面地址，SDK 已归一化 CDN 域名。 */
    cover: string
    description: string
    /** 发布时间，时间戳。 */
    publishTime: number
    /** 总时长，单位由后端定义。 */
    duration: number
    /** 分区名称。 */
    partition?: string
    /** 分 P 列表。 */
    pages: Array<{
      page: number
      title: string
      duration: number
    }>
    /** 稿件统计数据。 */
    stat: {
      view: number
      like: number
      coin: number
      favorite: number
      share: number
      comment: number
      danmaku: number
    }
    /** 付费相关标记。 */
    pay: {
      /** 是否充电专属。 */
      chargingPay: boolean
      /** 是否付费稿件。 */
      paid: boolean
    }
    /** 所属合集 id；不属于任何合集时缺省。 */
    seasonId?: number
    /** 排行信息；无排行数据时缺省。 */
    rank?: {
      now: number
      highest: number
    }
  }

  interface AuthorVideoItem {
    /** 回显本次请求传入的引用，用于与请求项对应。 */
    ref: AuthorVideoRef
    status: ToyItemStatus
    /** `status` 非 `ok` 时缺省（如作者未参与该视频创作、视频不可见）。 */
    data?: AuthorVideo
  }

  interface AuthorVideosResp {
    /** 整体状态；部分项失败时为 `partial`。 */
    status: ToyDataStatus
    items: AuthorVideoItem[]
  }

  // ---------------------------------------------------------------------------
  // 作者互动关系
  // ---------------------------------------------------------------------------

  interface AuthorRelation {
    /** 当前访问用户是否已关注该作者。 */
    isFollowing: boolean
    /** 当前访问用户是否就是该 Toy 作者本人。 */
    isAuthor: boolean
    /** 是否为老粉。 */
    isOldFan: boolean
    /** 是否持有该作者的粉丝勋章。 */
    hasFanMedal: boolean
    /** 勋章名称；无勋章时缺省。 */
    fanMedalName?: string
    /** 勋章等级；无勋章时缺省。 */
    fanMedalLevel?: number
    /** 勋章是否处于点亮状态；无勋章时缺省。 */
    isFanMedalActive?: boolean
    /** 当前是否正在对该作者进行包月充电。 */
    isCharging: boolean
    /** 关注时间，时间戳；未关注时缺省。 */
    followTime?: number
  }

  interface AuthorRelationResp {
    status: ToyDataStatus
    /** `status` 非 `ok` 时缺省。 */
    data?: AuthorRelation
  }

  // ---------------------------------------------------------------------------
  // 视频互动数据
  // ---------------------------------------------------------------------------

  interface VideoUserActionsReq {
    /** 1–50 个正整数 aid；SDK 会去重并保留首次出现顺序。 */
    aids: number[]
  }

  interface VideoUserActionItem {
    aid: number
    status: ToyItemStatus
    /** 是否已点赞；`status` 非 `ok` 时缺省。 */
    liked?: boolean
    /** 已投币数；`status` 非 `ok` 时缺省。 */
    coinCount?: number
    /** 是否已收藏；`status` 非 `ok` 时缺省。 */
    favorited?: boolean
  }

  interface VideoUserActionsResp {
    /** 整体状态；部分项失败时为 `partial`。 */
    status: ToyDataStatus
    items: VideoUserActionItem[]
  }

  // ---------------------------------------------------------------------------
  // 排行榜
  // ---------------------------------------------------------------------------

  /** 榜单周期：总榜（永久）/ 月 / 周 / 日。 */
  type RankPeriod = 'all' | 'month' | 'week' | 'day'

  interface SubmitScoreReq {
    /** 榜位，固定 1 / 2 / 3（含义由 toy 自定义），不传默认 1；非法值本地抛错。 */
    board?: number
    /**
     * 本次成绩的绝对分数，不是增量。整数，取值范围 -16777216 ~ 16777215，
     * 允许 0 与负数；超出范围本地抛错。服务端只保留该榜位的历史最高分。
     */
    score: number
  }

  interface SubmitScoreResp {
    /** 我的总榜（all）历史最高分，已合并本次提交。 */
    score: number
  }

  interface RankListReq {
    /** 榜位，固定 1 / 2 / 3，不传默认 1。 */
    board?: number
    /** 周期，不传按总榜 `all`。 */
    period?: RankPeriod
    /** 返回名次数量；不传或超上限按后端默认（≤100）。 */
    limit?: number
  }

  /** 榜单单行：名次 + 历史最高分 + 展示用昵称/头像，不含 uid。 */
  interface RankItem {
    rank: number
    score: number
    nickname: string
    /** 头像地址，SDK 已归一化 CDN 域名。 */
    avatar: string
  }

  interface MyRankReq {
    /** 榜位，固定 1 / 2 / 3，不传默认 1。 */
    board?: number
    /** 周期，不传按总榜 `all`。 */
    period?: RankPeriod
  }

  interface MyRankResp {
    /** 是否已上榜。分数允许 0 / 负，判断是否上榜必须用本字段，不能用 `score`。 */
    ranked: boolean
    /** 我的名次，从 1 起，唯一不并列（同分先达成者靠前）；未上榜为 0。 */
    rank: number
    /** 我的历史最高分；未上榜为 0。 */
    score: number
  }

  // ---------------------------------------------------------------------------
  // 媒体能力（摄像头 / 麦克风）
  // ---------------------------------------------------------------------------

  /**
   * 申请摄像头的可选项，仅 `requestCamera` 使用。
   *
   * 只接受 `facingMode` 一个字段：传入其他字段、或传非普通对象（数组 / 字符串 / null 等）
   * 时 SDK 本地抛错。`requestMicrophone` 不接受任何参数。
   */
  interface MediaRelayOptions {
    /** 摄像头朝向：`'user'` 前置、`'environment'` 后置。不传默认前置。 */
    facingMode?: 'user' | 'environment'
  }

  // ---------------------------------------------------------------------------
  // window.toy 的公开 API 面
  // ---------------------------------------------------------------------------

  interface Toy {
    /**
     * 判断当前环境是否支持指定能力。传能力名（如 `'saveImageToAlbum'`）即可，
     * 带不带 `toy.` 前缀都能匹配。
     *
     * 端外 Web 不支持 `saveImageToAlbum` / `share` / `closeBrowser`，其余能力两端一致
     * （二维码 `getQrCode` 两端均可用）。
     */
    isSupport(ability: string): Promise<boolean>

    /**
     * 跳转到指定页面。
     *
     * 必须在用户手势事件（如 click）中调用：SDK 会检查 `navigator.userActivation`，
     * 无有效用户激活时抛错。端内为原生跳转，端外新开标签页。
     */
    navigate(req: NavigateReq): Promise<void>

    /**
     * 保存图片到系统相册。**仅 B站 App 内可用**，Web 端调用直接抛错。
     *
     * Web 端请改用标准浏览器下载能力（`<a download>` 或 canvas blob URL，需用户点击触发）。
     */
    saveImageToAlbum(req: SaveImageReq): Promise<SaveImageResp>

    /**
     * 拉起 B站 App 的分享面板。**仅 B站 App 内可用**，Web 端调用直接抛错。
     *
     * 只传相对当前 Toy 的 `path`，完整分享链接由平台生成，
     * 避免分享链接被伪造指向其他 Toy 或外部站点。`path` 越界抛 `invalid_param`，
     * 页面不在 `/toy/<slug>/` 路径下时抛 `unsupported`。
     */
    share(req: ShareReq): Promise<void>

    /**
     * 生成指向当前 Toy 内某个页面的二维码，返回可直接用作 `img.src` 的 PNG base64 图片。
     * **App 端和 Web 端都可用**。
     *
     * 用途不限于分享：跨设备接力（PC 上扫码到手机继续玩）、结算页海报、线下展示都适用。
     * 区别于 `share`，本方法不拉起分享面板，而是把链接编码成二维码交给 Toy 自行展示。
     * 两个入参都可省略：`toy.getQrCode()` 即当前 Toy 首页的二维码。
     *
     * 只能编码当前 Toy 内的页面链接，不能编码任意文本：二维码内容同样由平台生成，
     * Toy 不能自行指定完整 URL。如需为任意字符串生成二维码，请自行在 Toy 内
     * 打包二维码库。`path` 越界或 `size` 非法抛 `invalid_param`，
     * 页面不在 `/toy/<slug>/` 路径下时抛 `unsupported`。
     */
    getQrCode(req?: QrCodeReq): Promise<QrCodeResp>

    /** 关闭当前 WebView 容器。**仅 B站 App 内可用**，Web 端调用直接抛错。 */
    closeBrowser(): Promise<void>

    /**
     * 获取当前登录用户的头像、昵称与当前 Toy 内的稳定假名标识。
     *
     * OpenID 模式启用后，已有未过期的 profile v1/v2 授权会直接复用，不重复弹窗；没有有效授权时，首次调用需由用户手势触发，并由平台展示“获取你的昵称、头像和当前 Toy 内用户标识”固定的用户数据确认弹窗（Toy 不能自定义弹窗内容），接受后写入 v2 授权。模式关闭时省略 toyOpenId。
     * 用户拒绝、未登录或在外部手机浏览器中调用时 Promise reject（外部浏览器会先引导打开 B站 App）。用户资料确认统一使用正文“你的 B站昵称、头像和仅用于当前 Toy 的用户标识，将用于当前 Toy 内展示和关联数据；不会向 Toy 提供你的 UID，也不能用于跨 Toy 识别。”，不区分 v1/v2 文案配置。`toyOpenId` 仅用于当前 Toy 内关联用户，不得写入埋点或公开日志。
     */
    getUserProfile(): Promise<UserProfileResp>

    /**
     * 获取当前 Toy 作者的公开资料、账号统计、稿件数、充电聚合与粉丝勋章配置。
     * 不能指定作者，固定取当前 Toy 的作者。
     */
    getAuthorProfile(): Promise<AuthorProfileResp>

    /**
     * 批量获取当前 Toy 作者的视频公开信息，含作者以联合投稿（共同创作）身份参与的视频。
     * 作者未参与创作、或对当前用户不可见的视频，对应 item 只返回 `status`，不含 `data`。
     */
    getAuthorVideos(req: AuthorVideosReq): Promise<AuthorVideosResp>

    /**
     * 获取当前访问用户与当前 Toy 作者的关注、老粉、粉丝勋章状态，
     * 以及当前是否正在对该作者进行包月充电。
     *
     * 只校验登录态，不触发用户数据确认弹窗。外部手机浏览器返回 `status: 'unsupported'`
     * 并引导打开 B站 App。
     */
    getAuthorRelation(): Promise<AuthorRelationResp>

    /**
     * 获取当前访问用户对当前作者视频（含作者以联合投稿身份参与的视频）的点赞、投币、收藏状态。
     *
     * 只校验登录态，不触发用户数据确认弹窗。外部手机浏览器返回
     * `status: 'unsupported'` 且 `items` 为空数组。
     */
    getVideoUserActions(req: VideoUserActionsReq): Promise<VideoUserActionsResp>

    /**
     * 读取云存储。不传或传空数组读取当前用户在该 Toy 下的全部数据；
     * 未命中的 key 不出现在结果中。
     *
     * 需用户已登录，按「登录用户 + Toy」双维度隔离，不触发用户数据确认。
     * key 不满足 `[a-zA-Z0-9_-]{1,128}` 时本地抛错。
     */
    getCloudStorage(keys?: string[]): Promise<Record<string, string>>

    /**
     * 批量写入云存储（upsert），同 key 覆盖旧值。
     *
     * `items` 必须是普通对象（传数组 / 字符串 / null 会本地抛错）。
     * key 只能含字母、数字、下划线、短横线且 ≤128 字节；value 为字符串，
     * 字节上限由服务端校验（存对象请自行 `JSON.stringify`）。
     * 单个 Toy 的 key 数量上限由服务端拦截。
     */
    setCloudStorage(items: Record<string, string>): Promise<void>

    /** 批量删除云存储中指定的 key。key 格式非法时本地抛错。 */
    removeCloudStorage(keys: string[]): Promise<void>

    /**
     * 上报分数到排行榜。需用户已登录，首次提交前由平台完成用户数据确认。
     * 按「toy + 榜位 + 周期」隔离，同榜位只保留历史最高分，本次更低不覆盖。
     */
    submitScore(req: SubmitScoreReq): Promise<SubmitScoreResp>

    /**
     * 读取榜单，游客可读。返回前 `limit` 名，固定从高到低；
     * 同分时先达成者靠前，名次唯一、不并列。
     */
    getRankList(req?: RankListReq): Promise<RankItem[]>

    /** 查询我在指定榜单的排名。需用户已登录；是否上榜必须用 `ranked` 判断。 */
    getMyRank(req?: MyRankReq): Promise<MyRankResp>

    /**
     * 申请摄像头，返回浏览器原生的实时 `MediaStream`（视频轨），可直接赋给
     * `<video>` 的 `srcObject` 渲染，或交给 canvas / WebGL 逐帧处理。
     *
     * **必须由用户点击等手势事件直接触发**：SDK 会检查 `navigator.userActivation`，
     * 无有效用户激活时抛错。首次申请由平台展示摄像头业务授权弹窗，同意后按
     * 「登录用户 + Toy + 设备」记录，后续不重复展示；随后仍会由 App 或浏览器
     * 展示系统权限框。
     *
     * `options` 只接受 `facingMode`，多传字段或传非普通对象会本地抛错。
     * 用户拒绝业务授权、系统拒绝、设备缺失或被占用时 Promise reject，
     * `error.name` 为 `BusinessDenied` / `NotAllowedError` / `NotFoundError` /
     * `NotReadableError` / `AbortError` 等标准错误名。
     *
     * 使用结束后必须调用 `toy.stopMedia(stream)` 释放设备，否则摄像头保持占用。
     */
    requestCamera(options?: MediaRelayOptions): Promise<MediaStream>

    /**
     * 申请麦克风，返回浏览器原生的**实时** `MediaStream`（音频轨）。
     *
     * 注意返回值的性质：它是可持续读取的实时音频流，**不是录音文件**
     * （没有 Blob / 本地路径），**也不是音量数值**。要得到录音文件或音量，
     * 用浏览器原生 API 在这个流上自行处理，SDK 不提供这两项能力：
     * - **录音**：用原生 `MediaRecorder` 接收本流并收集数据，自行编码成文件。
     * - **获取声音大小**：用原生 `AudioContext` 创建 `AnalyserNode`，把本流接入后
     *   读取频域 / 时域数据自行换算音量。
     *
     * **必须由用户点击等手势事件直接触发**：SDK 会检查 `navigator.userActivation`，
     * 无有效用户激活时抛错。首次申请由平台展示麦克风业务授权弹窗（与摄像头分别
     * 独立授权），同意后按「登录用户 + Toy + 设备」记录；随后仍会由 App 或浏览器
     * 展示系统权限框。
     *
     * 不接受任何参数，传参会本地抛错。被拒 / 采集失败时的 `error.name` 同
     * `requestCamera`。使用结束后必须调用 `toy.stopMedia(stream)` 释放设备。
     */
    requestMicrophone(): Promise<MediaStream>

    /**
     * 释放摄像头 / 麦克风：停止该流对应的会话，并关闭采集设备
     * （摄像头指示灯熄灭）。
     *
     * 参数必须是 `requestCamera` / `requestMicrophone` 返回的那个 `MediaStream`
     * 实例（SDK 以流对象为句柄定位会话），传入其他值本地抛错；传入已释放或非本
     * SDK 产生的流不会报错，直接静默返回。
     *
     * 摄像头与麦克风各自的流需要分别调用释放。
     */
    stopMedia(stream: MediaStream): Promise<void>
  }
}

// 全局声明。本文件是 ambient 声明文件（没有顶层 import / export），
// 放进项目后 TypeScript 自动加载，`window.toy` 与 `ToySDK.*` 均可直接使用。
interface Window {
  /** Toy JS SDK 实例，由 toy-sdk.js 加载后挂载到全局。 */
  toy: ToySDK.Toy
}

/** Toy JS SDK 实例（等价于 `window.toy`）。 */
declare const toy: ToySDK.Toy
