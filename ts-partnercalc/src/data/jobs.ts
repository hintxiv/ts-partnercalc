import { Job } from 'models'
import { preserve } from 'util/typeutils'

export const JOBS = preserve<Job>()({
    Unknown: {
        name: 'Unknown',
        iconPath: '/jobicons/dnc.svg',
        color: '#000000',
    },
    Dancer: {
        name: 'Dancer',
        iconPath: '/jobicons/dnc.svg',
        color: '#000000',
    },
    Machinist: {
        name: 'Machinist',
        iconPath: '/jobicons/mch.svg',
        color: '#000000',
    },
})
