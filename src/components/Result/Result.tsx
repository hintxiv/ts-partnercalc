import { CircularProgress } from '@material-ui/core'
import { FFLogsParser } from 'api/fflogs/parser'
import { JOBS } from 'data/jobs'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Simulator } from 'simulate/simulator'
import { ComputedStandard } from 'types'
import styles from './Result.module.css'
import { StandardWindow } from './StandardWindow/StandardWindow'

const MS_PER_MINUTE = 60000

export function Result() {
    const { reportID, fightID } = useParams()
    const [ready, setReady] = useState<boolean>(false)
    const [standards, setStandards] = useState<ComputedStandard[]>([])

    const parser = useMemo(() => {
        return new FFLogsParser(reportID, parseInt(fightID))
    }, [fightID, reportID])

    useEffect(() => {
        const simulate = async () => {
            await parser.init()
            console.log(parser.fight.friends)

            // Need a better place for this shit lol
            // (also pretty error handling)
            const dancer = parser.fight.friends.find(friend => friend.job === JOBS.Dancer)

            const simulator = new Simulator(parser, dancer)
            setStandards(await simulator.calculatePartnerDamage())
            setReady(true)
        }
        simulate().catch(console.error)
    }, [parser, setReady, setStandards])

    const formatTimestamp = (time: number) => {
        const elapsed = time - parser.fight.start
        const mm = Math.floor(elapsed / MS_PER_MINUTE)
        const ss = Math.floor((elapsed % MS_PER_MINUTE) / 1000)

        return `${mm < 10 ? '0' + mm : mm}:${ss < 10 ? '0' + ss : ss}`
    }

    if (!ready) {
        return <CircularProgress size={80} className={styles.loading} />
    }

    return <div className={styles.result}>
        {standards.map(standard =>
            <StandardWindow
                standard={standard}
                formatTimestamp={formatTimestamp}
                key={standard.start}
            />
        )}
    </div>
}
