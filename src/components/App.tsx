import { AppBar, createTheme, ThemeProvider, Toolbar, Typography } from '@material-ui/core'
import React from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import styles from './App.module.css'
import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary'
import { Footer } from './Footer/Footer'
import { Head } from './Head'
import { Home } from './Home/Home'
import { NotFoundPage } from './NotFound/NotFound'
import { Result } from './Result/Result'
import { TitleProvider } from './Title'

const theme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#f48fb1',
        },
        secondary: {
            main: '#f50057',
        },
    },
    typography: {
        fontFamily: 'Nunito',
        allVariants: {
            color: '#ffffff',
        },
    },
    overrides: {
        MuiPaper: {
            root: {
                backgroundColor: '#28282c',
            },
        },
        MuiChip: {
            root: {
                backgroundColor: '#424242',
            },
        },
        MuiTableCell: {
            root: {
                fontSize: '1rem',
            },
            head: {
                fontWeight: 'bold',
            },
        },
    },
})

const routes = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
    {
        path: '/:reportID/:fightID',
        element: <Result />,
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
        <TitleProvider>
            <Head />
            <div className={styles.content}>
                <AppBar>
                    <Toolbar>
                        <Typography variant="h5" align="center" onClick={goHome}>
                            partnercalc
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
        </TitleProvider>
    </ThemeProvider>
}
