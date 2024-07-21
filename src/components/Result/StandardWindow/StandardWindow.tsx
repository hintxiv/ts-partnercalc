import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
} from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import { Friend } from 'api/fflogs/fight'
import React, { useState } from 'react'
import { ComputedWindow } from 'types'
import { DamageGraph } from './DamageGraph/DamageGraph'
import { DamageTable } from './DamageTable/DamageTable'
import { DanceLog } from './DanceLog/DanceLog'
import styles from './StandardWindow.module.css'
import { NameChip, TimestampChip } from '../Chip'

interface StandardWindowProps {
    window: ComputedWindow
    dancer: Friend
    formatTimestamp: (time: number) => string
    generateTimestampLink: (start: number, end: number) => string
}

export function StandardWindow(props: StandardWindowProps) {
    const [expanded, setExpanded] = useState<string | false>(false)

    const start = props.formatTimestamp(props.window.start)
    const end = props.formatTimestamp(props.window.end)

    const partner = props.window.actualPartner

    const openTimestampLink = () => {
        const timestampURL = props.generateTimestampLink(props.window.start, props.window.end)
        window.open(timestampURL, '_blank', 'noopener,noreferrer')
    }

    const handleChange = (panel: string) => (
        _: React.ChangeEvent,
        isExpanded: boolean,
    ) => {
        setExpanded(isExpanded ? panel : false)
    }

    return <div className={styles.standardWindow}>
        <Card className={styles.card}>
            <div className={styles.rowContainer}>
                <div className={styles.partnered}>
                    <NameChip
                        name={props.dancer.name}
                        job={props.dancer.job}
                        className={styles.dancer}
                    />
                    <span className={styles.partneredText}>partnered</span>
                    <NameChip name={partner.name} job={partner.job} />
                </div>
                <div className={styles.timestamp}>
                    <TimestampChip
                        timestamp={start + ' - ' + end}
                        onClick={openTimestampLink}
                    />
                </div>
            </div>
        </Card>
        <Card className={styles.card + ' ' + styles.graph}>
            <DamageGraph players={props.window.players} />
        </Card>
        <div>
            <Accordion
                expanded={expanded === 'panel1'} onChange={handleChange('panel1')}
                TransitionProps={{ unmountOnExit: true }}
                className={styles.accordion}
            >
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    Damage Table
                </AccordionSummary>
                <AccordionDetails className={styles.accordionContent}>
                    <DamageTable players={props.window.players} />
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === 'panel2'} onChange={handleChange('panel2')}
                TransitionProps={{ unmountOnExit: true }}
                className={styles.accordion}
            >
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    Dance Log
                </AccordionSummary>
                <AccordionDetails className={styles.accordionContent}>
                    <DanceLog
                        events={props.window.events}
                        formatTimestamp={props.formatTimestamp}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    </div>
}
