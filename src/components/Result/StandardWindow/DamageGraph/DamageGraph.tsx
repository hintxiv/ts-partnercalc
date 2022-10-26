import { useTheme } from '@material-ui/core'
import { BardIcon } from 'components/JobIcons/bard'
import { ComputedPlayer, ComputedStandard } from 'models'
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
                    left: 200,
                    bottom: 5,
                }}
                layout="vertical"
            >
                <XAxis type="number" stroke="white" />
                <YAxis
                    dataKey="name"
                    type="category"
                    stroke="white"
                    tick={playerNameTick(props.standard.players)}
                />
                <Tooltip cursor={{ fillOpacity: 0.1 }} />
                <Legend />
                <Bar dataKey="Standard" stackId="a" fill={theme.palette.primary.main} />
                <Bar dataKey="Devilment" stackId="a" fill="#39a805" />
                <Bar dataKey="Esprit" stackId="a" fill="#53dee6" />
            </BarChart>
        </ResponsiveContainer>
    </div>
}

interface AxisTickProps {
    x: number
    y: number
    payload: {
        coordinate: number
        value: string
        index: number
        offset: number
        tickCoord: number
    }
}

const playerNameTick = (players: ComputedPlayer[]) => (props: AxisTickProps) => {
    const { x, y, payload } = props

    const player = players.find(player => player.name === payload.value)
    const initials = player.name
        .split(' ')
        .map(name => name.charAt(0).toUpperCase() + '.')
        .join(' ')

    return <g transform={`translate(${x},${y})`} fill={player.job.color}>
        <text
            x={-24}
            y={6}
            textAnchor="end"
        >
            {initials}
        </text>
        <BardIcon
            height={24}
            width={24}
            x={-24}
            y={-12}
        />
    </g>
}
