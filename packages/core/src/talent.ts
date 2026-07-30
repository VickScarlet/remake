import type { TalentEffect } from '@remake/data/talent'
import talents from '@remake/data/talent'
import type { Properties } from './state'
import { pick } from '@remake/vitex'

const TalentEffectPropertiesKeyMapper = {
    MNY: () => 'money',
    STR: () => 'strength',
    INT: () => 'intelligence',
    CHR: () => 'charm',
    SPR: () => 'spirit',
    RND: () => pick(['money', 'strength', 'intelligence', 'charm', 'spirit'])!,
} as Record<keyof TalentEffect, () => keyof Properties>

export const count = talents.size

export function get(talent: number) {
    return talents.get(talent)
}

export function random(talent: number) {}
