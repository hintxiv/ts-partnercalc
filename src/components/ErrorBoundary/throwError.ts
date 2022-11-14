import { useCallback, useState } from 'react'

/* Throws from within an async context. */
export const useAsyncError = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setError] = useState()

    return useCallback((error: Error) => {
        setError(() => {
            throw error
        })
    }, [setError])
}
