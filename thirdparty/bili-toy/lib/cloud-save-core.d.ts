/**
 * 哔哩哔哩官方 ToyCloudSaveCore 核心分片存储算法组件环境类型声明文件 (Ambient Declaration)
 *
 * 说明：本文件专为官方无类型的 ToyCloudSaveCore.js 设计。
 * 放入项目后，TypeScript 会自动在全局识别该组件，红线报错将彻底消除。
 */

declare namespace ToyCloudSaveCoreSDK {
    /** 外部必须提供给该核心组件的底层持久化存储驱动接口契约 */
    interface IToyStorageDriver {
        /** 异步获取指定键值对记录 */
        get(keys: string[]): Promise<Record<string, any> | null | undefined>
        /** 异步设置并持久化键值对记录，附带当前的存储上下文 */
        set(
            record: Record<string, string>,
            context: IToyStorageContext,
        ): Promise<void>
    }

    /** 存储操作的阶段上下文 */
    interface IToyStorageContext {
        /** 当前操作的存储槽区 */
        bank: 'a' | 'b'
        /** 递增的存储世代号 */
        generation: number
        /** 当前落盘的具体物理阶段 */
        phase: 'chunks' | 'meta' | 'head'
    }

    /** 存档操作成功后返回的物理数据摘要 */
    interface IToySaveSummary {
        /** 写入的存储槽区 */
        bank: 'a' | 'b'
        /** 递增的世代代数 */
        generation: number
        /** 本次存盘的实际 UTF-8 字节数 */
        bytes: number
        /** 分片总块数 */
        chunks: number
        /** 数据流的 CRC32 校验和十六进制字符串 */
        checksum: string
    }

    /** 状态机向外部观察者派发的所有生命周期事件 */
    interface IToySaveEvent {
        type:
            | 'save:start'
            | 'save:phase'
            | 'save:verified'
            | 'save:success'
            | 'save:error'
            | 'save:rejected'
            | 'save:queued'
            | 'load:start'
            | 'load:success'
            | 'load:empty'
        at: number
        phase?: 'chunks' | 'meta' | 'head' | 'verify'
        bank?: 'a' | 'b'
        generation?: number
        bytes?: number
        chunks?: number
        checksum?: string
        fallback?: boolean
        recovered?: boolean
        source?: 'head' | 'scan' | 'fallback'
        pending?: number
        code?:
            | 'STORAGE_ERROR'
            | 'VERIFICATION_FAILED'
            | 'PAYLOAD_TOO_LARGE'
            | 'INVALID_PAYLOAD'
            | string
        found?: boolean
    }

    /** 观察者事件回调函数 */
    type IToySaveEventHandler = (
        event: Readonly<IToySaveEvent>,
    ) => void | Promise<void>

    /** 创建云存储实例所需的入参配置项 */
    interface IToyCloudSaveOptions {
        /** 必填：提供底层读写能力的本地适配驱动 */
        storage: IToyStorageDriver
        /** 必填：用于防冲突的唯一键值前缀 */
        prefix: string
        /** 选填：核心生命周期事件的全量观察者钩子 */
        onEvent?: IToySaveEventHandler
    }

    /** 分片明细列表项 */
    interface IToyChunkInspect {
        index: number
        chars: number
        preview: string
    }

    /** 全盘负载深度审阅快照返回值 */
    interface IToyPayloadInspection {
        json: string
        bytes: number
        base64Chars: number
        chunkCount: number
        checksum: string
        exceedsLimit: boolean
        chunks: IToyChunkInspect[]
    }

    /** 调试状态快照 */
    interface IToyDebugState {
        prefix: string
        pendingSaves: number
        activeSave: boolean
        head: {
            bank?: 'a' | 'b'
            generation?: number
            valid: boolean
            status?: string
        } | null
        banks: {
            a: {
                bank?: 'a' | 'b'
                generation?: number
                valid: boolean
                status?: string
            } | null
            b: {
                bank?: 'a' | 'b'
                generation?: number
                valid: boolean
                status?: string
            } | null
        }
        lastSave: IToySaveSummary | null
        lastLoad: any
        events: IToySaveEvent[]
    }

    /** 经由 createCloudSave 创建的物理隔离处理服务实例 API */
    interface IToyCloudSaveInstance {
        /** 写入保存云存档 */
        save(json: string): Promise<IToySaveSummary>
        /** 读取云存档 */
        load(): Promise<string | null>
        /** 导出内存调试快照 */
        getDebugState(): IToyDebugState
    }

    /** 对应官方核心 JS 脚本导出的顶级大对象契约 */
    interface CoreObject {
        /** 单个分卷分片的最大安全 Base64 字符容量边界（960） */
        readonly CHUNK_CHARS: 960
        /** 双槽双缓冲设计允许承载的单次数据最大分片切片物理上限（48 块） */
        readonly MAX_CHUNKS: 48
        /** 计算指定数据的标准 CRC32 校验和 */
        crc32Hex(input: string | ArrayBuffer | ArrayBufferView): string
        /** 前置透视并审阅即将进行云存的文件负载 */
        inspectPayload(json: string): IToyPayloadInspection
        /** 核心工厂构建器：构建具备高可靠双槽原子性保护的云存档处理服务 */
        createCloudSave(options: IToyCloudSaveOptions): IToyCloudSaveInstance
    }
}

// ----------------- 全局注入声明 -----------------
interface Window {
    /** 哔哩哔哩官方无类型的云存档核心分片存储组件。由本地或网络脚本执行后自动挂载。 */
    ToyCloudSaveCore: ToyCloudSaveCoreSDK.CoreObject
}

/** 哔哩哔哩官方无类型的云存档核心分片存储组件顶级全局变量。 */
declare const ToyCloudSaveCore: ToyCloudSaveCoreSDK.CoreObject
