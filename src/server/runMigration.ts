import 'dotenv/config'
import { runMigration } from '@/db/migrations/1-mongo-to-postgres'

runMigration()
