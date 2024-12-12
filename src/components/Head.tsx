import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useTitle } from './Title'

export function Head() {
    const { title } = useTitle()

    return <Helmet>
        <title>{title}</title>
    </Helmet>
}
