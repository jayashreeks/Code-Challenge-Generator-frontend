import {useAuth} from '@clerk/clerk-react'

export const useApi = () => {
    const {getToken} = useAuth()

    const makeRequest = async (endpoint, options = {}) => {
        const token = await getToken()
        console.log(token)
        console.log(options)
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
    }
        const response = await fetch(`https://code-challenge-generator-backend-oeers8vx2-jayashreeks-projects.vercel.app/api/${endpoint}`, {
            ...defaultOptions,
            ...options
        })
        console.log(response)
        if (!response.ok) {
            const error = await response.json().catch(() => null)
            if(response.status ===429)
                throw new Error('Daily quota exceeded.')
            throw new Error(error?.message || 'An error occurred while processing your request.')
        }    
        return response.json()
    }

    return {makeRequest}
}
