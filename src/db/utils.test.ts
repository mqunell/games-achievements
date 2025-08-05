import { buildInsertPlaceholders } from './utils'

describe('database utils', () => {
	test('buildInsertPlaceholders', () => {
		expect(buildInsertPlaceholders(5, 1)).toEqual('($1), ($2), ($3), ($4), ($5)')
		expect(buildInsertPlaceholders(3, 2)).toEqual('($1, $2), ($3, $4), ($5, $6)')
		expect(buildInsertPlaceholders(1, 3)).toEqual('($1, $2, $3)')

		expect(() => buildInsertPlaceholders(0, 1)).toThrow()
		expect(() => buildInsertPlaceholders(1, 0)).toThrow()
	})
})
