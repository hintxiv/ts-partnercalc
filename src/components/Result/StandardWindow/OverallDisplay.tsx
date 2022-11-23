import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    Typography,
} from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import React from 'react'
import { OverallDamage } from 'types'
import { NameChip } from '../Chip'
import { DamageGraph } from './DamageGraph/DamageGraph'
import { DamageTable } from './DamageTable/DamageTable'
import styles from './StandardWindow.module.css'

interface OverallDisplayProps {
    damage: OverallDamage
    formatDPS: (damage: number) => string
}

export function OverallDisplay(props: OverallDisplayProps) {
    const best = props.damage.bestPartner

    return <div className={styles.overallWindow}>
        <div className={styles.overallText}>
            <Typography variant="h3" align="center">
                Overall best partner:
            </Typography>
            <NameChip
                name={best.name}
                job={best.job}
                iconProps={{
                    height: 50,
                    width: 50,
                }}
                className={styles.overallChip}
                style={{ backgroundColor: best.job.color }}
            />
        </div>
        <div className={styles.overallText}>
            <Typography variant="h5" align="center">
                Expected DPS: {props.formatDPS(best.totals.total)}
            </Typography>
        </div>
        <Card className={styles.card + ' ' + styles.graph}>
            <DamageGraph players={props.damage.players} />
        </Card>
        <div>
            <Accordion
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
                    <DamageTable players={props.damage.players} />
                </AccordionDetails>
            </Accordion>
        </div>
    </div>
}
