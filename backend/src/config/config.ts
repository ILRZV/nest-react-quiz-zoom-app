import 'dotenv/config';
import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export class ConfigService {
    constructor(private env: { [k: string]: string | undefined }) {
    }

    public getValue(key: string): string {
        const value = this.env[key];
        if (!value) {
            return undefined;
        }

        return value;
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.getValue('POSTGRES_HOST'),
            port: parseInt(this.getValue('POSTGRES_PORT')),
            username: this.getValue('POSTGRES_USER'),
            password: this.getValue('POSTGRES_PASSWORD'),
            database: this.getValue('POSTGRES_DATABASE'),
            entities: ['dist/**/*.entity.js'],
            migrationsTableName: 'migration',
            migrations: ['src/migration/*.ts'],
            retryAttempts: 30,
            retryDelay: 10000,
        };
    }
}
const configService = new ConfigService(process.env);

export { configService };
