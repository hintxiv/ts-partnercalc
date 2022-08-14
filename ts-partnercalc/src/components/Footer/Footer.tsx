import { Box, Grid, IconButton, Icon, Tooltip, Typography } from '@material-ui/core'
import GithubIcon from '@material-ui/icons/GitHub'
import * as React from 'react'
import styles from './Footer.module.css'

export function Footer() {
    const discordIcon = () => {
        const iconPath = '/Discord-Logo-White.svg'
        return <Icon className={styles.iconRoot}>
            <img className={styles.icon} src={iconPath}/>
        </Icon>
    }

    return <footer>
        <Grid container justify="center">
            <Box>
                <Tooltip title="GitHub" placement="top">
                    <IconButton size="medium" href="https://github.com/hintxiv" target="_blank">
                        <GithubIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Discord" placement="top">
                    <IconButton size="medium" href="https://discord.com/users/492781599126061066" target="_blank">
                        {discordIcon()}
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
