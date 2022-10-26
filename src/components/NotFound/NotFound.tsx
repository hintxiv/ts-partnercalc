import { Grid, Link, Typography } from '@material-ui/core'
import React from 'react'
import styles from './NotFound.module.css'

export function NotFoundPage() {
    return <div className={styles.notFound}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h3" align="center" color="textPrimary">
                    This page doesn't exist!
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" align="center" color="textPrimary">
                    Not sure why you're seeing this? DM me on <Link
                        href="https://discord.com/users/492781599126061066"
                        color="secondary"
                        target="_blank"
                    >
                        Discord
                    </Link>.
                </Typography>
            </Grid>
        </Grid>
    </div>
}
