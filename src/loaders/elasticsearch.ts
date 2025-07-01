import config from "../config";

import {Client} from "@elastic/elasticsearch";


const client = new Client({
    node: config.elastic.node // Elasticsearch endpoint
})

export default client
