import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    Chip,
    withStyles,
} from '@material-ui/core'
import { AccessTime, ExpandMore } from '@material-ui/icons'
import { Friend } from 'api/fflogs/fight'
import { DancerIcon } from 'components/JobIcons'
import React from 'react'
import { ComputedStandard } from 'types'
import { DamageGraph } from './DamageGraph/DamageGraph'
import { DamageTable } from './DamageTable/DamageTable'
import styles from './StandardWindow.module.css'

interface StandardWindowProps {
    standard: ComputedStandard
    dancer: Friend
    formatTimestamp: (time: number) => string
    generateTimestampLink: (start: number, end: number) => string
}

const NameChip = withStyles({
    root: {
        fontSize: 'large',
    },
})(Chip)

const TimestampChip = withStyles({
    root: {
        fontSize: 'medium',
    },
})(Chip)

export function StandardWindow(props: StandardWindowProps) {
    const start = props.formatTimestamp(props.standard.start)
    const end = props.formatTimestamp(props.standard.end)

    const partner = props.standard.actualPartner

    const openTimestampLink = () => {
        const timestampURL = props.generateTimestampLink(props.standard.start, props.standard.end)
        window.open(timestampURL, '_blank', 'noopener,noreferrer')
    }

    return <div className={styles.standardWindow}>
        <Card className={styles.card}>
            <div className={styles.rowContainer}>
                <div className={styles.partnered}>
                    <NameChip
                        label={props.dancer.name}
                        color="primary"
                        icon={<DancerIcon height={30} width={30} />}
                    />
                    {' partnered '}
                    <NameChip
                        label={partner.name}
                        icon={<partner.job.Icon height={30} width={30} fill="white" />}
                        style={{ backgroundColor: partner.job.color }}
                    />
                </div>
                <div className={styles.timestamp}>
                    <TimestampChip
                        label={start + ' - ' + end}
                        onClick={openTimestampLink}
                        icon={<AccessTime />}
                    />
                </div>
            </div>
        </Card>
        <Card className={styles.card}>
            <DamageGraph standard={props.standard} />
        </Card>
        <Accordion TransitionProps={{ unmountOnExit: true }} className={styles.accordion}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                Damage Table
            </AccordionSummary>
            <AccordionDetails>
                <DamageTable standard={props.standard} />
            </AccordionDetails>
        </Accordion>
    </div>
}
