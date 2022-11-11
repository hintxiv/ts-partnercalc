import { CircularProgress } from '@material-ui/core'
import { Friend } from 'api/fflogs/fight'
import { FFLogsParser } from 'api/fflogs/parser'
import { useTitle } from 'components/Title'
import { JOBS } from 'data/jobs'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Simulator } from 'simulate/simulator'
import { ComputedStandard } from 'types'
import styles from './Result.module.css'
import { StandardWindow } from './StandardWindow/StandardWindow'

export function Result() {
    const { reportID, fightID } = useParams()
    const { setTitle } = useTitle()
    const [ready, setReady] = useState<boolean>(false)
    const [standards, setStandards] = useState<ComputedStandard[]>([])
    const [dancer, setDancer] = useState<Friend>()

    const parser = useMemo(() => {
        return new FFLogsParser(reportID, parseInt(fightID))
    }, [fightID, reportID])

    useEffect(() => {
        const simulate = async () => {
            await parser.init()

            // TODO error handling
            const dancer = parser.fight.friends.find(friend => friend.job === JOBS.Dancer)
            setDancer(dancer)

            const simulator = new Simulator(parser, dancer)
            setStandards(await simulator.calculatePartnerDamage())
            setReady(true)
        }
        simulate().catch(console.error)
    }, [parser, setReady, setStandards])

    useEffect(() => {
        if (parser != null && dancer != null) {
            setTitle(`${dancer.name} - ${parser.fight.encounter}`)
        }
    }, [dancer, parser, setTitle])

    const generateTimestampLink = (start: number, end: number) => {
        const baseReportURL = 'https://www.fflogs.com/reports/'
        const fightURL = baseReportURL + `${parser.reportID}#fight=${parser.fightID}`

        return fightURL + `&type=damage-done&start=${start}&end=${end}`
    }

    if (!ready) {
        return <CircularProgress size={80} className={styles.loading} />
    }

    return <div>
        <div className={styles.fadeTop} />
        <div className={styles.result}>
            {standards.map(standard =>
                <StandardWindow
                    standard={standard}
                    dancer={dancer}
                    formatTimestamp={parser.formatTimestamp}
                    generateTimestampLink={generateTimestampLink}
                    key={standard.start}
                />
            )}
        </div>
        <div className={styles.fadeBottom} />
    </div>
}
