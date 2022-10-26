import { CircularProgress } from '@material-ui/core'
import { FFLogsParser } from 'api/fflogs/parser'
import { JOBS } from 'data/jobs'
import { ComputedStandard } from 'models'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Simulator } from 'simulate/simulator'
import styles from './Result.module.css'
import { StandardWindow } from './StandardWindow/StandardWindow'

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

    if (!ready) {
        return <CircularProgress size={80} className={styles.loading} />
    }

    return <div className={styles.result}>
        {standards.map(standard =>
            <StandardWindow standard={standard} key={standard.start} />
        )}
    </div>
}
