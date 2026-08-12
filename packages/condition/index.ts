export type ConditionNode = string | ConditionTree
export interface ConditionTree extends Array<ConditionNode> {}

export type PropertyContainer = Record<string, any>

export function parse(condition: string): ConditionTree {
    const conditions: ConditionTree = []
    const length = condition.length
    const stack: ConditionTree[] = []
    stack.unshift(conditions)
    let cursor = 0

    const catchString = (i: number): void => {
        const str = condition.substring(cursor, i).trim()
        cursor = i
        if (str) stack[0]?.push(str)
    }

    for (let i = 0; i < length; i++) {
        switch (condition[i]) {
            case ' ':
                continue

            case '(': {
                catchString(i)
                cursor++
                const sub: ConditionTree = []
                stack[0]?.push(sub)
                stack.unshift(sub)
                break
            }
            case ')':
                catchString(i)
                cursor++
                stack.shift()
                break

            case '|':
            case '&':
                catchString(i)
                catchString(i + 1)
                break

            default:
                continue
        }
    }

    catchString(length)
    return conditions
}

export function check(property: PropertyContainer, condition: string): boolean {
    const conditions = parse(condition)
    return checkParsedConditions(property, conditions)
}

/**
 * 递归计算已解析出来的多维语法树结果
 */
function checkParsedConditions(
    property: PropertyContainer,
    conditions: ConditionNode,
): boolean {
    // 如果已经剥离到了最底层的纯字符串表达式（如 'AGE>10'），直接移交核心原子判定器
    if (!Array.isArray(conditions)) {
        return checkProp(property, conditions)
    }

    if (conditions.length === 0) return true
    if (conditions.length === 1) {
        return checkParsedConditions(property, conditions[0]!)
    }

    let ret = checkParsedConditions(property, conditions[0]!)
    for (let i = 1; i < conditions.length; i += 2) {
        const operator = conditions[i]
        const nextNode = conditions[i + 1]

        // 防御性拦截，防止表达式残缺或配置错误引发崩溃
        if (nextNode === undefined) return false

        switch (operator) {
            case '&':
                if (ret) {
                    ret = checkParsedConditions(property, nextNode)
                }
                break
            case '|':
                if (ret) return true
                ret = checkParsedConditions(property, nextNode)
                break
            default:
                return false
        }
    }
    return ret
}

function checkProp(property: PropertyContainer, condition: string): boolean {
    const length = condition.length
    let i = condition.search(/[><!?=]/)

    // 防御处理：如果没有找到任何操作符，视为非法表达式直接拒签
    if (i === -1) return false

    const prop = condition.substring(0, i)
    // 判断是否是双字符操作符（如 >=, <=, !=），若是则向前多吞一个字符位
    const isDoubleSymbol = condition[i + 1] === '='
    const symbol = condition.substring(i, (i += isDoubleSymbol ? 2 : 1))
    const d = condition.substring(i, length)

    const propData = property[prop]
    const conditionData: number | any[] =
        d[0] === '[' ? JSON.parse(d) : Number(d)

    switch (symbol) {
        case '>':
            return (propData ?? 0) > conditionData
        case '<':
            return (propData ?? 0) < conditionData
        case '>=':
            return (propData ?? 0) >= conditionData
        case '<=':
            return (propData ?? 0) <= conditionData
        case '=':
            if (propData instanceof Set) {
                return propData.has(conditionData)
            }
            if (Array.isArray(propData)) {
                return propData.includes(conditionData)
            }
            return (propData ?? 0) == conditionData
        case '!=':
            if (propData instanceof Set) {
                return !propData.has(conditionData)
            }
            if (Array.isArray(propData)) {
                return !propData.includes(conditionData)
            }
            return (propData ?? 0) != conditionData

        case '?': // 🌟 包含判定符（如 属性值 是否在 [1,2,3] 数组范围内）
            if (propData instanceof Set) {
                if (Array.isArray(conditionData)) {
                    for (const c of conditionData) {
                        if (propData.has(c)) return true
                    }
                }
                return false
            }
            if (Array.isArray(propData)) {
                if (Array.isArray(conditionData)) {
                    for (const p of propData) {
                        if (conditionData.includes(p)) return true
                    }
                }
                return false
            }
            if (Array.isArray(conditionData)) {
                return conditionData.includes(propData)
            }
            return false

        case '!': // 🌟 排除判定符（如 属性值 是否不存在于 [1,2,3] 数组中）
            if (propData instanceof Set) {
                if (Array.isArray(conditionData)) {
                    for (const c of conditionData) {
                        if (propData.has(c)) return false
                    }
                }
                return true
            }
            if (Array.isArray(propData)) {
                if (Array.isArray(conditionData)) {
                    for (const p of propData) {
                        if (conditionData.includes(p)) return false
                    }
                }
                return true
            }
            if (Array.isArray(conditionData)) {
                return !conditionData.includes(propData)
            }
            return true

        default:
            return false
    }
}
