import { AppBar, createTheme, ThemeProvider, Toolbar, Typography } from '@material-ui/core'
import { blue } from '@material-ui/core/colors'
import * as React from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import styles from './App.module.css'
import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary'
import { Footer } from './Footer/Footer'
import { Home } from './Home/Home'
import { NotFoundPage } from './NotFound/NotFound'

const theme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: blue[900],
        },
    },
    typography: {
        fontFamily: 'Nunito',
    },
})

const routes = [
    {
        path: '/',
        element: <Home />,
        crumb: () => <Typography variant="subtitle1">Home</Typography>,
    },
    {
        path: '*',
        element: <NotFoundPage />,
        crumb: () => <Typography variant="subtitle1">Home</Typography>,
    },
]

export function App() {
    const location = useLocation()
    const navigate = useNavigate()

    const goHome = () => {
        if (location.pathname !== '/') {
            navigate('/')
        }
    }

    return <ThemeProvider theme={theme}>
        <div className={styles.content}>
            <AppBar>
                <Toolbar>
                    <Typography variant="h5" align="center" onClick={goHome}>
                        Reassemble
                    </Typography>
                </Toolbar>
            </AppBar>
            <ErrorBoundary>
                <Routes>
                    {routes.map(({ path, element }, key) => (
                        <Route path={path} key={key} element={element} />
                    ))}
                </Routes>
            </ErrorBoundary>
        </div>
        <div className={styles.footer}>
            <Footer />
        </div>
    </ThemeProvider>
}
