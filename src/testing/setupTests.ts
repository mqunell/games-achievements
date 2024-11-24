import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import '@/styles/globals.css'
import { server } from './mocks/server'

beforeAll(() => server.listen()) // Enable mocking
afterEach(() => server.resetHandlers()) // Reset any request handlers that were added during tests with `.use()` to the ones initially provided in `.setupServer()`
afterAll(() => server.close()) // Restore native request-issuing modules
