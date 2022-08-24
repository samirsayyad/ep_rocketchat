const stringify = (val) => val ? JSON.stringify(val) : undefined;

module.exports = ({offset = 0, count = 0, sort = undefined, fields = undefined, query = undefined} = {}) => ({offset, count, query: stringify(query), fields: stringify(fields), sort: stringify(sort)});
