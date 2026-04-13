class apiFeatures {
    constructor(query,queryStr){
        this.query = query
        this.queryStr = queryStr
    }


    pagination(){
        let page = this.queryStr.page * 1|| 1 
        let limit = this.queryStr.limit * 1 || 10 
        let skip = (page - 1)*limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = apiFeatures