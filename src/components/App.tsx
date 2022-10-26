import { AppBar, createTheme, ThemeProvider, Toolbar, Typography } from '@material-ui/core'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import styles from './App.module.css'
import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary'
import { Footer } from './Footer/Footer'
import { Home } from './Home/Home'
import { NotFoundPage } from './NotFound/NotFound'
import { Result } from './Result/Result'

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
        title: 'TODO dynamic title from report',
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

    const getTitle = () => {
        const route = routes.find(route => route.path === location.pathname)
        let title = 'partnercalc'

        if (route) {
            if (route.title) {
                title += ` | ${route.title}`
            }
        } else {
            title += ' | 404'
        }

        return title
    }

    return <ThemeProvider theme={theme}>
        <Helmet>
            <title>
                {getTitle()}
            </title>
        </Helmet>
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
    </ThemeProvider>
}
