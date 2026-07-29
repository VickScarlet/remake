import { expect, test, describe } from 'bun:test'
import { checkCondition } from '.'

// 定义属性 mock 字典的类型契约
interface MockProperties {
    [key: string]: number | number[]
}

/**
 * 属性注入高阶函数：模拟角色属性管理类
 */
function withProp(prop: MockProperties) {
    const p = {
        get(key: string): any {
            return prop[key]
        },
    }
    return (condition: string): boolean => checkCondition(p, condition)
}

describe('condition', () => {
    // 实例化一个带满各种脏数据（数字、数组、空数组）的强类型测试代理
    const check = withProp({
        n1: 0,
        n2: -10,
        n3: 10,
        nl1: [1, 2, 3],
        nl2: [0],
        nl3: [],
    })

    test('gt(>)', () => {
        expect(check('n3>11')).toBe(false)
        expect(check('n3>10')).toBe(false)
        expect(check('n3>9')).toBe(true)
    })

    test('gte(>=)', () => {
        expect(check('n3>=11')).toBe(false)
        expect(check('n3>=10')).toBe(true)
        expect(check('n3>=9')).toBe(true)
    })

    test('lt(<)', () => {
        expect(check('n3<9')).toBe(false)
        expect(check('n3<10')).toBe(false)
        expect(check('n3<11')).toBe(true)
    })

    test('lte(<=)', () => {
        expect(check('n3<=9')).toBe(false)
        expect(check('n3<=10')).toBe(true)
        expect(check('n3<=11')).toBe(true)
    })

    test('eq(=)', () => {
        expect(check('n3=9')).toBe(false)
        expect(check('n3=10')).toBe(true)
        expect(check('n3=11')).toBe(false)
        expect(check('nl1=0')).toBe(false)
        expect(check('nl1=1')).toBe(true)
        expect(check('nl1=2')).toBe(true)
        expect(check('nl1=3')).toBe(true)
    })

    test('ne(!=)', () => {
        expect(check('n3!=9')).toBe(true)
        expect(check('n3!=10')).toBe(false)
        expect(check('n3!=11')).toBe(true)
        expect(check('nl1!=0')).toBe(true)
        expect(check('nl1!=1')).toBe(false)
        expect(check('nl1!=2')).toBe(false)
        expect(check('nl1!=3')).toBe(false)
    })

    test('in(?)', () => {
        expect(check('n3?[1,2,3]')).toBe(false)
        expect(check('n3?[10,11,12]')).toBe(true)
        expect(check('nl1?[0,1]')).toBe(true)
        expect(check('nl2?[1,2,3]')).toBe(false)
        expect(check('nl3?[1,2,3]')).toBe(false)
        expect(check('nl2?[]')).toBe(false)
        expect(check('nl3?[]')).toBe(false)
    })

    test('notin(!)', () => {
        expect(check('n3![1,2,3]')).toBe(true)
        expect(check('n3![10,11,12]')).toBe(false)
        expect(check('nl1![0,1]')).toBe(false)
        expect(check('nl2![1,2,3]')).toBe(true)
        expect(check('nl3![1,2,3]')).toBe(true)
        expect(check('nl2![]')).toBe(true)
        expect(check('nl3![]')).toBe(true)
    })

    test('and(&)', () => {
        expect(check('n1>=0&n2<0')).toBe(true)
        expect(check('n2>0&n3>0')).toBe(false)
        expect(check('n2<0&n3<0')).toBe(false)
        expect(check('n2<0&n3>0')).toBe(true)
        expect(check('n1=0&n2<0&n3>0')).toBe(true)
        expect(check('n1=0&n2>0&n3>0')).toBe(false)
    })

    test('or(|)', () => {
        expect(check('n1>=0|n2<0')).toBe(true)
        expect(check('n2>0|n3>0')).toBe(true)
        expect(check('n2<0|n3<0')).toBe(true)
        expect(check('n2<0|n3>0')).toBe(true)
        expect(check('n2>0|n3<0')).toBe(false)
        expect(check('n1=0|n2<0|n3>0')).toBe(true)
        expect(check('n1=0|n2>0|n3>0')).toBe(true)
        expect(check('n1!=0|n2>0|n3<0')).toBe(false)
    })

    test('mix', () => {
        expect(check('(n1=0|n2<0|n3>0)&(n1=0|n2>0|n3>0)')).toBe(true)
        expect(check('(n1=0|n2<0|n3>0)&(n1!=0|n2>0|n3<0)')).toBe(false)
        expect(check('n1=0|n2<0|n3>0&n1!=0|n2>0|n3<0')).toBe(true)
        expect(check('(n1>0|n1?[-10,0])&(n2>0|n3![0,1])')).toBe(true)
        expect(check('(n1>0&n1?[-10,0])|(n2<0&n3![0,1])')).toBe(true)
    })
})
