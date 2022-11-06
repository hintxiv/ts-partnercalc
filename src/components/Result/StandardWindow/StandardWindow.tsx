import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
} from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import { Friend } from 'api/fflogs/fight'
import React, { useState } from 'react'
import { ComputedStandard } from 'types'
import { NameChip, TimestampChip } from '../Chip'
import { DamageGraph } from './DamageGraph/DamageGraph'
import { DamageTable } from './DamageTable/DamageTable'
import { DanceLog } from './DanceLog/DanceLog'
import styles from './StandardWindow.module.css'

interface StandardWindowProps {
    standard: ComputedStandard
    dancer: Friend
    formatTimestamp: (time: number) => string
    generateTimestampLink: (start: number, end: number) => string
}

export function StandardWindow(props: StandardWindowProps) {
    const [expanded, setExpanded] = useState<string | false>(false)

    const start = props.formatTimestamp(props.standard.start)
    const end = props.formatTimestamp(props.standard.end)

    const partner = props.standard.actualPartner

    const openTimestampLink = () => {
        const timestampURL = props.generateTimestampLink(props.standard.start, props.standard.end)
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
                    <NameChip name={props.dancer.name} job={props.dancer.job} />
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
            <DamageGraph standard={props.standard} />
        </Card>
        <div>
            <Accordion
                expanded={expanded === 'panel1'} onChange={handleChange('panel1')}
                TransitionProps={{ unmountOnExit: true }}
                className={styles.accordion}
            >
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    Damage Table
                </AccordionSummary>
                <AccordionDetails className={styles.accordionContent}>
                    <DamageTable standard={props.standard} />
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
                        events={props.standard.events}
                        formatTimestamp={props.formatTimestamp}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    </div>
}
