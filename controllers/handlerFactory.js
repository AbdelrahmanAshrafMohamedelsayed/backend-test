import APIFeatures from '../util/APIFeatures.js';
import catchAsync from '../util/catchAsync.js';
import { AppError } from '../util/ErrorHandling.js';

export const deleteOne = Model =>
    catchAsync(async(req, res, next) => {
        const { id } = req.params;
        const doc = await Model.findByIdAndDelete(id); // delete a document from the collection 'document' by id
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    });
export const updateOne = Model =>
    catchAsync(async(req, res, next) => {
        const { id } = req.params;
        const UpdatedDoc = await Model.findByIdAndUpdate(id, req.body, {
            new: true, // return the new updated document
            runValidators: true // run the validators again
        }); // update a document from the collection '' by id
        if (!UpdatedDoc) { // if the document is not found
            return next(new AppError('No document found with that ID', 404)); // return an error
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: UpdatedDoc
            }
        });
    });
export const createOne = Model =>
    catchAsync(async(req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });
export const getOne = (Model) =>
    catchAsync(async(req, res, next) => {
        // const { id } = req.params;
        let query = Model.findById(req.params.id); // get a document from the collection 'Model' by id
        const doc = await query; // get a document from the collection 'Model' by id
        if (!doc) {
            return next(new AppError('No Document found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });
export const getAll = Model =>
    catchAsync(async(req, res, next) => {
        const features = new APIFeatures(Model.find({}), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const Docs = await features.query; // execute the query to get the documents from the collection 'Model'
        // to send the number of pages to the client to be used in the pagination
        const numberOfpages = Math.ceil(
            (await Model.countDocuments()) / (req.query.limit || 100)
        );
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            numberOfpages,
            results: Docs.length,
            data: {
                data: Docs
            }
        });
    });