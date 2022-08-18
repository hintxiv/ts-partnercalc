import { FFLogsParser } from 'api/fflogs/parser'
import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Simulator } from 'simulate/simulator'

export function Result() {
    const { reportID, fightID } = useParams()

    const parser = useMemo(() => {
        return new FFLogsParser(reportID, parseInt(fightID))
    }, [fightID, reportID])

    useEffect(() => {
        const simulate = async () => {
            await parser.init()
            console.log(parser.fight.friends)
            // TODO pick out the Dancer (not in frontend please)
            const simulator = new Simulator(parser, parser.fight.friends[3])
            simulator.calculatePartnerDamage()
        }
        simulate().catch(console.error)
    }, [parser])

    return <div>
        TODO frontend lol
    </div>
}
