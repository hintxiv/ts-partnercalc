import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const SGE_ACTIONS = preserve<Action>()({
    PNEUMA: {
        name: 'Pneuma',
        id: 24318,
        generatesEsprit: true,
    },
    PHLEGMA_II: {
        name: 'Phlegma II',
        id: 24307,
        generatesEsprit: true,
    },
    PHLEGMA_III: {
        name: 'Phlegma III',
        id: 24313,
        generatesEsprit: true,
    },
    PHLEGMA: {
        name: 'Phlegma',
        id: 24289,
        generatesEsprit: true,
    },
    DOSIS: {
        name: 'Dosis',
        id: 24283,
        generatesEsprit: true,
    },
    DOSIS_II: {
        name: 'Dosis II',
        id: 24306,
        generatesEsprit: true,
    },
    DOSIS_III: {
        name: 'Dosis III',
        id: 24312,
        generatesEsprit: true,
    },
    EUKRASIAN_DOSIS: {
        name: 'Eukrasian Dosis',
        id: 24293,
        generatesEsprit: true,
    },
    EUKRASIAN_DOSIS_II: {
        name: 'Eukrasian Dosis II',
        id: 24308,
        generatesEsprit: true,
    },
    EUKRASIAN_DOSIS_III: {
        name: 'Eukrasian Dosis III',
        id: 24314,
        generatesEsprit: true,
    },
    DYSKRASIA: {
        name: 'Dyskrasia',
        id: 24297,
        generatesEsprit: true,
    },
    DYSKRASIA_II: {
        name: 'Dyskrasia II',
        id: 24315,
        generatesEsprit: true,
    },
    TOXIKON: {
        name: 'Toxikon',
        id: 24304,
        generatesEsprit: true,
    },
    TOXIKON_II: {
        name: 'Toxikon II',
        id: 24316,
        generatesEsprit: true,
    },
})
