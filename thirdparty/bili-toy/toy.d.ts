declare namespace toy {
    /**
     * B站 Toy 平台开放能力名称联合类型
     */
    type Ability =
        | 'navigate'
        | 'saveImageToAlbum'
        | 'closeBrowser'
        | 'getUserProfile'
        | 'reportAction'
        | 'getCloudStorage'
        | 'setCloudStorage'
        | 'removeCloudStorage'
        | 'getAuthorProfile'
        | 'getAuthorVideos'
        | 'getAuthorRelation'
        | 'getVideoUserActions'
        | 'submitScore'
        | 'getRankList'
        | 'getMyRank'

    /**
     * 判断当前 B站 App 宿主环境是否支持指定开放能力
     */
    function isSupport(ability: Ability): Promise<boolean>

    /** 跨页面/App组件跳转配置参数 */
    type NavigateRequest = {
        /** 目标页面类型：video(视频), space(空间), search(搜索), opus(图文动态), tribee(社区), toy(其它小游戏) */
        type: 'video' | 'space' | 'search' | 'opus' | 'tribee' | 'toy'
        /** 目标资源唯一标识 ID，如视频 BV 号、用户 mid、动态 id、游戏 id */
        id: string
        /** 额外附加参数，会作为 Query 或者是透传参数传递给目标承载页面 */
        extra?: Record<string, string>
    }
    /**
     * 跳转到指定 B站 App 原生或 H5 页面（注意：必须由用户手势或点击事件同步触发）
     */
    function navigate(req: NavigateRequest): Promise<void>

    /** 保存图片到相册的参数约束 */
    type SaveImageToAlbumRequest = (
        | {
              /** 网络图片的绝对 URL 地址 */
              url: string
              base64?: never
          }
        | {
              /** 带有 Data URI 前缀或纯 base64 的图片字符数据，体积最大硬限制 2M */
              base64: string
              url?: never
          }
    ) & {
        /** 客户端唤起操作系统申请相册写入权限时的引导提示文案 */
        hintMsg?: string
    }
    /**
     * 保存图片到系统相册（此 API 仅在 B站 App 宿主环境内环境生效）
     */
    function saveImageToAlbum(
        req: SaveImageToAlbumRequest,
    ): Promise<{ localPath: string }>

    /**
     * 关闭当前的 H5/小游戏浏览器容器，返回到上一级 App 原生界面
     */
    function closeBrowser(): Promise<void>

    /** 用户基本个人资料返回结果 */
    type UserProfile = {
        /** 用户 mid */
        mid: string
        /** 昵称 */
        nickname: string
        /** 头像绝对 URL 地址 */
        avatar: string
        /** 性别: 0-保密, 1-男, 2-女 */
        gender: 0 | 1 | 2
    }
    /**
     * 唤起 B站 原生授权弹窗，获取当前登录用户的公开个人资料
     */
    function getUserProfile(): Promise<UserProfile>

    /** 行为汇报参数配置 */
    type ReportActionRequest = {
        /** 行为埋点事件名/动作名 */
        action: string
        /** 汇报携带的属性字典 */
        label?: Record<string, string | number>
    }
    /**
     * 向 B站 开放平台数仓上报当前玩家的游戏行为埋点数据
     */
    function reportAction(req: ReportActionRequest): Promise<void>

    /** 获取云存储数据（托管数据）*/
    function getCloudStorage<K extends string[]>(
        keys?: [...K],
    ): Promise<{ [P in K[number]]?: string }>
    /** 设置/写入云存储数据 */
    function setCloudStorage(items: Record<string, string>): Promise<void>
    /** 移除指定的云存储键值对 */
    function removeCloudStorage(req: string[]): Promise<void>

    /** UP主/作者档案资料 */
    type AuthorProfile = {
        mid: string
        name: string
        face: string
        fans: number
    }
    /** 获取关联当前活动/游戏的UP主详细档案 */
    function getAuthorProfile(): Promise<AuthorProfile>

    /** 视频资产简单模型 */
    type VideoItem = {
        bvid: string
        title: string
        pic: string
        play: number
    }
    /** 获取当前活动/游戏的关联视频列表 */
    function getAuthorVideos(req: {
        page: number
        pageSize: number
    }): Promise<{ list: VideoItem[]; total: number }>

    /** 玩家与该关联UP主的关系状态 */
    type AuthorRelation = {
        /** 是否已关注该UP主 */
        isFollowing: boolean
        /** 是否是该UP主的特粉/大航海成员 */
        isVipRelation: boolean
    }
    /** 获取当前登录玩家与目标UP主之间的社交关注链状态 */
    function getAuthorRelation(): Promise<AuthorRelation>

    /** 用户针对某条视频的互动行为状态 */
    type VideoUserActions = {
        like: boolean // 是否点赞
        coin: boolean // 是否投币
        fav: boolean // 是否收藏
        share: boolean // 是否分享
    }
    /** 获取用户针对指定关联视频的点赞、投币、收藏、分享（三连）等原生行为状态 */
    function getVideoUserActions(req: {
        bvid: string
    }): Promise<VideoUserActions>

    /** 排行榜单项得分模型 */
    type RankItem = {
        rank: number
        mid: string
        nickname: string
        avatar: string
        score: number
    }

    /** 提交积分排行榜得分参数 */
    type SubmitScoreRequest = {
        /** 榜单唯一标识 ID */
        leaderboardId: string
        /** 当前局内取得的纯数字分数 */
        score: number
        /** 额外附加的自定义上下文字符串（如关卡详情等） */
        extra?: string
    }
    /**
     * 提交当前玩家的得分到 B站 开放平台官方托管的活动排行榜
     */
    function submitScore(
        req: SubmitScoreRequest,
    ): Promise<{ isNewRecord: boolean }>

    /**
     * 获取指定官方托管排行榜的分数列表
     */
    function getRankList(req: {
        leaderboardId: string
        page: number
        pageSize: number
    }): Promise<{ list: RankItem[]; total: number }>

    /**
     * 获取当前登录玩家自己在指定排行榜中的实时名次、分数等信息
     */
    function getMyRank(req: { leaderboardId: string }): Promise<RankItem>
}

interface Window {
    /** 哔哩哔哩 Toy 开放平台（H5游戏容器/小程序）专属官方高级运行时 JavaScript-SDK 挂载点 */
    readonly toy: typeof toy
}
