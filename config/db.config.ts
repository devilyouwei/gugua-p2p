// some default config for P2P
import root from 'app-root-path'
import webConf from './web.config'
export default {
    type: 'sqlite',
    database: `${root}/database/data.db`,
    entities: [],
    synchronize: true,
    logging: false //webConf.logging
}
