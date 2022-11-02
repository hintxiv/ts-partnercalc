import { Card, Chip } from '@material-ui/core'
import React from 'react'
import { ComputedStandard } from 'types'
import { DamageGraph } from './DamageGraph/DamageGraph'
import styles from './StandardWindow.module.css'

interface StandardWindowProps {
    standard: ComputedStandard
    formatTimestamp: (time: number) => string
}

export function StandardWindow(props: StandardWindowProps) {
    const start = props.formatTimestamp(props.standard.start)
    const end = props.formatTimestamp(props.standard.end)

    return <Card className={styles.standardWindow}>
        <Chip label={start} />
        <span> - </span>
        <Chip label={end} />
        <span> Applier </span>
        <Chip label={props.standard.appliedBy} />
        <DamageGraph standard={props.standard} />
    </Card>
}
