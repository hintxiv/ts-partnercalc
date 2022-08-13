import { Grid, Link, Typography } from '@material-ui/core'
import React, { ErrorInfo, ReactNode } from 'react'
import styles from './ErrorBoundary.module.css'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ hasError: true })
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (!this.state.hasError) {
            return this.props.children
        }

        return <div className={styles.error}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h3" align="center" color="textPrimary">
                        Oops... Something went wrong.
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
}
