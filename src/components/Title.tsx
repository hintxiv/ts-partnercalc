import React, { createContext, useContext, useReducer } from 'react'
import { HelmetProvider } from 'react-helmet-async'

const DEFAULT_TITLE = 'partnercalc'

interface TitleContextValue {
    title: string
    setTitle?: React.Dispatch<string>
}

const TitleContext = createContext<TitleContextValue>({
    title: DEFAULT_TITLE,
})

export const useTitle = () => useContext(TitleContext)

export const TitleProvider = (props: { children: React.ReactNode }) => {
    const [title, setTitle] = useReducer((_: string, title: string) => {
        return `${title} · ${DEFAULT_TITLE}`
    }, DEFAULT_TITLE)

    return (
        <HelmetProvider context={{}}>
            <TitleContext.Provider value={{ title, setTitle }}>
                {props.children}
            </TitleContext.Provider>
        </HelmetProvider>
    )
}
