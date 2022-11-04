import { Box, Grid, IconButton, Icon, Tooltip, Typography } from '@material-ui/core'
import GithubIcon from '@material-ui/icons/GitHub'
import * as React from 'react'
import styles from './Footer.module.css'

export function Footer() {
    return <footer>
        <Grid container justifyContent="center">
            <Box>
                <Tooltip title="GitHub" placement="top">
                    <IconButton size="medium" href="https://github.com/hintxiv/ts-partnercalc" target="_blank">
                        <GithubIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Discord" placement="top">
                    <IconButton size="medium" href="https://discord.com/users/492781599126061066" target="_blank">
                        <Icon className={styles.iconRoot}>
                            <img className={styles.icon} src="/Discord-Logo-White.svg" />
                        </Icon>
                    </IconButton>
                </Tooltip>
            </Box>
            <Grid item xs={12}>
                <Typography align="center" color="textSecondary">
                    Made by Ghost Syrup @ Sargatanas.
                </Typography>
            </Grid>
        </Grid>
    </footer>
}
