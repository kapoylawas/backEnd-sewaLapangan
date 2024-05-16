import { dataSourceOptions } from "./data-source";

module.exports = {
    ...dataSourceOptions,
    seeds : ['dist/seeds/**/*.seeds{.ts,.js}'],
    factories : ['dist/factories/**/*.factory{.ts,.js}']
}