import React from 'react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { ComputedPlayer, ComputedStandard } from 'types'
import styles from './DamageGraph.module.css'
import { GraphTooltip } from './Tooltip'

interface DamageGraphProps {
    standard: ComputedStandard
}

export function DamageGraph(props: DamageGraphProps) {
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
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 30,
                    bottom: 0,
                }}
                layout="vertical"
            >
                <XAxis
                    type="number"
                    stroke="white"
                    tickCount={8}
                    tickLine={false}
                />
                <YAxis
                    dataKey="name"
                    type="category"
                    stroke="white"
                    tick={playerNameTick(props.standard.players)}
                    tickLine={false}
                />
                <Tooltip
                    cursor={{ fillOpacity: 0.1 }}
                    wrapperStyle={{ outline: 'none' }}
                    content={<GraphTooltip />}
                />
                <Legend />
                <CartesianGrid horizontal={false} vertical={true} opacity={0.5} />
                <Bar dataKey="Standard" barSize={30} stackId="a" fill="#e0e158" />
                <Bar dataKey="Devilment" barSize={30} stackId="a" fill="#0fe863" />
                <Bar dataKey="Esprit" barSize={30} stackId="a" fill="#3febde" />

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

    if (player == null) { return }

    const initials = player.name
        .split(' ')
        .map(name => name.charAt(0).toUpperCase() + '.')
        .join(' ')

    return <g transform={`translate(${x},${y})`} fill="white">
        <text
            x={-32}
            y={8}
            textAnchor="end"
        >
            {initials}
        </text>
        <player.job.Icon
            height={30}
            width={30}
            x={-28}
            y={-13}
        />
    </g>
}
