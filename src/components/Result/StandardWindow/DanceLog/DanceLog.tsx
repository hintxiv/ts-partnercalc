import { TimestampChip } from 'components/Result/Chip'
import React from 'react'
import { ComputedEvent } from 'types/computed'
import styles from './DanceLog.module.css'

interface DanceLogProps {
    events: ComputedEvent[]
    formatTimestamp: (time: number) => string
}

export function DanceLog(props: DanceLogProps) {
    return <div>
        <div className={styles.eventRow}>
            <TimestampChip timestamp={props.formatTimestamp(6348149)} />
            <span className={styles.eventText}>
                {'Standard Finish on Ghost Syrup'}
            </span>
        </div>
        <div className={styles.eventRow}>
            <TimestampChip timestamp={props.formatTimestamp(6368149)} />
            <span className={styles.eventText}>
                {'Devilment on Ghost Syrup'}
            </span>
        </div>
        <div className={styles.eventRow}>
            <TimestampChip timestamp={props.formatTimestamp(6448149)} />
            <span className={styles.eventText}>
                {'Closed Position on Asta Valdis'}
            </span>
        </div>
    </div>
}
