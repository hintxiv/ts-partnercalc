import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const SAM_ACTIONS = preserve<Action>()({
    ENPI: {
        name: 'Enpi',
        id: 7478,
        generatesEsprit: true,
    },
    FUGA: {
        name: 'Fuga',
        id: 7483,
        generatesEsprit: true,
    },
    GEKKO: {
        name: 'Gekko',
        id: 7481,
        generatesEsprit: true,
    },
    HAKAZE: {
        name: 'Hakaze',
        id: 7477,
        generatesEsprit: true,
    },
    HIGANBANA: {
        name: 'Higanbana',
        id: 7489,
        generatesEsprit: true,
    },
    IAIJUTSU: {
        name: 'Iaijutsu',
        id: 7867,
        generatesEsprit: true,
    },
    JINPU: {
        name: 'Jinpu',
        id: 7478,
        generatesEsprit: true,
    },
    KASHA: {
        name: 'Kasha',
        id: 7482,
        generatesEsprit: true,
    },
    MANGETSU: {
        name: 'Mangetsu',
        id: 7484,
        generatesEsprit: true,
    },
    MIDARE_SETSUGEKKA: {
        name: 'Midare Setsugekka',
        id: 7487,
        generatesEsprit: true,
    },
    KAESHI_SETSUGEKKA: {
        name: 'Kaeshi Setsugekka',
        id: 16486,
        autoCrit: true,
    },
    OKA: {
        name: 'Oka',
        id: 7485,
        generatesEsprit: true,
    },
    SHIFU: {
        name: 'Shifu',
        id: 7479,
        generatesEsprit: true,
    },
    TENKA_GOKEN: {
        name: 'Tenka Goken',
        id: 7488,
        generatesEsprit: true,
    },
    YUKIKAZE: {
        name: 'Yukikaze',
        id: 7480,
        generatesEsprit: true,
    },
    OGI_NAMIKIRI: {
        name: 'Ogi Namikiri',
        id: 25781,
        generatesEsprit: true,
        autoCrit: true,
    },
    KAESHI_NAMIKIRI: {
        name: 'Kaeshi Namikiri',
        id: 25782,
        autoCrit: true,
    },
    FUKO: {
        name: 'Fuko',
        id: 25780,
        generatesEsprit: true,
    },
})
