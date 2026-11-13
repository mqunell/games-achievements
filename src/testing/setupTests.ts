import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
// import '@/styles/globals.css'
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' })) // Enable mocking, with errors for non-mocked routes
afterEach(() => server.resetHandlers()) // Reset any request handlers that were added during tests with `.use()` to the ones initially provided in `.setupServer()`
afterAll(() => server.close()) // Restore native request-issuing modules
