class ApiFeatures {
    constructor(query,queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    filter(){
        const queryObj = { ...this.queryStr }
        const excludedFields = ["sort","fields","page","limit"]
        excludedFields.forEach(el => delete queryObj[el])
        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryString))
        return this
    }
    sort(){
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(",").join(" ")
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort("-createdAt")
        }
        return this
    }
    fields(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(",").join(" ")
            this.query = this.query.select(fields)
        }else{
            this.query = this.query.select("-__v")
        }
        return this
    }
    pagination(){
        let page = Math.max(this.queryStr.page * 1 || 1, 1)
        let limit = Math.min(this.queryStr.limit * 1 || 10, 50)
        let skip = (page - 1)*limit
        this.page = page
        this.limit = limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = ApiFeatures