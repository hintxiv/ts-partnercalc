import { CircularProgress } from '@material-ui/core'
import { Friend } from 'api/fflogs/fight'
import { FFLogsParser } from 'api/fflogs/parser'
import { useAsyncError } from 'components/ErrorBoundary/throwError'
import { useTitle } from 'components/Title'
import { JOBS } from 'data/jobs'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Simulator } from 'simulator/simulator'
import { ComputedStandard, OverallDamage } from 'types'
import { formatDamage } from 'util/format'
import styles from './Result.module.css'
import { OverallDisplay } from './StandardWindow/OverallDisplay'
import { StandardWindow } from './StandardWindow/StandardWindow'

export function Result() {
    const { reportID, fightID } = useParams()
    const { setTitle } = useTitle()
    const [ready, setReady] = useState<boolean>(false)
    const [standards, setStandards] = useState<ComputedStandard[]>([])
    const [overall, setOverall] = useState<OverallDamage>()
    const [dancer, setDancer] = useState<Friend>()
    const asyncThrow = useAsyncError()

    const parser = useMemo(() => {
        return new FFLogsParser(reportID, parseInt(fightID))
    }, [fightID, reportID])

    useEffect(() => {
        const simulate = async () => {
            await parser.init()

            const dancer = parser.fight.friends
                .find(friend => friend.job === JOBS.Dancer)

            if (dancer == null) {
                asyncThrow(new Error('Report does not have a Dancer.'))
            }

            setDancer(dancer)

            const simulator = new Simulator(parser, dancer)
            setStandards(await simulator.calculatePartnerDamage())
            setOverall(simulator.calculateOverallDamage())
            setReady(true)
        }
        simulate().catch(console.error)
    }, [asyncThrow, parser, setReady, setStandards])

    useEffect(() => {
        if (parser != null && dancer != null) {
            setTitle(`${parser.fight.encounter} - ${dancer.name}`)
        }
    }, [dancer, parser, setTitle])

    const generateTimestampLink = (start: number, end: number) => {
        const baseReportURL = 'https://www.fflogs.com/reports/'
        const fightURL = baseReportURL + `${parser.reportID}#fight=${parser.fightID}`

        return fightURL + `&type=damage-done&start=${start}&end=${end}`
    }

    const formatDPS = (damage: number) => {
        const duration = parser.fight.end - parser.fight.start
        const dps = damage / (duration / 1000)
        return formatDamage(dps)
    }

    if (!ready) {
        return <CircularProgress size={80} className={styles.loading} />
    }

    return <div>
        <div className={styles.fadeTop} />
        <div className={styles.result}>
            <OverallDisplay damage={overall} formatDPS={formatDPS} />
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
