import { NameChip, TimestampChip } from 'components/Result/Chip'
import React from 'react'
import { ComputedEvent } from 'types/computed'
import styles from './DanceLog.module.css'

interface DanceLogProps {
    events: ComputedEvent[]
    formatTimestamp: (time: number) => string
}

export function DanceLog(props: DanceLogProps) {
    return <div>
        {props.events.map(event =>
            <div key={event.timestamp} className={styles.eventRow}>
                <TimestampChip timestamp={props.formatTimestamp(event.timestamp)} />
                <span className={styles.eventText}>
                    {event.action.name + (event.target != null ? ' on' : '')}
                </span>
                {event.target != null &&
                    <NameChip name={event.target.name} job={event.target.job} />
                }
            </div>
        )}
    </div>
}
