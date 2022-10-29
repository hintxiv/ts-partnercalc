import { Card, Chip, Typography } from '@material-ui/core'
import { ComputedStandard } from 'types'
import React from 'react'
import { DamageGraph } from './DamageGraph/DamageGraph'
import styles from './StandardWindow.module.css'

interface StandardWindowProps {
    standard: ComputedStandard
}

export function StandardWindow(props: StandardWindowProps) {
    return <Card className={styles.standardWindow}>
        <Chip label="0:00" />
        <span> - </span>
        <Chip label="1:15" />
        <DamageGraph standard={props.standard} />
    </Card>
}
