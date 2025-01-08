class APIFeatures {
    constructor(query, queryString) {
        this.query = query; // the query is a query object that is not executed yet in this case it is  after filtering
        this.queryString = queryString; // the query string is the query string that is sent in the url
    }
    filter() { // 1A) FILTERING example: /api/v1/tours?duration[gte]=5&difficulty=easy (filter based on fields)
        const queryObj = {...this.queryString };
        const excluded_fields = ['page', 'sort', 'limit', 'fields']; // exclude these fields from the query as they are not fields in the document
        excluded_fields.forEach(el => delete queryObj[el]); // delete the excluded fields from the query
        //  1B) ADVANCED FILTERING
        const queryStr = JSON.stringify(queryObj); // convert the query object to a string to be able to use the regular expression
        const queryStrWithDollarSign = queryStr.replace( // replace the gte, gt, lte, lt with $gte, $gt, $lte, $lt
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );
        const queryObjWithDollarSign = JSON.parse(queryStrWithDollarSign); // convert the string to an object
        this.query = this.query.find(queryObjWithDollarSign); // find the documents that match the query object
        return this; // return the object to be able to chain the methods
    }
    sort() { // 2) SORTING example: /api/v1/tours?sort=price,ratingsAverage (sort based on fields)
        // 2) SORTING
        if (this.queryString.sort) { // if there is a sort query in the url
            const sortBy = this.queryString.sort.split(',').join(' '); // sort('price ratingsAverage'). the sort method will sort the documents based on the price and then the ratingsAverage
            this.query = this.query.sort(sortBy); // sort the documents based on the sortBy
        } else {
            this.query = this.query.sort('-createdAt'); // sort the documents based on the createdAt field in descending order
        }
        return this;
    }

    limitFields() {
        // 3) FIELD LIMITING example: /api/v1/tours?fields=name,duration,price (show only the fields that are in the query)
        if (this.queryString.fields) { // if there is a fields query in the url
            const fields = this.queryString.fields.split(',').join(' '); // 'name duration price'. the select method will select only the fields that are in the fields variable
            this.query = this.query.select(fields); // select('name duration price')
        } else {
            this.query = this.query.select('-__v'); // select all the fields except the __v field
        }
        return this;
    }
    paginate() {
        // 4) PAGINATION example: /api/v1/tours?page=2&limit=10 (show the second page with 10 documents)
        const page = +this.queryString.page || 1; // the page number that is sent in the url
        const limit = +this.queryString.limit || 10; // the limit of the documents that will be shown in the page
        const skip = (page - 1) * limit; // page=3& limit=10,( 1-10, page 1), (11-20, page 2),( 21-30, page 3)
        this.query = this.query.skip(skip).limit(limit); // skip the documents that are before the current page and limit the documents to the limit
        /**
         *  query = query.skip(skip).limit(limit);
         * is used to implement pagination if there was no page query in the url then the query will be like this: query = query.skip(0).limit(100); as default page=1 and limit=100
         */
        return this;
    }
}
export default APIFeatures;