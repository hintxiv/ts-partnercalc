import { Grid, TextField, Box, Typography } from '@material-ui/core'
import { fetchLastFightID } from 'api/fflogs/api'
import { useTitle } from 'components/Title'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

export function Home() {
    const [hasError, setError] = useState<boolean>(false)
    const navigate = useNavigate()
    const { setTitle } = useTitle()

    useEffect(() => setTitle('Home'))

    const decomposeFFLogsURL = (url: URL) => {
        const report = url.pathname.replace('/reports/', '')
        const hashParam = url.hash.replace('#', '')

        const fight = hashParam.split('&')
            .map((param) => param.split('='))
            .find(([key, _]) => key === 'fight')[1]

        if (!report || !fight) {
            throw new Error('Invalid FFLogs URL')
        }

        return {
            reportID: report,
            fightID: fight,
        }
    }

    const onFFlogsChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') {
            // Empty field, reset state
            setError(false)
            return
        }

        try {
            const url = new URL(event.target.value)
            const { reportID, fightID } = decomposeFFLogsURL(url)

            const parsedFightID = (fightID === 'last')
                ? await fetchLastFightID(reportID)
                : parseInt(fightID)

            navigate(`/${reportID}/${parsedFightID}`)

        } catch (e) {
            setError(true)
        }
    }

    return <div className={styles.home}>
        <Box p={2}>
            <Box mb={1}>
                <Typography variant="h6" color="textPrimary">
                    Enter your FFLogs report link to get started.
                </Typography>
            </Box>
            <Grid container spacing={8} alignItems="flex-end">
                <Grid item md={true} sm={true} xs={true}>
                    <TextField
                        id="fflogs"
                        variant="outlined"
                        placeholder="https://www.fflogs.com/reports/..."
                        fullWidth
                        onChange={onFFlogsChange}
                    />
                </Grid>
            </Grid>
            <Box mb={1}>
                {hasError &&
                    <Typography color="error">
                     * Not a valid FFLogs report url.
                    </Typography>
                }
            </Box>
        </Box>
    </div>
}
