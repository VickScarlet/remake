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

  interface ReportActionReq {
    /** UP 主自定义的动作标识。 */
    userEventId: string
  }

  // ---------------------------------------------------------------------------
  // 用户信息
  // ---------------------------------------------------------------------------

  interface UserProfileResp {
    /** 头像地址，SDK 已统一归一化为 https 与 p0 CDN 域名。 */
    avatar: string
    /** 昵称。 */
    nickname: string
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
   * - `author_mismatch`: 请求的资源不属于当前 Toy 作者
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
    /** `status` 非 `ok` 时缺省（如非当前作者、视频不可见）。 */
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
  // 媒体能力
  // ---------------------------------------------------------------------------

  interface MediaRelayOptions {
    /** 摄像头朝向，不传默认使用前置摄像头。 */
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
     * 端外 Web 不支持 `saveImageToAlbum` / `closeBrowser`，其余能力两端一致。
     */
    isSupport(ability: string): Promise<boolean>

    /**
     * 跳转到指定页面。
     *
     * 必须在用户手势事件（如 click）中调用：SDK 会检查 `navigator.userActivation`，
     * 无有效用户激活时抛错。端内走 JSB 原生跳转，端外用 `window.open` 新开标签页。
     */
    navigate(req: NavigateReq): Promise<void>

    /**
     * 保存图片到系统相册。**仅 B站 App 内可用**，Web 端调用直接抛错。
     *
     * Web 端请改用标准浏览器下载能力（`<a download>` 或 canvas blob URL，需用户点击触发）。
     */
    saveImageToAlbum(req: SaveImageReq): Promise<SaveImageResp>

    /** 关闭当前 WebView 容器。**仅 B站 App 内可用**，Web 端调用直接抛错。 */
    closeBrowser(): Promise<void>

    /**
     * 获取当前登录用户的头像与昵称。
     *
     * 首次调用需由用户手势触发，并由平台展示固定的用户数据确认弹窗（Toy 不能自定义弹窗内容）；
     * 用户拒绝、未登录或在外部手机浏览器中调用时 Promise reject（外部浏览器会先引导打开 B站 App）。
     */
    getUserProfile(): Promise<UserProfileResp>

    /** 上报 UP 主自定义的用户动作。 */
    reportAction(req: ReportActionReq): Promise<void>

    /**
     * 获取当前 Toy 作者的公开资料、账号统计、稿件数、充电聚合与粉丝勋章配置。
     * 不能指定作者，固定取当前 Toy 的作者。
     */
    getAuthorProfile(): Promise<AuthorProfileResp>

    /**
     * 批量获取当前 Toy 作者的视频公开信息。
     * 非当前作者或对当前用户不可见的视频，对应 item 只返回 `status`，不含 `data`。
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
     * 获取当前访问用户对当前作者视频的点赞、投币、收藏状态。
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
     * 申请摄像头业务授权和系统权限，并返回中继的媒体流。
     * 必须在用户手势事件中调用。
     */
    requestCamera(options?: MediaRelayOptions): Promise<MediaStream>

    /**
     * 申请麦克风业务授权和系统权限，并返回中继的媒体流。
     * 不接受参数，且必须在用户手势事件中调用。
     */
    requestMicrophone(): Promise<MediaStream>

    /** 停止媒体中继并释放摄像头或麦克风设备。 */
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
