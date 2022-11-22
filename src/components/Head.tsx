import React from 'react'
import { Helmet } from 'react-helmet'
import { useTitle } from './Title'

export function Head() {
    const { title } = useTitle()

    return <Helmet>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta property="description" content="A tool for analyzing Dance Partner damage contribution in Final Fantasy XIV (FFXIV)." />
        <meta property="og:description" content="A tool for analyzing Dance Partner damage contribution in Final Fantasy XIV (FFXIV)." />
        <meta property="og:title" content="partnercalc" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="favicon.ico" />
        <meta property="og:url" content="https://partnercalc.app" />
        <link rel="canonical" href="https://partnercalc.app" />
    </Helmet>
}
