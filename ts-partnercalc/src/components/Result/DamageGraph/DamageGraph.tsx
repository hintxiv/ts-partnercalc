import { useTheme } from '@material-ui/core'
import { ComputedStandard } from 'models'
import React from 'react'
import {
    Bar,
    BarChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import styles from './DamageGraph.module.css'

interface DamageGraphProps {
    standard: ComputedStandard
}

export function DamageGraph(props: DamageGraphProps) {
    const theme = useTheme()

    const data = props.standard.players.map(player => ({
        name: player.name,
        Standard: Math.floor(player.totals.standard),
        Devilment: Math.floor(player.totals.devilment),
        Esprit: Math.floor(player.totals.esprit),
    }))

    return <div className={styles.standardGraph}>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={data.reverse()}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                layout="vertical"
            >
                <XAxis type="number" className={styles.chartText} />
                <YAxis dataKey="name" type="category" className={styles.chartText} />
                <Tooltip
                    wrapperClassName={styles.chartText}
                    cursor={{ fillOpacity: 0.1 }}
                />
                <Legend className={styles.chartText} />
                <Bar dataKey="Standard" stackId="a" fill={theme.palette.primary.main} />
                <Bar dataKey="Devilment" stackId="a" fill="#39a805" />
                <Bar dataKey="Esprit" stackId="a" fill="#53dee6" />
            </BarChart>
        </ResponsiveContainer>
    </div>
}
