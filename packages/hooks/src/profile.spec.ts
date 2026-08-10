import { describe, test, expect } from 'bun:test'
import { screen, renderHook } from '@testing-library/react'
import { useProfile, useProfileInject } from './profile'

describe('profile', () => {
    test('inject', () => {
        expect(() => renderHook(() => useProfile())).toThrow()
        // const inject = renderHook(() => useProfileInject())
    })
    test('no inject throw', () => {
        expect(() => renderHook(() => useProfile())).toThrow()
        // const inject = renderHook(() => useProfileInject())
    })
})
