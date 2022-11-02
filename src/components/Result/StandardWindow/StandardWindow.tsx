import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    Chip,
    Typography,
    withStyles,
} from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import React from 'react'
import { ComputedStandard } from 'types'
import { DamageGraph } from './DamageGraph/DamageGraph'
import styles from './StandardWindow.module.css'

interface StandardWindowProps {
    standard: ComputedStandard
    formatTimestamp: (time: number) => string
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

    return <Card className={styles.standardWindow}>
        <div className={styles.rowContainer}>
            <div className={styles.partnered}>
                <NameChip label="Dancer Name" color="primary" />
                {' partnered '}
                <NameChip label={props.standard.actualPartner.name} />
            </div>

            <div className={styles.timestamp}>
                <TimestampChip label={start + ' - ' + end} />
            </div>
        </div>

        <DamageGraph standard={props.standard} />

        <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>Damage Table</Typography>
            </AccordionSummary>
            <AccordionDetails>
                TODO (let's use a toggle here instead actually)
            </AccordionDetails>
        </Accordion>
    </Card>
}
