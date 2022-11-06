import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core'
import React from 'react'
import { ComputedPlayer, ComputedStandard } from 'types'

interface DamageTableProps {
    standard: ComputedStandard
}

export function DamageTable(props: DamageTableProps) {
    const makeRow = (player: ComputedPlayer) => {
        return <TableRow key={player.id}>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.job.name}</TableCell>
            <TableCell>{Math.floor(player.totals.standard)}</TableCell>
            <TableCell>{Math.floor(player.totals.devilment)}</TableCell>
            <TableCell>{Math.floor(player.totals.esprit)}</TableCell>
            <TableCell>{Math.floor(player.totals.total)}</TableCell>
        </TableRow>
    }

    return <TableContainer>
        <Table aria-label="Damage table">
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Job</TableCell>
                    <TableCell>Standard</TableCell>
                    <TableCell>Devilment</TableCell>
                    <TableCell>Esprit</TableCell>
                    <TableCell>Total</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.standard.players.map(player => makeRow(player))}
            </TableBody>
        </Table>
    </TableContainer>
}
